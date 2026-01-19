Real-time Chat

A real-time chat application built with Spring Boot WebSocket (STOMP + SockJS) and a React frontend, using PostgreSQL for message persistence. The project demonstrates real-time communication, REST APIs, WebSockets, and Docker-based setup.

✨ Features

💬 Real-time messaging using WebSockets

🕒 Message history persisted in database

🔁 Automatic message broadcast to connected clients

🌐 REST endpoints for message history

🐳 Fully dockerized backend + database

🧰 Tech Stack Backend

Java

Spring Boot

Spring WebSocket (STOMP + SockJS)

Spring Data JPA

PostgreSQL

Frontend

React

JavaScript

SockJS Client

STOMP.js

DevOps

Docker

Docker Compose

📦 Requirements

Docker Desktop

(Optional for local dev) Node.js & JDK

🚀 Run with Docker (Recommended) 1️⃣ Start backend + database

From the project root (where docker-compose.yml is located):

docker compose up -d --build

This will start:

PostgreSQL database

Spring Boot backend (WebSocket + REST API)

2️⃣ Verify backend

Open in browser:

http://localhost:8080/ping

Or test REST endpoint:

curl http://localhost:8080/api/rooms/general/messages

🖥️ Run Frontend

If the frontend is not dockerized, start it locally:

cd frontend npm install npm run dev

Frontend will run on:

http://localhost:5173

The frontend connects to:

WebSocket: ws://localhost:8080/ws

REST API: http://localhost:8080/api

🔧 Configuration Database

Database configuration is handled via environment variables in docker-compose.yml:

Database: chat

User: chat

Password: chat

Data is persisted using a Docker volume.
