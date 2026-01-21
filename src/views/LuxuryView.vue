<template>
  <div class="page">
    <!-- Top bar -->
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหา Luxury..." v-model="q" @focus="openSearch" />
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

    <!-- Tabs -->
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

    <!-- Content -->
    <main class="content">
      <div class="container">
        <h2 class="section-title">Luxury</h2>
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

        <h2 class="section-title second">แนะนำสำหรับสาย Luxury</h2>
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

      <!-- ========= แผงค้นหา Luxury + animation ========= -->
      <transition name="search-fade">
        <div v-if="showSearchPanel" class="search-overlay" @click.self="closeSearch">
          <div class="search-panel">
            <!-- ฝั่งซ้าย: คีย์เวิร์ดยอดนิยม -->
            <div class="search-panel__col search-panel__popular">
              <div class="sp-title">การค้นหายอดนิยม</div>
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

            <!-- ฝั่งขวา: สินค้าที่ match -->
            <div class="search-panel__col search-panel__results">
              <div class="sp-header-row">
                <span class="sp-title">สินค้าแนะนำ</span>
                <button class="sp-see-all" type="button">ดูทั้งหมด</button>
              </div>

              <div v-if="searchResults.length === 0" class="sp-empty">ไม่พบสินค้าในคำค้นนี้</div>

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
      <!-- ========= /แผงค้นหา ========= -->

      <!-- ========= โมดัลรายละเอียดสินค้า ========= -->
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

              <!-- แสดง size เฉพาะสินค้าที่ควรมีไซซ์ (เสื้อ / hoodie) -->
              <div v-if="showSizeSection" class="mc-modal__sizeblock">
                <div class="mc-modal__sizehead">
                  <span>size</span>
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
})

// ===== Search state =====
const q = ref('')
const showSearchPanel = ref(false)

const popularKeywords = ['Louis Vuitton', 'Gucci', 'Dior', 'Chanel', 'Balenciaga']

// default size เสื้อ / hoodie
const defaultSizes: SizeOpt[] = [
  { label: 'XS', price: 10900 },
  { label: 'S', price: 10900 },
  { label: 'M', price: 10900 },
  { label: 'L', price: 8900 },
  { label: 'XL', price: 7900 },
  { label: 'XXL', price: 9900 },
]

/** Luxury: ล่าสุด */
const latest = ref<Product[]>([
  {
    id: 2001,
    name: 'Louis Vuitton',
    desc: 'Multiple Wallet Damier Graphite',
    price: 19890,
    sold: '900',
    tag: 'New',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/louis-vuitton-multiple-wallet-damier-graphite-1.jpg',
    noSize: true,
  },
  {
    id: 2002,
    name: 'Louis Vuitton',
    desc: 'LV Initiales 40MM Reversible Monogram Eclipse',
    price: 12990,
    sold: '500',
    tag: 'Hot',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/louis-vuitton-lv-initiales-40mm-reversible-in-monogram-eclipse-canvas-and-brass-buckle-with-shiny-dark-ruthenium-finishing-1.jpg',
    noSize: true,
  },
  {
    id: 2003,
    name: 'Chrome Hearts',
    desc: 'Horse Shoe Floral Hoodie Black',
    price: 79890,
    sold: '900',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/chrome-hearts-horse-shoe-floral-hoodie-black-1.jpg',
  },
  {
    id: 2004,
    name: 'Polo Ralph Lauren',
    desc: 'Polo Ralph Lauren The Iconic Cotton Chino Ball Cap White',
    price: 2190,
    sold: '500',
    tag: 'Hot',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/710548524001-polo-ralph-lauren-the-iconic-cotton-chino-ball-cap-white-1.jpg',
    noSize: true,
  },
  {
    id: 2005,
    name: 'Coach',
    desc: 'Nolita 19 In Signature Canvas With Gold Hardware Black Black Walnut Brown',
    price: 4250,
    sold: '800',
    tag: 'Hot',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/cw426-imxaq-coach-nolita-19-in-signature-canvas-with-gold-hardware-black-black-walnut-brown-1.jpg',
    noSize: true,
  },
  {
    id: 2006,
    name: 'Balenciaga',
    desc: 'Political Campaign T-Shirt Large Fit Black',
    price: 140709,
    sold: '250',
    tag: 'Hot',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/balenciaga-political-campaign-t-shirt-large-fit-black--1.jpg',
  },
])

/** Luxury: แนะนำ */
const recommended = ref<Product[]>([
  {
    id: 2101,
    name: 'Balenciaga',
    desc: 'Oversized Logo-Print Cotton-Jersey T-Shirt Navy',
    price: 11590,
    sold: '900',
    tag: 'Recommended',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/balenciaga-oversized-logo-print-cotton-jersey-t-shirt-navy-1.jpg',
  },
  {
    id: 2102,
    name: 'Louis Vuitton',
    desc: 'LV Initiales 40MM Reversible Monogram Eclipse',
    price: 12990,
    sold: '500',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/louis-vuitton-lv-initiales-40mm-reversible-in-monogram-eclipse-canvas-and-brass-buckle-with-shiny-dark-ruthenium-finishing-1.jpg',
    noSize: true,
  },
])

