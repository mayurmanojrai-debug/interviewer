package com.interviewiq.entity;
import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="questions") public class Question {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
  @Column(columnDefinition="TEXT") public String questionText;
  public String category="Technical"; public String jobRole="Java Developer";
  public String difficulty="Medium"; @Column(columnDefinition="TEXT") public String expectedKeywords="";
  @Column(columnDefinition="TEXT") public String idealAnswer=""; public boolean active=true;
}