package com.example.springsocial.payload;

import lombok.Getter;

import javax.validation.constraints.NotBlank;

@Getter
public class ChangePWRequest {

    @NotBlank
    private String oldPassword;

    @NotBlank
    private String newPassword;

}
