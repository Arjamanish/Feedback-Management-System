package com.example.feedback.config;

import com.example.feedback.model.Feedback;
import com.example.feedback.model.FeedbackPriority;
import com.example.feedback.repository.FeedbackRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {
  @Bean
  CommandLineRunner seed(FeedbackRepository repo) {
    return args -> {
      if (repo.count() == 0) {
        repo.save(new Feedback("Add dark mode", "Support system-wide dark theme.", "UI", FeedbackPriority.HIGH));
        repo.save(new Feedback("Export to CSV", "Allow exporting feedback table.", "Data", FeedbackPriority.MEDIUM));
        repo.save(new Feedback("Keyboard shortcuts", "Create shortcuts for power users.", "UX", FeedbackPriority.LOW));
      }
    };
  }
}
