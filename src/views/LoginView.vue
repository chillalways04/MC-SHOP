<template>
  <div class="login-shell">
    <div class="hero">
      <div class="left-block">
        <div class="left-content">
          <img src="../assets/oop.png" alt="mcshop" class="promo-img" />
          <div class="text-content">
            <h1 class="title">MCSHOP</h1>
            <p class="tagline">ช็อปง่ายๆกับ MCSHOP</p>
            <p class="desc">
              ประสบการณ์ช้อประดับพรีเมียม สินค้าของแท้ผ่านการตรวจสอบอย่างพิถีพิถันทุกชิ้น
            </p>
          </div>
        </div>
      </div>

      <div class="login-panel">
        <div class="logo-wrapper">
          <img src="../assets/logoM.png" alt="MC SHOP Logo" class="logo-img" />
        </div>

        <h2 class="panel-title">เข้าสู่ระบบ <span class="brand-strong">MCSHOP</span></h2>

        <form class="login-form" @submit.prevent="login">
          <label class="form-field">
            <span class="field-label">อีเมล</span>
            <input
              v-model="email"
              type="email"
              placeholder="example@gmail.com"
              class="field-input"
              required
              :disabled="loading"
            />
          </label>

          <label class="form-field">
            <span class="field-label">รหัสผ่าน</span>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="field-input"
              required
              :disabled="loading"
            />
          </label>

          <div class="forgot">ลืมรหัสผ่าน?</div>

          <button type="submit" class="primary-btn" :disabled="loading">
            <span v-if="loading">กำลังเข้าสู่ระบบ...</span>
            <span v-else>เข้าสู่ระบบด้วยอีเมล</span>
          </button>

          <div class="divider">หรือ</div>

          <div class="social-row">
            <button type="button" class="social fb">
              <img src="../assets/facebook.png" alt="Facebook" class="social-icon" />
              <span>Facebook</span>
            </button>

            <button type="button" class="social gg">
              <img src="../assets/search.png" alt="Google" class="social-icon" />
              <span>Google</span>
            </button>
          </div>

          <p class="bottom-text">
            ยังไม่มีบัญชี?
            <router-link to="/register" class="link">สมัครสมาชิก</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

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

const email = ref('')
const password = ref('')
const loading = ref(false)

const login = async () => {
  // Check ค่าว่าง
  if (!email.value || !password.value) {
    Toast.fire({
      icon: 'warning',
      title: 'ข้อมูลไม่ครบ',
      text: 'กรุณากรอกอีเมลและรหัสผ่าน',
    })
    return
  }

  loading.value = true

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    // ถ้า Login ไม่ผ่าน
    if (!res.ok) {
      Toast.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      })
      loading.value = false // หยุดโหลดเพื่อให้กดใหม่ได้
      return
    }

    // -------------------------------
    // 🟦 Login สำเร็จ: เก็บข้อมูล
    // -------------------------------
    localStorage.setItem('userEmail', email.value)
    localStorage.setItem('user', JSON.stringify(data.user || {}))
    if (data.token) localStorage.setItem('token', data.token)

    // ✅ Toast สีเขียว
    Toast.fire({
      icon: 'success',
      title: 'เข้าสู่ระบบสำเร็จ!',
      text: 'กำลังพาไปหน้าหลัก...',
    })

    // รอ 1 วินาที ให้เห็น Toast ก่อนเด้งไปหน้า Home
    setTimeout(() => {
      router.push('/home')
    }, 1000)
  } catch (err) {
    console.error(err)
    // Error ฝั่ง Network/Server
    Toast.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
    })
    loading.value = false
  }
}
</script>

<style scoped>
/* ... CSS เดิมของคุณ 100% ... */

.login-shell {
  position: fixed;
  inset: 0;
}

.hero {
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #f5f6f7 0%, #fbfcfc 40%, #cfe7fe 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 clamp(1.5rem, 5vw, 7.5rem);
  box-sizing: border-box;
  gap: 2rem;
}

.left-block {
  flex: 1 1 50%;
}
.left-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.promo-img {
  width: 550px;
  height: auto;
  margin-right: 30px;
  margin-top: 50px;
}
.text-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.title {
  font-size: 80px;
  font-weight: 700;
  color: #4d5057;
}
.tagline {
  background: #dff57c;
  padding: 35px 50px;
  border-radius: 30px;
  font-weight: 750;
  display: inline-block;
  font-size: 30px;
  margin-right: 90px;
}
.desc {
  max-width: 600px;
  color: #555;
  line-height: 1.6;
  font-size: 30px;
}

.login-panel {
  width: 650px;
  height: 850px;
  background: #fff;
  border-radius: 30px;
  padding: 36px 30px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.logo-img {
  width: 110px;
  height: auto;
  object-fit: contain;
}

.panel-title {
  text-align: center;
  font-size: 25px;
  color: #4d4e57;
  margin-bottom: 20px;
  font-weight: 700;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}
.field-label {
  font-weight: 600;
  color: #2d343f;
  font-size: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.field-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0dce7;
  border-radius: 15px;
  font-size: 20px;
  outline: none;
  transition: all 0.2s ease;
  background: #ffffff;
  height: 55px;
  box-sizing: border-box; /* เพิ่มเพื่อความชัวร์ */
}
.field-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}
.field-input:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}

.forgot {
  text-align: center;
  font-size: 20px;
  color: #007bff;
  margin: 5px 0 15px;
  cursor: pointer;
  font-weight: 700;
}

.primary-btn {
  width: 100%;
  background: #1174ff;
  color: #fff;
  border: none;
  padding: 15px;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 20px;
}
.primary-btn:hover:not(:disabled) {
  transform: scale(1.03);
}
.primary-btn:disabled {
  background: #8acdfb;
  cursor: wait;
}

.divider {
  text-align: center;
  color: #999;
  font-size: 20px;
  margin: 16px 0;
}

.social-row {
  display: flex;
  gap: 10px;
}
.social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 14px 0;
  font-weight: 800;
  cursor: pointer;
  background: #fff;
  font-size: 20px;
  transition: all 0.25s ease;
}
.social:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}
.social-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.social.fb {
  background: #1174ff;
  color: #ffffff;
  border-color: #1174ff;
}
.social.gg {
  background: #ffffff;
  color: #e34133;
  border: 1px solid #ddd;
}

.bottom-text {
  text-align: center;
  margin-top: 30px;
  font-size: 20px;
}
.bottom-text a {
  color: #007bff;
  font-weight: 600;
  font-size: 20px;
}
</style>
