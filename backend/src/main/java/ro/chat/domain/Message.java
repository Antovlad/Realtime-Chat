package ro.chat.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_room_created", columnList = "room, createdAt")
})
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String room;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false, length = 2000)
    private String text;

    @Column(nullable = false)
    private Instant createdAt;

    public Message() {}

    public Message(String room, String sender, String text, Instant createdAt) {
        this.room = room;
        this.sender = sender;
        this.text = text;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
