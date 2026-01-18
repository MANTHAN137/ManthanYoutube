# Manthan YouTube Channel Website

A modern, professional website for the Manthan YouTube channel featuring AI-generated content, games, and a stunning sci-fi design.

## 📁 Project Structure

```
manthan-website/
├── frontend/           # Frontend (React + Vite)
│   ├── public/         # Static assets
│   │   ├── videos/     # Video montage files
│   │   └── dark-scifi-bg.png
│   └── src/            # React source code
└── backend/            # Backend API (Node.js + Express)
    └── server.js       # YouTube API proxy server
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- YouTube Data API key

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## 🌐 Deployment

### Deploy Frontend (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to Vercel or Netlify

3. Update `BACKEND_URL` in `src/services/youtubeApi.js` to point to your deployed backend

### Deploy Backend (Railway/Render)

1. Push the `backend` folder to a Git repo
2. Connect to Railway or Render
3. Set environment variable: `PORT=3001`
4. Deploy!

### Environment Variables

**Backend:**
- `PORT` - Server port (default: 3001)

**Frontend:**
- Update `BACKEND_URL` in `youtubeApi.js` with your production backend URL

## ✨ Features

- 🎬 **Video Gallery** - Auto-fetches latest videos from YouTube
- 📱 **Shorts Section** - Dedicated section for YouTube Shorts
- 🎮 **Games** - Snake, Tic-Tac-Toe, Space Runner, Asteroid Shooter
- 🌌 **Sci-Fi Design** - Dark theme with glowing effects
- 📊 **Live Stats** - Real subscriber and view counts
- 🔄 **Auto-Update** - New videos appear within 5 minutes

## 🎮 Games

| Game | Controls |
|------|----------|
| 🐍 Snake | Arrow Keys |
| ⭕ Tic-Tac-Toe | Click cells |
| 🚀 Space Runner | Space/Click |
| 🎯 Asteroid Shooter | Click asteroids |

## 📝 License

MIT License - Feel free to use and modify!
