<div align="center">
  <h1>🏆 13TierList</h1>
  <p><strong>โปรแกรมสร้าง Tier List ส่วนตัวสไตล์มินิมอล ที่โมเดิร์นและแอนิเมชันสวยงาม</strong></p>

  <br />

[🇬🇧 Read in English (อ่านภาษาอังกฤษ)](README.md)

  <br />
  
  [![Built by Kx53](https://img.shields.io/badge/Built_by-Kx53-8b5cf6?style=for-the-badge&logoColor=white)](https://github.com/Kx53)
  [![Powered by](https://img.shields.io/badge/Powered_by-13room.space-0f172a?style=for-the-badge)](https://13room.space)

</div>

<br />

## ✨ ฟีเจอร์หลัก

- **ไม่ต้องสมัครสมาชิก:** ข้ามความยุ่งยากไปได้เลย สามารถสร้าง Tier List ได้แบบไร้ระบุตัวตนผ่านระบบ Edit Token ที่ปลอดภัย
- **ลากและวาง (Drag & Drop):** ประสบการณ์ลากวางที่ลื่นไหลและเป็นธรรมชาติ ขับเคลื่อนโดย `dnd-kit`
- **ใส่รูปหรือข้อความก็ได้:** รองรับทั้งการอัปโหลดรูปภาพ (สูงสุด 5MB) และการพิมพ์ข้อความเปล่าๆ เป็นไอเทม
- **Item Bank (ไอเทมที่รอจัดอันดับ):** โซนสำหรับพักรูปภาพหรือข้อความที่คุณเพิ่มเข้ามา ก่อนที่จะลากจัดอันดับใน Tiers ด้านบน
- **ปรับแต่งอิสระ:** เพิ่ม ลบ เปลี่ยนชื่อ หรือเปลี่ยนสีของแต่ละ Tier ได้ทันที
- **บันทึกอัตโนมัติ (Auto-Save):** ไม่ต้องกลัวงานหาย ระบบจะเซฟ Draft ลงเบราว์เซอร์ของคุณอัตโนมัติ
- **แชร์ลิงก์ง่ายๆ:** ส่ง URL ให้เพื่อนเข้ามาดูผลงานแบบ Read-only ได้แบบสวยๆ

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### หน้าบ้าน (Frontend)

- **Framework:** Astro (เพื่อเว็บไซต์ที่เบาและโหลดไวที่สุด)
- **UI:** React 19 (สำหรับความลื่นไหลในหน้า Editor)
- **Styling:** Tailwind CSS (v4)
- **Drag & Drop:** `@dnd-kit/core` และ `@dnd-kit/sortable`
- **State Management:** React Hooks + LocalStorage (Drafts & Tokens)

### หลังบ้าน (Backend)

- **Runtime:** Bun
- **Framework:** Express.js
- **Database:** MongoDB (Native Mongoose ODM)
- **Storage:** Local Disk Storage ระบบอัปโหลดรูปผ่าน `multer`

## 🚀 คู่มือการรันโปรเจกต์ (Quick Start)

### สิ่งที่ต้องเตรียม

- [Node.js](https://nodejs.org/)
- [Bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/) (รันในเครื่องหรือใช้ Cloud Atlas ก็ได้)

### 1. โคลน

```bash
git clone https://github.com/Kx53/13tierlist.git
cd 13tierlist
```

### 2. ตั้งค่า Backend

```bash
cd backend
bun install

# สร้างไฟล์ .env
echo "MONGODB_URI=mongodb://localhost:27017/13tierlist" > .env
echo "PORT=3001" >> .env
echo "CORS_ORIGIN=http://localhost:4321" >> .env

# รันหลังบ้าน
bun run dev
```

### 3. ตั้งค่า Frontend

```bash
# เปิด Terminal หน้าต่างใหม่
cd frontend
npm install

# รันหน้าบ้าน
npm run dev
```

เปิด `http://localhost:4321` ในเบราว์เซอร์ของคุณ

## 🔒 ความปลอดภัยและการทำงาน

- แทนที่จะใช้ระบบล็อกอินแบบเดิม โปรเจกต์นี้เลือกใช้ **Edit Tokens** ที่ไม่ต้องพึ่งรหัสผ่าน
- เมื่อเริ่มสร้าง Tier List ใหม่ เซิร์ฟเวอร์จะสุ่มรหัส Token ความยาว 32 ตัวอักษร
- เซิร์ฟเวอร์จะเก็บแค่ค่า **Hash (เข้ารหัสทางเดียว)** ของ Token นี้เท่านั้น ไม่มีใครรู้รหัสจริง
- เบราว์เซอร์ของผู้สร้างจะจำรหัสจริงไว้ใน `localStorage` นำไปอ้างอิงตอนแก้ไข
- ทุกคนที่มีลิงก์สามารถดูหน้านี้ได้ตลอด แต่เฉพาะเครื่องที่มี Token ตรงกันเท่านั้นถึงจะมีสิทธิอัปโหลดรูปหรือดัดแปลงแก้ไข Tier List นี้ได้

## 👨‍💻 ผู้พัฒนา

พัฒนาด้วย ❤️ โดย **[Kx53](https://github.com/Kx53)**  
เป็นส่วนหนึ่งของ **[13room.space](https://13room.space)**
