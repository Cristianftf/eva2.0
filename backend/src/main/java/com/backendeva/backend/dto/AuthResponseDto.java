package com.backendeva.backend.dto;

import com.backendeva.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private User user;
}
