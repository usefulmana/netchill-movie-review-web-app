package com.example.springsocial.controller;

import com.example.springsocial.exception.BadPasswordException;
import com.example.springsocial.exception.PasswordDoesNotMatchException;
import com.example.springsocial.exception.ResourceAlreadyExistsException;
import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.ConfirmationToken;
import com.example.springsocial.model.Mail;
import com.example.springsocial.model.User;
import com.example.springsocial.payload.ChangePWRequest;
import com.example.springsocial.payload.RetrievePasswordRequest;
import com.example.springsocial.payload.TokenRequest;
import com.example.springsocial.repositories.ConfirmationTokenRepository;
import com.example.springsocial.repositories.UserRepository;
import com.example.springsocial.security.CurrentUser;
import com.example.springsocial.security.UserPrincipal;
import com.example.springsocial.service.EmailSenderService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfirmationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailSenderService emailSenderService;

    @Value("${spring.mail.username}")
    @Getter
    private String hostEmail;

    @Value("${remote_host}")
    @Getter
    private String remoteHost;

    @GetMapping("/user/me")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable(value = "id") Long id) {
        return userRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @PutMapping("/user")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public ResponseEntity updateUserInfo(@CurrentUser UserPrincipal userPrincipal,
                                         @RequestBody User updatedUser) throws PasswordDoesNotMatchException, ResourceAlreadyExistsException, BadPasswordException {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(ResourceNotFoundException::new);
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PatchMapping("/user")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public ResponseEntity<?> changeUserPassword(@CurrentUser UserPrincipal userPrincipal,
                                                @RequestBody @Valid ChangePWRequest request) throws BadPasswordException {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(ResourceNotFoundException::new);
        String passwordPattern = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}";

        if (encoder.matches(request.getOldPassword(), user.getPassword())){
            if (!request.getNewPassword().matches(passwordPattern)){
                throw new BadPasswordException();
            }
            else {
                user.setPassword(encoder.encode(request.getNewPassword()));
                return ResponseEntity.ok(userRepository.save(user));
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/user/forgot")
    public ResponseEntity<?> generatePWToken(@Valid @RequestBody TokenRequest request) throws IOException, MessagingException {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(ResourceNotFoundException::new);

        if (!Objects.isNull(user)){
            ConfirmationToken token = new ConfirmationToken(user);
            tokenRepository.save(token);
            sendForgotPWEmail(user, token);
            return new ResponseEntity<>(HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/user/forgot/token/{token}")
    public ResponseEntity<?> retrieveForgottenPassword(@PathVariable(name = "token")String token,
                                                       @RequestBody RetrievePasswordRequest request){
        ConfirmationToken token1 = tokenRepository.findByToken(token);
        if (LocalDateTime.now().isBefore(token1.getExpiredDateTime())){
            User user = token1.getUser();
            user.setPassword(encoder.encode(request.getNewPassword()));
            token1.setConfirmedDateTime(LocalDateTime.now());
            tokenRepository.save(token1);
            return ResponseEntity.ok(userRepository.save(user));
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    private void sendForgotPWEmail(User user, ConfirmationToken confirmationToken)throws IOException, MessagingException {

        Mail mail = new Mail();
        mail.setFrom(this.getHostEmail());
        mail.setTo(user.getEmail());
        mail.setSubject("Retrieve Your Password");

        Map<String, Object> model = new HashMap<>();
        model.put("verification_url", String.format("%s/forgot/%s", this.getRemoteHost(),
                confirmationToken.getToken()));
        mail.setModel(model);

        emailSenderService.sendSimpleMessage(mail, "changePWEmail");
    }
}
