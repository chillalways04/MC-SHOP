<template>
  <div class="page-wrapper">
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาสินค้า, แบรนด์, รุ่น หรือ ชื่อสินค้า" />
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
            <li>คำสั่งซื้อ</li>
            <li>สินค้าที่สนใจ</li>
            <li>ตั้งค่า</li>
            <router-link to="/" class="logout">ลงชื่อออก</router-link>
          </ul>
        </div>
      </div>
    </header>

    <main class="content">
      <div class="container">
        <nav class="breadcrumb">
          <router-link to="/cart">Cart</router-link>
          <span>/</span>
          <span>เพิ่มที่อยู่จัดส่ง</span>
        </nav>

        <section class="card">
          <h1 class="title">เพิ่มที่อยู่สำหรับจัดส่ง</h1>
          <p class="subtitle">กรอกข้อมูลให้ครบถ้วนเพื่อใช้ในการจัดส่งสินค้า</p>

          <form class="form" @submit.prevent="submitForm">
            <div class="form-row two-col">
              <div class="field">
                <label>ชื่อ - นามสกุล</label>
                <input
                  v-model="form.fullName"
                  type="text"
                  placeholder="เช่น ณัฐวุฒิ ทดสอบ"
                  required
                />
              </div>
              <div class="field">
                <label>เบอร์โทรศัพท์</label>
                <input v-model="form.phone" type="tel" placeholder="เช่น 0812345678" required />
              </div>
            </div>

            <div class="field">
              <label>ที่อยู่ (บ้านเลขที่, หมู่บ้าน, ซอย)</label>
              <textarea
                v-model="form.addressLine"
                rows="2"
                placeholder="บ้านเลขที่ 99/9 หมู่บ้านตัวอย่าง ซอย ABC"
                required
              ></textarea>
            </div>

            <div class="form-row three-col">
              <div class="field">
                <label>จังหวัด</label>
                <input v-model="form.province" type="text" placeholder="เช่น ชลบุรี" required />
              </div>
              <div class="field">
                <label>อำเภอ / เขต</label>
                <input v-model="form.district" type="text" placeholder="เช่น ศรีราชา" required />
              </div>
              <div class="field">
                <label>ตำบล / แขวง</label>
                <input
                  v-model="form.subdistrict"
                  type="text"
                  placeholder="เช่น สุรศักดิ์"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="field field-small">
                <label>รหัสไปรษณีย์</label>
                <input v-model="form.postcode" type="text" placeholder="เช่น 20110" required />
              </div>
              <label class="checkbox">
                <input v-model="form.isDefault" type="checkbox" />
                <span>ตั้งเป็นที่อยู่เริ่มต้นสำหรับจัดส่ง</span>
              </label>
            </div>

            <div class="actions-row">
              <button type="button" class="btn-secondary" @click="goBack">ยกเลิก</button>
              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? 'กำลังบันทึก...' : 'บันทึกที่อยู่' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2' // ✅ 1. Import SweetAlert2

const router = useRouter()
const loading = ref(false)

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

const form = reactive({
  fullName: '',
  phone: '',
  addressLine: '',
  province: '',
  district: '',
  subdistrict: '',
  postcode: '',
  isDefault: true,
})

// avatar dropdown state
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

async function submitForm() {
  loading.value = true
  try {
    // ดึง userId
    let userId: number | null = null
    const rawUser = localStorage.getItem('user')
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser)
        if (u && typeof u.id === 'number') userId = u.id
      } catch (e) {
        console.warn('parse user error', e)
      }
    }

    const payload = {
      userId,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      addressLine: form.addressLine.trim(),
      province: form.province.trim(),
      district: form.district.trim(),
      subdistrict: form.subdistrict.trim(),
      postcode: form.postcode.trim(),
      isDefault: form.isDefault,
    }

    const res = await fetch('http://localhost:3000/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      // ❌ Error Toast
      Toast.fire({
        icon: 'error',
        title: 'บันทึกไม่สำเร็จ',
        text: errBody.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์',
      })
      loading.value = false
      return
    }

    // ✅ Success Toast
    Toast.fire({
      icon: 'success',
      title: 'บันทึกสำเร็จ!',
      text: 'เพิ่มที่อยู่ใหม่เรียบร้อยแล้ว',
    })

    // รอ 1 วินาทีแล้วค่อยกลับหน้า Cart
    setTimeout(() => {
      router.push('/cart')
    }, 1000)
  } catch (err) {
    console.error('Error saving address:', err)
    // ❌ Network Error Toast
    Toast.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
    })
    loading.value = false
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped>
/* ===== ใช้ CSS เดิมของคุณ 100% ===== */
.page-wrapper {
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
  inset-inline: 0;
  top: 0;
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
  gap: 2.8rem;
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

/* ===== Content ===== */
.content {
  padding-top: 88px;
  padding-bottom: 40px;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 2rem 0;
}

/* breadcrumb */
.breadcrumb {
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 12px;
  display: flex;
  gap: 4px;
  align-items: center;
  transition: transform 0.2s ease;
}
.breadcrumb a {
  color: #0f8df2;
  text-decoration: none;
}
.breadcrumb a:hover {
  font-weight: 600;
  transform: scale(1.1);
}

/* การ์ดฟอร์ม */
.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 35px 25px 28px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}
.title {
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 4px;
}
.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 18px;
  font-weight: 600;
}

/* ฟอร์ม */
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.form-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.two-col .field {
  flex: 1;
}
.three-col .field {
  flex: 1;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.field-small {
  max-width: 160px;
}
.field label {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}
.field input,
.field textarea {
  border-radius: 15px;
  border: 1px solid #e5e7eb;
  padding: 12px 11px;
  font-size: 16px;
  outline: none;
  background: #f9fafb;
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.15s ease;
}
.field textarea {
  resize: vertical;
  min-height: 90px;
}
.field input:focus,
.field textarea:focus {
  border-color: #0f8df2;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(15, 141, 242, 0.25);
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.22);
  transform: scale(1.01);
}

/* checkbox */
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #4b5563;
  margin-top: 36px;
}
.checkbox input {
  width: 16px;
  height: 16px;
}

/* ปุ่มบันทึก / ยกเลิก */
.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
.btn-primary,
.btn-secondary {
  padding: 12px 18px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: transform 0.2s ease;
}
.btn-primary {
  background: #0d6efd;
  color: #ffffff;
}
.btn-primary:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: scale(1.1);
}
.btn-primary:disabled {
  background: #a0cfff;
  cursor: wait;
}
.btn-secondary {
  background: #edf2f7;
  color: #4b5563;
}
.btn-secondary:hover {
  background: #e2e8f0;
  transform: scale(1.1);
}

@media (max-width: 900px) {
  .container {
    padding-inline: 1.25rem;
  }
  .form-row {
    flex-direction: column;
  }
  .field-small {
    max-width: 100%;
  }
}
</style>
