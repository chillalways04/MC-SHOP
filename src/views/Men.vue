<template>
  <div class="page">
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาสินค้าผู้ชาย..." v-model="q" @focus="openSearch" />
      </div>

      <div class="actions">
        <router-link to="/cart" class="icon-btn" style="display: grid; place-items: center">
          🛒
        </router-link>
        <button class="icon-btn">🔔</button>
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
        <h2 class="section-title">สินค้าผู้ชายล่าสุด</h2>
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

        <h2 class="section-title second">แนะนำสำหรับผู้ชาย</h2>
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

      <!-- ===== Search Overlay สำหรับผู้ชาย ===== -->
      <transition name="search-fade">
        <div v-if="showSearchPanel" class="search-overlay" @click.self="closeSearch">
          <div class="search-panel">
            <!-- ซ้าย: keyword ยอดนิยม -->
            <div class="search-panel__col search-panel__popular">
              <div class="sp-title">คำค้นยอดนิยมสำหรับผู้ชาย</div>
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

            <!-- ขวา: รายการสินค้า match -->
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

      <!-- ===== โมดัลดูรายละเอียดสินค้า + ตารางไซซ์รองเท้า ===== -->
      <div v-if="showModal && selected" class="mc-modal__backdrop" @click.self="closeModal">
        <div class="mc-modal__panel">
          <button class="mc-modal__close" @click="closeModal">✕</button>

          <div class="mc-modal__body">
            <div class="mc-modal__image">
              <img :src="selected.image" :alt="selected.name" />
            </div>

            <div class="mc-modal__info">
              <h3 class="mc-modal__title">{{ selected.name }}</h3>
              <p class="mc-modal__sub">{{ selected.desc }}</p>

              <div class="mc-modal__meta-row">
                <span v-if="selected.sold" class="mc-modal__sold"> {{ selected.sold }} sold </span>
                <span v-if="selected.tag" class="mc-modal__tag">
                  {{ selected.tag }}
                </span>
              </div>

              <div v-if="selected.sizes && selected.sizes.length" class="mc-size">
                <div class="mc-size__header">
                  <span class="mc-size__label">Size (US)</span>
                  <button class="mc-size__more">ดูข้อมูลเพิ่มเติม ↗</button>
                </div>

                <div class="mc-size__grid">
                  <button
                    v-for="opt in selected.sizes"
                    :key="opt.label"
                    class="mc-size__item"
                    :class="{
                      'mc-size__item--disabled': opt.available === false,
                      'mc-size__item--active':
                        selectedSize === opt.label && opt.available !== false,
                    }"
                    :disabled="opt.available === false"
                    @click="selectSize(opt.label, opt.available)"
                  >
                    <div class="mc-size__item-label">{{ opt.label }}</div>
                    <div v-if="opt.price" class="mc-size__item-price">
                      ฿{{ opt.price.toLocaleString() }}
                    </div>
                  </button>
                </div>
              </div>

              <div v-else class="mc-modal__price">ราคา: ฿{{ selected.price.toLocaleString() }}</div>

              <!-- 🔻 แก้ให้ใช้ saveToWishlist แทน toggle(selected) -->
              <button class="mc-modal__save" @click="saveToWishlist">
                {{ isSaved(selected.id) ? '❤️ อยู่ใน Saved แล้ว' : '♡ เพิ่มลง Saved' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- ===== จบโมดัล ===== -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useWishlist } from '../router/useWishlist'

interface SizeOption {
  label: string
  price?: number
  available?: boolean
}

interface Product {
  id: number
  name: string
  desc: string
  price: number
  image: string
  sold?: string
  tag?: string
  sizes?: SizeOption[]
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

// ===== Avatar dropdown =====
const showMenu = ref(false)
const userInitial = ref('N')

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// ปิด dropdown เมื่อคลิกนอก avatar / เมนู
function handleGlobalClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const menu = document.querySelector('.user-menu')
  const avatar = document.querySelector('.avatar')
  if (menu && !menu.contains(target) && avatar && !avatar.contains(target)) {
    showMenu.value = false
  }
}

// ดึงตัวอักษรแรกจากอีเมลใน localStorage
onMounted(() => {
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

// ===== Search state =====
const q = ref('')
const showSearchPanel = ref(false)

// keyword สำหรับผู้ชาย
const popularKeywords = [
  'Air Force 1',
  'Samba',
  'Jordan 1',
  'New Balance 990',
  'Stussy Tee',
  'สร้อยผู้ชาย',
  'Pop Mart',
]

// ===== Data สินค้า =====
const latest = ref<Product[]>([
  {
    id: 4001,
    name: 'Nike Air Force 1 ’07',
    desc: 'White',
    price: 3290,
    sold: '15.4K',
    tag: 'Popular',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/nike-air-force-1-07-white-1.jpg',
    sizes: [
      { label: 'US 6', price: 3200 },
      { label: 'US 7', price: 3290 },
      { label: 'US 8', price: 3290 },
      { label: 'US 9', price: 3390 },
      { label: 'US 10', price: 3490 },
      { label: 'US 11', price: 3490, available: false },
    ],
  },
  {
    id: 4002,
    name: 'Medicom Toy',
    desc: 'BE@RBRICK Iron Man Mark 50 400％ + 100％',
    price: 6590,
    sold: '8.2K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/be-rbrick-iron-man-mark-50-400----100--1.jpg',
  },
  {
    id: 4003,
    name: 'Adidas Samba OG',
    desc: 'Cloud White/Core Black',
    price: 1579,
    sold: '80.4K',
    tag: 'Trending',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/adidas-samba-og-cloud-white-core-black-1.jpg',
    sizes: [
      { label: 'US 4.5', price: 2400 },
      { label: 'US 5', available: false },
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
      { label: 'US 11', price: 3199 },
      { label: 'US 14', price: 4590 },
      { label: 'US 15', price: 4815 },
    ],
  },
  {
    id: 4004,
    name: 'Vivienne Westwood',
    desc: 'Man Mini Bas Relief Orb Pendant In Gold-tone Hardware',
    price: 5290,
    sold: '1.6K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/vivienne-westwood-man-mini-bas-relief-orb-pendant-in-gold-tone-hardware-1.jpg',
  },
  {
    id: 4005,
    name: 'Pop Mart',
    desc: 'Repair Man (The Monsters X Kow Yokoyama Ma.K.Series) Secret',
    price: 2890,
    sold: '3.9K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/pop-mart-repair-man--the-monsters-x-kow-yokoyama-ma-k-series--secret-1.jpg',
  },
])

const recommended = ref<Product[]>([
  {
    id: 4101,
    name: 'New Balance 990v5',
    desc: 'Grey',
    price: 7290,
    sold: '2.5K',
    tag: 'Comfort',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/new-balance-990v5-grey-1.jpg',
    sizes: [
      { label: 'US 7', price: 7290 },
      { label: 'US 8', price: 7390 },
      { label: 'US 9', price: 7390 },
      { label: 'US 10', price: 7490 },
    ],
  },
  {
    id: 4102,
    name: 'Pop Mart',
    desc: 'Mega Space Molly 400% Lala Company Durian Man',
    price: 6590,
    sold: '1.1K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/pm-fgcpmmsm4lcdmwa1c-pop-mart-mega-space-molly-400-lala-company-durian-man-1.jpg',
  },
])

const trending = ref<Product[]>([
  {
    id: 4201,
    name: 'Jordan 1 Low OG SP',
    desc: 'Travis Scott Medium Olive',
    price: 17982,
    tag: 'Trending',
    sold: '1.4K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/jordan-1-low-og-sp-x-travis-scott-medium-olive-1.jpg',
    sizes: [
      { label: 'US 7', price: 17800 },
      { label: 'US 8', price: 17982 },
      { label: 'US 9', price: 18200 },
    ],
  },
  {
    id: 4202,
    name: 'Stussy Basic Tee',
    desc: 'Pigment Dyed Black',
    price: 2149,
    sold: '2.9K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/stussy-8-ball-tee-pigment-dyed-black-1.jpg',
  },
])

// ใช้ filter section แรกด้วย q
const filteredLatest = computed(() =>
  latest.value.filter(
    (i) =>
      i.name.toLowerCase().includes(q.value.toLowerCase()) ||
      i.desc.toLowerCase().includes(q.value.toLowerCase()),
  ),
)

// รวมของทุก section สำหรับ search overlay
const allItems = computed(() => [...latest.value, ...recommended.value, ...trending.value])

const searchResults = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return allItems.value.slice(0, 6)
  return allItems.value.filter(
    (item) => item.name.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term),
  )
})

