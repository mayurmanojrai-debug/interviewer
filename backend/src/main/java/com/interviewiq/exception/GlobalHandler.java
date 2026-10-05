package com.interviewiq.exception;
import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*; import java.time.LocalDateTime; import java.util.*;
@RestControllerAdvice public class GlobalHandler {
  @ExceptionHandler(RuntimeException.class) public ResponseEntity<Map<String,Object>> rt(RuntimeException e, jakarta.servlet.http.HttpServletRequest r){ return body(HttpStatus.BAD_REQUEST,"Request failed",e.getMessage(),r.getRequestURI()); }
  @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<Map<String,Object>> val(MethodArgumentNotValidException e, jakarta.servlet.http.HttpServletRequest r){
    String m = e.getBindingResult().getFieldErrors().stream().map(f->f.getField()+": "+f.getDefaultMessage()).findFirst().orElse("Validation error");
    return body(HttpStatus.BAD_REQUEST,"Validation Error",m,r.getRequestURI()); }
  private ResponseEntity<Map<String,Object>> body(HttpStatus s,String err,String msg,String path){
    Map<String,Object> b=new LinkedHashMap<>(); b.put("timestamp",LocalDateTime.now().toString()); b.put("status",s.value()); b.put("error",err); b.put("message",msg); b.put("path",path); return ResponseEntity.status(s).body(b); }
}
