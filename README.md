# 🧑‍💻 Virtual AI Voice Assistant

An AI-powered virtual assistant built with React, Node.js, Express, MongoDB, and Google Gemini AI. It can listen to your voice, respond with speech (US accent), search on Google & YouTube, open apps like Instagram/Facebook, show weather, answer general questions, and more.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#️-installation--setup)
- [Environment Variables](#-environment-variables)
- [Getting API Keys](#-getting-api-keys)
  - [Gemini API Key](#-1-gemini-api-key)
  - [Cloudinary API Keys](#-2-cloudinary-api-keys)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Author](#️-author)

---

## ✨ Features

- 🎙️ Voice recognition using Web Speech API
- 🗣️ Text-to-Speech (US accent) for smooth conversations
- 🤖 AI-powered responses using Google Gemini AI

### 🔍 Smart Actions

- Google Search
- YouTube Search (with channel detection)
- Weather lookup
- Calculator
- Social media shortcuts (Instagram, Facebook)

- 🖼️ Customizable Assistant Profile (name + avatar via Cloudinary)
- 📝 User history tracking stored in MongoDB
- 🔑 Authentication & Security with JWT and bcrypt

---

## 🛠 Tech Stack

### Frontend

- React 19
- React Router DOM
- Tailwind CSS 4
- Axios

### Backend

- Node.js + Express 5
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer & Cloudinary for image uploads
- Google Gemini AI (Generative Language API)
- Moment.js for date/time handling

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sarg3n7/Virtual-AI-Assistant.git
cd Virtual-AI-Assistant
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
```

---

## 🌍 Environment Variables

You need to configure environment variables for both backend and frontend.

Inside `backend/`, create a `.env.example` file:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
```

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your actual credentials in `.env`.

---

## 🔑 Getting API Keys

### 🔹 1. Gemini API Key

Go to **Google AI Studio** → [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

- Sign in with your Google account.
- Click **Create API Key**.
- Copy the key and paste it into `.env`:

```env
GEMINI_API_KEY=your_generated_key_here
```

### 🔹 2. Cloudinary API Keys

Go to **Cloudinary** → [https://cloudinary.com](https://cloudinary.com)

- Create a free account.
- After logging in, go to **Dashboard**.
- Copy your credentials:
  - Cloud Name
  - API Key
  - API Secret

Paste them into `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Usage

### Run Backend

```bash
cd backend
npx nodemon
```

### Run Frontend

```bash
cd frontend
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## 📸 Screenshots

### User SignIn Page
![SignIn Page](./screenshots/signin.png)

### Virtual Assistant
![Virtual Assistant](./screenshots/assistant.png)

---

## 📌 Future Improvements

- 🌎 Multi-language support
- 🎵 Spotify/YouTube Music integration
- 📅 Calendar & reminders
- 💻 Desktop app version with Electron

---

## 👨‍💻 Author

**Tikesh Aswale**
