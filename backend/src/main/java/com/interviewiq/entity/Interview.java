package com.interviewiq.entity;
import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="interviews") public class Interview {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
  public Long userId; public String jobRole; public String experienceLevel="Intermediate";
  public String difficulty="Adaptive AI"; public String interviewType="Mixed";
  public int totalQuestions=5; public double overallScore=0, technicalScore=0;
  public double communicationScore=0, problemSolvingScore=0, confidenceScore=0;
  public int durationSeconds=0; public String status="IN_PROGRESS";
  public LocalDateTime createdAt=LocalDateTime.now();
}