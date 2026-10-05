package com.interviewiq.config;
import com.interviewiq.security.JwtFilter;
import org.springframework.context.annotation.*; import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy; import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; import org.springframework.web.servlet.config.annotation.*;
@Configuration public class SecurityConfig implements WebMvcConfigurer {
  private final JwtFilter jwt; public SecurityConfig(JwtFilter j){ this.jwt=j; }
  @Bean public PasswordEncoder enc(){ return new BCryptPasswordEncoder(); }
  @Bean public SecurityFilterChain chain(HttpSecurity h) throws Exception {
    h.csrf(c->c.disable()).cors(c->{}).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
     .authorizeHttpRequests(a->a.requestMatchers("/api/auth/**","/api/health","/error").permitAll().requestMatchers("/api/admin/**").hasRole("ADMIN").anyRequest().authenticated())
     .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class);
    return h.build();
  }
  @Override public void addCorsMappings(CorsRegistry r){ r.addMapping("/api/**").allowedOriginPatterns("*").allowedMethods("*").allowedHeaders("*").allowCredentials(false); }
}
