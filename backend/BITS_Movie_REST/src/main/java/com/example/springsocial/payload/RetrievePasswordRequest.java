package com.example.springsocial.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class RetrievePasswordRequest {

    @NotBlank
    private String newPassword;
}