/** Luxury: มาแรง */
const trending = ref<Product[]>([
  {
    id: 2201,
    name: 'Chrome Hearts',
    desc: 'Horse Shoe Floral Hoodie Black',
    price: 79890,
    sold: '900',
    tag: 'Trending',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/chrome-hearts-horse-shoe-floral-hoodie-black-1.jpg',
  },
  {
    id: 2202,
    name: 'Louis Vuitton',
    desc: 'LV Initiales 40MM Reversible Monogram Eclipse',
    price: 12990,
    sold: '500',
    tag: 'Trending',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/louis-vuitton-lv-initiales-40mm-reversible-in-monogram-eclipse-canvas-and-brass-buckle-with-shiny-dark-ruthenium-finishing-1.jpg',
    noSize: true,
  },
])

// filter เฉพาะ section แรกด้วย field q
const filteredLatest = computed(() =>
  latest.value.filter(
    (i) =>
      i.name.toLowerCase().includes(q.value.toLowerCase()) ||
      i.desc.toLowerCase().includes(q.value.toLowerCase()),
  ),
)

// รวมสินค้าไว้ใช้ค้นหาใน overlay
const allItems = computed(() => [...latest.value, ...recommended.value, ...trending.value])

const searchResults = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) {
    return allItems.value.slice(0, 6)
  }
  return allItems.value.filter(
    (item) => item.name.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term),
  )
})

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

/* -------- โมดัล -------- */
const showModal = ref(false)
const selected = ref<Product | null>(null)
const pickedSize = ref<SizeOpt | null>(null)

const sizeOptions = computed<SizeOpt[]>(() => {
  if (!selected.value) return []
  if (selected.value.noSize) return []
  if (selected.value.sizes?.length) return selected.value.sizes
  return defaultSizes
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

// events global
onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('click', handleGlobalClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
/* ===== เดิมของหน้า Luxury (คงไว้) ===== */
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
.product-card:hover .meta {
  transform: translateY(-3px);
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

/* ===== Animation: Search overlay & panel ===== */
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
  border: 1px solid #eef0f3;
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

@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 992px) {
  .product-grid {
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
/* =================================================================
   📱 RESPONSIVE MEDIA QUERIES (สำหรับหน้า Luxury)
   (วางไว้ล่างสุดของ <style scoped> เพื่อ Override ค่าเดิม)
   ================================================================= */

/* --- Tablet & Laptop เล็ก (max-width: 1300px) --- */
@media (max-width: 1300px) {
  .page {
    width: 100%; /* ยกเลิกความกว้าง 150vh */
    margin-left: 0; /* ยกเลิก margin ติดลบ */
    overflow-x: hidden;
  }

  .tabs {
    margin-left: 0; /* ยกเลิก margin ติดลบของ tabs */
    justify-content: flex-start;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    overflow-x: auto; /* ให้สไลด์แนวนอนได้ */
  }
}

/* --- Mobile (max-width: 768px) --- */
@media (max-width: 768px) {
  /* 1. Header: ปรับโครงสร้างใหม่ */
  .topbar {
    height: auto;
    flex-wrap: wrap;
    padding: 10px 1rem;
    gap: 10px;
  }

  .brand {
    order: 1; /* โลโก้อยู่ซ้ายบน */
  }

  .actions {
    position: static; /* ยกเลิก absolute positioning */
    order: 2; /* ไอคอนอยู่ขวาบน */
    margin-left: auto;
    gap: 1rem;
  }

  /* ช่องค้นหา: ลงมาบรรทัดใหม่ เต็มความกว้าง */
  .search {
    position: static;
    transform: none;
    order: 3;
    width: 100%;
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

  /* 2. Tabs: ทำให้เลื่อนได้ */
  .tabs {
    margin-top: 110px; /* เว้นที่ให้ Header ที่สูงขึ้น */
    gap: 1.5rem;
    padding-bottom: 5px;
    /* ซ่อน Scrollbar */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }

  .tab {
    flex-shrink: 0;
    font-size: 0.9rem;
  }

  /* 3. Layout สินค้า */
  .content {
    padding: 1rem 0 4rem;
  }
  .container {
    padding: 0 1rem;
  }

  /* Grid สินค้า: บังคับ 2 คอลัมน์บนมือถือ */
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
  }

  /* ปรับการ์ดสินค้า */
  .thumb {
    height: 140px;
  }
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
  .wish {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }

  /* 4. Modal: ปรับเป็นแนวตั้ง */
  .mc-modal__panel {
    width: 95vw;
    margin: 10px;
  }

  .mc-modal__body {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 20px;
  }

  .mc-modal__image {
    border-right: none;
    border-bottom: 1px solid #eef0f3;
    padding-bottom: 15px;
    padding-right: 0;
  }

  .mc-modal__sizegrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
