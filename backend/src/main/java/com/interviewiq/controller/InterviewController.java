package com.interviewiq.controller;
import com.interviewiq.ai.*;
import com.interviewiq.entity.*;
import com.interviewiq.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
@RestController @RequestMapping("/api/interviews")
public class InterviewController {
  private final InterviewRepository interviews; private final QuestionRepository questions;
  private final AnswerRepository answers; private final EvaluationService eval; private final AdaptiveService adaptive;
  private final SkillRepository skills; private final UserSkillRepository userSkills;
  private final RoadmapRepository roadmaps; private final AchievementRepository achievements;
  public InterviewController(InterviewRepository i, QuestionRepository q, AnswerRepository a, EvaluationService e, AdaptiveService ad, SkillRepository s, UserSkillRepository u, RoadmapRepository r, AchievementRepository ac){
    interviews=i; questions=q; answers=a; eval=e; adaptive=ad; skills=s; userSkills=u; roadmaps=r; achievements=ac; }
  private Long uid(HttpServletRequest r){ Object v=r.getAttribute("userId"); return v==null?null:Long.valueOf(v.toString()); }
  public record CreateReq(String jobRole, String experienceLevel, String difficulty, String interviewType, Integer totalQuestions){}
  @PostMapping public ResponseEntity<?> create(@RequestBody CreateReq c, HttpServletRequest req){
    Interview iv=new Interview(); iv.userId=uid(req);
    iv.jobRole=c.jobRole()==null?"Java Developer":c.jobRole();
    iv.experienceLevel=c.experienceLevel()==null?"Intermediate":c.experienceLevel();
    iv.difficulty=c.difficulty()==null?"Adaptive AI":c.difficulty();
    iv.interviewType=c.interviewType()==null?"Mixed":c.interviewType();
    iv.totalQuestions=c.totalQuestions()==null?5:c.totalQuestions();
    interviews.save(iv);
    List<Question> pool = questions.findByJobRoleAndActiveTrue(iv.jobRole);
    if (pool.isEmpty()) pool = questions.findByActiveTrue();
    Collections.shuffle(pool);
    List<Question> pick = pool.stream().limit(iv.totalQuestions).toList();
    return ResponseEntity.status(201).body(Map.of("interview",iv,"questions",pick,"nextDifficulty","Medium"));
  }
  @GetMapping public List<Interview> mine(HttpServletRequest req){ return interviews.findByUserIdOrderByCreatedAtDesc(uid(req)); }
  @GetMapping("/{id}") public ResponseEntity<?> one(@PathVariable Long id, HttpServletRequest req){
    var iv=interviews.findById(id).orElse(null); if(iv==null||!iv.userId.equals(uid(req))) return ResponseEntity.status(404).body(Map.of("message","Not found"));
    return ResponseEntity.ok(Map.of("interview",iv,"answers",answers.findByInterviewId(id)));
  
 plus methods placeholder
