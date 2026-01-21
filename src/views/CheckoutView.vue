<template>
  <div class="page-wrapper">
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
        <h1 class="page-title">Checkout</h1>

        <div class="checkout-layout">
          <section class="left-col">
            <section class="card shipping-card">
              <div class="card-header">
                <div class="card-title-row">
                  <span class="icon-loc">📍</span>
                  <span class="card-title">Shipping address</span>
                </div>

                <div class="card-actions" v-if="selectedAddress">
                  <span v-if="selectedAddress.isDefault" class="badge-primary">ค่าเริ่มต้น</span>
                  <button
                    type="button"
                    class="btn-link"
                    @click="showAddressPicker = !showAddressPicker"
                  >
                    เปลี่ยน
                  </button>
                </div>
              </div>

              <div v-if="!selectedAddress" class="shipping-empty">
                <p>ยังไม่มีที่อยู่จัดส่ง</p>
                <router-link to="/address/new" class="btn-outline"
                  >เพิ่มที่อยู่สำหรับจัดส่ง</router-link
                >
              </div>

              <div v-else class="shipping-body">
                <div class="shipping-name-line">
                  <span class="shipping-name">{{ selectedAddress.fullName }}</span>
                  <span class="shipping-phone">{{ selectedAddress.phone }}</span>
                </div>
                <p class="shipping-address-text">
                  {{ selectedAddress.addressLine }}, {{ selectedAddress.subdistrict }},
                  {{ selectedAddress.district }}, {{ selectedAddress.province }},
                  {{ selectedAddress.postcode }}
                </p>
                <p class="shipping-note">ใช้ที่อยู่นี้สำหรับการจัดส่งคำสั่งซื้อของคุณ</p>
              </div>

              <div v-if="showAddressPicker && addresses.length" class="address-picker">
                <h3 class="picker-title">เลือกที่อยู่จัดส่ง</h3>
                <div
                  v-for="addr in addresses"
                  :key="addr.id"
                  class="address-option"
                  :class="{ active: addr.id === selectedAddressId }"
                  @click="chooseAddress(addr.id)"
                >
                  <div class="option-radio">
                    <span class="radio-outer">
                      <span v-if="addr.id === selectedAddressId" class="radio-inner"></span>
                    </span>
                  </div>
                  <div class="option-content">
                    <div class="option-top">
                      <span class="option-name">{{ addr.fullName }}</span>
                      <span class="option-phone">{{ addr.phone }}</span>
                      <span v-if="addr.isDefault" class="badge-soft">ค่าเริ่มต้น</span>
                    </div>
                    <div class="option-address">
                      {{ addr.addressLine }}, {{ addr.subdistrict }}, {{ addr.district }},
                      {{ addr.province }},
                      {{ addr.postcode }}
                    </div>
                  </div>
                </div>

                <router-link to="/address/new" class="btn-small-add">
                  + เพิ่มที่อยู่ใหม่
                </router-link>
              </div>
            </section>

            <section class="card payment-card">
              <h2 class="card-title payment-title">Payment Method</h2>

              <div
                class="pm-option"
                :class="{ active: paymentMethod === 'card' }"
                @click="paymentMethod = 'card'"
              >
                <span class="pm-radio">
                  <span class="radio-outer">
                    <span v-if="paymentMethod === 'card'" class="radio-inner"></span>
                  </span>
                </span>
                <span class="pm-label">Credit Card / Debit card</span>
              </div>

              <div
                class="pm-option"
                :class="{ active: paymentMethod === 'bank' }"
                @click="paymentMethod = 'bank'"
              >
                <span class="pm-radio">
                  <span class="radio-outer">
                    <span v-if="paymentMethod === 'bank'" class="radio-inner"></span>
                  </span>
                </span>
                <span class="pm-label">Mobile Banking</span>
              </div>

              <div
                class="pm-option"
                :class="{ active: paymentMethod === 'paypal' }"
                @click="paymentMethod = 'paypal'"
              >
                <span class="pm-radio">
                  <span class="radio-outer">
                    <span v-if="paymentMethod === 'paypal'" class="radio-inner"></span>
                  </span>
                </span>
                <span class="pm-label">PayPal</span>
              </div>

              <div
                class="pm-option"
                :class="{ active: paymentMethod === 'promptpay' }"
                @click="paymentMethod = 'promptpay'"
              >
                <span class="pm-radio">
                  <span class="radio-outer">
                    <span v-if="paymentMethod === 'promptpay'" class="radio-inner"></span>
                  </span>
                </span>
                <span class="pm-label">PromptPay</span>
              </div>

              <div
                class="pm-option"
                :class="{ active: paymentMethod === 'cod' }"
                @click="paymentMethod = 'cod'"
              >
                <span class="pm-radio">
                  <span class="radio-outer">
                    <span v-if="paymentMethod === 'cod'" class="radio-inner"></span>
                  </span>
                </span>
                <span class="pm-label">Cash on Delivery</span>
              </div>

              <div v-if="paymentMethod === 'cod'" class="pm-note cod-note">
                ชำระเป็นเงินสดเมื่อสินค้าจัดส่งถึงปลายทาง กรุณาเตรียมเงินให้พอดีกับยอดชำระ
              </div>
              <div v-if="paymentMethod === 'paypal'" class="pm-note paypal-note bottom-note">
                คุณจะถูกส่งต่อไปยัง PayPal เพื่อดำเนินการชำระเงินให้เสร็จสิ้นหลังจากส่งคำสั่งซื้อ
              </div>

              <div v-if="paymentMethod === 'card'" class="card-form">
                <div class="form-row">
                  <label>Card number</label>
                  <input type="text" placeholder="1234 4567 7895" />
                </div>
                <div class="form-row">
                  <label>Card Holder</label>
                  <input type="text" placeholder="Nattawat Sapmee" />
                </div>
                <div class="form-row two-col">
                  <div>
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label>CVV</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
              </div>
            </section>
          </section>

          <aside class="right-col">
            <section class="card summary-card">
              <h2 class="card-title">Order Summary</h2>

              <div v-if="cartItems.length" class="summary-product">
                <div class="summary-thumb">
                  <img :src="cartItems[0].image" :alt="cartItems[0].name" />
                </div>
                <div class="summary-meta">
                  <div class="summary-name">{{ cartItems[0].name }}</div>
                  <div class="summary-sub">
                    ฿{{ formatNumber(cartItems[0].unitPrice) }} × {{ cartItems[0].quantity }}
                  </div>
                </div>
                <div class="summary-line-price">฿{{ formatNumber(itemTotal(cartItems[0])) }}</div>
              </div>

              <div class="summary-list">
                <div class="summary-row">
                  <span>ราคาสินค้า</span>
                  <span>฿{{ formatNumber(subtotal) }}</span>
                </div>
                <div class="summary-row">
                  <span>ค่าจัดส่ง</span>
                  <span class="free">Free</span>
                </div>
                <div class="summary-row">
                  <span>Tax/Vat ({{ (taxRate * 100).toFixed(0) }}%)</span>
                  <span>฿{{ formatNumber(taxAmount) }}</span>
                </div>
                <div class="divider"></div>
                <div class="summary-row total-row">
                  <span>ยอดรวมสุทธิ รวมทุกภาษีแล้ว</span>
                  <span class="total-price">฿{{ formatNumber(grandTotal) }}</span>
                </div>
              </div>

              <button class="pay-btn" @click="placeOrder">ดำเนินการชำระเงิน</button>
              <p class="summary-note">ดำเนินการชำระเงินถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขของเรา</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2' // ✅ 1. Import SweetAlert2

