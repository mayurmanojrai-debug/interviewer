package com.interviewiq.entity;
import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="answers") public class Answer {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
  public Long interviewId; public Long questionId;
  @Column(columnDefinition="TEXT") public String questionText;
  @Column(columnDefinition="MEDIUMTEXT") public String answerText;
  public double score=0, technicalScore=0, relevanceScore=0, completenessScore=0, clarityScore=0;
  @Column(columnDefinition="TEXT") public String feedback="", strengths="", weaknesses="";
  public String difficultyAtTime="Medium"; public LocalDateTime createdAt=LocalDateTime.now();
}