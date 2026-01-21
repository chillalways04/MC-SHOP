<template>
  <div class="page-wrapper">
    <!-- Topbar -->
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาสินค้าตามแบรนด์, ชื่อรุ่น หรือชื่อสินค้า" />
      </div>

      <div class="actions">
        <router-link to="/cart" class="icon-btn">🛒</router-link>
        <button class="icon-btn">🔔</button>
        <router-link to="/saved" class="icon-btn">♡</router-link>
        <router-link to="/home" class="icon-btn">🏠</router-link>

        <!-- Avatar + dropdown -->
        <div class="avatar" @click.stop="toggleMenu">
          {{ userInitial }}
        </div>

        <div v-if="showMenu" class="user-menu">
          <div class="user-row">
            <div class="user-pic">👤</div>
            <div class="user-status">ยืนยันแล้ว</div>
          </div>
          <ul>
            <router-link to="/profile" class="menu-link">โปรไฟล์</router-link>
            <router-link to="/orders" class="menu-link"> คำสั่งซื้อ </router-link>
            <router-link to="/saved" class="menu-link"> สินค้าที่สนใจ </router-link>

            <li>ตั้งค่า</li>
            <router-link to="/" class="logout">ลงชื่อออก</router-link>
          </ul>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="content">
      <div class="container">
        <div class="success-wrapper">
          <div class="success-check">
            <svg viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" />
              <path fill="none" d="M14 27 l7 7 l17 -17" />
            </svg>
          </div>
        </div>

        <h1 class="title">Order confirmed!</h1>
        <p class="subtitle">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <!-- การ์ดหลัก -->
        <section class="card confirm-card">
          <div class="confirm-header">
            <div class="header-col">
              <div class="header-label">Order number:</div>
              <div class="header-value">{{ orderNumber }}</div>
            </div>
            <div class="header-col header-right">
              <div class="header-label">Order Date:</div>
              <div class="header-value">{{ orderDate }}</div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Step 1 -->
          <div class="step-row">
            <div class="step-icon received">🧾</div>
            <div class="step-text">
              <div class="step-title">Order Received</div>
              <div class="step-desc">We’ve received your order and are processing it.</div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="step-row">
            <div class="step-icon processing">📦</div>
            <div class="step-text">
              <div class="step-title">Order Processing</div>
              <div class="step-desc">Your order will be prepared for shipping soon.</div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="step-row">
            <div class="step-icon shipping">🚚</div>
            <div class="step-text">
              <div class="step-title">Order Shipping</div>
              <div class="step-desc">
                You’ll receive a shipping confirmation when your order ships.
              </div>
            </div>
          </div>
        </section>

        <button class="continue-btn" @click="goHome">Continue Shopping</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderNumber = ref<string>('')
const orderDate = ref<string>('')

// avatar dropdown
const showMenu = ref(false)
const userInitial = ref('N')

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

function handleGlobalClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const menu = document.querySelector('.user-menu')
  const avatar = document.querySelector('.avatar')
  if (menu && !menu.contains(target) && avatar && !avatar.contains(target)) {
    showMenu.value = false
  }
}

function formatToday(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = d.getFullYear()
  return `${dd}/${mm}/${yy}`
}

onMounted(() => {
  // รับค่า orderId / date จาก query ถ้ามี
  const qOrderId = (route.query.orderId as string) || ''
  const qDate = (route.query.date as string) || ''

  orderNumber.value = qOrderId || `ORD-${Date.now()}`
  orderDate.value = qDate || formatToday()

  const email = localStorage.getItem('userEmail') || ''
  if (email) userInitial.value = email.charAt(0).toUpperCase()

  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})

function goHome() {
  router.push('/home')
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #eef0f3;
  width: 150vh;
  margin-left: -125px;
}

/* topbar เหมือนหน้า checkout */
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
  cursor: pointer;
  transition: transform 0.2s ease;
}
.avatar:hover {
  transform: scale(1.1);
}

/* dropdown */
.user-menu {
  position: absolute;
  top: 60px;
  right: 0;
  width: 230px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 16px 20px;
  z-index: 200;
}
.user-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.user-pic {
  font-size: 28px;
}
.user-status {
  font-size: 16px;
  color: #16a34a;
  font-weight: 600;
}
.user-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.user-menu ul li {
  padding: 8px 6px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.user-menu ul li:hover {
  background: #e1e6f0;
  transform: scale(1.03);
  font-weight: 700;
  color: #3190cf;
}
.logout {
  color: #c51e1e;
  cursor: pointer;
  padding: 8px 6px;
  display: block;
  border-radius: 8px;
}
.logout:hover {
  color: #d11e11;
  transform: scale(1.03);
  font-weight: 800;
}

/* content */
.content {
  padding-top: 90px;
  padding-bottom: 40px;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
}

.icon-success {
  margin-top: 36px;
  margin-bottom: 16px;
}
.icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 999px;
  border: 4px solid #22c55e;
  display: grid;
  place-items: center;
  font-size: 32px;
  color: #22c55e;
  margin: 0 auto;
}