const router = useRouter()

// ✅ 2. Config Toast
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

interface Address {
  id: number
  userId: number | null
  fullName: string
  phone: string
  addressLine: string
  province: string
  district: string
  subdistrict: string
  postcode: string
  isDefault: boolean
}

interface CartItem {
  id: number
  name: string
  unitPrice: number
  quantity: number
  image: string
  brand?: string
}

interface OrderItem extends CartItem {}

interface Order {
  id: string
  createdAt: string
  status: 'Paid' | 'WaitingPayment'
  total: number
  paymentMethod: 'card' | 'bank' | 'paypal' | 'promptpay' | 'cod'
  items: OrderItem[]
  shippingAddress: Address
}

const addresses = ref<Address[]>([])
const selectedAddressId = ref<number | null>(null)
const showAddressPicker = ref(false)

const cartItems = ref<CartItem[]>([])
const taxRate = 0.07

// avatar
const showMenu = ref(false)
const userInitial = ref('N')

const paymentMethod = ref<'card' | 'bank' | 'paypal' | 'promptpay' | 'cod'>('card')

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

// address ที่ถูกเลือก
const selectedAddress = computed(
  () => addresses.value.find((a) => a.id === selectedAddressId.value) || null,
)

async function loadAddresses() {
  try {
    let userId: number | null = null
    const rawUser = localStorage.getItem('user')
    if (rawUser) {
      const u = JSON.parse(rawUser)
      if (u && typeof u.id === 'number') userId = u.id
    }

    let url = 'http://localhost:3000/addresses'
    if (userId !== null) {
      url += `?userId=${userId}`
    }

    const res = await fetch(url)
    const data = (await res.json()) as Address[]
    addresses.value = data

    if (addresses.value.length) {
      const savedId = localStorage.getItem('checkoutAddressId')
      const savedIdNum = savedId ? Number(savedId) : null
      if (savedIdNum && addresses.value.some((a) => a.id === savedIdNum)) {
        selectedAddressId.value = savedIdNum
      } else {
        const def = addresses.value.find((a) => a.isDefault)
        selectedAddressId.value = def ? def.id : addresses.value[0].id
      }
    } else {
      selectedAddressId.value = null
    }
  } catch (err) {
    console.error('โหลดที่อยู่ไม่สำเร็จ', err)
  }
}

