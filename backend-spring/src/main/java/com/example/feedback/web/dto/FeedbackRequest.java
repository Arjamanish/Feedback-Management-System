package com.example.feedback.web.dto;

import com.example.feedback.model.FeedbackPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class FeedbackRequest {
  @NotBlank @Size(max = 140)
  public String title;

  @NotBlank @Size(max = 2000)
  public String description;

  @NotBlank @Size(max = 64)
  public String category;

  @NotNull
  public FeedbackPriority priority;
}
