package com.example.springsocial.controller;

import com.example.springsocial.exception.*;
import com.example.springsocial.model.*;
import com.example.springsocial.payload.ApiResponse;
import com.example.springsocial.payload.AuthResponse;
import com.example.springsocial.payload.LoginRequest;
import com.example.springsocial.payload.SignUpRequest;
import com.example.springsocial.repositories.ConfirmationTokenRepository;
import com.example.springsocial.repositories.MovieListRepository;
import com.example.springsocial.repositories.UserRepository;
import com.example.springsocial.security.CurrentUser;
import com.example.springsocial.security.TokenProvider;
import com.example.springsocial.security.UserPrincipal;
import com.example.springsocial.service.EmailSenderService;
import com.example.springsocial.util.URLShortener;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    private MovieListRepository movieListRepository;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider tokenProvider;

    @Value("${remote_host}")
    @Getter
    private String remoteHost;

    @Value("${local_host}")
    @Getter
    private String localHost;


    @Value("${spring.mail.username}")
    @Getter
    private String hostEmail;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByEmailIgnoreCase(loginRequest.getEmail());
        if (optionalUser.isPresent()){
            User temp = optionalUser.get();
            if (!temp.getProvider().equals(AuthProvider.local))
            {
                throw new BadRequestException(String.format("It appears that this account is registered via %s service. " +
                        "Please login with %s service!", temp.getProvider(), temp.getProvider()));
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.createToken(authentication);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) throws IOException, BadPasswordException, MessagingException {
//
//          (?=.*[0-9]) # a digit must occur at least once
//          (?=.*[a-z]) # a lower case letter must occur at least once
//          (?=.*[A-Z]) # an upper case letter must occur at least once
//          (?=.*[@#$%^&+=!]) # a special character must occur at least once
//          (?=\S+$) # no whitespace allowed in the entire string
//          .{8,} # anything, at least eight places though
//
        Optional<User> optionalUser = userRepository.findByEmailIgnoreCase(signUpRequest.getEmail());
        if (optionalUser.isPresent()){
            User temp = optionalUser.get();
            throw new BadRequestException(String.format("Email is already in use." +
                    "If you owns this email account, please login with %s service!", temp.getProvider()));
        }


        String passwordPattern = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}";

        if (!signUpRequest.getPassword().matches(passwordPattern)){
            throw new BadPasswordException();
        }



        // Creating user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(signUpRequest.getPassword());
        user.setProvider(AuthProvider.local);
        user.setRole(Role.ROLE_USER);


        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User result = userRepository.save(user);

        // Send email verification email
        ConfirmationToken confirmationToken = new ConfirmationToken(user);
        confirmationTokenRepository.save(confirmationToken);
 // TODO Uncomment in Prod
//        sendVerificationEmail(user, confirmationToken);


        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/user/me")
                .buildAndExpand(result.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "User registered successfully@"));
    }

    @RequestMapping(value = "/confirm", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> confirmUserEmail(@RequestParam(value = "token") String token) throws TokenExpiredException, UserAlreadyVerifiedException {

        ConfirmationToken tempToken = confirmationTokenRepository.findByToken(token);

        if (tempToken.getConfirmedDateTime() != null){
            throw new UserAlreadyVerifiedException();
        }

        if (LocalDateTime.now().isBefore(tempToken.getExpiredDateTime())){
            User user = userRepository.findByEmailIgnoreCase(tempToken.getUser().getEmail())
                    .orElseThrow(RuntimeException::new);
            user.setEmailVerified(true);
            userRepository.save(user);
            tempToken.setConfirmedDateTime(LocalDateTime.now(ZoneOffset.UTC));
            confirmationTokenRepository.save(tempToken);
            HashMap<String, String> res = new HashMap<>();
            res.put("message", "verified");
            return ResponseEntity.ok(res);
        }
        else if (!LocalDateTime.now().isBefore(tempToken.getExpiredDateTime())){
            throw new TokenExpiredException();
        }
        else{
            throw new ResourceNotFoundException();
        }
    }

    @RequestMapping(value = "/resend", method = {RequestMethod.GET, RequestMethod.POST})
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public ResponseEntity<?> resendToken(@CurrentUser UserPrincipal userPrincipal) throws UserAlreadyVerifiedException, IOException, MessagingException {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(ResourceNotFoundException::new);
        ConfirmationToken token = confirmationTokenRepository.findByUser_Id(user.getId());
         if (user.getEmailVerified()){
             throw new UserAlreadyVerifiedException();
         }
         if (token == null){
             ConfirmationToken confirmationToken = new ConfirmationToken(user);
             confirmationTokenRepository.save(confirmationToken);
             sendVerificationEmail(user, confirmationToken);
             HashMap<String, String> res = new HashMap<>();
             res.put("message", "sent");
             return ResponseEntity.ok(res);
         }

         else if (token != null && LocalDateTime.now().isBefore(token.getExpiredDateTime())) {
             sendVerificationEmail(user, token);
             HashMap<String, String> res = new HashMap<>();
             res.put("message", "sent");
             return ResponseEntity.ok(res);
         }
         else if(token != null && !LocalDateTime.now().isBefore(token.getExpiredDateTime())){
             confirmationTokenRepository.delete(token);
             ConfirmationToken newToken =  new ConfirmationToken(user);
             confirmationTokenRepository.save(newToken);
             sendVerificationEmail(user, newToken);
             HashMap<String, String> res = new HashMap<>();
             res.put("message", "sent");
             return ResponseEntity.ok(res);
         }
         return null;
    }

    private void sendVerificationEmail(User user, ConfirmationToken confirmationToken) throws IOException, MessagingException {
//        SimpleMailMessage mailMessage = new SimpleMailMessage();
//        mailMessage.setTo(user.getEmail());
//        mailMessage.setSubject("Complete Your Registration");
//        mailMessage.setFrom("test.piot.314@gmail.com");
//        mailMessage.setText("To confirm your account, please click here : "
//                + String.format("http://%s/auth/confirm?token=%s", this.getLocalHost(),
//                confirmationToken.getToken()));
//        emailSenderService.sendEmail(mailMessage);

        Mail mail = new Mail();
        mail.setFrom(this.getHostEmail());
        mail.setTo(user.getEmail());
        mail.setSubject("Complete Your Registration");

        Map<String, Object> model = new HashMap();
        model.put("verification_url", String.format("%s/auth/confirm?token=%s", this.getRemoteHost(),
                confirmationToken.getToken()));
        mail.setModel(model);

        emailSenderService.sendSimpleMessage(mail, "verification-email");
    }
}
