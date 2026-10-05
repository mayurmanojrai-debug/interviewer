package com.interviewiq.entity;
import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="users") public class User {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
  public String name; @Column(unique=true,nullable=false) public String email;
  public String password; public String role="STUDENT";
  public String targetRole="Full Stack Developer"; public String experienceLevel="Intermediate";
  public LocalDateTime createdAt=LocalDateTime.now();
}