import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export function createStompClient({ onConnect, onError }) {
  const socket = new SockJS("http://localhost:8080/ws");

  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 2000,
    onConnect: () => onConnect?.(),
    onStompError: (frame) => onError?.(frame?.headers?.message || "STOMP error"),
    onWebSocketError: () => onError?.("WebSocket error"),
  });

  client.activate();
  return client;
}

export function subscribeRoom(client, room, onMessage) {
  return client.subscribe(`/topic/room.${room}`, (msg) => {
    try {
      onMessage(JSON.parse(msg.body));
    } catch (e) {
      console.error("Bad message", e, msg.body);
    }
  });
}

export function sendJoin(client, room, from) {
  client.publish({
    destination: "/app/chat.join",
    body: JSON.stringify({ room, from }),
  });
}

export function sendLeave(client, room, from) {
  client.publish({
    destination: "/app/chat.leave",
    body: JSON.stringify({ room, from }),
  });
}

export function sendChat(client, room, from, text) {
  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({ room, from, text }),
  });
}

export function subscribePresence(client, room, cb) {
  return client.subscribe(`/topic/presence.${room}`, (message) => {
    cb(JSON.parse(message.body));
  });
}
