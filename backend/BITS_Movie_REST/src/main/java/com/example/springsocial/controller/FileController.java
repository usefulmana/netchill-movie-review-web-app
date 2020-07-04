package com.example.springsocial.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.User;
import com.example.springsocial.repositories.UserRepository;
import com.example.springsocial.security.CurrentUser;
import com.example.springsocial.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);
    @Autowired
    private Environment env;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    @CrossOrigin
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @CurrentUser UserPrincipal userPrincipal) throws ResourceNotFoundException {
        // Loading Cloudinary credentials
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(ResourceNotFoundException::new);

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", env.getProperty("cloudinary.cloud_name"));
        config.put("api_key", env.getProperty("cloudinary.api_key"));
        config.put("api_secret",env.getProperty("cloudinary.api_secret"));
        Cloudinary cloudinary = new Cloudinary(config);

        try{
            Map<String, String> res = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            user.setImageUrl(res.get("secure_url"));
            return ResponseEntity.ok(userRepository.save(user));
        }
        catch (IOException e){
            logger.error(e.getMessage());
        }
        return (ResponseEntity<?>) ResponseEntity.status(HttpStatus.BAD_REQUEST);
    }
}
