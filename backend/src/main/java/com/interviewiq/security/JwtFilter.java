package com.interviewiq.security;
import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority; import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException; import java.util.List;
@Component public class JwtFilter extends OncePerRequestFilter {
  private final JwtUtil jwt; public JwtFilter(JwtUtil j){ this.jwt=j; }
  @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain ch) throws ServletException, IOException {
    String h = req.getHeader("Authorization");
    if (h != null && h.startsWith("Bearer ")) {
      try { var c = jwt.parse(h.substring(7)).getBody();
        var auth = new UsernamePasswordAuthenticationToken(c.getSubject(), null, List.of(new SimpleGrantedAuthority("ROLE_"+c.get("role",String.class))));
        req.setAttribute("userId", Long.valueOf(c.getSubject())); req.setAttribute("userRole", c.get("role",String.class)); req.setAttribute("userEmail", c.get("email",String.class));
        SecurityContextHolder.getContext().setAuthentication(auth);
      } catch (Exception ignored) {}
    }
    ch.doFilter(req, res);
  }
}
