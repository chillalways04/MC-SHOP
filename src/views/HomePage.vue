<template>
  <div class="page">
    <!-- Top bar -->
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          placeholder="ค้นหาสินค้าตามแบรนด์, ชื่อรุ่น หรือ ชื่อสินค้า"
          v-model="q"
          @focus="openSearch"
        />
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
            <router-link to="/profile" class="menu-link"> โปรไฟล์ </router-link>
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
      <!-- หัวข้อ 1 -->
      <h2 class="section-title">สินค้าที่ดูล่าสุด</h2>
      <div class="product-grid">
        <article
          v-for="item in products"
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
              <button class="wish" :class="{ liked: isSaved(item.id) }" @click.stop="toggle(item)">
                {{ isSaved(item.id) ? '❤️' : '♡' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- หัวข้อ 2 -->
      <h2 class="section-title second">สินค้าแนะนำ</h2>
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
              <button class="wish" :class="{ liked: isSaved(item.id) }" @click.stop="toggle(item)">
                {{ isSaved(item.id) ? '❤️' : '♡' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- หัวข้อ 3 -->
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
              <button class="wish" :class="{ liked: isSaved(item.id) }" @click.stop="toggle(item)">
                {{ isSaved(item.id) ? '❤️' : '♡' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- ========= แผงค้นหา ========= -->
      <transition name="search-fade">
        <div v-if="showSearchPanel" class="search-overlay" @click.self="closeSearch">
          <div class="search-panel">
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

      <!-- ================= Modal ================= -->
      <div v-if="showModal && selected" class="mc-modal__backdrop" @click.self="closeModal">
        <div class="mc-modal__panel" role="dialog" aria-modal="true">
          <button class="mc-modal__close" @click="closeModal">✕</button>

          <div class="mc-modal__body">
            <!-- ซ้าย: รูป -->
            <div class="mc-modal__image">
              <img :src="selected.image" :alt="selected.name" />
            </div>

            <!-- ขวา: รายละเอียด -->
            <div class="mc-modal__info">
              <h3 class="mc-modal__title">{{ selected.name }}</h3>
              <p class="mc-modal__sub">{{ selected.desc }}</p>

              <!-- Section size: แสดงเฉพาะสินค้า ที่ควรมีไซซ์ -->
              <div v-if="showSizeSection" class="mc-modal__sizeblock">
                <div class="mc-modal__sizehead">
                  <span>Size</span>
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
      <!-- =============== /Modal =============== -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useWishlist } from '../router/useWishlist'

interface SizeOption {
  label: string
  price: number
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
  noSize?: boolean
}

const { toggle, isSaved } = useWishlist()

// dropdown avatar
const showMenu = ref(false)
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Tabs
const tabs = [
  { label: 'สำหรับคุณ', to: '/home' },
  { label: 'Streetwear', to: '/streetwear' },
  { label: 'Luxury', to: '/luxury' },
  { label: 'ของสะสม', to: '/collectibles' },
  { label: 'ผู้ชาย', to: '/men' },
  { label: 'ผู้หญิง', to: '/women' },
]

// ===== Search state =====
const q = ref('')
const showSearchPanel = ref(false)

const popularKeywords = ['pokemon', 'nike dunk', 'human made', 'chromes heart', 'new balance']

// เสื้อ: XS - XXL
const defaultClothSizes: SizeOption[] = [
  { label: 'XS', price: 10900 },
  { label: 'S', price: 10900 },
  { label: 'M', price: 10900 },
  { label: 'L', price: 8900 },
  { label: 'XL', price: 7900 },
  { label: 'XXL', price: 9900 },
]

// รองเท้า US
const shoeSizes: SizeOption[] = [
  { label: 'US 3.5', price: 2400 },
  { label: 'US 4', price: 2400 },
  { label: 'US 4.5', price: 2400 },
  { label: 'US 5', price: 2400 },
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

// ----- ข้อมูลสินค้า -----

const products = ref<Product[]>([
  {
    id: 1,
    name: 'adidas',
    desc: 'adidas Samba OG Cloud White Core Black',
    price: 1579,
    tag: 'Trending',
    sold: '80.4K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/adidas-samba-og-cloud-white-core-black-1.jpg',
    sizes: shoeSizes,
  },
  {
    id: 2,
    name: 'Human Made',
    desc: 'human made x Pokemon Tee White Blue',
    price: 7592,
    sold: '1.4K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/hm-tsahmxppmgtswb-human-made-x-pokemon-pokemon-made-graphic-t-shirt-white-blue-1.jpg',
  },
  {
    id: 3,
    name: 'Human Made',
    desc: 'human made x Pokemon Tee White Blue',
    price: 7592,
    sold: '1.4K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/hm-tsahmxppmgtswo-human-made-x-pokemon-pokemon-made-graphic-t-shirt-white-orange-1.jpg',
  },
  {
    id: 4,
    name: 'Stussy',
    desc: 'Stussy Basic Stussy Black',
    price: 1982,
    tag: 'Trending',
    sold: '1.4K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/stussy-basic-stussy-tee-pigment-dyed-black-1.jpg',
  },
  {
    id: 5,
    name: 'Human Made',
    desc: 'human made x Pokemon Tee White Blue',
    price: 7592,
    sold: '1.4K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/hm-tsahmxppmgtswg-human-made-x-pokemon-pokemon-made-graphic-t-shirt-white-grey-1.jpg',
  },
  {
    id: 6,
    name: 'Jordan',
    desc: 'Jordan 1 Retro Low OG SP Travis Scott Medium Olive',
    price: 17982,
    tag: 'Trending',
    sold: '1.4K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/jordan-1-low-og-sp-x-travis-scott-medium-olive-1.jpg',
    sizes: shoeSizes,
  },
  {
    id: 7,
    name: 'Jordan',
    desc: 'Jordan 1 Retro Low OG SP Fragment x Travis Scott',
    price: 41120,
    tag: 'Trending',
    sold: '1.9K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/jordan-1-low-fragment-design-x-travis-scott-1.jpg',
    sizes: shoeSizes,
  },
  {
    id: 8,
    name: 'Polo Ralph Lauren ',
    desc: 'Polo Ralph Lauren The Iconic Cotton Chino Ball Cap Copper Brown',
    price: 2160,
    sold: '1.7K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/710825442004-polo-ralph-lauren-the-iconic-cotton-chino-ball-cap-copper-brown-1.jpg',
    noSize: true,
  },
  {
    id: 9,
    name: 'Pop Mart',
    desc: 'Pop Mart Mega Royal Molly 1000% Harry Potter',
    price: 35844,
    sold: '2K',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/pm-fgcpmmrm1hp-pop-mart-mega-royal-molly-1000-harry-potter-1.jpg',
    noSize: true,
  },
  {
    id: 10,
    name: 'Stussy',
    desc: 'Stussy 8 Ball Tee Pigment Dyed Black',
    price: 2149,
    sold: '2.9K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/stussy-8-ball-tee-pigment-dyed-black-1.jpg',
  },
])

const recommended = ref<Product[]>([
  {
    id: 101,
    name: 'Nike',
    desc: 'Nike Dunk Low Retro White Black Panda',
    price: 4590,
    tag: 'Trending',
    sold: '13.6K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/nike-dunk-low-retro-white-black--2021--1.jpg',
    sizes: shoeSizes,
  },
  {
    id: 102,
    name: 'Louis Vuitton',
    desc: 'by Salehe Bembury',
    price: 19890,
    sold: '900',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/louis-vuitton-multiple-wallet-damier-graphite-1.jpg',
    noSize: true,
  },
  {
    id: 103,
    name: 'Louis Vuitton',
    desc: 'Louis Vuitton LV Initiales 40MM',
    price: 12990,
    sold: '500',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/louis-vuitton-lv-initiales-40mm-reversible-in-monogram-eclipse-canvas-and-brass-buckle-with-shiny-dark-ruthenium-finishing-1.jpg',
    noSize: true,
  },
  {
    id: 104,
    name: 'Chrome Hearts',
    desc: 'Chrome Hearts Horse Shoe Floral Hoodie Black',
    price: 79890,
    sold: '900',
    image:
      'https://d2cva83hdk3bwc.cloudfront.net/chrome-hearts-horse-shoe-floral-hoodie-black-1.jpg',
  },
])

const trending = ref<Product[]>([
  {
    id: 201,
    name: 'New Balance 550',
    desc: 'White Green',
    price: 4890,
    tag: 'Trending',
    sold: '8.5K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/new-balance-550-white-green-1.jpg',
    sizes: shoeSizes,
  },
  {
    id: 202,
    name: 'New Balance',
    desc: 'FW23 Black Edition',
    price: 11500,
    tag: 'Trending',
    sold: '3.2K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/new-balance-530-white-silver-navy-1.jpg',
    sizes: shoeSizes,
  },
  {
    id: 203,
    name: 'Yeezy Slide',
    desc: 'Bone (2022 Restock)',
    price: 4990,
    tag: 'Trending',
    sold: '12.1K',
    image: 'https://d2cva83hdk3bwc.cloudfront.net/yeezy-slide-bone-1.jpg',
    sizes: shoeSizes,
  },
])

// รวมสินค้าทุก section สำหรับค้นหา
const allItems = computed(() => [...products.value, ...recommended.value, ...trending.value])

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

// ---------------- Modal state & logic ----------------
const showModal = ref(false)
const selected = ref<Product | null>(null)
const pickedSize = ref<SizeOption | null>(null)

const sizeOptions = computed<SizeOption[]>(() => {
  if (!selected.value) return []
  if (selected.value.noSize) return []
  if (selected.value.sizes && selected.value.sizes.length) return selected.value.sizes
  return defaultClothSizes
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

function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (showModal.value) closeModal()
    if (showSearchPanel.value) closeSearch()
  }
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

onMounted(() => {
  window.addEventListener('keydown', handleKey)
  window.addEventListener('click', handleGlobalClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
  window.removeEventListener('click', handleGlobalClick)
})
const userInitial = ref('N')

onMounted(() => {
  const email = localStorage.getItem('userEmail') || ''
  if (email) {
    userInitial.value = email.charAt(0).toUpperCase()
  }
})
</script>

<style scoped>
/* ====== สไตล์เดิมของหน้า ====== */
.page {
  min-height: 100vh;
  background: #eef0f3;
  width: 150vh;
  margin-left: -90px;
}
.topbar {
  height: 72px;
  width: 100%;
  background: #ffffff;
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
.search input {
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  font-size: 0.9rem;
}
.search-icon {
  font-size: 1.15rem;
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
  transform: scale(1.3);
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
.user-menu ul li.logout {
  color: #ef4444;
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
  padding: 1.5rem 2.5rem 3rem;
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

/* ===== Modal ===== */
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
  opacity: 0.9;
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
  box-shadow: 0 0 0 1px #10b981;
}
.mc-sizebtn__label {
  font-size: 12px;
  color: #6b7280;
}
.mc-sizebtn__price {
  font-size: 13px;
  color: #16a34a;
  font-weight: 650;
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

/* ===== Animation: Search overlay & panel ===== */
/* 1. จัดการตัวพื้นหลัง (สีดำจางๆ) */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.3s ease; /* ปรับเวลาความเร็วพื้นหลังตรงนี้ */
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

/* 2. จัดการตัวกล่อง Search Panel (ให้เลื่อนและจาง) */
/* ต้องเพิ่ม transition ให้ตัว panel ด้วย เพื่อให้มันขยับ */
.search-fade-enter-active .search-panel,
.search-fade-leave-active .search-panel {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); /* เอฟเฟกต์เด้งออกแบบนุ่มนวล */
}

/* ตอนเริ่มเข้า (Start) */
.search-fade-enter-from .search-panel {
  transform: translateY(-20px) scale(0.98); /* เริ่มต้น: ลอยขึ้นนิดนึง + เล็กกว่าปกติ */
  opacity: 0;
}

/* ตอนจบ (End) - คือสถานะปกติใน class .search-panel */
.search-fade-enter-to .search-panel {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* ตอนกำลังจะปิด (Leave) */
.search-fade-leave-from .search-panel {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.search-fade-leave-to .search-panel {
  transform: translateY(-20px) scale(0.98); /* จบ: ลอยกลับขึ้นไป + เล็กลง */
  opacity: 0;
}
.logout {
  /*
  padding: 8px 6px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  */
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
  color: #d11e11; /* สีตอน hover */
  transform: scale(1.03);
  font-weight: 800;
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
   📱 RESPONSIVE MEDIA QUERIES
   (วางไว้ล่างสุดของ <style scoped> เพื่อ Override ค่าเดิม)
   ================================================================= */

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
