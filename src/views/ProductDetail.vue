<template>
  <div class="page">
    <!-- Top bar -->
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาใน MC SHOP..." />
      </div>

      <div class="actions">
        <router-link to="/cart" class="icon-btn" style="display: grid; place-items: center">
          🛒
        </router-link>
        <button class="icon-btn">🔔</button>
        <router-link to="/home" class="icon-btn">🏠</router-link>
        <router-link to="/saved" class="icon-btn" style="display: grid; place-items: center">
          ♡
        </router-link>

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
            <li>โปรไฟล์</li>
            <router-link to="/orders" class="menu-link"> คำสั่งซื้อ </router-link>
            <li>สินค้าที่สนใจ</li>
            <li>ตั้งค่า</li>
            <router-link to="/" class="logout">ลงชื่อออก</router-link>
          </ul>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="content">
      <div class="container">
        <div class="detail-layout">
          <!-- ซ้าย: รูป + สเปก -->
          <section class="detail-left">
            <div class="image-box">
              <img :src="product.image" :alt="product.name" />
            </div>

            <div class="spec-card">
              <h3 class="spec-title">Specifications</h3>
              <div class="spec-row" v-for="(row, i) in product.specs" :key="i">
                <span class="spec-label">{{ row.label }}</span>
                <span class="spec-value">{{ row.value }}</span>
              </div>
            </div>
          </section>

          <!-- ขวา: ข้อมูลสินค้า -->
          <section class="detail-right">
            <p v-if="product.brand" class="prd-brand">{{ product.brand }}</p>
            <h1 class="prd-name">{{ product.name }}</h1>

            <div class="rating-row">
              <span class="rating-icon">⭐</span>
              <span class="rating-score">{{ product.rating }}</span>
              <span class="rating-reviews"> ({{ product.reviews }} reviews) </span>
              <span class="rating-stock"> In stock: {{ product.stock }} </span>
            </div>

            <div class="price-row">
              <div class="price-main">฿{{ product.price.toLocaleString() }}</div>
            </div>

            <p class="prd-sub">{{ product.subtitle }}</p>

            <!-- จำนวน + ปุ่ม Add to Cart -->
            <div class="qty-row">
              <div class="qty-control">
                <button class="qty-btn" @click="decQty">−</button>
                <span class="qty-value">{{ qty }}</span>
                <button class="qty-btn" @click="incQty">+</button>
              </div>

              <button class="btn-add" @click="addToCart">Add to Cart</button>
            </div>

            <!-- Info แถวล่าง -->
            <div class="info-list">
              <div class="info-item">
                <div class="info-icon">📦</div>
                <div>
                  <div class="info-title">Category</div>
                  <div class="info-sub">{{ product.category }}</div>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">🚚</div>
                <div>
                  <div class="info-title">Free Shipping</div>
                  <div class="info-sub">Free standard shipping on all orders</div>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">🛡️</div>
                <div>
                  <div class="info-title">Warranty</div>
                  <div class="info-sub">1 year limited warranty</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface SpecRow {
  label: string
  value: string
}

interface DetailProduct {
  id: number
  brand: string
  name: string
  subtitle: string
  price: number
  image: string
  rating: number
  reviews: number
  stock: number
  category: string
  specs: SpecRow[]
}

const route = useRoute()
const router = useRouter()

// avatar dropdown
const showMenu = ref(false)
const userInitial = ref('N')

const product = computed<DetailProduct>(() => {
  const fallback: DetailProduct = {
    id: 4003,
    brand: '', // ✅ ไม่ fix ว่าเป็น Adidas แล้ว
    name: 'Adidas Samba OG',
    subtitle: 'Adidas Samba OG Cloud White Core Black',
    price: 1579,
    image: 'https://d2cva83hdk3bwc.cloudfront.net/adidas-samba-og-cloud-white-core-black-1.jpg',
    rating: 4.8,
    reviews: 245,
    stock: 50,
    category: 'Sneakers',
    specs: [
      { label: 'Wireless', value: 'Included' },
      { label: 'AudioIn', value: 'Included' },
      { label: 'Earbuds', value: 'Included' },
      { label: 'Bluetooth', value: 'Included' },
      { label: 'Warranty', value: '1 Year' },
      { label: 'Support', value: '24/7 Customer Support' },
    ],
  }

  const q = route.query

  // ✅ ดึง brand จาก query ถ้าไม่มีให้ fallback เป็น '' แล้วค่อยใช้ name แทนเวลา addToCart
  const brandFromQuery = typeof q.brand === 'string' ? q.brand : ''

  return {
    ...fallback,
    id: q.id ? Number(q.id) : fallback.id,
    name: (q.name as string) || fallback.name,
    brand: brandFromQuery || fallback.brand, // ตอนนี้ fallback.brand เป็น '' แล้ว
    subtitle: (q.desc as string) || fallback.subtitle,
    price: q.price ? Number(q.price) : fallback.price,
    image: (q.image as string) || fallback.image,
  }
})

