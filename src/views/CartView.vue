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
        <router-link to="/home" class="icon-btn home-icon">🏠</router-link>

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
        <h1 class="page-title">Shopping Cart</h1>

        <div class="cart-layout">
          <section class="cart-column">
            <div v-for="item in cartItems" :key="item.id" class="cart-card">
              <div class="cart-row">
                <div class="product-main">
                  <div class="product-image">
                    <img :src="item.image" :alt="item.name" />
                  </div>

                  <div class="product-info">
                    <p class="brand">{{ item.brand }}</p>
                    <p class="name">{{ item.name }}</p>
                    <p class="unit-price">Unit Price: {{ formatPrice(item.unitPrice) }}</p>
                  </div>
                </div>

                <div class="product-side">
                  <div class="quantity-control">
                    <button @click="decrementQuantity(item.id)" :disabled="item.quantity <= 1">
                      −
                    </button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button @click="incrementQuantity(item.id)">+</button>
                  </div>

                  <div class="item-price">
                    {{ formatPrice(calculateItemTotal(item)) }}
                  </div>

                  <button class="remove-item" @click="removeItem(item.id)">🗑</button>
                </div>
              </div>
            </div>

            <button class="back-button" @click="goBack">
              <span class="back-icon">←</span>
              <span>Back</span>
            </button>
          </section>

          <aside class="summary-column">
            <div class="summary-card">
              <h2 class="summary-title">Order Summary</h2>

              <div class="promo-row">
                <input type="text" placeholder="ใส่รหัสโปรโมชั่น..." v-model="promoCode" />
                <button class="apply-button" @click="applyPromoCode">Apply</button>
              </div>

              <router-link to="/address/new" class="address-button">
                เพิ่มที่อยู่สำหรับจัดส่ง
              </router-link>

              <div class="summary-list">
                <div class="summary-row">
                  <span>ราคาสินค้า</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>

                <div class="summary-row">
                  <span>ค่าจัดส่ง</span>
                  <span class="free">
                    {{ shippingCost === 0 ? 'Free' : formatPrice(shippingCost) }}
                  </span>
                </div>

                <div class="summary-row tax-row">
                  <span>Tax/Vat ({{ (taxRate * 100).toFixed(0) }}%)</span>
                  <span>{{ formatPrice(taxAmount) }}</span>
                </div>

                <div class="divider"></div>

                <div class="summary-row total-row">
                  <span>ยอดรวมสุทธิ รวมทุกภาษีแล้ว</span>
                  <span class="total-price">
                    {{ formatPrice(grandTotal) }}
                  </span>
                </div>
              </div>

              <button class="checkout-button" @click="checkout">ดำเนินการชำระเงิน</button>

              <p class="summary-note">
                ดำเนินการชำระเงิน การชำระถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขของเรา
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2' // ✅ 1. Import SweetAlert2

const router = useRouter()

// ✅ 2. สร้าง Setting สำหรับ Toast
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

interface CartItem {
  id: number
  brand: string
  name: string
  unitPrice: number
  quantity: number
  image: string
}

const promoCode = ref('')
const taxRate = 0.07
const shippingCost = 0

const cartItems = ref<CartItem[]>([])

// ----- avatar dropdown -----
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

// โหลด localStorage + avatar
onMounted(() => {
  const raw = localStorage.getItem('cart')
  const stored = raw ? JSON.parse(raw) : []
  cartItems.value = stored.map((i: any) => ({
    id: i.id,
    brand: i.brand ?? '',
    name: i.name,
    unitPrice: i.price,
    quantity: i.quantity,
    image: i.image,
  }))

  const email = localStorage.getItem('userEmail') || ''
  if (email) {
    userInitial.value = email.charAt(0).toUpperCase()
  }

  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})

// ----- Calculation -----
const calculateItemTotal = (item: CartItem) => item.unitPrice * item.quantity

const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + calculateItemTotal(item), 0),
)

const taxAmount = computed(() => subtotal.value * taxRate)

