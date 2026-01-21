<template>
  <div class="page">
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาสินค้าผู้หญิง..." v-model="q" @focus="openSearch" />
      </div>

      <div class="actions">
        <!-- ตะกร้าสินค้า -->
        <router-link to="/cart" class="icon-btn" style="display: grid; place-items: center">
          🛒
        </router-link>

        <!-- แจ้งเตือน -->
        <button class="icon-btn">🔔</button>

        <!-- Saved / Wishlist -->
        <router-link to="/saved" class="icon-btn" style="display: grid; place-items: center">
          ♡
        </router-link>

        <!-- Avatar -->
        <div class="avatar" @click.stop="toggleMenu">
          {{ userInitial }}
        </div>

        <!-- User Dropdown -->
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

    <nav class="tabs">
      <router-link
        v-for="t in tabs"
        :key="t.to"
        :to="t.to"
        class="tab"
        :class="{ active: $route.path === t.to }"
      >
        {{ t.label }}
      </router-link>
    </nav>

    <main class="content">
      <div class="container">
        <h2 class="section-title">สินค้าผู้หญิงล่าสุด</h2>
        <div class="product-grid">
          <article
            v-for="item in filteredLatest"
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
              <div class="badge" v-if="item.tag"><span class="badge-dot"></span>{{ item.tag }}</div>
              <div class="bottom-row">
                <div class="price">฿{{ item.price.toLocaleString() }}</div>
                <button
                  class="wish"
                  :class="{ liked: isSaved(item.id) }"
                  @click.stop="toggle(item)"
                >
                  {{ isSaved(item.id) ? '❤️' : '♡' }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <h2 class="section-title second">แนะนำสำหรับผู้หญิง</h2>
        <div class="product-grid">
          <article
            v-for="item in recommended"
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
              <div class="badge" v-if="item.tag"><span class="badge-dot"></span>{{ item.tag }}</div>
              <div class="bottom-row">
                <div class="price">฿{{ item.price.toLocaleString() }}</div>
                <button
                  class="wish"
                  :class="{ liked: isSaved(item.id) }"
                  @click.stop="toggle(item)"
                >
                  {{ isSaved(item.id) ? '❤️' : '♡' }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <h2 class="section-title" style="margin-top: 3rem">Trending 🔥</h2>
        <div class="product-grid">
          <article
            v-for="item in trending"
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
              <div class="badge" v-if="item.tag"><span class="badge-dot"></span>{{ item.tag }}</div>
              <div class="bottom-row">
                <div class="price">฿{{ item.price.toLocaleString() }}</div>
                <button
                  class="wish"
                  :class="{ liked: isSaved(item.id) }"
                  @click.stop="toggle(item)"
                >
                  {{ isSaved(item.id) ? '❤️' : '♡' }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- ===== Search Overlay ผู้หญิง ===== -->
      <transition name="search-fade">
        <div v-if="showSearchPanel" class="search-overlay" @click.self="closeSearch">
          <div class="search-panel">
            <!-- ซ้าย: keyword ยอดนิยม -->
            <div class="search-panel__col search-panel__popular">
              <div class="sp-title">คำค้นยอดนิยมสำหรับผู้หญิง</div>
              <div class="sp-chips">
                <button
                  v-for="kw in popularKeywords"
                  :key="kw"
                  class="sp-chip"
                  @click="applyKeyword(kw)"
                >
                  {{ kw }}
                </button>
              </div>
            </div>

            <div class="search-panel__divider"></div>

            <!-- ขวา: รายการ match -->
            <div class="search-panel__col search-panel__results">
              <div class="sp-header-row">
                <span class="sp-title">สินค้าแนะนำ</span>
                <button class="sp-see-all" type="button">ดูทั้งหมด</button>
              </div>

              <div v-if="searchResults.length === 0" class="sp-empty">
                ไม่พบสินค้าที่ตรงกับคำค้นนี้
              </div>

              <div v-else class="sp-list">
                <button
                  v-for="item in searchResults.slice(0, 5)"
                  :key="item.id"
                  class="sp-item"
                  type="button"
                  @click="goFromSearch(item)"
                >
                  <div class="sp-thumb">
                    <img :src="item.image" :alt="item.name" />
                  </div>
                  <div class="sp-meta">
                    <div class="sp-name">{{ item.name }}</div>
                    <div class="sp-desc">{{ item.desc }}</div>
                    <div class="sp-price">฿{{ item.price.toLocaleString() }}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <!-- ===== /Search Overlay ===== -->

      <!-- ========= โมดัลรายละเอียดสินค้า (มี size แค่ที่จำเป็น) ========= -->
      <div v-if="showModal && selected" class="mc-modal__backdrop" @click.self="closeModal">
        <div class="mc-modal__panel" role="dialog" aria-modal="true">
          <button class="mc-modal__close" @click="closeModal">✕</button>

          <div class="mc-modal__body">
            <!-- ซ้าย: รูปสินค้า -->
            <div class="mc-modal__image">
              <img :src="selected.image" :alt="selected.name" />
            </div>

            <!-- ขวา: รายละเอียด -->
            <div class="mc-modal__info">
              <h3 class="mc-modal__title">{{ selected.name }}</h3>
              <p class="mc-modal__sub">{{ selected.desc }}</p>

              <!-- block size: แสดงเฉพาะสินค้าที่มี size จริง (รองเท้า) -->
              <div v-if="showSizeSection" class="mc-modal__sizeblock">
                <div class="mc-modal__sizehead">
                  <span>Size (US)</span>
                  <button type="button" class="mc-modal__more">ดูข้อมูลเพิ่มเติม ↗</button>
                </div>

                <div class="mc-modal__sizegrid">
                  <button
                    v-for="(opt, i) in sizeOptions"
                    :key="i"
                    class="mc-sizebtn"
                    :class="{ active: pickedSize && opt.label === pickedSize.label }"
                    @click="pickedSize = opt"
                  >
                    <div class="mc-sizebtn__label">{{ opt.label }}</div>
                    <div class="mc-sizebtn__price">฿{{ opt.price.toLocaleString() }}</div>
                  </button>
                </div>
              </div>

              <div class="mc-modal__cta">
                <button class="mc-btn--primary" @click="addSelectedToSaved">
                  {{ isSaved(selected.id) ? 'อยู่ใน Saved แล้ว' : 'เพิ่มลง Saved' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ========= /โมดัล ========= -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useWishlist } from '../router/useWishlist'

type SizeOpt = { label: string; price: number }

interface Product {
  id: number
  name: string
  desc: string
  price: number
  image: string
  sold?: string
  tag?: string
  sizes?: SizeOpt[]
  noSize?: boolean
}

const tabs = [
  { label: 'สำหรับคุณ', to: '/home' },
  { label: 'Streetwear', to: '/streetwear' },
  { label: 'Luxury', to: '/luxury' },
  { label: 'ของสะสม', to: '/collectibles' },
  { label: 'ผู้ชาย', to: '/men' },
  { label: 'ผู้หญิง', to: '/women' },
]

const { toggle, isSaved } = useWishlist()
const q = ref('')

// ===== Avatar dropdown =====
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

// search overlay state
const showSearchPanel = ref(false)
const popularKeywords = [
  'New Balance 530',
  'รองเท้าผู้หญิง',
  'กระเป๋า Coach',
  'กระเป๋า Celine',
  'Pop Mart',
  'ตุ๊กตา Labubu',
  'Longchamp',
]

// ตารางไซซ์รองเท้า (ตามรูป size US)
const nb530Sizes: SizeOpt[] = [
  { label: 'US 4.5', price: 2400 },
  { label: 'US 5.5', price: 2228 },
  { label: 'US 6', price: 3600 },
  { label: 'US 6.5', price: 4681 },
  { label: 'US 7', price: 3499 },
  { label: 'US 7.5', price: 3283 },
  { label: 'US 8', price: 4800 },
  { label: 'US 8.5', price: 3690 },
  { label: 'US 9', price: 3099 },
  { label: 'US 9.5', price: 3399 },
  { label: 'US 10', price: 3299 },
  { label: 'US 10.5', price: 3289 },
  { label: 'US 11', price: 3199 },
  { label: 'US 11.5', price: 3999 },
  { label: 'US 12', price: 3299 },
  { label: 'US 12.5', price: 5090 },
  { label: 'US 13', price: 3938 },
  { label: 'US 14', price: 4590 },
  { label: 'US 15', price: 4815 },
]

const latest = ref<Product[]>([
  {
    id: 5001,
    name: 'Pop Mart',
    desc: 'Pop Mart Labubu The Monsters DRESS BE LATTE Vinyl Plush Doll',
    price: 20590,
    sold: '10.3K',
    tag: 'Trending',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/pop-mart-the-monsters-dress-be-latte-vinyl-plush-doll-1.jpg',
    noSize: true,
  },
  {
    id: 5002,
    name: 'New Balance 530',
    desc: 'White/Silver (W)',
    price: 3990,
    sold: '7.8K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/new-balance-530-white-silver-navy-1.jpg',
    sizes: nb530Sizes,
  },
  {
    id: 5003,
    name: 'Pop Mart',
    desc: 'Pop Mart Juggling Clown Why So Serious Series-vinyl Plush Pendant Blind Box',
    price: 3990,
    sold: '1.9K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/pm-bbcpmjcwsssvppbb-pop-mart-juggling-clown-why-so-serious-series-vinyl-plush-pendant-blind-box-1.jpg',
    noSize: true,
  },
  {
    id: 5004,
    name: 'Pop Mart',
    desc: 'Pop Mart Neon Cutie (Crybaby Wild But Cutie Series Vinyl Plush Pendant Blind Box)',
    price: 321,
    sold: '2.3K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/pm-bbcccpmnccwbcsvppbb-pop-mart-neon-cutie-crybaby-wild-but-cutie-series-vinyl-plush-pendant-blind-box-1.jpg',
    noSize: true,
  },
  {
    id: 5005,
    name: 'Longchamp ',
    desc: 'Longchamp Le Pliage Original Pouch With Handle In Recycled Canvas With Gold Hardware Black',
    price: 3390,
    sold: '5.4K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/longchamp-le-pliage-original-pouch-with-handle-in-recycled-canvas-black-1.jpg',
    noSize: true,
  },
])

const recommended = ref<Product[]>([
  {
    id: 5101,
    name: 'MICHAEL KORS',
    desc: "MICHAEL KORS Leather Trim Handheld Shoulder Bag Crossbody Bag Medium Size Women's White",
    price: 4490,
    sold: '3.6K',
    image:
      'https://sasom-orders-bucket-prod.s3-ap-southeast-1.amazonaws.com/OuZKL1762611511805/image-OuZKL1762611511805-0.jpg',
    noSize: true,
  },
  {
    id: 5102,
    name: 'Coach',
    desc: "Coach Women's Mini Leather Wallet Chain Crossbody Bag Black",
    price: 2590,
    sold: '1.2K',
    tag: 'Popular',
    image:
      'https://sasom-orders-bucket-prod.s3-ap-southeast-1.amazonaws.com/49x1A1751906124550/image-49x1A1751906124550-0.jpg',
    noSize: true,
  },
])

const trending = ref<Product[]>([
  {
    id: 5201,
    name: 'Coach',
    desc: 'Coach Graham Crossbody In Signature Canvas With Silver Hardware Khaki Black',
    price: 5590,
    sold: '4.9K',
    image:
      'https://sasom-orders-bucket-prod.s3-ap-southeast-1.amazonaws.com/nPLge1743805745012/image-nPLge1743805745012-0.jpg',
    noSize: true,
  },
  {
    id: 5202,
    name: 'Celine',
    desc: 'Celine Medium Celine Croque Bag In Triomphe Canvas And Calfskin With Zipped Closure Tan',
    price: 43990,
    sold: '2.7K',
    image:
      'https://sasom-orders-bucket-prod.s3-ap-southeast-1.amazonaws.com/Bof5j1745492826723/image-Bof5j1745492826723-0.jpg',
    noSize: true,
  },
])

// filter section แรกด้วย q
const filteredLatest = computed(() =>
  latest.value.filter(
    (i) =>
      i.name.toLowerCase().includes(q.value.toLowerCase()) ||
      i.desc.toLowerCase().includes(q.value.toLowerCase()),
  ),
)

// รวมสินค้าทั้งหมดใช้ใน search overlay
const allItems = computed(() => [...latest.value, ...recommended.value, ...trending.value])

const searchResults = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return allItems.value.slice(0, 6)
  return allItems.value.filter(
    (item) => item.name.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term),
  )
})

// search overlay functions
function openSearch() {
  showSearchPanel.value = true
}
function closeSearch() {
  showSearchPanel.value = false
}
function applyKeyword(kw: string) {
  q.value = kw
  showSearchPanel.value = true
}
function goFromSearch(item: Product) {
  closeSearch()
  openProduct(item)
}

/* -------- โมดัล logic -------- */
const showModal = ref(false)
const selected = ref<Product | null>(null)
const pickedSize = ref<SizeOpt | null>(null)

const sizeOptions = computed<SizeOpt[]>(() => {
  if (!selected.value) return []
  if (selected.value.noSize) return []
  if (selected.value.sizes?.length) return selected.value.sizes
  return []
})

const showSizeSection = computed(() => sizeOptions.value.length > 0)

function openProduct(item: Product) {
  selected.value = item
  pickedSize.value = sizeOptions.value[0] ?? null
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  selected.value = null
  pickedSize.value = null
  document.body.style.overflow = ''
}

function addSelectedToSaved() {
  if (!selected.value) return

  let finalPrice = selected.value.price

  // ถ้ามี size ที่เลือกอยู่ ให้ใช้ราคาของ size นั้น
  if (pickedSize.value?.price) {
    finalPrice = pickedSize.value.price
  }

  toggle({
    ...selected.value,
    price: finalPrice,
    chosenSize: pickedSize.value?.label || '',
  } as any)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (showModal.value) closeModal()
    if (showSearchPanel.value) closeSearch()
  }
}

