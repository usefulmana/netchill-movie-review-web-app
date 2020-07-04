package com.example.springsocial.model;


import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class Mail {

    private String from;
    private String to;
    private String subject;
    private List<Object> attachments;
    private Map<String, Object> model;

}
