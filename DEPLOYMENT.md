# 13TierList — Deployment Guide

## Domain & Architecture

```
tierlist.13room.space (Vercel)  →  api.tierlist.13room.space (Homelab)
       Frontend                           Bun + Caddy
                                          MongoDB (local)
```

---

## 1. MongoDB Setup (Ubuntu Server)

### แนะนำ: ลงตรงบน Ubuntu (ไม่ต้อง Docker)

MongoDB ลงตรงบน Ubuntu เหมาะกว่าสำหรับ homelab เพราะ:
- เบากว่า Docker (ไม่มี overhead ของ container layer)
- จัดการง่าย — `systemctl` control, auto-start on boot
- Backup ง่าย — `mongodump` ตรงๆ
- แอปเดียว ไม่จำเป็นต้อง containerize

### ติดตั้ง MongoDB 7 บน Ubuntu 22.04/24.04

```bash
# 1. Import GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# 2. Add repository (Ubuntu 22.04)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Install
sudo apt update
sudo apt install -y mongodb-org

# 4. Start & enable auto-start
sudo systemctl start mongod
sudo systemctl enable mongod

# 5. Verify
mongosh --eval "db.runCommand({ ping: 1 })"
```

### สร้าง Database & User

```bash
mongosh
```

```js
// สร้าง database
use tierlist13

// สร้าง user สำหรับ app (แนะนำ)
db.createUser({
  user: "tierlist13app",
  pwd: "เปลี่ยนรหัสผ่านตรงนี้",
  roles: [{ role: "readWrite", db: "tierlist13" }]
})
```

### เปิด Auth (แนะนำสำหรับ production)

```bash
sudo nano /etc/mongod.conf
```

เพิ่ม:
```yaml
security:
  authorization: enabled
```

```bash
sudo systemctl restart mongod
```

### Connection String (หลังเปิด auth)

```
MONGODB_URI=mongodb://tierlist13app:รหัสผ่าน@localhost:27017/tierlist13?authSource=tierlist13
```

---

## 2. Bun Backend Setup (Ubuntu Server)

### ติดตั้ง Bun

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun --version
```

### Deploy Backend

```bash
# Clone/copy project ไปที่ server
cd /opt/13tierlist/backend

# Install dependencies
bun install

# ตั้งค่า .env (production)
cp .env.example .env
nano .env
```

`.env` สำหรับ production:
```env
MONGODB_URI=mongodb://tierlist13app:รหัสผ่าน@localhost:27017/tierlist13?authSource=tierlist13
PORT=3001
CORS_ORIGIN=https://tierlist.13room.space
```

### ทดสอบ

```bash
bun src/index.js
# ควรเห็น: MongoDB connected: localhost
# ควรเห็น: Server running on port 3001
```

### Systemd Service (auto-start)

```bash
sudo nano /etc/systemd/system/13tierlist.service
```

```ini
[Unit]
Description=13TierList Backend (Bun)
After=network.target mongod.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/13tierlist/backend
ExecStart=/home/<your-user>/.bun/bin/bun src/index.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable 13tierlist
sudo systemctl start 13tierlist
sudo systemctl status 13tierlist
```

---

## 3. Caddy Reverse Proxy (HTTPS)

### ติดตั้ง Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

```
api.tierlist.13room.space {
    reverse_proxy localhost:3001
}
```

```bash
sudo systemctl restart caddy
```

Caddy จะจัดการ HTTPS (Let's Encrypt) อัตโนมัติ

### DNS

ตั้ง A record:
- `api.tierlist.13room.space` → IP ของ homelab server

---

## 4. Frontend (Vercel)

### Environment Variables บน Vercel

```
PUBLIC_API_URL=https://api.tierlist.13room.space
```

### Deploy

```bash
cd frontend
npm run build
# Deploy ผ่าน Vercel CLI หรือ Git integration
```

### DNS

ตั้ง CNAME:
- `tierlist.13room.space` → cname.vercel-dns.com

---

## MongoDB Schema Summary

```
Database: tierlist13
Collection: tierlists

Document structure:
{
  slug:           String (unique, indexed)
  title:          String (max 200)
  editTokenHash:  String (bcrypt)
  tiers: [{
    id:     String
    label:  String (max 20)
    color:  String (#RRGGBB)
    items: [{
      id:       String
      title:    String (max 100)
      imageUrl: String (URL only, max 2048)
    }]
  }]
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```
