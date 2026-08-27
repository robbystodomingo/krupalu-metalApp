package com.krupalu.MetalApp;

import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;



@SpringBootApplication
public class MetalAppApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	public static void main(String[] args) {
		SpringApplication.run(MetalAppApplication.class, args);
	}

	public void run(String... args){
		User superUserAccount = userRepository.findByRole(Role.ADMIN);
		if(null == superUserAccount){

			var user = User.builder()
					.email("admin@gmail.com")
					.fullName("admin")
					.country("Philippines")
					.role(Role.ADMIN)
					.password(new BCryptPasswordEncoder().encode("admin"))
					.phoneNumber("0960123456789")
					.username("admin")
					.build();
			userRepository.save(user);
		}
	}

}
