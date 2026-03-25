<div align="center">
  <h1>🏆 13TierList 🏆</h1>
  <p><strong>A modern, minimalist, and beautifully animated Tier List maker.</strong></p>

  <br />

[🇹🇭 ภาษาไทย (Thai)](README.th.md)

  <br />

[![Built by Kx53](https://img.shields.io/badge/Built_by-Kx53-8b5cf6?style=for-the-badge&logoColor=white)](https://github.com/Kx53)
[![Powered by](https://img.shields.io/badge/Powered_by-13room.space-0f172a?style=for-the-badge)](https://www.13room.space)

</div>

<br />

## ✨ Features

- **No Sign-up Required:** Jump right in and create tier lists anonymously using a secure edit token system.
- **Drag & Drop:** Fluid and native-feeling drag-and-drop interactions powered by `@dnd-kit`.
- **Hybrid Items:** Support for both Image Uploads (up to 5MB) and Text-Only items.
- **Item Bank:** A dedicated staging area for your uploaded items before you rank them.
- **Mobile Optimized:** Optimized touch sensors for effortless use on iPhones, iPads, and Android devices.
- **Real-time i18n:** Seamlessly switch between **Thai** and **English** without page reloads.
- **Auto-Save & Drafts:** Your progress is automatically saved to your browser so you never lose your work.
- **Shareable Links:** Send your tier list URL to anyone. They get a beautiful read-only view.

## 🛠️ Tech Stack

### Frontend

- **Framework:** Astro 6 (Lightning-fast static routing)
- **UI:** React 19 (Islands functionality)
- **Styling:** Tailwind CSS (v4)
- **Localization:** `@nanostores/i18n` (Zero-latency TH/EN switching)
- **Type Safety:** **Eden RPC** (End-to-end type safety with the backend)
- **Drag & Drop:** `@dnd-kit/core` and `@dnd-kit/sortable`

### Backend

- **Runtime:** Bun
- **Framework:** **Elysia.js** (High-performance web framework for Bun)
- **Language:** TypeScript
- **Database:** MongoDB (Native Mongoose ODM)
- **Storage:** Local Disk Storage via `multer`

## 🚀 Quick Start (Local Development)

### Prerequisites

- [Bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/) (running locally or via Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/Kx53/13tierlist.git
cd 13tierlist
```

### 2. Setup the Backend

```bash
cd backend
bun install

# Create a .env file
echo "MONGODB_URI=mongodb://localhost:27017/13tierlist" > .env
echo "PORT=3001" >> .env
echo "CORS_ORIGIN=http://localhost:4321" >> .env

# Run the backend
bun run dev
```

### 3. Setup the Frontend

```bash
# In a new terminal window
cd frontend
bun install

# Run the frontend
bun run dev
```

Open `http://localhost:4321` in your browser.

## 🔒 Security & Architecture

- Instead of traditional user accounts, 13TierList uses **Edit Tokens**.
- When a list is created, the server generates a crypto-random 32-character token.
- The server stores only the `bcrypt` hash of this token.
- The backend is fully built with **Elysia.js** and communicates with the frontend via **Eden RPC**, ensuring that every API request is type-safe and performant.
- All file uploads are restricted to 5MB and validated against supported mime types.

## 👨‍💻 Author

Built with ❤️ by **[Kx53](https://github.com/Kx53)**  
Part of the **13room.space** ecosystem.
