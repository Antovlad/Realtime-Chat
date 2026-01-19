import { useEffect, useMemo, useRef, useState } from "react";
import {
  createStompClient,
  subscribeRoom,
  subscribePresence,
  sendChat,
  sendJoin,
  sendLeave,
} from "./api/ws";
import { fetchHistory } from "./api/http";

function fmt(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString();
  } catch {
    return iso;
  }
}

export default function ChatPage() {
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  const [username, setUsername] = useState("Antoniu");
  const [room, setRoom] = useState("general");

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);

  const clientRef = useRef(null);
  const roomSubRef = useRef(null);
  const presenceSubRef = useRef(null);

  const canSend = useMemo(() => {
    return connected && username.trim() && room.trim() && text.trim();
  }, [connected, username, room, text]);

  
  useEffect(() => {
    const client = createStompClient({
      onConnect: () => setConnected(true),
      onError: (msg) => setError(String(msg)),
    });
    clientRef.current = client;

    return () => {
      try {
        roomSubRef.current?.unsubscribe?.();
      } catch {}
      try {
        presenceSubRef.current?.unsubscribe?.();
      } catch {}
      try {
        client.deactivate();
      } catch {}
    };
  }, []);

 
  useEffect(() => {
    if (!connected) return;

    const client = clientRef.current;
    if (!client) return;

    const r = room.trim();
    const u = username.trim();

    if (!r || !u) return;

    setError("");

    
    setMessages([]);
    setOnline([]);

    
    try {
      roomSubRef.current?.unsubscribe?.();
    } catch {}
    try {
      presenceSubRef.current?.unsubscribe?.();
    } catch {}
    roomSubRef.current = null;
    presenceSubRef.current = null;

    
    fetchHistory(r, 50)
      .then((hist) => {
        const mapped = (hist || []).map((m) => ({
          room: m.room,
          from: m.from,
          text: m.text,
          type: "CHAT",
          timestamp: m.timestamp,
        }));
        setMessages(mapped);
      })
      .catch((e) => {
        setError(e.message || String(e));
      });

    roomSubRef.current = subscribeRoom(client, r, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    presenceSubRef.current = subscribePresence(client, r, (users) => {
      setOnline(users || []);
    });

    sendJoin(client, r, u);

    return () => {
      try {
        sendLeave(client, r, u);
      } catch {}
      try {
        roomSubRef.current?.unsubscribe?.();
      } catch {}
      try {
        presenceSubRef.current?.unsubscribe?.();
      } catch {}
      roomSubRef.current = null;
      presenceSubRef.current = null;
    };
  }, [connected, room, username]);

  function onSend(e) {
    e.preventDefault();
    if (!canSend) return;

    const client = clientRef.current;
    if (!client) return;

    const r = room.trim();
    const u = username.trim();
    const t = text.trim();

    setError("");

    try {
      sendChat(client, r, u, t);
      setText("");
    } catch (err) {
      setError(err?.message || String(err));
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 6 }}>Real-time Chat</h1>
      <div style={{ color: "#666", marginBottom: 16 }}>
        Spring Boot WebSocket (STOMP) + React • History (REST) + Presence
      </div>

      {error && (
        <div style={{ background: "#ffe6e6", padding: 12, borderRadius: 10, marginBottom: 12 }}>
          <b>Error:</b> {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, alignItems: "start" }}>
        <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
          <h2 style={{ marginTop: 0 }}>Session</h2>

          <div style={{ marginBottom: 10 }}>
            Status:{" "}
            <b style={{ color: connected ? "green" : "#b45309" }}>
              {connected ? "Connected" : "Connecting..."}
            </b>
          </div>

          <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>

          <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
            Room
            <input value={room} onChange={(e) => setRoom(e.target.value)} />
          </label>

          <h3 style={{ marginTop: 0 }}>Online users</h3>
          {online.length === 0 ? (
            <div style={{ color: "#666" }}>No users (yet).</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {online.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          )}

          <div style={{ color: "#666", fontSize: 13, marginTop: 12 }}>
            Tip: deschide încă un tab și intră în aceeași cameră.
          </div>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ marginTop: 0, marginBottom: 0 }}>Room: {room.trim() || "(empty)"}</h2>
            <div style={{ color: "#666" }}>{messages.length} msgs</div>
          </div>

          <div
            style={{
              marginTop: 12,
              height: 440,
              overflow: "auto",
              border: "1px solid #f0f0f0",
              borderRadius: 12,
              padding: 12,
              background: "#fafafa",
            }}
          >
            {messages.length === 0 ? (
              <div style={{ color: "#666" }}>No messages yet.</div>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    marginBottom: 8,
                    background: m.type === "CHAT" ? "white" : "#f3f4f6",
                    border: "1px solid #eee",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <b>{m.from || "system"}</b>{" "}
                      {m.type && m.type !== "CHAT" && (
                        <span style={{ color: "#666" }}>({m.type})</span>
                      )}
                    </div>
                    <div style={{ color: "#666", fontSize: 12 }}>{fmt(m.timestamp)}</div>
                  </div>
                  <div style={{ marginTop: 4 }}>{m.text}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={onSend} style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message..."
              style={{ flex: 1 }}
            />
            <button disabled={!canSend} type="submit">
              Send
            </button>
          </form>

          {!username.trim() || !room.trim() ? (
            <div style={{ color: "#b45309", fontSize: 13, marginTop: 8 }}>
              Setează username și room ca să poți trimite mesaje.
            </div>
          ) : null}

          <div style={{ color: "#666", fontSize: 13, marginTop: 10 }}>
            History loads via REST (`/api/rooms/{room}/messages`) and live updates via WebSocket.
          </div>
        </div>
      </div>
    </div>
  );
}
