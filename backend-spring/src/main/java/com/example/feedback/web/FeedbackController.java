package com.example.feedback.web;

import com.example.feedback.model.Feedback;
import com.example.feedback.model.FeedbackStatus;
import com.example.feedback.repository.FeedbackRepository;
import com.example.feedback.web.dto.FeedbackRequest;
import com.example.feedback.web.dto.StatusRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = {"${app.cors.allowed-origin:http://localhost:5173}"})
public class FeedbackController {

  private final FeedbackRepository repo;

  public FeedbackController(FeedbackRepository repo) {
    this.repo = repo;
  }

  @GetMapping
  public List<Feedback> list() {
    // Newest first
    return repo.findAll().stream()
      .sorted((a, b) -> Long.compare(b.getCreatedAt(), a.getCreatedAt()))
      .toList();
  }

  @PostMapping
  public ResponseEntity<Feedback> create(@Valid @RequestBody FeedbackRequest body) {
    Feedback f = new Feedback(body.title, body.description, body.category, body.priority);
    f.setCreatedAt(System.currentTimeMillis());
    return ResponseEntity.ok(repo.save(f));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Feedback> update(@PathVariable UUID id, @Valid @RequestBody FeedbackRequest body) {
    return repo.findById(id)
      .map(existing -> {
        existing.setTitle(body.title);
        existing.setDescription(body.description);
        existing.setCategory(body.category);
        existing.setPriority(body.priority);
        return ResponseEntity.ok(repo.save(existing));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<Feedback> updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest body) {
    return repo.findById(id)
      .map(existing -> {
        existing.setStatus(body.status);
        return ResponseEntity.ok(repo.save(existing));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    if (!repo.existsById(id)) return ResponseEntity.notFound().build();
    repo.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
