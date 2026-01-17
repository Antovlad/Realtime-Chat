package ro.chat.dto;

import java.time.Instant;

public record MessageResponse(Long id, String room, String from, String text, Instant timestamp) {}
