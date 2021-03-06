package com.example.springsocial.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Resource already exists!")
public class ResourceAlreadyExistsException extends Exception {
}
