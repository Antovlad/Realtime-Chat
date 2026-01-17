package ro.chat.controller;

import org.springframework.web.bind.annotation.*;
import ro.chat.dto.MessageResponse;
import ro.chat.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // test endpoint
    @GetMapping("/ping")
    public String ping() {
        return "ok";
    }

    // history endpoint
    @GetMapping("/{room}/messages")
    public List<MessageResponse> history(
            @PathVariable String room,
            @RequestParam(defaultValue = "50") int limit
    ) {
        return messageService.findLatest(room, limit);
    }
}
