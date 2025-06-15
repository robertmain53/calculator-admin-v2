import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


// --- Auth middleware ---
const API_SECRET = process.env.ADMIN_API_SECRET

function verifyToken(req, res, next) {
  const token = req.headers['authorization']
  if (!token || token !== `Bearer ${API_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}


const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'
const ADMIN_USER = {
  email: 'admin@example.com',
  passwordHash: bcrypt.hashSync('password123', 10)
}

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  if (email !== ADMIN_USER.email || !bcrypt.compareSync(password, ADMIN_USER.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403)
    req.user = decoded
    next()
  })
}

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/list', (req, res) => {
  res.json([
    { slug: 'bmi-calculator', title: 'BMI Calculator', lang: 'en' },
    { slug: 'loan-calculator', title: 'Loan Calculator', lang: 'en' },
  ])
})

app.post('/api/improve', verifyToken, (req, res) => {
  const { slug, content } = req.body
  res.json({
    slug,
    improved: true,
    diff: '...'
  })
})

app.post('/api/review', verifyToken, (req, res) => {
  const { slug } = req.body
  res.json({
    slug,
    review: 'passed',
    issues: []
  })
})

app.post('/api/approve', verifyToken, (req, res) => {
  const { slug } = req.body
  res.json({
    slug,
    status: 'approved',
    timestamp: new Date().toISOString()
  })
})

app.post('/api/publish', verifyToken, async (req, res) => {
  const { slug } = req.body

  // Simulate publishing logic
  const NETLIFY_HOOK_URL = process.env.NETLIFY_BUILD_HOOK

  if (NETLIFY_HOOK_URL) {
    try {
      const response = await fetch(NETLIFY_HOOK_URL, { method: 'POST' })
      const result = await response.text()
      console.log('✅ Netlify rebuild triggered:', result)
    } catch (error) {
      console.error('❌ Failed to trigger Netlify build hook:', error)
    }
  }

  res.json({
    slug,
    status: 'published',
    url: `https://calchub.xyz/${slug}`
  })
})

app.get('/', (req, res) => {
  res.send('✅ Admin API is running')
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`✅ Admin backend is running on port ${port}`)
})