package com.backendeva.backend.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Aspect
@Component
public class RateLimitAspect {

    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> windowStartTimes = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS = 10; // 10 requests
    private static final long WINDOW_TIME = 60000; // per minute

    @Around("@annotation(com.backendeva.backend.config.RateLimited)")
    public Object enforceRateLimit(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest request = attributes.getRequest();
        HttpServletResponse response = attributes.getResponse();

        if (response == null) {
            return joinPoint.proceed();
        }

        String clientIP = getClientIP(request);
        String key = clientIP + ":" + request.getRequestURI();

        long currentTime = System.currentTimeMillis();
        long windowStart = windowStartTimes.getOrDefault(key, currentTime);

        // Reset window if time has passed
        if (currentTime - windowStart > WINDOW_TIME) {
            requestCounts.put(key, new AtomicInteger(0));
            windowStartTimes.put(key, currentTime);
            windowStart = currentTime;
        }

        AtomicInteger count = requestCounts.computeIfAbsent(key, k -> new AtomicInteger(0));
        int currentCount = count.incrementAndGet();

        if (currentCount > MAX_REQUESTS) {
            response.setStatus(429);
            response.setContentType("application/json");
            try {
                response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
            } catch (Exception e) {
                // Ignore if writer fails
            }
            return null;
        }

        return joinPoint.proceed();
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}