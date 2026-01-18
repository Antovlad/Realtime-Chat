package ro.chat.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import ro.chat.domain.Message;
import ro.chat.dto.MessageResponse;
import ro.chat.repo.MessageRepository;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository repo;

    public MessageService(MessageRepository repo) {
        this.repo = repo;
    }

    public MessageResponse save(String room, String from, String text, Instant ts) {
        Message m = new Message(room, from, text, ts);
        Message saved = repo.save(m);
        return new MessageResponse(saved.getId(), saved.getRoom(), saved.getSender(), saved.getText(), saved.getCreatedAt());
    }

    public List<MessageResponse> findLatest(String room, int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 200);

        var list = repo.findByRoomOrderByCreatedAtDesc(room, PageRequest.of(0, safeLimit));
        Collections.reverse(list);

        return list.stream()
                .map(m -> new MessageResponse(m.getId(), m.getRoom(), m.getSender(), m.getText(), m.getCreatedAt()))
                .toList();
    }
}
