<div align="center">
  <h1>🏆 13TierList</h1>
  <p><strong>A modern, minimalist, and beautifully animated Tier List maker.</strong></p>

  <br />
  
  [![Built by Kx53](https://img.shields.io/badge/Built_by-Kx53-8b5cf6?style=for-the-badge&logoColor=white)](https://github.com/Kx53)
  [![Powered by](https://img.shields.io/badge/Powered_by-13room.space-0f172a?style=for-the-badge)](https://13room.space)

</div>

<br />

## ✨ Features

- **No Sign-up Required:** Jump right in and create tier lists anonymously using a secure edit token system.
- **Drag & Drop:** Fluid and native-feeling drag-and-drop interactions powered by `dnd-kit`.
- **Hybrid Items:** Support for both Image Uploads (up to 5MB) and Text-Only items.
- **Item Bank (Unranked Pool):** A dedicated staging area for your uploaded items before you rank them.
- **Customizable Tiers:** Add, rename, or recolor your tiers on the fly.
- **Auto-Save & Drafts:** Your progress is automatically saved to your browser so you never lose your work.
- **Shareable Links:** Send your tier list URL to anyone. They get a beautiful read-only view.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Astro (for lightning-fast static routing)
- **UI:** React 19 (Islands functionality)
- **Styling:** Tailwind CSS (v4)
- **Drag & Drop:** `@dnd-kit/core` and `@dnd-kit/sortable`
- **State Management:** React Hooks + LocalStorage (Drafts & Tokens)

### Backend
- **Runtime:** Bun
- **Framework:** Express.js
- **Database:** MongoDB (Native Mongoose ODM)
- **Storage:** Local Disk Storage via `multer`

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/)
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
npm install

# Run the frontend
npm run dev
```
Open `http://localhost:4321` in your browser.

## 🔒 Security & Architecture
- Instead of traditional user accounts, 13TierList uses **Edit Tokens**.
- When a list is created, the server generates a crypto-random 32-character token.
- The server stores only the `bcrypt` hash of this token.
- The frontend stores the raw token in `localStorage`.
- Anyone with the link can view the list, but only the browser with the token can edit or upload images to it.

## 👨‍💻 Author

Built with ❤️ by **[Kx53](https://github.com/Kx53)**  
Part of the **13room.space** ecosystem.
