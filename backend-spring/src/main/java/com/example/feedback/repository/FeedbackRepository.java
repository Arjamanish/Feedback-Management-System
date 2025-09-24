package com.example.feedback.repository;

import com.example.feedback.model.Feedback;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {}
