Here is your **clean, properly structured `README.md` in correct Markdown format**, ready to paste directly into GitHub 👇

---

````md
# ChatX – Real-time Chat Application 🚀

ChatX is a full-stack, real-time chat application built using **Laravel**, **Next.js**, and **WebSockets (Laravel Reverb)**.  
It supports multi-tenant architecture, admin management, and embeddable chat widgets.

---

## ✨ Features

- Real-time messaging
- WebSocket support with **Laravel Reverb**
- Multi-tenant architecture
- Admin dashboard
- Widget-based chat interface
- Dockerized development environment

---

## 📦 Prerequisites

Make sure you have the following installed:

- Docker & Docker Compose
- Git
- Node.js **v18+**
- PHP **8.2+**
- Composer

---

## 🚀 Quick Start

### 1️⃣ Clone the repository
```bash
git clone https://github.com/MuazamMughal/chatx.git
cd chatx
````

---

### 2️⃣ Setup environment files

```bash
cp backend/.env.example backend/.env
cp web/.env.local.example web/.env.local
cp widget/.env.local.example widget/.env.local
cp admin/.env.local.example admin/.env.local
```

---

### 3️⃣ Build and start containers

```bash
docker compose up -d --build
```

---

### 4️⃣ Install PHP dependencies

```bash
docker compose exec backend composer install
```

---

### 5️⃣ Generate application key

```bash
docker compose exec backend php artisan key:generate
```

---

### 6️⃣ Run database migrations

```bash
docker compose exec backend php artisan migrate --seed
```

---

### 7️⃣ Install Node.js dependencies

```bash
docker compose exec web npm install
docker compose exec widget npm install
docker compose exec admin npm install
```

---

### 8️⃣ Build frontend assets

```bash
docker compose exec web npm run build
docker compose exec widget npm run build
docker compose exec admin npm run build
```

---

## 🌐 Access the Applications

| Service          | URL                                            |
| ---------------- | ---------------------------------------------- |
| Main Web App     | [http://localhost:3000](http://localhost:3000) |
| Admin Dashboard  | [http://localhost:3001](http://localhost:3001) |
| Chat Widget      | [http://localhost:3002](http://localhost:3002) |
| Backend API      | [http://backend.local](http://backend.local)   |
| WebSocket Server | ws://backend.local:8080                        |

---

## 🧑‍💻 Development Mode

Run services in development mode:

```bash
docker compose -f docker-compose.dev.yml up -d
```

---

## ⚙️ Environment Variables

### Backend (Laravel)

* `APP_ENV` – Application environment (`local`, `production`)
* `APP_DEBUG` – Enable debug mode
* `DB_*` – Database configuration
* `BROADCAST_DRIVER=reverb` – WebSocket driver
* `REVERB_*` – Reverb WebSocket configuration

### Web (Next.js)

* `NEXT_PUBLIC_API_URL` – Backend API URL
* `NEXT_PUBLIC_WS_URL` – WebSocket server URL
* `NEXTAUTH_URL` – Authentication callback URL
* `NEXTAUTH_SECRET` – NextAuth secret key

---

## 📁 Project Structure

```text
chatx/
├── admin/              # Admin dashboard (Next.js)
├── backend/            # Laravel API
├── web/                # Main web app (Next.js)
├── widget/             # Chat widget (Next.js)
├── nginx/              # Nginx configuration
├── supervisor/         # Process management
└── docker-compose.yml  # Docker configuration
```

---

## 🛠 Troubleshooting

### Port Conflicts

Ensure these ports are free:

```
80, 3000, 3001, 3002, 8080, 8081, 9001, 3306
```

---

### View container logs

```bash
docker compose logs
docker compose logs backend
```

---

### Database issues

```bash
docker compose exec backend php artisan migrate
docker compose exec backend php artisan migrate:fresh --seed
```

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ✅ Next Steps

### Add License file

```bash
echo "MIT License" > LICENSE
git add LICENSE
git commit -m "Add MIT License"
git push
```

---

### Update `.gitignore`

```bash
.env
backend/.env
web/.env.local
widget/.env.local
admin/.env.local
```

```bash
git add .gitignore
git commit -m "Update gitignore for environment files"
git push
```

---

### Update README

```bash
git add README.md
git commit -m "Update README with setup instructions"
git push
```

---

💡 **ChatX is production-ready and fully Dockerized.**
