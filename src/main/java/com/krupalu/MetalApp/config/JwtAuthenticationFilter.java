package com.krupalu.MetalApp.config;

import com.krupalu.MetalApp.entity.User;
import com.krupalu.MetalApp.enums.Role;
import com.krupalu.MetalApp.repo.UserRepository;
import com.krupalu.MetalApp.services.JWTService;
import com.krupalu.MetalApp.token.TokenRepository;
import com.krupalu.MetalApp.util.MyUserDetails;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (StringUtils.isEmpty(authHeader) ||
                !StringUtils.startsWith(authHeader, "Bearer")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUserName(jwt);

        if (StringUtils.isNotEmpty(userEmail) &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            boolean isTokenValid = tokenRepository.findByToken(jwt)
                    .map(t -> !t.isExpired() && !t.isRevoked())
                    .orElse(false);

            if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                Claims claims = jwtService.extractAllClaims(jwt);

                String roleStr = claims.get("role", String.class);
                String userId = claims.get("userId", String.class);
                Role roleEnum = Role.valueOf(roleStr);

                // Load full user details from DB
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                MyUserDetails myUserDetails = new MyUserDetails(
                        user.getId(),
                        user.getEmail(),
                        user.getPassword(),
                        user.getFullName(),
                        user.getCountry(),
                        user.getPhoneNumber(),
                        roleEnum,
                        List.of(new SimpleGrantedAuthority(roleEnum.name()))
                );

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                myUserDetails,
                                null,
                                myUserDetails.getAuthorities()
                        );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                securityContext.setAuthentication(authToken);
                SecurityContextHolder.setContext(securityContext);

                log.info("Authentication set with authorities: {}", authToken.getAuthorities());
            }
        }

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "*");
        response.setHeader("Access-Control-Allow-Headers", "*");

        filterChain.doFilter(request, response);
    }
}
