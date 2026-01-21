<template>
  <div class="page-wrapper">
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาสินค้าตามแบรนด์, ชื่อรุ่น หรือ ชื่อสินค้า" />
      </div>

      <div class="actions">
        <router-link to="/cart" class="icon-btn">🛒</router-link>
        <button class="icon-btn">🔔</button>
        <router-link to="/saved" class="icon-btn">♡</router-link>
        <router-link to="/home" class="icon-btn">🏠</router-link>

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

    <main class="content">
      <div class="container">
        <section class="orders-panel">
          <div class="orders-header">
            <div class="box-icon">📦</div>
            <h1 class="title">My Orders</h1>
            <p class="subtitle">Track and manage your order history</p>

            <button v-if="orders.length" class="clear-orders-btn" @click="clearOrders">
              เคลียร์ประวัติคำสั่งซื้อ
            </button>
          </div>

          <div v-if="orders.length" class="orders-list">
            <article v-for="order in orders" :key="order.id" class="order-card">
              <header class="order-card-header">
                <div class="order-id-row">
                  <span class="order-id">{{ order.code }}</span>
                  <span class="badge-delivered" v-if="order.status === 'delivered'">
                    ✓ Delivered
                  </span>
                </div>
                <div class="order-date">
                  {{ formatDate(order.date) }}
                </div>
              </header>

              <div class="order-body">
                <div class="item-main">
                  <div class="item-thumb">
                    <img :src="order.items[0].image" :alt="order.items[0].name" />
                  </div>
                  <div class="item-info">
                    <div class="item-name">{{ order.items[0].name }}</div>
                    <div class="item-qty">Qty: {{ order.items[0].qty }}</div>
                  </div>
                </div>

                <div class="item-total">฿{{ formatNumber(order.total) }}</div>
              </div>

              <footer class="order-footer">
                <div class="footer-left">
                  <span class="label-total">Total:</span>
                  <span class="total-value">฿{{ formatNumber(order.total) }}</span>
                </div>
                <button class="detail-btn" @click="viewDetail(order.code)">
                  View Detail &nbsp; &gt;
                </button>
              </footer>
            </article>
          </div>

          <div v-else class="empty-state">ยังไม่มีคำสั่งซื้อในระบบ</div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Swal from 'sweetalert2' // ✅ 1. Import SweetAlert2

// ✅ 2. Toast Config
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  },
})

interface OrderItem {
  name: string
  image: string
  qty: number
}

interface Order {
  id: number
  code: string
  status: 'delivered' | 'processing' | 'cancelled'
  date: string
  total: number
  items: OrderItem[]
}

const showMenu = ref(false)
const userInitial = ref('N')
const orders = ref<Order[]>([])

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

function safeDate(raw: string) {
  const d = new Date(raw)
  return isNaN(d.getTime()) ? new Date() : d
}

onMounted(() => {
  const email = localStorage.getItem('userEmail') || ''
  if (email) userInitial.value = email.charAt(0).toUpperCase()

  const raw = localStorage.getItem('orders')
  if (raw) {
    try {
      const list = JSON.parse(raw) as Order[]
      orders.value = list.map((o) => ({
        ...o,
        date: o.date ? o.date : new Date().toISOString(),
      }))
    } catch {
      orders.value = []
    }
  }

  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})

function formatNumber(v: number): string {
  return v.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(raw: string): string {
  const d = safeDate(raw)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  })
}

// ✅ 3. ใช้ Toast แทน alert ธรรมดา
function viewDetail(code: string) {
  Toast.fire({
    icon: 'info',
    title: 'ดูรายละเอียดคำสั่งซื้อ',
    text: `Order ID: ${code}`,
  })
}

/** 🧹 เคลียร์ประวัติคำสั่งซื้อ */
function clearOrders() {
  if (!orders.value.length) return

  // ✅ ใช้ Swal Confirm Dialog สวยๆ
  Swal.fire({
    title: 'ยืนยันการลบ?',
    text: 'ประวัติคำสั่งซื้อทั้งหมดจะหายไป',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ลบเลย!',
    cancelButtonText: 'ยกเลิก',
  }).then((result) => {
    if (result.isConfirmed) {
      // ลบจริง
      orders.value = []
      localStorage.removeItem('orders')

      // แจ้งเตือนว่าลบเสร็จแล้ว
      Toast.fire({
        icon: 'success',
        title: 'ลบประวัติเรียบร้อย',
      })
    }
  })
}
</script>

<style scoped>
/* CSS เดิมทั้งหมด */
.page-wrapper {
  min-height: 100vh;
  background: #eef0f3;
  width: 150vh;
  margin-left: -115px;
}

