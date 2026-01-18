package ro.chat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ro.chat.dto.ChatMessage;
import ro.chat.service.MessageService;
import ro.chat.service.PresenceService;

import java.time.Instant;

@Controller
public class ChatWsController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final PresenceService presenceService;

    public ChatWsController(SimpMessagingTemplate messagingTemplate,
                            MessageService messageService,
                            PresenceService presenceService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.presenceService = presenceService;
    }

    @MessageMapping("/chat.join")
    public void join(@Payload ChatMessage msg) {
        String room = safe(msg.getRoom());
        String from = safe(msg.getFrom());

        ChatMessage out = new ChatMessage();
        out.setRoom(room);
        out.setFrom(from);
        out.setType("JOIN");
        out.setTimestamp(Instant.now().toString());
        out.setText(from + " joined");

        // broadcast join event
        messagingTemplate.convertAndSend("/topic/room." + room, out);

        // update presence + broadcast users
        var users = presenceService.join(room, from);
        messagingTemplate.convertAndSend("/topic/presence." + room, users);
    }

    @MessageMapping("/chat.leave")
    public void leave(@Payload ChatMessage msg) {
        String room = safe(msg.getRoom());
        String from = safe(msg.getFrom());

        ChatMessage out = new ChatMessage();
        out.setRoom(room);
        out.setFrom(from);
        out.setType("LEAVE");
        out.setTimestamp(Instant.now().toString());
        out.setText(from + " left");
        messagingTemplate.convertAndSend("/topic/room." + room, out);

        var users = presenceService.leave(room, from);
        messagingTemplate.convertAndSend("/topic/presence." + room, users);
    }

    @MessageMapping("/chat.send")
    public void send(@Payload ChatMessage msg) {
        String room = safe(msg.getRoom());
        String from = safe(msg.getFrom());
        String text = safe(msg.getText());

        ChatMessage out = new ChatMessage();
        out.setRoom(room);
        out.setFrom(from);
        out.setType("CHAT");
        out.setTimestamp(Instant.now().toString());
        out.setText(text);

        messageService.save(room, from, text, Instant.parse(out.getTimestamp()));

        messagingTemplate.convertAndSend("/topic/room." + room, out);
    }

    private String safe(String s) {
        if (s == null) return "";
        return s.trim();
    }
}