.title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 6px;
}
.subtitle {
  font-size: 19px;
  color: #6b7280;
  margin-bottom: 22px;
  font-weight: 480;
}

/* card */
.card {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
  padding: 22px 24px 20px;
  text-align: left;
}
.confirm-card {
  margin: 0 auto;
}

.confirm-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 480;
}
.header-label {
  color: #6b7280;
}
.header-value {
  font-weight: 600;
  margin-top: 2px;
}
.header-right {
  text-align: right;
}
.divider {
  border-top: 1px solid #e5e7eb;
  margin: 10px 0 8px;
}

/* steps */
.step-row {
  display: flex;
  gap: 14px;
  padding: 10px 0;
}
.step-icon {
  width: 54px;
  height: 54px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 22px;
  background: #e5f0ff;
}
.step-text {
  flex: 1;
}
.step-title {
  font-size: 19px;
  font-weight: 600;
}
.step-desc {
  font-size: 14px;
  color: #9a9fa8;
  font-weight: 500;
}

.continue-btn {
  margin-top: 24px;
  border-radius: 999px;
  padding: 16px 26px;

  /* ⭐ Glass effect */
  border: 1px solid rgba(204, 223, 250, 0.45);
  background: rgba(67, 132, 230, 0.25);
  color: #1839cc;

  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow: 0 4px 18px rgba(13, 110, 253, 0.25);
  transition: all 0.25s ease;
}

.continue-btn:hover {
  background: rgba(13, 110, 253, 0.35);
  transform: scale(1.08);
  box-shadow: 0 6px 26px rgba(13, 110, 253, 0.35);
}

.menu-link {
  display: block;
  padding: 8px 6px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #111;
  text-decoration: none;
  transition: all 0.25s ease;
}

.menu-link:hover {
  background: #e1e6f0;
  transform: scale(1.03);
  font-weight: 700;
  color: #3190cf;
}
@media (max-width: 1300px) {
  .page-wrapper {
    width: 100%; /* ยกเลิกความกว้าง 150vh */
    margin-left: 0; /* ยกเลิก margin ติดลบ */
    overflow-x: hidden;
  }
}

/* --- Mobile (max-width: 768px) --- */
@media (max-width: 768px) {
  /* 1. Header: ปรับให้ยืดหยุ่น */
  .topbar {
    height: auto;
    flex-wrap: wrap;
    padding: 10px 1rem;
    gap: 10px;
    position: fixed;
    width: 100%;
  }

  .brand {
    order: 1;
  }

  /* จัดกลุ่มไอคอนขวาบน */
  .actions {
    position: static;
    order: 2;
    margin-left: auto;
    right: auto;
    gap: 0.8rem;
  }

  /* ช่องค้นหาเต็มความกว้าง */
  .search {
    position: static;
    transform: none;
    order: 3;
    width: 100%;
    max-width: 100%;
    margin-top: 5px;
    padding: 8px 15px;
  }

  .icon-btn {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
  .avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .content {
    padding-top: 130px;
    padding-bottom: 60px;
  }
  .container {
    padding: 0 1.5rem;
  }

  .icon-success {
    margin-top: 20px;
  }
  .title {
    font-size: 28px;
  }
  .subtitle {
    font-size: 16px;
    margin-bottom: 30px;
  }

  .card {
    padding: 20px;
  }

  .confirm-header {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
  }

  .header-right {
    text-align: center;
  }

  .step-row {
    align-items: flex-start;
    gap: 15px;
    text-align: left;
  }

  .step-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
    flex-shrink: 0;
  }

  .step-title {
    font-size: 17px;
  }
  .step-desc {
    font-size: 13px;
  }

  .continue-btn {
    width: 100%;
    margin-top: 30px;
  }
}
.success-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.success-check {
  width: 90px;
  height: 90px;
}

.success-check svg {
  width: 100%;
  height: 100%;
}

.success-check circle {
  stroke: #9de7b8;
  stroke-width: 2.1;
  stroke-dasharray: 159;
  stroke-dashoffset: 159;
  animation: circle-draw 0.8s ease-out forwards;
}

.success-check path {
  stroke: #22c55e;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: check-draw 0.5s ease-out forwards;
  animation-delay: 0.8s;
}

@keyframes circle-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes check-draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
