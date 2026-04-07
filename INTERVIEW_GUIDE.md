# 🧠 System Design Interview Guide: SocketChat

This guide prepares you to explain the **SocketChat** architecture during a technical interview. It covers the most common "deep-dive" questions and provides high-signal answers based on your implementation.

---

## 👨‍🏫 Part 1: The "High-Level" Pitch

**Interviewer:** *"Tell me about the architecture of your chat system."*

**Your Answer:**
> "I built SocketChat as a distributed real-time messaging platform. It uses **Node.js/Express** and **Socket.io** for persistent connections, with a **Nginx** reverse proxy for load balancing. To handle horizontal scaling, I integrated a **Redis Pub/Sub** adapter so that users on different server instances can communicate seamlessly. For data durability and reliability, I used **PostgreSQL** with a write-through pattern and implemented **idempotency keys** to prevent message duplication during network retries."

---

## 🔍 Part 2: Deep Dive Questions

### 1. "How do you handle WebSocket authentication securely?"
**Technical Implementation:**
*   You use **Cookie-based Handshake Auth**.
*   The JWT is stored in an `httpOnly`, `Secure`, `SameSite=Lax` cookie.
*   **Why this matters:** Unlike sending the token in a `payload` or `query string` (which can be logged by proxies), the cookie is sent automatically during the **HTTP Upgrade** request.
*   **The Code:** In `backend/src/socket/index.ts`, you parse the cookie header *before* the socket is even fully connected (`io.use`).

### 2. "How does your system scale horizontally (multi-server)?"
**Technical Implementation:**
*   **Sticky Sessions:** Nginx uses `ip_hash` to ensure a client stays on the same server for the initial handshake.
*   **Redis Adapter:** You use `@socket.io/redis-adapter`.
*   **Scenario:** If User A is on Server 1 and User B is on Server 2:
    1. User A sends a message to Server 1.
    2. Server 1 saves it to the DB and publishes it to **Redis**.
    3. Server 2 is "listening" to Redis; it sees the message and pushes it via WebSocket to User B.

### 3. "How do you ensure you don't save duplicate messages if a client retries?"
**Technical Implementation:**
*   **Client-Side:** The frontend generates a unique `client_message_id` (UUID) for every message *before* sending it.
*   **Database-Side:** The `messages` table has a `UNIQUE (client_message_id)` constraint.
*   **Logic:** You use `INSERT ... ON CONFLICT DO NOTHING`.
*   **Interview Signal:** This demonstrates you understand **Idempotency** and the "At-Least-Once" delivery challenges of distributed systems.

### 4. "How do you track user presence (Online/Offline) across multiple servers?"
**Technical Implementation:**
*   **The Problem:** A user might have 3 tabs open across 2 different servers. You don't want them to show as 'Offline' if they just close one tab.
*   **The Solution:** You used a **Redis Hash** with `HINCRBY`.
    *   **Connect:** Increment the counter in Redis. If the result is `1`, they just went online.
    *   **Disconnect:** Decrement the counter. If the result is `0`, they are officially offline.
*   **Why Redis?** Server memory is isolated. Redis provides a **Global Shared State** that all server instances can see.

---

## 🏗 Part 3: Design Trade-offs (The "Senior" Signal)

| Choice | Trade-off |
| :--- | :--- |
| **PostgreSQL vs. MongoDB** | I chose Postgres for **ACID compliance** and strict schemas for user/auth data. For extreme scale (billions of messages), I would look at partitioning Postgres or moving to a NoSQL store like Cassandra/ScyllaDB. |
| **Redis vs. Kafka** | Redis is perfect for **sub-millisecond low-latency** fan-out needed for chat. I would add Kafka later if I needed a durable "event stream" for analytics or complex search indexing. |
| **HTTP Handshake Auth** | Using cookies simplifies the code and is more secure against XSS, but it requires the frontend and backend to share a domain (or properly configured CORS/Cookies). |

---

## 🚀 Part 4: "What would you do next?"

*If they ask how you'd improve the system, mention these:*

1.  **Message Ordering (Sequence Numbers):** Use a per-channel sequence number to ensure that if packets arrive out of order, the UI can re-sort them correctly.
2.  **Media Sharding:** Move file uploads to an **S3-compatible object store** and use a CDN (CloudFront) for delivery instead of serving them from the local backend.
3.  **Read Receipts:** Implement a "Last Read Message" pointer in the database per user per channel to handle unread counts efficiently.

---

**Tip for your interview:** Have a tab open with your `README.md` and the `backend/src/socket/index.ts` file. These are your strongest "evidence" files!