/* Topbar */
.topbar {
  height: 72px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  max-width: 100vw;
  z-index: 1000;
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
  width: 36px;
  height: 36px;
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
}

/* ลิงก์ในเมนู */
.menu-link {
  display: block;
  padding: 8px 6px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #111827;
  text-decoration: none;
  transition: all 0.25s ease;
}
.menu-link:hover,
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
  text-decoration: none;
}
.logout:hover {
  color: #d11e11;
  transform: scale(1.03);
  font-weight: 800;
}

/* Layout */
.content {
  padding-top: 90px;
  padding-bottom: 40px;
}
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Orders panel */
.orders-panel {
  background: #ffffff;
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  padding: 36px 32px 28px;
}

.orders-header {
  text-align: center;
  margin-bottom: 24px;
}
.box-icon {
  font-size: 80px;
  margin-bottom: -15px;
}
.title {
  font-size: 40px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}
.subtitle {
  font-size: 20px;
  color: #9ca3af;
  font-weight: 600;
}

/* ปุ่มเคลียร์คำสั่งซื้อ */
.clear-orders-btn {
  margin-top: 14px;
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(248, 113, 113, 0.3);
  transition:
    transform 0.25s ease,
    background 0.25s ease;
}
.clear-orders-btn:hover {
  background: #fecaca;
  transform: scale(1.03);
}

.orders-list {
  margin-top: 15px;
}
.order-card {
  border-radius: 16px;
  background: #f9fafb;
  padding: 14px 18px 12px;
  margin-top: 16px;
  transition: all 0.25s ease;
}
.order-card:hover {
  transform: scale(1.02);
}
.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  margin-bottom: 10px;
}
.order-id-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.order-id {
  font-weight: 700;
}
.badge-delivered {
  background: #dcfce7;
  color: #16a34a;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
}
.order-date {
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}
.order-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  border-top: 1px solid #e5e7eb;
}
.item-main {
  display: flex;
  align-items: center;
  gap: 12px;
}
.item-thumb {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background: #fff;
  display: grid;
  place-items: center;
}
.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.item-info {
  display: flex;
  flex-direction: column;
}
.item-name {
  font-size: 16px;
  font-weight: 600;
}
.item-qty {
  font-size: 13px;
  color: #9ca3af;
}
.item-total {
  font-size: 16px;
  font-weight: 700;
}
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.footer-left {
  display: flex;
  gap: 6px;
  font-size: 14px;
}
.label-total {
  font-weight: 600;
  color: #6b7280;
}
.total-value {
  font-weight: 700;
}
.detail-btn {
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 6px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.detail-btn:hover {
  transform: scale(1.03);
}

/* empty */
.empty-state {
  text-align: center;
  padding: 40px 0 20px;
  color: #9ca3af;
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

  /* ปรับขนาดปุ่มไอคอน */
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

  /* 2. Layout เนื้อหา */
  .content {
    padding-top: 130px; /* เว้นที่ให้ Header */
    padding-bottom: 60px;
  }
  .container {
    padding: 0 1rem;
  }

  /* 3. ปรับ Orders Panel */
  .orders-panel {
    padding: 20px 15px; /* ลด padding */
  }

  /* หัวข้อ */
  .box-icon {
    font-size: 60px;
  }
  .title {
    font-size: 28px;
  }
  .subtitle {
    font-size: 16px;
    margin-bottom: 20px;
  }

  /* 4. ปรับการ์ด Order */
  .order-card {
    padding: 15px;
  }

  .order-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .order-id-row {
    width: 100%;
    justify-content: space-between; /* เลข Order ชิดซ้าย, สถานะชิดขวา */
  }

  /* ส่วนเนื้อหา (รูป + ชื่อสินค้า) */
  .order-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .item-main {
    width: 100%;
  }

  /* ราคาสินค้าย้ายไปอยู่ขวาล่างของส่วนนี้ หรือชิดซ้ายแล้วแต่ดีไซน์ */
  .item-total {
    align-self: flex-end; /* จัดชิดขวา */
    font-size: 18px;
  }

  /* Footer (Total + View Detail) */
  .order-footer {
    flex-direction: column; /* เรียงแนวตั้ง */
    align-items: flex-end; /* ชิดขวา */
    gap: 10px;
  }

  .footer-left {
    width: 100%;
    justify-content: space-between;
    border-bottom: 1px dashed #e5e7eb; /* เส้นประคั่น */
    padding-bottom: 8px;
  }

  .detail-btn {
    width: 100%; /* ปุ่มเต็มความกว้าง */
    text-align: center;
    background: #f3f4f6; /* ใส่พื้นหลังอ่อนๆ ให้เด่นขึ้น */
    border: none;
  }
}
</style>
