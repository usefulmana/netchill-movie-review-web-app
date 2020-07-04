package com.example.springsocial;

import com.example.springsocial.config.AppProperties;
import com.example.springsocial.model.Role;
import com.example.springsocial.model.User;
import com.example.springsocial.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;


@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties({AppProperties.class})
public class SpringSocialApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringSocialApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder encoder){
		return args -> {
			Optional<User> temp = userRepository.findByEmail("admin@gmail.com");
			if (!temp.isPresent()){
				User admin = new User(encoder.encode("GAtech321"), "admin@gmail.com",
						"Admin", Role.ROLE_ADMIN);
				admin.setEmailVerified(true);
				userRepository.save(admin);
			}
	};
	}
}
