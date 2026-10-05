package com.interviewiq.security;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Component;
import java.security.Key; import java.util.Date;
@Component public class JwtUtil {
  private final Key key; private final long expiry;
  public JwtUtil(@Value("${app.jwt-secret:interviewiq-super-secret-key-min-32-chars-1234567890}") String s,
                 @Value("${app.jwt-expiry:86400000}") long e){ this.key=Keys.hmacShaKeyFor(s.getBytes()); this.expiry=e; }
  public String gen(Long id,String email,String role){ return Jwts.builder().setSubject(String.valueOf(id)).claim("email",email).claim("role",role).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis()+expiry)).signWith(key).compact(); }
  public Jws<Claims> parse(String t){ return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(t); }
}
