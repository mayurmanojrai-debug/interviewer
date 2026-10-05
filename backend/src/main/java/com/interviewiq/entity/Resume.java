package com.interviewiq.entity;
import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="resumes") public class Resume {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
  public Long userId; public String fileName="";
  @Column(columnDefinition="MEDIUMTEXT") public String extractedText="";
  public int resumeScore=0; public LocalDateTime uploadedAt=LocalDateTime.now();
}