function chooseAddress(id: number) {
  selectedAddressId.value = id
  localStorage.setItem('checkoutAddressId', String(id))
  showAddressPicker.value = false
}

// cart
function loadCart() {
  const raw = localStorage.getItem('cart')
  const stored = raw ? JSON.parse(raw) : []
  cartItems.value = stored.map((i: any) => ({
    id: i.id,
    name: i.name,
    unitPrice: i.price,
    quantity: i.quantity,
    image: i.image,
    brand: i.brand,
  }))
}

const itemTotal = (item: CartItem) => item.unitPrice * item.quantity
const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + itemTotal(item), 0))
const taxAmount = computed(() => subtotal.value * taxRate)
const grandTotal = computed(() => subtotal.value + taxAmount.value)

function formatNumber(v: number): string {
  return v.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** 🔹 ฟังก์ชันสร้างคำสั่งซื้อแล้วเซฟลง localStorage */
function createOrder(status: Order['status']): string | null {
  if (!selectedAddress.value || !cartItems.value.length) return null

  const orderId = `ORD-${Date.now()}`

  const order: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    status,
    total: grandTotal.value,
    paymentMethod: paymentMethod.value,
    items: cartItems.value.map((c) => ({ ...c })),
    shippingAddress: selectedAddress.value,
  }

  const raw = localStorage.getItem('orders')
  const list: Order[] = raw ? JSON.parse(raw) : []
  list.push(order)
  localStorage.setItem('orders', JSON.stringify(list))

  // เก็บไว้ให้หน้า Order Confirmed ใช้
  localStorage.setItem('lastOrderId', orderId)
  localStorage.setItem('lastGrandTotal', String(grandTotal.value))

  return orderId
}

/** ✅ ฟังก์ชันกด “ดำเนินการชำระเงิน” */
function placeOrder() {
  if (!selectedAddress.value) {
    // ❌ ใช้ Toast แทน Alert
    Toast.fire({
      icon: 'warning',
      title: 'ข้อมูลไม่ครบ',
      text: 'กรุณาเลือกที่อยู่สำหรับจัดส่ง',
    })
    return
  }
  if (!cartItems.value.length) {
    Toast.fire({
      icon: 'warning',
      title: 'ตะกร้าว่างเปล่า',
      text: 'กรุณาเลือกสินค้าก่อนชำระเงิน',
    })
    return
  }

  // ถ้าเป็น PromptPay ยังไม่จ่าย → WaitingPayment
  const status: Order['status'] = paymentMethod.value === 'promptpay' ? 'WaitingPayment' : 'Paid'

  const orderId = createOrder(status)
  if (!orderId) return

  // เคลียร์ตะกร้า
  localStorage.removeItem('cart')
  cartItems.value = []

  // ✅ แจ้งเตือนก่อนเปลี่ยนหน้า
  Toast.fire({
    icon: 'success',
    title: 'สร้างคำสั่งซื้อสำเร็จ',
    text: 'กำลังดำเนินการ...',
  })

  // หน่วงเวลานิดนึงค่อยเปลี่ยนหน้า
  setTimeout(() => {
    if (paymentMethod.value === 'promptpay') {
      router.push('/promptpay')
    } else {
      router.push('/order-confirmed')
    }
  }, 1000)
}

onMounted(() => {
  const email = localStorage.getItem('userEmail') || ''
  if (email) userInitial.value = email.charAt(0).toUpperCase()

  loadAddresses()
  loadCart()
  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
.page-wrapper {
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
  text-decoration: none;
}
.logout:hover {
  color: #d11e11;
  transform: scale(1.03);
  font-weight: 800;
}

/* layout */
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
  margin-bottom: 24px;
}
.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(360px, 1fr);
  gap: 24px;
  align-items: flex-start;
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.right-col {
  width: 100%;
}

/* card */
.card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
  padding: 30px 28px 18px;
}
.card-title {
  font-size: 25px;
  font-weight: 700;
}

