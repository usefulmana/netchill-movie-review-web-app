package com.example.springsocial.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Password does not match!")
public class PasswordDoesNotMatchException extends Exception {
}
