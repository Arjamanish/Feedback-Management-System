package com.example.feedback.web.dto;

import com.example.feedback.model.FeedbackStatus;
import jakarta.validation.constraints.NotNull;

public class StatusRequest {
  @NotNull
  public FeedbackStatus status;
}
