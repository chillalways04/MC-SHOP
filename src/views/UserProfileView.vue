<template>
  <div class="page profile-page">
    <header class="topbar">
      <div class="brand">
        <div class="logo-box">MC<br />SHOP</div>
      </div>

      <div class="search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาสินค้าตามแบรนด์, ชื่อรุ่น หรือ ชื่อสินค้า" />
      </div>

      <div class="actions">
        <router-link to="/cart" class="icon-btn" style="display: grid; place-items: center">
          🛒
        </router-link>

        <button class="icon-btn">🔔</button>

        <router-link to="/saved" class="icon-btn" style="display: grid; place-items: center">
          ♡
        </router-link>
        <router-link to="/home" class="icon-btns home-icon">🏠</router-link>

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

    <main class="content-wrapper">
      <div class="profile-card-container">
        <h2 class="profile-title">ข้อมูลของฉัน</h2>
        <p class="profile-subtitle">จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้</p>
        <hr class="divider" />

        <div class="profile-layout">
          <div class="profile-sidebar">
            <div class="avatar-wrapper">
              <img
                src="C:\Users\ADMIN\Downloads\ESANSHOP\src\assets\images.jpg"
                alt="Profile Avatar"
                class="profile-avatar-img"
              />
            </div>

            <div class="menu-list">
              <router-link to="/profile" class="menu-item active">
                <svg
                  class="menu-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                บัญชีของฉัน
              </router-link>

              <router-link to="/orders" class="menu-item">
                <svg
                  class="menu-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                คำสั่งซื้อ
              </router-link>

              <router-link to="/notifications" class="menu-item">
                <svg
                  class="menu-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
                การแจ้งเตือน
              </router-link>

              <router-link to="/address/new" class="menu-item">
                <svg
                  class="menu-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                ที่อยู่ส่วนตัวของฉัน
              </router-link>
            </div>
          </div>

          <div class="profile-form-content">
            <div class="form-sections">
              <div class="form-row">
                <label class="form-label">ชื่อผู้ใช้</label>
                <div class="form-field-display">
                  <span class="username-text">esan1234</span>
                  <div class="badge-tag">ชื่อ</div>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">ชื่อ</label>
                <input
                  type="text"
                  v-model="profileData.fullName"
                  placeholder="กรอกชื่อ-นามสกุล"
                  class="form-input"
                />
              </div>

              <div class="form-row">
                <label class="form-label">อีเมล</label>
                <div class="form-field-display justify-between">
                  <span class="masked-text">{{ profileData.emailMasked }}</span>
                  <button class="change-btn">เปลี่ยน</button>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">หมายเลขโทรศัพท์</label>
                <div class="form-field-display justify-between">
                  <span class="masked-text">{{ profileData.phoneMasked }}</span>
                  <button class="change-btn">เปลี่ยน</button>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">เพศ</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      class="radio-input"
                      v-model="profileData.gender"
                    />
                    <span>ชาย</span>
                  </label>
                  <label class="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      class="radio-input"
                      v-model="profileData.gender"
                    />
                    <span>หญิง</span>
                  </label>
                  <label class="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      class="radio-input"
                      v-model="profileData.gender"
                    />
                    <span>อื่นๆ</span>
                  </label>
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">วัน/เดือน/ปี เกิด</label>
                <div class="form-field-display justify-between">
                  <span class="masked-text">{{ profileData.dobMasked }}</span>
                  <button class="change-btn">เปลี่ยน</button>
                </div>
              </div>
            </div>

            <div class="save-button-wrapper">
              <button class="save-btn" @click="saveProfile">บันทึก</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue' // 🟢 เพิ่ม onMounted, onBeforeUnmount

interface ProfileData {
  username: string
  fullName: string
  emailMasked: string
  phoneMasked: string
  gender: 'male' | 'female' | 'other'
  dobMasked: string
}

const profileData = ref<ProfileData>({
  username: 'esan1234',
  fullName: '',
  emailMasked: 'esa******@gmail.com',
  phoneMasked: '**********45',
  gender: 'male',
  dobMasked: '**/ ** / 2004',
})

// 🟢 Logic สำหรับ Dropdown Menu (ถึงแม้ว่าหน้านี้ไม่ควรมีก็ตาม)
const showMenu = ref(false)
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const saveProfile = () => {
  console.log('บันทึกข้อมูลโปรไฟล์:', profileData.value) // [Functionality] เพิ่ม logic การเรียก API สำหรับบันทึกข้อมูลที่นี่
}

// 🟢 Global Event Handlers (เพิ่มเพื่อความสมบูรณ์ของ Component)
function handleGlobalClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const menu = document.querySelector('.user-menu')
  const avatar = document.querySelector('.avatar')

  // หากมีการใช้ Dropdown/Menu อื่นๆ
  if (showMenu.value && menu && !menu.contains(target) && avatar && !avatar.contains(target)) {
    showMenu.value = false
  }
}

