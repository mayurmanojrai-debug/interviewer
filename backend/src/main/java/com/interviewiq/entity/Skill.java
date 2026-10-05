package com.interviewiq.entity;
import jakarta.persistence.*;
@Entity @Table(name="skills") public class Skill {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
  @Column(unique=true) public String name; public String category="Technical"; public String description="";
}