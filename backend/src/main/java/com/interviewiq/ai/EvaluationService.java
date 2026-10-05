package com.interviewiq.ai;
import com.interviewiq.entity.Question;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class EvaluationService {
  private static final Set<String> FILLERS = Set.of("um","uh","like","actually","basically","stuff","thing");
  public EvaluationResult evaluate(String answer, Question q) {
    EvaluationResult r = new EvaluationResult();
    String a = answer == null ? "" : answer.trim();
    String low = a.toLowerCase();
    List<String> kws = new ArrayList<>();
    if (q.expectedKeywords != null && !q.expectedKeywords.isBlank())
      for (String k : q.expectedKeywords.split(",")) { k=k.trim().toLowerCase(); if(!k.isEmpty()) kws.add(k); }
    long hits = kws.stream().filter(low::contains).count();
    double coverage = kws.isEmpty() ? 0.6 : (double) hits / kws.size();
    int words = a.isEmpty() ? 0 : a.split("\\s+").length;
    double lenScore = words < 10 ? 0.3 : words < 30 ? 0.6 : words < 80 ? 0.85 : words < 200 ? 0.95 : 0.85;
    long filler = Arrays.stream(low.split("\\W+")).filter(FILLERS::contains).count();
    double clarity = Math.max(0.3, 0.92 - filler * 0.06 + (a.contains(".") ? 0.03 : -0.05));
    boolean hasExample = low.contains("example") || low.contains("for instance") || low.contains("e.g") || low.contains("use case");
    double technical = clamp(0.35 + coverage*0.55 + (hasExample?0.05:0) + (words>25?0.05:0));
    double relevance = clamp(0.4 + coverage*0.5 + (words>15?0.08:0));
    double completeness = clamp(lenScore*0.7 + coverage*0.3);
    double diffW = "Hard".equalsIgnoreCase(q.difficulty)?1.0:"Medium".equalsIgnoreCase(q.difficulty)?0.95:0.9;
    r.technical = pct(technical*diffW); r.relevance = pct(relevance); r.completeness = pct(completeness); r.clarity = pct(clarity);
    r.score = pct(technical*0.4+relevance*0.25+completeness*0.2+clarity*0.15);
    if (coverage>=0.6) r.strengths.add("Good concept coverage ("+(int)(coverage*100)+"%)");
    if (hasExample) r.strengths.add("Included real-world example");
    if (words>=40) r.strengths.add("Well-structured, detailed explanation");
    if (r.strengths.isEmpty()) r.strengths.add("Attempted the core concept");
    if (coverage<0.4) r.weaknesses.add("Missing key concepts: "+missing(kws,low));
    if (!hasExample) r.weaknesses.add("Add a real-world example");
    if (words<30) r.weaknesses.add("Answer too brief — explain with steps");
    if (filler>2) r.weaknesses.add("Reduce filler words for clarity");
    r.feedback = buildFeedback(r.score, coverage, hasExample, words);
    return r;
  }
  private String missing(List<String> kws,String low){ List<String> m=kws.stream().filter(k->!low.contains(k)).limit(3).toList(); return m.isEmpty()?"core details":String.join(", ",m); }
  private String buildFeedback(double s,double cov,boolean ex,int w){
    if (s>=85) return "Excellent answer with strong technical depth."+(ex?"":" Add one production example to make it perfect.");
    if (s>=70) return "Good explanation of the concept. Strengthen coverage ("+(int)(cov*100)+"%) and add a real-world example.";
    if (w<20) return "Answer is too short. Explain the concept in 3-4 sentences with an example and mention trade-offs.";
    return "Partial understanding shown. Cover the missing concepts step-by-step and illustrate with an example.";
  }
  private double clamp(double v){ return Math.max(0.15,Math.min(1.0,v)); }
  private double pct(double v){ return Math.round(clamp(v)*1000.0)/10.0; }
}
