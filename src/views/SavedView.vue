<template>
  <div class="page">
    <!-- Topbar -->
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาในที่บันทึก" v-model="q" />
      </div>

      <div class="actions">
        <router-link to="/cart" class="icon-btn" style="display: grid; place-items: center">
          🛒
        </router-link>
        <button class="icon-btn">🔔</button>
        <router-link to="/home" class="icon-btns home-icon">🏠</router-link>

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
            <li>สินค้าที่สนใจ</li>
            <li>ตั้งค่า</li>
            <router-link to="/" class="logout">ลงชื่อออก</router-link>
          </ul>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="content">
      <h2 class="section-title">💖 Saved Items</h2>

      <!-- ✅ Empty State -->
      <div v-if="filteredItems.length === 0" class="empty-state">
        <div class="empty-icon">♡</div>
        <p class="empty-title">
          {{
            items.length === 0 ? 'มาเพิ่มหน้านี้ด้วยสินค้าที่คุณสนใจ!' : 'ไม่พบสินค้าที่ตรงกับคำค้น'
          }}
        </p>
        <router-link to="/home" class="empty-btn"> คุณอาจจะชอบสิ่งนี้ </router-link>
      </div>

      <!-- ✅ Product Grid -->
      <div v-else class="product-grid">
        <article
          v-for="item in filteredItems"
          :key="item.id"
          class="product-card"
          @click="openProduct(item)"
        >
          <div class="thumb">
            <img :src="item.image" :alt="item.name" />
            <span class="sold" v-if="item.sold">{{ item.sold }} sold</span>
          </div>
          <div class="meta">
            <h3 class="name">{{ item.name }}</h3>
            <p class="sub">{{ item.desc }}</p>
            <div class="badge" v-if="item.tag">
              <span class="badge-dot"></span>
              {{ item.tag }}
            </div>
            <div class="bottom-row">
              <div class="price">฿{{ item.price.toLocaleString() }}</div>

              <!-- ปุ่มหัวใจ ลบ/เพิ่มจาก Saved -->
              <button class="wish" :class="{ liked: isSaved(item.id) }" @click.stop="toggle(item)">
                {{ isSaved(item.id) ? '❤️' : '♡' }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlist } from '@/router/useWishlist'

// ดึง item + ฟังก์ชันจาก wishlist
const { items, toggle, isSaved } = useWishlist()
const router = useRouter()

// search state
const q = ref('')

// avatar dropdown state
const showMenu = ref(false)
const userInitial = ref('N')

const filteredItems = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return items.value

  return items.value.filter((item: any) => {
    const name = (item.name || '').toLowerCase()
    const desc = (item.desc || '').toLowerCase()
    return name.includes(term) || desc.includes(term)
  })
})

// กดการ์ดแล้วไปหน้า Product Detail
function openProduct(item: any) {
  router.push({
    name: 'product-detail',
    query: {
      id: item.id,
      name: item.name,
      desc: item.desc,
      price: item.price,
      image: item.image,
      sold: item.sold || '',
      tag: item.tag || '',
    },
  })
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

/* ===== Topbar ===== */
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

/* search กลางจอ */
.search {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 460px;
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
  gap: 2.5rem;
}

.icon-btn {
  width: 50px;
  height: 50px;
  font-size: 1.25rem;
  border-radius: 999px;
  border: none;
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease;
  line-height: 1 !important;
  margin-top: 2px;
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
  transition: transform 0.2s ease;
  cursor: pointer;
}
.avatar:hover {
  transform: scale(1.2);
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

/* พอพ้น topbar แล้วให้คอนเทนต์กว้างและอยู่กลาง */
.content {
  max-width: 1480px;
  margin: 0 auto;
  padding: 6.5rem 1.5rem 2.5rem;
  box-sizing: border-box;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2d3a4b;
}

/* 5 ใบ / row */
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

.product-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #eef0f2;
  width: 100%;
  max-width: 240px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: 0.25s;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #d6e0f0;
}

.thumb {
  height: 160px;
  background: #f7f8f9;
  overflow: hidden;
  position: relative;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.product-card:hover .thumb img {
  transform: scale(1.05);
}

.sold {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ffffff;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.65rem;
  color: #6a7381;
  border: 1px solid #edf0f3;
}

.meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  min-height: 150px;
}
.name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2d3a4b;
}
.sub {
  font-size: 0.7rem;
  color: #7b8085;
  min-height: 2.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #e6f7e8;
  color: #1f8c3a;
  border-radius: 8px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 500;
  margin-top: 0.4rem;
  width: fit-content;
}
.badge-dot {
  width: 6px;
  height: 6px;
  background: #08a33a;
  border-radius: 999px;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
.price {
  font-weight: 700;
  font-size: 0.85rem;
  color: #1a1d1f;
  margin-top: 0.8rem;
}

.wish {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid #eceff1;
  background: #fff;
  cursor: pointer;
  font-size: 1rem;
  display: grid;
  place-items: center;
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}
.wish:hover {
  transform: scale(1.2);
}
.wish:active {
  transform: scale(0.85);
}
.wish.liked {
  color: #e63946;
}

.empty-state {
  width: 100%;
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  color: #1f2937;
}
.empty-icon {
  width: 90px;
  height: 90px;
  border: 1.8px solid #e5e7eb;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 2.4rem;
  color: #e5e7eb;
}
.empty-title {
  font-size: 1.05rem;
  font-weight: 800;
}
.empty-btn {
  margin-top: 0.5rem;
  background: #111;
  color: #fff;
  padding: 0.55rem 1.4rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.empty-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

@media (max-width: 768px) {
  .topbar {
    padding: 0 1rem;
  }
  .content {
    padding: 5rem 1rem 2rem;
  }
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.home-icon {
  margin-top: 19px;
}
.user-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Style สำหรับ Menu Items ทั้งหมด (li และ router-link) */
.user-menu ul li,
.menu-link {
  display: block;
  padding: 8px 6px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #2d3a4b; /* สีข้อความปกติ */
  text-decoration: none;
  transition: all 0.25s ease;
  font-weight: 500;
}

/* Hover effect */
.user-menu ul li:hover,
.menu-link:hover {
  background: #e1e6f0;
  transform: scale(1.03);
  font-weight: 700;
  color: #3190cf;
}
.icon-btns {
  font-size: 1.25rem;
  border-radius: 999px;
  border: none;
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease;
  line-height: 1 !important;
  margin-top: -2px;
  margin-right: 14px;
}
.icon-btns:hover {
  transform: scale(1.2);
}
</style>
