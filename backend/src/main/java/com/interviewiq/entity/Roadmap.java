package com.interviewiq.entity;
import jakarta.persistence.*;
@Entity @Table(name="roadmaps") public class Roadmap {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
  public Long userId; public Long skillId;
  public String title; @Column(columnDefinition="TEXT") public String description="";
  public int priority=1, progress=0; public String status="PENDING";
}