// ฟังก์ชัน search
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

// ---------- Modal state / logic ----------
const showModal = ref(false)
const selected = ref<Product | null>(null)
const selectedSize = ref<string | null>(null)

function openProduct(item: Product) {
  selected.value = item
  showModal.value = true
  selectedSize.value = null
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  selected.value = null
  selectedSize.value = null
  document.body.style.overflow = ''
}

function selectSize(label: string, available?: boolean) {
  if (available === false) return
  selectedSize.value = label
}

// ✅ ฟังก์ชันใหม่: เซฟลง Saved ตามราคาของ size ที่เลือก
function saveToWishlist() {
  if (!selected.value) return

  const base = selected.value
  let finalPrice = base.price

  if (selectedSize.value && base.sizes?.length) {
    const found = base.sizes.find((s) => s.label === selectedSize.value)
    if (found?.price) {
      finalPrice = found.price
    }
  }

  toggle({
    ...base,
    price: finalPrice,
    chosenSize: selectedSize.value || '',
  } as any)
}

// ปิดด้วย ESC ทั้ง modal และ search overlay
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (showModal.value) closeModal()
    if (showSearchPanel.value) closeSearch()
  }
}
</script>

<style scoped>
/* ===== Layout/Style เดิม ===== */
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
  padding: 0.75rem 2.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  gap: 2.5rem;
  width: 100%;
}
/* 1. ปรับตัวปุ่มเมนู */
.tab {
  position: relative;
  display: inline-block;
  border: none;
  background: transparent;
  font-weight: 500;
  font-size: 0.95rem;
  color: #94a3b8; /* สีเทาอ่อนลงนิดนึงเพื่อให้ตอน Active ดูเด่นขึ้น */
  cursor: pointer;
  padding-bottom: 0.6rem;
  text-decoration: none;

  /* เพิ่ม Animation ให้ตัวหนังสือ */
  transition:
    color 0.3s ease,
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 2. ตอนเอาเมาส์ชี้ หรือ เลือกอยู่: ให้ตัวหนังสือลอยขึ้นนิดนึง + สีเข้ม */
.tab:hover,
.tab.active {
  color: #0f172a; /* สีดำเข้ม */
  transform: translateY(-2px); /* ลอยขึ้น 2px */
}

/* 3. เส้นขีดเส้นใต้ (Magic Line) */
.tab::after {
  content: '';
  position: absolute;
  left: 0; /* เปลี่ยนจาก left: 50% เป็นเริ่มจากซ้าย */
  bottom: 0;
  width: 0%; /* เริ่มต้นความกว้าง 0 */
  height: 2.5px; /* ความหนาเส้น */
  background: #0f172a;
  border-radius: 4px;

  /* ใช้ cubic-bezier เพื่อให้เส้นวิ่งแบบ "วูบ...แล้วนุ่ม" (เหมือน iOS) */
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* จัดกึ่งกลางด้วยวิธี margin แทน transform เพื่อความลื่น */
  margin-left: auto;
  margin-right: auto;
  right: 0;
}

/* 4. สั่งยืดเส้นเมื่อ Active */
.tab.active::after {
  width: 100%; /* ยืดเต็ม */
}

/* (Optional) ถ้าอยากให้ตอน Hover มีเส้นโผล่มาจางๆ ด้วย ให้เพิ่มตรงนี้ */
.tab:hover::after {
  width: 30%; /* โผล่มานิดหน่อยตอนเอาเมาส์ผ่าน */
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
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08); /* ปรับเงาให้ฟุ้งขึ้นและจางลงให้นุ่มนวล */
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
/* ===== Search overlay ===== */
.search-overlay {
  position: fixed;
  inset: 72px 0 0 0; /* ใต้ topbar */
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

/* ===== Modal ===== */
.mc-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  z-index: 9999;
}
.mc-modal__panel {
  width: 90%;
  max-width: 850px;
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  position: relative;
  animation: mcModalIn 0.2s ease;
}
.mc-modal__close {
  position: absolute;
  right: 14px;
  top: 14px;
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
}
.mc-modal__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.mc-modal__image img {
  width: 100%;
  border-radius: 12px;
}
.mc-modal__title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}
.mc-modal__sub {
  color: #555;
  margin-bottom: 10px;
}
.mc-modal__meta-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}
.mc-modal__sold {
  font-size: 0.8rem;
  color: #6a7381;
}
.mc-modal__tag {
  font-size: 0.75rem;
  background: #e6f7e8;
  color: #1f8c3a;
  padding: 2px 8px;
  border-radius: 999px;
}
.mc-modal__price {
  font-size: 20px;
  font-weight: 700;
  margin-top: 8px;
  margin-bottom: 18px;
}
.mc-modal__save {
  width: 100%;
  padding: 12px;
  background: #111;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 15px;
}

/* ตารางไซซ์รองเท้า */
.mc-size {
  margin-top: 10px;
  margin-bottom: 18px;
}
.mc-size__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.mc-size__label {
  font-weight: 600;
}
.mc-size__more {
  border: none;
  background: transparent;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
}
.mc-size__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px;
}
.mc-size__item {
  border-radius: 8px;
  border: 1px solid #e2e4e7;
  padding: 6px 4px;
  background: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.15s ease;
}
.mc-size__item:hover {
  transform: scale(1.05);
}
.mc-size__item-label {
  margin-bottom: 2px;
  font-weight: 500;
  color: #6b7280;
  font-size: 12px;
}
.mc-size__item-price {
  font-size: 0.78rem;
  color: #14a44d;
  font-weight: 600;
}
.mc-size__item--disabled {
  background: #f2f3f5;
  color: #b3b6bd;
  cursor: not-allowed;
}
.mc-size__item--disabled .mc-size__item-price {
  color: #b3b6bd;
}
.mc-size__item--active {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
}

@keyframes mcModalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
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
  .mc-modal__body {
    grid-template-columns: 1fr;
  }
  .mc-size__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
