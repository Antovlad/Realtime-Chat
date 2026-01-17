package ro.chat.dto;

import java.time.Instant;

public record MessageDto(Long id, String room, String from, String text, Instant timestamp) {}
