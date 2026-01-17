package ro.chat.dto;

public class ChatMessage {
    private String room;
    private String from;
    private String text;
    private String type; // "CHAT" | "JOIN" | "LEAVE"
    private String timestamp; // ISO string

    public ChatMessage() {}

    // getters/setters
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