function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    // หากมี Modal หรือ Search Panel
    // if (showModal.value) closeModal()
    // if (showSearchPanel.value) closeSearch()

    // ปิด Dropdown เมนู
    if (showMenu.value) {
      showMenu.value = false
    }
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
.page {
  min-height: 100vh;
  background: #eef0f3;
  margin-top: 60px;
  margin-left: 195px;
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
.search-icon {
  font-size: 1.15rem;
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

/* ================================== */
/* 2. Main Content Wrapper (ชดเชย Header) */
/* ================================== */
.content-wrapper {
  padding-top: 72px;
  padding: 1.5rem 2.5rem 3rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* ================================== */
/* 3. Profile Card Styles (อิงตามโทนสีโปรเจกต์) */
/* ================================== */
.profile-card-container {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 1.5rem;
}

.profile-title {
  font-size: 35px;
  font-weight: 700;
  color: #2d3a4b;
  margin-bottom: 0.5rem;
}

.profile-subtitle {
  color: #7b8085;
  margin-bottom: 1.5rem;
  font-size: 18px;
}

.divider {
  border: 0;
  border-top: 1px solid #eef0f2;
  margin-bottom: 2rem;
}

/* ---------------------------------- */
/* 4. Profile Layout (Sidebar + Form) */
/* ---------------------------------- */
.profile-layout {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

@media (min-width: 768px) {
  .profile-layout {
    flex-direction: row;
    gap: 2rem;
  }
  .profile-sidebar {
    width: 250px;
    flex-shrink: 0;
  }
  .profile-form-content {
    flex-grow: 1;
  }
}

/* ---------------------------------- */
/* 5. Sidebar Styles */
/* ---------------------------------- */
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
.profile-avatar-img {
  width: 125px;
  height: 125px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease;
}

.profile-avatar-img:hover {
  transform: scale(1.03);
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 16px;
  font-weight: 500;
  color: #4b5563;
  margin-top: 25px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  color: #4b5563;
}

.menu-item:hover,
.menu-item.active {
  background: #e1e6f0;
  transform: scale(1.01);
  color: #3190cf;
  font-weight: 700;
}

.menu-item.active {
  color: #3190cf;
  background: #e1e6f0;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  stroke: currentColor;
  fill: none;
}

/* ---------------------------------- */
/* 6. Form Styles */
/* ---------------------------------- */
.form-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .form-row {
    grid-template-columns: 180px 1fr;
    gap: 1rem;
  }
}

.form-label {
  color: #6a7381;
  font-size: 0.95rem;
}

.form-field-display {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  min-height: 28px;
}

.form-field-display.justify-between {
  justify-content: space-between;
}

.username-text,
.masked-text {
  color: #2d3a4b;
  font-weight: 600;
  margin-right: 0.75rem;
}

.badge-tag {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.form-input {
  border: none;
  border-bottom: 1px solid #e6e8eb;
  padding: 0.25rem 0;
  width: 100%;
  font-size: 1rem;
  transition: border-color 0.2s;
  background: transparent;
}

.form-input:focus {
  outline: none;
  border-bottom-color: #3190cf;
}

.change-btn {
  color: #3190cf;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.change-btn:hover {
  color: #0f8df2;
}

/* Radio Button Group */
.radio-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.radio-input {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
}
.radio-input:checked {
  border-color: #3190cf;
  background-color: #3190cf;
}
.radio-input:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: white;
}

/* Save Button */
.save-button-wrapper {
  margin-top: 2.5rem;
  text-align: center;
}

@media (min-width: 768px) {
  .save-button-wrapper {
    text-align: left;
    margin-left: 190px;
  }
}

.save-btn {
  width: 100%;
  margin-top: 10px;
  border-radius: 999px;
  padding: 0.75rem 2rem;

  font-size: 17px;
  font-weight: 680;
  cursor: pointer;

  /* ⭐ Blue Glass Effect */
  background: rgba(71, 140, 243, 0.25); /* ฟ้าใส */
  border: 1px solid rgba(204, 223, 250, 0.45); /* ขอบฟ้าอ่อน */
  color: #1839cc;

  backdrop-filter: blur(12px); /* เบลอด้านหลัง */
  -webkit-backdrop-filter: blur(12px);

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.2);
  transition: 0.25s ease;
  /* ลบ border: none; ออก เพราะเรากำหนด border 1px ไว้แล้ว */
}

.save-btn:hover {
  background: rgba(13, 110, 253, 0.35); /* ฟ้าเข้มขึ้นตอน hover */
  transform: scale(1.03);
  box-shadow: 0 6px 24px rgba(13, 110, 253, 0.32);
}

/* HomeView.vue (ส่วน <style scoped>) */

/* =============================================== */
/* 🟢 User Dropdown Styles (แก้ไข/ปรับปรุง) */
/* =============================================== */

.user-menu {
  position: absolute;
  top: 60px; /* เยื้องลงมาจาก topbar */
  right: 60px; /* จัดให้อยู่ใต้ปุ่ม avatar */

  width: 230px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* เงาชัดเจน */
  padding: 16px 20px;
  z-index: 200;
  margin-right: -65px;
}

/* Row ด้านบน (User Icon + ยืนยันแล้ว) */
.user-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eef0f2; /* เส้นแบ่งบาง ๆ */
}
.user-pic {
  font-size: 28px;
  color: #555193; /* 🟣 สีม่วง/น้ำเงินเข้มตามรูปภาพ */
}
.user-status {
  font-size: 16px;
  color: #16a34a; /* 🟢 สีเขียว "ยืนยันแล้ว" */
  font-weight: 600;
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

/* Logout Link (สีแดง) */
.logout {
  display: block;
  padding: 8px 6px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #ef4444; /* 🔴 สีแดง "ลงชื่อออก" */
  text-decoration: none;
  transition: all 0.25s ease;
  margin-top: 5px; /* เว้นระยะห่างจากเมนูตั้งค่า */
}

.logout:hover {
  background: #fee2e2; /* พื้นหลังสีแดงอ่อนตอน hover */
  color: #c51e1e;
  transform: scale(1.03);
  font-weight: 700;
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
}
.icon-btn:hover {
  transform: scale(1.2);
}
</style>
