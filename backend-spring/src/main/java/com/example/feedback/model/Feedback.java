package com.example.feedback.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "feedback")
public class Feedback {

  @Id
  @GeneratedValue
  private UUID id;

  @Column(nullable = false, length = 140)
  private String title;

  @Column(nullable = false, length = 2000)
  private String description;

  @Column(nullable = false, length = 64)
  private String category;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private FeedbackStatus status = FeedbackStatus.OPEN;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private FeedbackPriority priority = FeedbackPriority.MEDIUM;

  @Column(nullable = false)
  private long createdAt;

  public Feedback() {}

  public Feedback(String title, String description, String category, FeedbackPriority priority) {
    this.title = title;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.status = FeedbackStatus.OPEN;
    this.createdAt = System.currentTimeMillis();
  }

  // Getters and setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public FeedbackStatus getStatus() { return status; }
  public void setStatus(FeedbackStatus status) { this.status = status; }

  public FeedbackPriority getPriority() { return priority; }
  public void setPriority(FeedbackPriority priority) { this.priority = priority; }

  public long getCreatedAt() { return createdAt; }
  public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
}