const grandTotal = computed(() => subtotal.value + shippingCost + taxAmount.value)

const formatPrice = (value: number) => {
  return `฿${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// ----- Quantity update -----
const incrementQuantity = (itemId: number) => {
  const item = cartItems.value.find((i) => i.id === itemId)
  if (item) {
    item.quantity++
    syncLocalStorage()
  }
}

const decrementQuantity = (itemId: number) => {
  const item = cartItems.value.find((i) => i.id === itemId)
  if (item && item.quantity > 1) {
    item.quantity--
    syncLocalStorage()
  }
}

const removeItem = (itemId: number) => {
  // ✅ ใช้ SweetAlert ถามก่อนลบ (Optional) หรือจะลบเลยแล้ว Toast บอกก็ได้
  // ในที่นี้ลบเลยแล้วแจ้งเตือนเบาๆ
  cartItems.value = cartItems.value.filter((i) => i.id !== itemId)
  syncLocalStorage()

  // แจ้งเตือนว่าลบแล้ว
  Toast.fire({
    icon: 'success',
    title: 'ลบสินค้าเรียบร้อย',
  })
}

// Sync cart to storage
const syncLocalStorage = () => {
  const plain = cartItems.value.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.unitPrice,
    image: i.image,
    quantity: i.quantity,
    brand: i.brand,
  }))
  localStorage.setItem('cart', JSON.stringify(plain))
}

// Promo
const applyPromoCode = () => {
  // ✅ ใช้ Toast แทน Alert
  if (!promoCode.value) {
    Toast.fire({
      icon: 'warning',
      title: 'กรุณาระบุรหัสส่วนลด',
    })
    return
  }
  Toast.fire({
    icon: 'info',
    title: 'กำลังตรวจสอบสิทธิ์',
    text: `Code: ${promoCode.value}`,
  })
}

// Checkout
const checkout = () => {
  if (!cartItems.value.length) {
    // ✅ ใช้ Toast แทน Alert
    Toast.fire({
      icon: 'warning',
      title: 'ตะกร้าสินค้าว่างอยู่',
      text: 'กรุณาเลือกสินค้าก่อนชำระเงิน',
    })
    return
  }

  // ไปหน้า checkout
  router.push('/checkout')
}

// Back
const goBack = () => {
  history.back()
}
</script>

<style scoped>
/* CSS เดิมของคุณทั้งหมด */

.page-wrapper {
  min-height: 100vh;
  background: #eef0f3;
  width: 150vh; /* ตามที่คุณตั้งไว้ */
  margin-left: -90px;
}

/* ---------- Topbar ---------- */
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
  max-width: 600px;
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
  margin-right: 0;
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
  transform: scale(1.3);
}

/* 🔵 avatar + menu เหมือนตัวอย่าง Saved */
.avatar {
  width: 36px;
  height: 36px;
  background: #0f8df2;
  border-radius: 999px;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 600;
  transition: transform 0.2s ease;
  cursor: pointer;
}
.avatar:hover {
  transform: scale(1.2);
}

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
  font-weight: 800;
  cursor: pointer;
  padding: 8px 6px;
  display: block;
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}
.logout:hover {
  color: #d11e11;
  transform: scale(1.03);
}

/* ---------- Layout ---------- */
.content {
  padding-top: 90px;
  padding-bottom: 40px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 24px;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(420px, 1fr);
  gap: 24px;
  align-items: flex-start;
}

/* คอนเทนเนอร์หลักฝั่งซ้าย */
.cart-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* ตัวการ์ดสินค้า */
.cart-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}
.cart-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
.cart-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.product-main {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  margin-right: 24px;
  min-width: 0;
}

.product-image {
  width: 170px;
  height: 120px;
  border-radius: 12px;
  display: grid;
  place-items: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  margin-top: -14px;
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}
.product-info .brand {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.product-info .name {
  font-size: 16px;
  color: #4b5563;
}

.product-info .unit-price {
  font-size: 14px;
  color: #6b7280;
  margin-top: 6px;
}

.product-side {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  overflow: hidden;
}

.quantity-control button {
  width: 36px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
}

.quantity-control button:disabled {
  opacity: 0.4;
  cursor: default;
}

.qty-value {
  width: 40px;
  text-align: center;
  font-size: 16px;
}

.item-price {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  min-width: 100px;
  text-align: right;
}

.remove-item {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  color: #9ca3af;
  transition: transform 0.2s ease;
}

.remove-item:hover {
  color: #ef4444;
  transform: scale(1.1);
}

/* ปุ่ม Back */
.back-button {
  margin-top: 12px;
  padding: 12px 22px;
  border-radius: 999px;
  border: 1px solid #e7e9ec;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
  width: fit-content;
  align-self: flex-start;
  transition: transform 0.2s ease;
  font-weight: 800;
}
.back-button:hover {
  transform: scale(1.1);
}

.back-icon {
  font-size: 18px;
  font-weight: 700;
  margin-top: -3.5px;
}

/* ---------- Right: Summary ---------- */
.summary-column {
  width: 100%;
}

.summary-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 32px 22px 20px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
  max-width: 450px;
}

.summary-title {
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 14px;
}

.promo-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.promo-row input {
  flex: 1;
  border-radius: 22px;
  border: 1px solid #d1d5db;
  padding: 16px 10px;
  font-size: 14px;
  outline: none;
}

.apply-button {
  border-radius: 22px;
  background: rgba(71, 140, 243, 0.25);
  border: 1px solid rgba(204, 223, 250, 0.45);
  color: #1839cc;
  border: none;
  padding: 15px 18px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.2);
  transition: 0.25s ease;
}

.apply-button:hover {
  background: rgba(13, 110, 253, 0.35);
  transform: scale(1.03);
  box-shadow: 0 6px 24px rgba(13, 110, 253, 0.32);
}

.summary-list {
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #4b5563;
  padding: 4px 0;
}

.summary-row .free {
  color: #16a34a;
  font-weight: 600;
  font-size: 16px;
}

.tax-row {
  margin-bottom: 4px;
}

.divider {
  border-top: 1px solid #e5e7eb;
  margin: 8px 0 6px;
}

.total-row {
  font-weight: 700;
  color: #111827;
}

.total-price {
  font-size: 18px;
}

.checkout-button {
  width: 100%;
  margin-top: 10px;
  border-radius: 999px;
  padding: 15px 16px;
  font-size: 17px;
  font-weight: 680;
  cursor: pointer;

  /* ⭐ Blue Glass Effect */
  background: rgba(71, 140, 243, 0.25);
  border: 1px solid rgba(204, 223, 250, 0.45);
  color: #1839cc;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.2);
  transition: 0.25s ease;
}

.checkout-button:hover {
  background: rgba(13, 110, 253, 0.35);
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(13, 110, 253, 0.32);
}

.summary-note {
  margin-top: 10px;
  font-size: 13px;
  color: #6b7280;
}

.address-button {
  display: block;
  width: 100%;
  margin-bottom: 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #111827;
  padding: 11px 16px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.address-button:hover {
  background: #e5f0ff;
  border-color: #0d6efd;
  transform: scale(1.03);
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
  /* 1. ปรับ Header ให้ยืดหยุ่น */
  .topbar {
    height: auto;
    flex-wrap: wrap;
    padding: 10px 1rem;
    gap: 10px;
    position: fixed; /* ล็อกไว้ด้านบน */
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

  /* 2. ปรับ Layout หลัก */
  .content {
    padding-top: 130px; /* เว้นที่ให้ Header ที่สูงขึ้น */
    padding-bottom: 80px;
  }
  .container {
    padding: 0 1rem;
  }

  /* เปลี่ยน Grid เป็นคอลัมน์เดียว */
  .cart-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  /* 3. ปรับการ์ดสินค้าในตะกร้า */
  .cart-row {
    flex-direction: column; /* เรียงแนวตั้ง */
    align-items: stretch;
    gap: 15px;
    position: relative;
  }

  /* ส่วนข้อมูลสินค้า */
  .product-main {
    flex-direction: row; /* รูปคู่กับชื่อ */
    margin-right: 0;
    gap: 15px;
  }

  .product-image {
    width: 90px; /* ลดขนาดรูป */
    height: 90px;
    flex-shrink: 0;
  }

  .product-info .brand {
    font-size: 16px;
  }
  .product-info .name {
    font-size: 14px;
  }
  .product-info .unit-price {
    font-size: 13px;
  }

  /* ส่วนจัดการ (ปุ่มบวกลบ + ราคา) */
  .product-side {
    width: 100%;
    justify-content: space-between;
    flex-direction: row; /* เรียงแนวนอน */
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid #f3f4f6;
  }

  /* ปุ่มลบสินค้า (ย้ายไปมุมขวาบน) */
  .remove-item {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
  }

  /* ปุ่มปรับจำนวน */
  .quantity-control button {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
  .qty-value {
    width: 30px;
    font-size: 14px;
  }

  /* ราคารวมของชิ้นนั้น */
  .item-price {
    text-align: right;
    font-size: 18px;
  }

  /* 4. ปรับส่วนสรุปยอด (Order Summary) */
  .summary-card {
    max-width: 100%; /* เต็มความกว้าง */
    padding: 20px;
  }

  .summary-title {
    font-size: 20px;
  }

  .promo-row {
    flex-direction: column; /* ช่องกรอกกับปุ่มเรียงแนวตั้ง */
    gap: 10px;
  }

  .apply-button {
    width: 100%;
  }
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
  /* 1. ปรับ Header ให้ยืดหยุ่น */
  .topbar {
    height: auto;
    flex-wrap: wrap;
    padding: 10px 1rem;
    gap: 10px;
    position: fixed; /* ล็อกไว้ด้านบน */
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

  /* 2. ปรับ Layout หลัก */
  .content {
    padding-top: 130px; /* เว้นที่ให้ Header ที่สูงขึ้น */
    padding-bottom: 80px;
  }
  .container {
    padding: 0 1rem;
  }

  /* เปลี่ยน Grid เป็นคอลัมน์เดียว */
  .cart-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  /* 3. ปรับการ์ดสินค้าในตะกร้า */
  .cart-row {
    flex-direction: column; /* เรียงแนวตั้ง */
    align-items: stretch;
    gap: 15px;
    position: relative;
  }

  /* ส่วนข้อมูลสินค้า */
  .product-main {
    flex-direction: row; /* รูปคู่กับชื่อ */
    margin-right: 0;
    gap: 15px;
  }

  .product-image {
    width: 90px; /* ลดขนาดรูป */
    height: 90px;
    flex-shrink: 0;
  }

  .product-info .brand {
    font-size: 16px;
  }
  .product-info .name {
    font-size: 14px;
  }
  .product-info .unit-price {
    font-size: 13px;
  }

  /* ส่วนจัดการ (ปุ่มบวกลบ + ราคา) */
  .product-side {
    width: 100%;
    justify-content: space-between;
    flex-direction: row; /* เรียงแนวนอน */
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid #f3f4f6;
  }

  /* ปุ่มลบสินค้า (ย้ายไปมุมขวาบน) */
  .remove-item {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
  }

  /* ปุ่มปรับจำนวน */
  .quantity-control button {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
  .qty-value {
    width: 30px;
    font-size: 14px;
  }

  /* ราคารวมของชิ้นนั้น */
  .item-price {
    text-align: right;
    font-size: 18px;
  }

  /* 4. ปรับส่วนสรุปยอด (Order Summary) */
  .summary-card {
    max-width: 100%; /* เต็มความกว้าง */
    padding: 20px;
  }

  .summary-title {
    font-size: 20px;
  }

  .promo-row {
    flex-direction: column; /* ช่องกรอกกับปุ่มเรียงแนวตั้ง */
    gap: 10px;
  }

  .apply-button {
    width: 100%;
  }
}
</style>
