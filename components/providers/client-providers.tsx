"use client"

import { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AuthProvider } from "@/lib/context/auth.context"
import { I18nProvider } from "@/components/i18n-provider"
import { CacheProvider } from "@/components/providers/cache-provider"
import { CacheStats } from "@/components/dev/cache-stats"
import { queryClient } from "@/lib/query-client"

interface ClientProvidersProps {
  children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <CacheProvider>
            {children}
            {process.env.NODE_ENV === 'development' && (
              <>
                <ReactQueryDevtools
                  initialIsOpen={false}
                />
                <CacheStats />
              </>
            )}
          </CacheProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}
