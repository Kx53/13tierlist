<div align="center">
  <h1>🏆 13TierList 🏆</h1>
  <p><strong>โปรแกรมสร้าง Tier List ส่วนตัวสไตล์มินิมอล ที่โมเดิร์นและแอนิเมชันสวยงาม</strong></p>

  <br />

[🇬🇧 English (ภาษาอังกฤษ)](README.md)

  <br />
  
  [![Built by Kx53](https://img.shields.io/badge/Built_by-Kx53-8b5cf6?style=for-the-badge&logoColor=white)](https://github.com/Kx53)
  [![Powered by](https://img.shields.io/badge/Powered_by-13room.space-0f172a?style=for-the-badge)](https://www.13room.space)

</div>

<br />

## ✨ ฟีเจอร์หลัก

- **ไม่ต้องสมัครสมาชิก:** ข้ามความยุ่งยากไปได้เลย สามารถสร้าง Tier List ได้แบบไร้ระบุตัวตนผ่านระบบ Edit Token ที่ปลอดภัย
- **ลากและวาง (Drag & Drop):** ประสบการณ์ลากวางที่ลื่นไหลและเป็นธรรมชาติ ขับเคลื่อนโดย `@dnd-kit`
- **บันทึกเป็นรูปภาพ:** โหลดรูปภาพ Tier List แบบความละเอียดสูงเก็บไว้ดูเล่นหรือแชร์ต่อได้ทันที (PNG)
- **ใส่รูปหรือข้อความก็ได้:** รองรับทั้งการอัปโหลดรูปภาพ (สูงสุด 5MB) และการพิมพ์ข้อความเปล่าๆ เป็นไอเทม
- **Item Bank:** โซนสำหรับพักไอเทมที่เพิ่งเพิ่มเข้ามา ก่อนที่จะลากจัดอันดับ
- **Mobile Optimized:** ปรับแต่ง Touch Sensors ให้ใช้งานบน iPhone, iPad และ Android ได้อย่างสมบูรณ์แบบ
- **Real-time i18n:** สลับภาษา **ไทย / English** ได้ทันทีโดยไม่ต้องรีเฟรชหน้าเว็บ
- **บันทึกอัตโนมัติ (Auto-Save):** ไม่ต้องกลัวงานหาย ระบบจะเซฟ Draft ลงเบราว์เซอร์ของคุณอัตโนมัติ
- **แชร์ลิงก์ง่ายๆ:** ส่ง URL ให้เพื่อนเข้ามาดูผลงานแบบ Read-only ได้แบบสวยงาม

## 🛠️ เทคโนโลยีที่ใช้

### หน้าบ้าน (Frontend)

- **Framework:** Astro 6 (เพื่อระดับความเร็วสูงสุดในการโหลดหน้าเว็บ)
- **UI:** React 19 (สำหรับการทำงานที่ซับซ้อนในหน้า Editor)
- **Styling:** Tailwind CSS (v4)
- **Localization:** `@nanostores/i18n` (สลับภาษาได้ไวโดยไม่มี Delay)
- **Type Safety:** **Eden RPC** (เชื่อมต่อหลังบ้านด้วยระบบ Type-safe เต็มรูปแบบ)
- **Drag & Drop:** `@dnd-kit/core` และ `@dnd-kit/sortable`

### หลังบ้าน (Backend)

- **Runtime:** Bun
- **Framework:** **Elysia.js** (Framework เว็บความเร็วสูงที่ออกแบบมาเพื่อ Bun โดยเฉพาะ)
- **Language:** TypeScript
- **Database:** MongoDB (Native Mongoose ODM)

## 🚀 คู่มือการรันโปรเจกต์

### สิ่งที่ต้องเตรียม

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
bun install

# รันหน้าบ้าน
bun run dev
```

เปิด `http://localhost:4321` ในเบราว์เซอร์ของคุณ

## 🔒 ความปลอดภัยและการทำงาน

- แทนที่จะใช้ระบบล็อกอินแบบเดิม โปรเจกต์นี้เลือกใช้ **Edit Tokens** ที่ไม่ต้องพึ่งรหัสผ่าน
- หลังบ้านพัฒนาด้วย **Elysia.js** และสื่อสารกับหน้าบ้านผ่าน **Eden RPC** ทำให้ทุก API Call มีความปลอดภัยและประสิทธิภาพสูงสุด
- ระบบจะจำกัดขนาดไฟล์อัปโหลดไว้ที่ 5MB และตรวจสอบประเภทไฟล์เพื่อความปลอดภัยของเซิร์ฟเวอร์
- ทุกคนที่มีลิงก์สามารถดูหน้านี้ได้ตลอด แต่เฉพาะเครื่องที่มี Token ตรงกันเท่านั้นถึงจะมีสิทธิแก้ไขข้อมูลได้

## 👨‍💻 ผู้พัฒนา

พัฒนาด้วย ❤️ โดย **[Kx53](https://github.com/Kx53)**  
เป็นส่วนหนึ่งของ **[13room.space](https://13room.space)**
