<template>
  <div class="page-wrapper">
    <!-- Topbar -->
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาตามแบรนด์, ชื่อรุ่น หรือชื่อสินค้า" />
      </div>

      <div class="actions">
        <router-link to="/cart" class="icon-btn">🛒</router-link>
        <button class="icon-btn">🔔</button>
        <router-link to="/saved" class="icon-btn">♡</router-link>
        <router-link to="/home" class="icon-btn">🏠</router-link>

        <div class="avatar">{{ userInitial }}</div>
      </div>
    </header>

    <main class="content">
      <div class="container">
        <div class="prompt-card">
          <div class="prompt-header">
            <img src="C:\ESANSHOP\src\assets\promtpay56.png" alt="QR Logo" class="qr-icon" />
            <span class="prompt-header-text">THAI QR<br />PAYMENT</span>
          </div>

          <div class="prompt-body">
            <!-- โลโก้ PromptPay -->
            <div class="promptpay-logo">
              <img src="C:\ESANSHOP\src\assets\promtpay55.png" alt="PromptPay Logo" />
            </div>

            <!-- QR (เอาไปเปลี่ยนเป็นรูปจริงได้) -->
            <div class="qr-box">
              <!-- ถ้ามีรูปจริง -->
              <img src="C:\ESANSHOP\src\assets\Qrcode15.png" alt="PromptPay QR" />
              <div class="qr-placeholder"></div>
            </div>

            <div class="amount-row">฿{{ formattedAmount }}</div>

            <p class="warn-red">หากไม่ชำระเงินตามเวลาที่กำหนด ระบบอาจทำการยกเลิกการจองอัตโนมัติ</p>
            <p class="warn-small">⏱️ ชำระเงินจ่ายภายใน 1 ชม. 59 นาที</p>
          </div>
        </div>

        <button class="completed-btn" @click="goCompleted">Completed</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userInitial = ref('N')
const amount = ref(0)

// โหลดชื่อ user + ยอดเงินจาก localStorage
onMounted(() => {
  const email = localStorage.getItem('userEmail') || ''
  if (email) userInitial.value = email.charAt(0).toUpperCase()

  const raw = localStorage.getItem('lastGrandTotal')
  amount.value = raw ? Number(raw) || 0 : 0
})

const formattedAmount = computed(() =>
  amount.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
)

function goCompleted() {
  // จ่ายเสร็จ → ไปหน้า Order Confirmed
  router.push('/order-confirmed')
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #eef0f3;
  width: 150vh;
  margin-left: -105px;
}

/* Topbar */
.topbar {
  height: 72px;
  width: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  border-bottom: 1px solid #e6e8eb;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.brand {
  display: flex;
  align-items: center;
}
.logo-box {
  font-weight: 800;
  line-height: 1;
  color: #2d3a4b;
  font-size: 20px;
}
.search {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 520px;
  background: #f3f4f6;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
}
.search-icon {
  font-size: 1.1rem;
}
.search input {
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  font-size: 0.9rem;
}
.actions {
  position: absolute;
  right: 60px;
  display: flex;
  align-items: center;
  gap: 2.8rem;
}
.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}
.icon-btn:hover {
  transform: scale(1.2);
}
.avatar {
  width: 34px;
  height: 34px;
  background: #0f8df2;
  border-radius: 999px;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 600;
}

/* Body */
.content {
  padding-top: 90px;
  padding-bottom: 60px;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* PromptPay panel */
.prompt-card {
  margin-top: 80px;
  width: 420px;
  max-width: 100%;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}
.prompt-header {
  background: #2269b3;
  color: #fff;
  padding: 10px 18px;
  display: flex;
  justify-content: center; /* กล่องกลาง */
}

.prompt-header-icon {
  font-size: 18px;
}
.prompt-header-text {
  font-size: 18px;
  line-height: 1.2;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: -3px;
  margin-top: 13px;
}
.prompt-body {
  padding: 20px 24px 18px;
  text-align: center;
}
.promptpay-logo {
  display: inline-block;
  padding: 6px 16px;
  border: 2px solid #0f172a;
  border-radius: 4px;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 10px;
}
.promptpay-logo span {
  color: #0f8df2;
}
.qr-box {
  margin: 8px auto 10px;
  width: 185px;
  height: 185px;
  border-radius: 6px;
  background: #ffffff;
  display: grid;
  place-items: center;
  margin-top: -25px;
}
.qr-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.qr-placeholder {
  font-size: 14px;
  color: #6b7280;
}
.amount-row {
  margin-top: 18px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2933;
}
.warn-red {
  margin-top: 8px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
}
.warn-small {
  margin-top: 2px;
  font-size: 12px;
  color: #aecc42;
  font-weight: 600;
}

.completed-btn {
  margin-top: 18px;
  border-radius: 999px;
  padding: 16px 63px;

  /* ⭐ Glass effect */
  border: 1px solid rgba(204, 223, 250, 0.45);
  background: rgba(71, 140, 243, 0.25);
  color: #1839cc;

  font-size: 18px;
  font-weight: 600;
  cursor: pointer;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.25);
  transition: all 0.25s ease;
}

.completed-btn:hover {
  background: rgba(13, 110, 253, 0.35);
  transform: scale(1.07);
  box-shadow: 0 6px 28px rgba(13, 110, 253, 0.35);
}

.qr-icon {
  width: 70px;
  height: 70px;
  margin-right: -3px;
  border-radius: 12px;
}
.qr-icon-wrapper {
  background: #0d2e68;
  padding: 6px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.promptpay-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0 12px;
  border: none; /* ลบขอบ */
  box-shadow: none; /* ลบเงา */
  margin-top: -25px;
}

/* รูปโลโก้ PromptPay */
.promptpay-logo img {
  width: 180px; /* ปรับขนาดตามใจได้ เช่น 140 / 200 */
  max-width: 100%;
  height: auto;
  object-fit: contain; /* ป้องกันรูปเบี้ยว */
}
</style>
