import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import nodemailer from 'nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'

/* ====================== BASIC SETUP ====================== */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_FILE = path.join(__dirname, 'users.json')
const ADDR_FILE = path.join(__dirname, 'addresses.json')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors()) // อนุญาตให้หน้าบ้านเชื่อมต่อได้
app.use(express.json()) // รองรับข้อมูลแบบ JSON

/* ====================== OPTIONAL EMAIL SETUP ====================== */

const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env
let transporter = null

if (GMAIL_USER && GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  })
  console.log('✅ Email service enabled')
} else {
  console.warn('⚠️ Email service disabled (demo mode)')
}

/* ====================== INIT LOCAL FILES ====================== */

const initFiles = () => {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8')
  if (!fs.existsSync(ADDR_FILE)) fs.writeFileSync(ADDR_FILE, '[]', 'utf8')
}

/* ====================== USERS LOGIC ====================== */

const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]')
  } catch {
    return []
  }
}

const saveUsers = (users) => fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8')

// ⭐ เพิ่มใหม่: GET /users สำหรับตรวจสอบอีเมลซ้ำ (ที่หน้าบ้านเรียกหา)
app.get('/users', (req, res) => {
  try {
    const users = loadUsers()
    const { email } = req.query

    if (email) {
      // ค้นหา user ที่มีอีเมลตรงกัน (ไม่สนพิมพ์เล็กพิมพ์ใหญ่)
      const found = users.filter((u) => u.email.toLowerCase() === String(email).toLowerCase())
      return res.json(found)
    }

    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

// Register
app.post('/users', async (req, res) => {
  try {
    const { email, password } = req.body
    const users = loadUsers()

    if (!email || !password) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' })
    }

    if (users.some((u) => u.email === email)) {
      return res.status(409).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json(userWithoutPassword)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const users = loadUsers()

    const user = users.find((u) => u.email === email)
    if (!user) return res.status(401).json({ message: 'Login Failed' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Login Failed' })

    const { password: _, ...userWithoutPassword } = user
    res.json({ message: 'Login Success', user: userWithoutPassword })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

/* ====================== ADDRESSES LOGIC ====================== */

const loadAddresses = () => {
  try {
    return JSON.parse(fs.readFileSync(ADDR_FILE, 'utf8') || '[]')
  } catch {
    return []
  }
}

const saveAddresses = (addresses) =>
  fs.writeFileSync(ADDR_FILE, JSON.stringify(addresses, null, 2), 'utf8')

app.get('/addresses', (req, res) => {
  res.json(loadAddresses())
})

app.post('/addresses', (req, res) => {
  try {
    const body = req.body || {}
    const addresses = loadAddresses()

    if (!body.fullName || !body.phone || !body.addressLine || !body.postcode) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' })
    }

    const newAddress = {
      id: Date.now(),
      ...body,
      isDefault: !!body.isDefault,
      createdAt: new Date().toISOString(),
    }

    if (newAddress.isDefault) {
      addresses.forEach((a) => (a.isDefault = false))
    }

    addresses.push(newAddress)
    saveAddresses(addresses)

    res.status(201).json({ message: 'บันทึกสำเร็จ', address: newAddress })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

/* ====================== EMAIL (OPTIONAL) ====================== */

app.post('/send-email', async (req, res) => {
  if (!transporter) {
    return res.status(503).json({
      message: 'Email service is disabled in demo mode',
    })
  }

  const { to, subject, message } = req.body

  try {
    await transporter.sendMail({
      from: `"MC SHOP" <${GMAIL_USER}>`,
      to,
      subject,
      html: `<div style="padding:20px;">${message.replace(/\n/g, '<br>')}</div>`,
    })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false })
  }
})

/* ====================== START SERVER ====================== */

initFiles()
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