/* Shipping card */
.shipping-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-loc {
  font-size: 22px;
}
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-link {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #0f8df2;
  cursor: pointer;
}
.badge-primary {
  background: #e0efff;
  color: #0f8df2;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}
.shipping-empty {
  padding: 10px 0 4px;
}
.btn-outline {
  display: inline-block;
  margin-top: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #0f8df2;
  color: #0f8df2;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}
.shipping-body {
  padding-top: 6px;
}
.shipping-name-line {
  display: flex;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 18px;
}
.shipping-address-text {
  font-size: 18px;
  color: #4b5563;
  font-weight: 600;
}
.shipping-note {
  margin-top: 4px;
  font-size: 15px;
  color: #9ca3af;
}

/* address picker */
.address-picker {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}
.picker-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.address-option {
  display: flex;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 6px;
  cursor: pointer;
  background: #f9fafb;
}
.address-option.active {
  border-color: #0f8df2;
  box-shadow: 0 0 0 1px rgba(15, 141, 242, 0.2);
  background: #eef5ff;
}
.option-radio {
  padding-top: 4px;
}
.radio-outer {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid #cbd5e1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.radio-inner {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #0f8df2;
}
.option-content {
  flex: 1;
}
.option-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}
.option-name {
  font-weight: 600;
  font-size: 14px;
}
.option-phone {
  font-size: 13px;
  color: #6b7280;
}
.badge-soft {
  background: #e5f0ff;
  color: #0f8df2;
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
}
.option-address {
  font-size: 13px;
  color: #4b5563;
}
.btn-small-add {
  margin-top: 4px;
  display: inline-block;
  font-size: 13px;
  color: #0f8df2;
  text-decoration: none;
  font-weight: 600;
}

/* Payment method */
.payment-title {
  margin-bottom: 12px;
}
.pm-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  background: #f9fafb;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}
.pm-option.active {
  background: #eaf3ff;
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.15);
  transform: scale(1.03);
}

.pm-label {
  font-size: 15px;
  font-weight: 600;
}
.pm-radio {
  display: flex;
  align-items: center;
}
.card-form {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}
.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 9px;
  gap: 4px;
}
.form-row label {
  font-size: 14px;
  font-weight: 600;
}
.form-row input {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 10px 14px;
  font-size: 14px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

.form-row input:hover {
  border-color: #cbd5e1;
}

.form-row input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.18);
  transform: scale(1.01);
}
.form-row.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-row.two-col > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Summary */
.summary-card .card-title {
  margin-bottom: 15px;
}
.summary-product {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 10px;
  margin-bottom: 14px;
}
.summary-thumb img {
  width: 76px;
  height: 76px;
  border-radius: 10px;
  object-fit: cover;
}
.summary-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.summary-name {
  font-size: 17px;
  font-weight: 600;
}
.summary-sub {
  font-size: 16px;
  color: #6b7280;
  font-weight: 600;
}
.summary-line-price {
  font-size: 14px;
  font-weight: 700;
  text-align: right;
  margin-top: 15px;
}
.summary-list {
  font-size: 18px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 600;
}
.free {
  color: #16a34a;
  font-weight: 600;
}
.divider {
  border-top: 1px solid #e5e7eb;
  margin: 6px 0;
}
.total-row {
  font-weight: 700;
}
.total-price {
  font-size: 18px;
}
.pay-btn {
  width: 100%;
  margin-top: 12px;
  border-radius: 999px;

  border: 1px solid rgba(204, 223, 250, 0.45);
  background: rgba(71, 140, 243, 0.25);
  color: #1839cc;

  padding: 17px 16px;
  font-size: 17px;
  font-weight: 600;

  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.25);
  transition: all 0.25s ease;
}

.pay-btn:hover {
  background: rgba(13, 110, 253, 0.35);
  transform: scale(1.05);
  box-shadow: 0 6px 28px rgba(13, 110, 253, 0.35);
}

.summary-note {
  margin-top: 15px;
  font-size: 15px;
  color: #6b7280;
}
.pm-note {
  margin-top: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 600;
}

.cod-note {
  background: #ecfdf3;
  color: #166534;
}
.pm-note {
  margin-top: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.45;
}

.paypal-note {
  background: #eff6ff;
  color: #1d4ed8;
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

@media (max-width: 960px) {
  .container {
    padding: 0 1.25rem;
  }
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>
