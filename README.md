#  MC SHOP – E-Commerce Web Application

MC SHOP คือเว็บแอปพลิเคชัน E-Commerce ที่พัฒนาด้วย **Vue 3 + TypeScript**
รองรับระบบตะกร้าสินค้า, Checkout, การชำระเงิน (PromptPay), และการจัดการคำสั่งซื้อ

---

## Features
- Login / Register
- Cart Management (เพิ่ม / ลบ / แก้จำนวน)
- Checkout System
- Address Management
- Payment Method
  - Credit Card / Debit Card
  - PayPal
  - PromptPay (QR Payment)
  - Mobile Banking
  - Cash on Delivery
- Order Confirmation
- Order History (My Orders)
- ใช้ LocalStorage จำลอง Backend

---

## Tech Stack
- **Frontend**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Router**: Vue Router
- **State**: LocalStorage
- **Styling**: CSS (Custom UI / Glassmorphism)
- **Build Tool**: Vite

---


---

## Checkout Flow
1. เพิ่มสินค้าเข้าตะกร้า
2. เลือกที่อยู่จัดส่ง
3. เลือกวิธีชำระเงิน
4. หากเลือก PromptPay → แสดง QR Code
5. ยืนยันการชำระเงิน
6. บันทึกคำสั่งซื้อ → แสดงใน My Orders





## Screenshots
_(สามารถเพิ่มรูปหน้า Checkout / PromptPay / Orders ได้)_

---

## Demo
Demo version (Local only)



## Author
- Name: **[Nattawut]**
- GitHub: https://github.com/your-username


---

### Project Structure 

```md
## Project Structure

src/
├─ assets/           # Images, icons
├─ components/       # Reusable components
├─ views/            # Pages (Home, Cart, Checkout, Orders)
├─ router/           # Vue Router config
├─ styles/           # Global styles
└─ main.ts


```


## Installation
```bash
git clone https://github.com/your-username/mc-shop.git
cd mc-shop
npm install
npm run dev
```

---

## Data Flow (LocalStorage)

- cart → เก็บสินค้าในตะกร้า
- addresses → ที่อยู่จัดส่ง
- orders → ประวัติคำสั่งซื้อ
- lastOrderId → คำสั่งซื้อล่าสุด
- lastGrandTotal → ยอดรวมล่าสุด



## Payment Logic

- PromptPay
  - สร้างคำสั่งซื้อสถานะ `WaitingPayment`
  - แสดง QR Code
  - กดยืนยัน → เปลี่ยนเป็น `Paid`


---

##  Technical Features

- **Type-Safe Development**: ใช้ TypeScript กำหนด Schema สำหรับ Product, Cart Item และ User Data เพื่อความแม่นยำของข้อมูล
- **State Persistence**: ระบบจัดการตะกร้าสินค้าที่คงอยู่แม้ Refresh หน้าเว็บ (LocalStorage Persistence)
- **Responsive Design**: รองรับการใช้งานทุกหน้าจอ (Desktop, Tablet, Mobile) ด้วย Flexbox และ CSS Grid
- **Glassmorphism UI**: ดีไซน์หน้าเว็บที่เน้นความโปร่งแสงและทันสมัย โดยใช้ Custom CSS

## Tech Stack Details

| Technology | Usage |
|------------|-------|
| **Vue 3** | Framework หลัก (Composition API) |
| **TypeScript** | พัฒนาด้วยระบบ Type-checking |
| **Vue Router** | จัดการ Client-side Routing |
| **Vite** | Build tool ความเร็วสูง |
| **CSS3** | Custom Styles (Glassmorphism focus) |