onMounted(() => {
  // ดึงตัวอักษรแรกจากอีเมลที่เก็บไว้ตอน login
  const email = localStorage.getItem('userEmail') || ''
  if (email) {
    userInitial.value = email.charAt(0).toUpperCase()
  }

  window.addEventListener('keydown', onKey)
  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
/* ใช้สไตล์เดียวกับหน้าอื่นเพื่อความสม่ำเสมอ */
.page {
  min-height: 100vh;
  background: #eef0f3;
  width: 150vh;
  margin-left: -90px;
}
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
  gap: 2rem;
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
}
.icon-btn:hover {
  transform: scale(1.1);
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
  font-weight: 800;
}

.tabs {
  margin-top: 72px;
  background: #eef0f3;
  display: flex;
  justify-content: center;
  position: relative;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  gap: 2.5rem;
}
/* 1. ปรับตัวปุ่มเมนู */
.tab {
  position: relative;
  display: inline-block;
  border: none;
  background: transparent;
  font-weight: 500;
  font-size: 0.95rem;
  color: #94a3b8;
  cursor: pointer;
  padding-bottom: 0.6rem;
  text-decoration: none;

  transition:
    color 0.3s ease,
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab:hover,
.tab.active {
  color: #0f172a;
  transform: translateY(-2px);
}

.tab::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 2.5px;
  background: #0f172a;
  border-radius: 4px;

  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  margin-left: auto;
  margin-right: auto;
  right: 0;
}

.tab.active::after {
  width: 100%;
}

.tab:hover::after {
  width: 30%;
  opacity: 0.5;
}
.content {
  padding: 1rem 0 3rem;
}
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2.5rem;
}
.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 2rem 0 1.5rem;
  color: #2d3a4b;
  display: block;
  width: 100%;
}
.section-title.second {
  margin-top: 4rem;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
.product-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #eef0f2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition:
    all 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.4s ease;
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
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
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backface-visibility: hidden;
  transform-origin: center center;
}
.product-card:hover .thumb img {
  transform: scale(1.05);
}
.sold {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #fff;
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
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
  font-size: 0.95rem;
  color: #1a1d1f;
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
.product-card:hover .wish {
  transform: scale(1.2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06); /* มีเงาโผล่มานิดๆ */
}
.wish:hover {
  transform: scale(1.15) translateY(-2px) !important; /* ขยาย + คงตำแหน่งลอย */
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  background: #f8fafc; /* เปลี่ยนสีพื้นหลังปุ่มนิดนึง */
}
.wish:active {
  transform: scale(0.85);
}
.wish.liked {
  color: #e63946;
  animation: heartPop 0.35s ease;
}
@keyframes heartPop {
  0% {
    transform: scale(0.8);
  }
  60% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@media (max-width: 768px) {
  .search {
    width: 72%;
  }
  .container {
    padding: 0 1rem;
  }
}

/* ===== Search overlay ===== */
.search-overlay {
  position: fixed;
  inset: 72px 0 0 0;
  background: rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(3px);
  z-index: 150;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.search-panel {
  margin-top: 32px;
  width: min(1100px, 96vw);
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  display: grid;
  grid-template-columns: 1.1fr auto 1.2fr;
  padding: 22px 26px;
  column-gap: 28px;
}
.search-panel__col {
  min-height: 160px;
}
.search-panel__divider {
  width: 1px;
  background: #e5e7eb;
}
.sp-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 10px;
}
.sp-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.sp-chip {
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.sp-chip:hover {
  background: #111827;
  color: #fff;
  border-color: #111827;
}
.search-panel__results {
  display: flex;
  flex-direction: column;
}
.sp-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.sp-see-all {
  border: none;
  background: transparent;
  font-size: 0.8rem;
  color: #6b7280;
  cursor: pointer;
}
.sp-see-all:hover {
  color: #111827;
}
.sp-empty {
  font-size: 0.85rem;
  color: #9ca3af;
  padding-top: 12px;
}
.sp-list {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sp-item {
  width: 100%;
  border: none;
  background: transparent;
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 10px;
  padding: 6px 0;
  cursor: pointer;
  text-align: left;
}
.sp-item:hover {
  background: #f9fafb;
  border-radius: 10px;
  padding-inline: 8px;
}
.sp-thumb img {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
}
.sp-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.sp-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}
.sp-desc {
  font-size: 0.78rem;
  color: #6b7280;
}
.sp-price {
  font-size: 0.85rem;
  color: #16a34a;
  font-weight: 600;
  margin-top: 2px;
}

@media (max-width: 960px) {
  .search-panel {
    grid-template-columns: 1fr;
    row-gap: 16px;
  }
  .search-panel__divider {
    display: none;
  }
}

/* Animation overlay */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.18s ease;
}
.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
.search-fade-enter-from .search-panel {
  transform: translateY(-10px);
  opacity: 0;
}
.search-fade-enter-to .search-panel {
  transform: translateY(0);
  opacity: 1;
}
.search-fade-leave-from .search-panel {
  transform: translateY(0);
  opacity: 1;
}
.search-fade-leave-to .search-panel {
  transform: translateY(-10px);
  opacity: 0;
}

/* ===== โมดัล ===== */
.mc-modal__backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(17, 24, 39, 0.55);
  z-index: 2000;
  padding: 1.25rem;
}
.mc-modal__panel {
  width: min(980px, 96vw);
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: mcModalIn 0.18s ease;
}
@keyframes mcModalIn {
  from {
    transform: scale(0.98);
    opacity: 0.6;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.mc-modal__close {
  position: absolute;
  right: 14px;
  top: 12px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.7;
}
.mc-modal__close:hover {
  opacity: 1;
}
.mc-modal__body {
  display: grid;
  grid-template-columns: 1.1fr 1.3fr;
  gap: 24px;
  padding: 28px;
}
.mc-modal__image {
  display: grid;
  place-items: center;
  border-right: 1px solid #eef0f3;
  padding-right: 12px;
}
.mc-modal__image img {
  width: 100%;
  max-width: 360px;
  height: auto;
  object-fit: contain;
}
.mc-modal__info {
  padding-left: 6px;
}
.mc-modal__title {
  font-size: 22px;
  font-weight: 800;
  color: #2d3a4b;
  margin: 0 0 6px;
}
.mc-modal__sub {
  color: #6b7280;
  margin: 0 0 18px;
}
.mc-modal__sizeblock {
  margin-bottom: 18px;
}
.mc-modal__sizehead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #6b7280;
}
.mc-modal__more {
  border: none;
  background: transparent;
  color: #1f2937;
  cursor: pointer;
  font-size: 13px;
  opacity: 0.85;
}
.mc-modal__more:hover {
  opacity: 1;
}
.mc-modal__sizegrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px;
}
.mc-sizebtn {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.mc-sizebtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.mc-sizebtn.active {
  border-color: #10b981;
  box-shadow: inset 0 0 0 1px #10b981;
}
.mc-sizebtn__label {
  font-size: 12px;
  color: #6b7280;
}
.mc-sizebtn__price {
  font-size: 12px;
  color: #16a34a;
  font-weight: 700;
}
.mc-modal__cta {
  margin-top: 18px;
}
.mc-btn--primary {
  padding: 10px 14px;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  border: none;
  cursor: pointer;
}
.mc-btn--primary:hover {
  filter: brightness(1.05);
}
@media (max-width: 860px) {
  .mc-modal__body {
    grid-template-columns: 1fr;
  }
  .mc-modal__image {
    border-right: 0;
    padding-right: 0;
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

/* --- สำหรับ Tablet และหน้าจอเล็กกว่า 1200px --- */
@media (max-width: 1200px) {
  .page {
    width: 100%; /* ยกเลิกความกว้าง 150vh */
    margin-left: 0; /* ยกเลิก margin ติดลบ */
    overflow-x: hidden;
  }

  .tabs {
    margin-left: 0; /* จัด Tabs ให้กลับมาอยู่กลาง */
    padding-left: 20px;
    padding-right: 20px;
    overflow-x: auto; /* ให้สไลด์แนวนอนได้ถ้าแท็บยาวเกิน */
    white-space: nowrap;
    justify-content: flex-start; /* เริ่มจากซ้าย */
  }

  .tab {
    flex-shrink: 0;
  }
}

/* --- สำหรับ Mobile (มือถือ) --- */
@media (max-width: 768px) {
  /* 1. ปรับ Topbar ให้เป็น 2 บรรทัด */
  .topbar {
    height: auto; /* ความสูงยืดหดตามเนื้อหา */
    flex-wrap: wrap; /* ให้เนื้อหาตกลงมาบรรทัดใหม่ได้ */
    padding: 10px 16px;
    gap: 10px;
  }

  .brand {
    order: 1; /* โลโก้อยู่ซ้ายบน */
  }

  .actions {
    position: static; /* ยกเลิก position absolute */
    order: 2; /* ไอคอนอยู่ขวาบน */
    gap: 12px; /* ลดระยะห่างระหว่างไอคอน */
    margin-left: auto; /* ดันไปขวาสุด */
  }

  /* ช่องค้นหา ลงมาอยู่บรรทัดที่ 2 เต็มความกว้าง */
  .search {
    position: static;
    transform: none;
    width: 100%;
    order: 3;
    margin-top: 5px;
    padding: 8px 15px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  .icon-btn {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  /* 2. ปรับเนื้อหาหลัก */
  .content {
    padding: 1rem; /* ลด padding ด้านข้าง */
  }

  .tabs {
    margin-top: 110px; /* เว้นที่ให้ Topbar ที่สูงขึ้น */
    gap: 1.5rem;
  }

  /* 3. ปรับ Grid สินค้า (ให้เป็น 2 คอลัมน์ในมือถือ) */
  .product-grid {
    /* ปรับ minmax ให้เล็กลง เพื่อให้แบ่ง 2 คอลัมน์ได้ในจอเล็ก */
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
  }

  .thumb {
    height: 140px;
  } /* ลดความสูงรูป */

  .meta {
    padding: 10px;
    min-height: auto;
  }

  .name {
    font-size: 0.85rem;
  }
  .price {
    font-size: 0.9rem;
  }

  /* 4. ปรับ Modal (หน้าต่างเด้ง) */
  .mc-modal__body {
    grid-template-columns: 1fr; /* เรียงเป็นแนวตั้ง */
    gap: 15px;
    padding: 20px;
  }

  .mc-modal__image {
    border-right: none;
    border-bottom: 1px solid #eef0f3;
    padding-right: 0;
    padding-bottom: 15px;
  }

  .mc-modal__title {
    font-size: 18px;
  }

  /* ปุ่ม Size ใน Modal */
  .mc-modal__sizegrid {
    grid-template-columns: repeat(3, 1fr); /* แถวละ 3 ปุ่ม */
  }

  /* 5. ปรับ Hero Banner (ถ้ามี) */
  .hero-banner {
    flex-direction: column-reverse;
    padding: 2rem 1.5rem;
    text-align: center;
  }
  .hero-text-content {
    max-width: 100%;
  }
  .hero-image-content img {
    width: 220px;
    margin-bottom: 20px;
  }
}
</style>