const qty = ref(1)

function incQty() {
  qty.value++
}

function decQty() {
  if (qty.value > 1) qty.value--
}

// เพิ่มลง localStorage แล้วไปหน้า /cart
function addToCart() {
  const raw = localStorage.getItem('cart')
  const cart = raw ? JSON.parse(raw) : []

  const existing = cart.find((i: any) => i.id === product.value.id)

  if (existing) {
    existing.quantity += qty.value
  } else {
    cart.push({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.image,
      quantity: qty.value,
      // ✅ ถ้า brand ว่าง จะใช้ name แทน (จะได้ไม่กลายเป็น Adidas มั่ว ๆ)
      brand: product.value.brand || product.value.name,
    })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  router.push('/cart')
}

// avatar dropdown
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

onMounted(() => {
  const email = localStorage.getItem('userEmail') || ''
  if (email) {
    userInitial.value = email.charAt(0).toUpperCase()
  }

  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #eef0f3;
  width: 150vh;
  margin-left: -90px;
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
  font-size: 20px;
}
.logo-box {
  font-weight: 800;
  line-height: 1;
  color: #2d3a4b;
}
.search {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 520px;
  background: #f2f5f7;
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
  gap: 1.5rem;
}
.icon-btn {
  width: 34px;
  height: 34px;
  font-size: 1.25rem;
  border-radius: 999px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.2s ease;
}
.icon-btn:hover {
  transform: scale(1.3);
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

/* user dropdown */
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

/* Content layout */
.content {
  padding-top: 88px;
  padding-bottom: 40px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem 0;
}
.detail-layout {
  display: grid;
  grid-template-columns: 1.1fr 1.1fr;
  gap: 32px;
}

/* Left side */
.detail-left {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.image-box {
  background: #fff;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  display: grid;
  place-items: center;
}
.image-box img {
  width: 100%;
  max-width: 420px;
  height: auto;
  object-fit: contain;
  margin: 0 auto;
}
.spec-card {
  background: #fff;
  border-radius: 18px;
  padding: 18px 22px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}
.spec-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
}
.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
}
.spec-label {
  color: #6b7280;
  font-size: 14px;
}
.spec-value {
  color: #297cca;
  font-weight: 500;
  font-size: 14px;
}

/* Right side */
.detail-right {
  padding-top: 4px;
}
.prd-brand {
  font-size: 14px;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.12em;
  margin-bottom: 4px;
}
.prd-name {
  font-size: 32px;
  font-weight: 750;
  margin: 0 0 4px;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  margin-bottom: 10px;
  font-size: 19px;
  font-weight: 750;
}
.rating-icon {
  font-size: 19px;
}
.rating-score {
  font-weight: 750;
  color: #111827;
}
.rating-stock {
  margin-left: 6px;
  color: #059669;
  font-weight: 600;
}
.price-row {
  margin-bottom: 6px;
}
.price-main {
  font-size: 30px;
  font-weight: 750;
  color: #0d6efd;
}
.prd-sub {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 18px;
  font-weight: 600;
}

/* Qty + button */
.qty-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.qty-control {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  overflow: hidden;
}
.qty-btn {
  width: 45px;
  height: 50.5px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 24px;
}
.qty-value {
  width: 40px;
  text-align: center;
  font-size: 20px;
}
.btn-add {
  flex: 1;
  border: 1px solid rgba(204, 223, 250, 0.45); /* ขอบฟ้าโปร่ง */
  background: rgba(67, 132, 230, 0.25); /* ฟ้าใสแบบ glass */
  color: #1839cc;
  font-weight: 600;
  padding: 17px 22px;
  cursor: pointer;
  border-radius: 25px;
  font-size: 17px;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.2);
  transition: 0.25s ease;
}

.btn-add:hover {
  background: rgba(13, 110, 253, 0.35); /* เข้มขึ้นตอน hover */
  transform: scale(1.05);
  box-shadow: 0 6px 28px rgba(13, 110, 253, 0.33);
}

/* Info rows */
.info-list {
  margin-top: 10px;
  display: grid;
  gap: 15px;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.info-icon {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #f1f5f9;
  display: grid;
  place-items: center;
}
.info-title {
  font-size: 19px;
  font-weight: 600;
}
.info-sub {
  font-size: 16px;
  color: #6b7280;
  font-weight: 600;
}

@media (max-width: 960px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
  .container {
    padding-inline: 1.25rem;
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
</style>
