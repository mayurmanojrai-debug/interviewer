package com.interviewiq.entity;
import jakarta.persistence.*;
@Entity @Table(name="user_skills", uniqueConstraints=@UniqueConstraint(columnNames={"userId","skillId"})) public class UserSkill {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
  public Long userId; public Long skillId; public double currentScore=0, targetScore=90, gapScore=90;
}