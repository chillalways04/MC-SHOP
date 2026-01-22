<template>
  <div class="register-shell">
    <div class="hero">
      <div class="register-panel">
        <img src="../assets/logoM.png" alt="MC SHOP" class="logo-img" />

        <h2 class="panel-title">สมัครสมาชิก <span class="brand-strong">MCSHOP</span></h2>

        <form class="register-form" @submit.prevent="register">
          <label class="form-field">
            <span class="field-label">อีเมล</span>
            <input v-model="email" type="email" placeholder="อีเมล" class="field-input" required />
          </label>

          <label class="form-field">
            <span class="field-label">รหัสผ่าน</span>
            <input
              v-model="password"
              type="password"
              placeholder="รหัสผ่าน"
              class="field-input"
              required
            />
          </label>

          <p class="terms">
            โดยการดำเนินการต่อ ฉันได้อ่านและยอมรับ
            <a href="#" class="link">เงื่อนไขการให้บริการและข้อตกลง</a>
          </p>

          <button type="submit" class="primary-btn" :disabled="loading">
            <span v-if="loading">กำลังประมวลผล...</span>
            <span v-else>สมัครสมาชิกด้วยอีเมล</span>
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
            มีบัญชีอยู่แล้ว? <router-link to="/" class="link">เข้าสู่ระบบ</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2' // ✅ 1. Import SweetAlert2

// ✅ 2. สร้าง Setting สำหรับ Toast (แจ้งเตือนมุมขวาบน)
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

interface UserLite {
  id?: number
  email: string
}

const email = ref('')
const password = ref('')
const loading = ref(false)

// ... ส่วนของ ref และ Toast เหมือนเดิม ...

const register = async () => {
  const emailInput = (email.value || '').trim().toLowerCase()
  const passwordInput = (password.value || '').trim()

  if (!emailInput || !passwordInput) {
    Toast.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกอีเมลและรหัสผ่าน' })
    return
  }

  if (passwordInput.length < 6) {
    Toast.fire({ icon: 'warning', title: 'รหัสผ่านสั้นเกินไป', text: 'ต้องมีอย่างน้อย 6 ตัวอักษร' })
    return
  }

  loading.value = true

  try {
    // 1. เช็คอีเมลซ้ำ (เปลี่ยนเป็น localhost ให้เหมือนกัน)
    const checkRes = await fetch(
      `http://localhost:3000/users?email=${encodeURIComponent(emailInput)}`,
    )

    if (!checkRes.ok) throw new Error('ไม่สามารถตรวจสอบข้อมูลได้')

    const existingUsers = (await checkRes.json()) as UserLite[]

    if (existingUsers.length > 0) {
      Toast.fire({ icon: 'error', title: 'สมัครไม่สำเร็จ', text: 'อีเมลนี้มีผู้ใช้งานอยู่แล้ว' })
      loading.value = false
      return
    }

    // 2. สมัครสมาชิกใหม่ (ใช้ localhost เหมือนกัน และลบ createdAt ออก)
    const res = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
        // ไม่ต้องส่ง createdAt ไป เพราะ server จัดการเองแล้ว
      }),
    })

    if (!res.ok) throw new Error('ไม่สามารถสมัครสมาชิกได้ในขณะนี้')

    // 3. ส่งอีเมลยืนยัน
    try {
      await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailInput,
          subject: 'ยืนยันการสมัครสมาชิก MC SHOP',
          message: `ขอบคุณที่สมัครสมาชิกกับ MC SHOP\n\nอีเมลที่ใช้สมัคร: ${emailInput}\n\nบัญชีของคุณได้ถูกสร้างเรียบร้อยแล้ว`,
        }),
      })
    } catch (mailErr) {
      console.warn('ส่งอีเมลไม่สำเร็จ', mailErr)
    }

    Toast.fire({ icon: 'success', title: 'สมัครสมาชิกสำเร็จ!', text: 'กรุณาตรวจสอบอีเมลของคุณ' })
    email.value = ''
    password.value = ''
  } catch (err: any) {
    console.error(err)
    Toast.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ===== คง CSS เดิมของคุณไว้ 100% ===== */
.register-shell {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #f5f6f7 0%, #e8f2ff 40%, #cfe7fe 100%);
  overflow: hidden;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem;
}

.register-panel {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2rem 2.5rem;
  width: 600px;
  height: 780px;
  text-align: center;
}

/* ===== Logo ===== */
.logo-img {
  width: 110px;
  height: 105px;
  margin: 0 auto 1rem;
  border-radius: 20px;
  display: block;
}

/* ===== Title ===== */
.panel-title {
  font-size: 28px;
  color: #4d4e57;
  font-weight: 550;
  margin-bottom: 1.5rem;
}

.brand-strong {
  font-weight: 800;
}

/* ===== Form ===== */
.form-field {
  text-align: left;
  margin-bottom: 1rem;
}

.field-label {
  display: block;
  font-weight: 600;
  font-size: 17px;
  color: #333;
  margin-bottom: 10px;
}

.field-input {
  width: 100%;
  height: 55px;
  padding: 10px 12px;
  border: 1.5px solid #dfe7f0;
  border-radius: 15px;
  font-size: 15px;
  outline: none;
  transition: 0.2s;
  background: #ffffff;
  /* เพิ่ม box-sizing เพื่อป้องกัน input ทะลุกรอบในบาง browser */
  box-sizing: border-box;
  margin-bottom: 12px;
}

.field-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

/* ===== Terms ===== */
.terms {
  font-size: 15px;
  color: #6c7a88;
  margin: 0.8rem 0 1rem;
  font-weight: 500;
}

.link {
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
}

/* ===== Button ===== */
.primary-btn {
  width: 100%;
  background: #007bff;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.primary-btn:hover {
  background: #0064da;
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 123, 255, 0.25);
}

.primary-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
  transform: none;
}

/* ===== Divider ===== */
.divider {
  color: #999;
  font-size: 20px;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  height: 1px;
  background: #ddd;
  position: absolute;
  top: 50%;
  width: 40%;
}

.divider::before {
  left: 0;
}
.divider::after {
  right: 0;
}

/* ===== Social Buttons ===== */
.social-row {
  display: flex;
  gap: 10px;
}

.social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.25s ease;
  border: none; /* เพิ่มให้เพื่อความชัวร์ */
}

.social-icon {
  width: 22px;
  height: 22px;
}

.social.fb {
  background: #1877f2;
  color: #fff;
  box-shadow: 0 3px 8px rgba(24, 119, 242, 0.3);
  padding: 16px;
  border-radius: 15px;
}
.social.fb:hover {
  transform: scale(1.05);
}

.social.gg {
  background: #fff;
  color: #e34133;
  border: 1px solid #ddd;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  border-radius: 15px;
}
.social.gg:hover {
  transform: scale(1.05);
}

/* ===== Footer ===== */
.bottom-text {
  font-size: 18px;
  color: #444;
  margin-top: 1.5rem;
}
</style>
