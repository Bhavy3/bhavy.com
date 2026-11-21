import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const portArgIndex = process.argv.indexOf('--port')
const port = Number(process.env.PORT || (portArgIndex !== -1 && process.argv[portArgIndex + 1]) || 4173)

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const normalized = normalize(decoded).replace(/^([/\\])+/, '')
  const target = join(root, normalized)
  if (!target.startsWith(root.endsWith(sep) ? root : root + sep)) return null

  if (existsSync(target) && statSync(target).isFile()) return target
  if (existsSync(target) && statSync(target).isDirectory()) {
    const index = join(target, 'index.html')
    if (existsSync(index)) return index
  }
  // SPA fallback: extension-less paths render the app shell.
  if (!extname(normalized)) return join(root, 'index.html')
  return null
}

function handleChat(req, res) {
  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}')
      const lastMsg = (data.messages && data.messages[data.messages.length - 1]?.content || data.message || data.prompt || '').toLowerCase()
      
      let reply = "I'm Bhavy's AI assistant. I can tell you about his projects (Predictive Project, Hospital Management System, Bike Recommendation System, Bond's Projects, My Data Science Project, Power Ball, or FRIDAY), his background in Data Science and AI, or what he is building now."

      if (lastMsg.includes('project') || lastMsg.includes('built')) {
        reply = "Bhavy has built several personal and technical projects: 1) Predictive Project (eating-out problem analysis using Sydney restaurant data and geospatial insight with Scikit-Learn, PySpark, and DVC), 2) Hospital Management System (React + Django platform for patient registration, appointments, room allocation, and billing), 3) Bike Recommendation System (Streamlit recommendation engine using pre-trained ML models), 4) Bond's Projects (early JARVIS-style assistant with voice recognition and MediaPipe hand-tracking mouse control), 5) My Data Science Project (Streamlit analysis and ML tool with regression, Random Forest, SHAP and LIME), and 6) Power Ball (Streamlit statistical analysis & Monte Carlo simulation app in Docker)."
      } else if (lastMsg.includes('friday') || lastMsg.includes('assistant') || lastMsg.includes('jarvis')) {
        reply = "FRIDAY is Bhavy's personal AI assistant in active development. It is envisioned as a real-time cognitive companion and personal AI operating system, designed to use local language models, real-time low-latency interaction, interruption handling, long-term memory, contextual understanding, emotional awareness, and autonomous workflows."
      } else if (lastMsg.includes('how did you get into ai') || lastMsg.includes('journey') || lastMsg.includes('background') || lastMsg.includes('story')) {
        reply = "Bhavy's journey started in a Gujarati-medium school. He was initially a below-average student without a clear vision, until watching Iron Man sparked his fascination with Tony Stark and JARVIS. Around 2019, he got his first exposure to technology and AI, building his first basic assistant line-by-line. Today, he works as a Data Scientist at Vibrant Technology, building machine learning models and training students and professionals."
      } else if (lastMsg.includes('seminar') || lastMsg.includes('workshop') || lastMsg.includes('training') || lastMsg.includes('teach')) {
        reply = "Bhavy conducts sessions and workshops for students and professionals, breaking down complex Data Science, Machine Learning, and Generative AI concepts into practical, hands-on applications."
      } else if (lastMsg.includes('work on now') || lastMsg.includes('now') || lastMsg.includes('current')) {
        reply = "Currently, Bhavy works as a Data Scientist at Vibrant Technology, focuses on Data Science, ML and Generative AI, and is actively developing FRIDAY, his local AI assistant."
      } else if (lastMsg.includes('client') || lastMsg.includes('internal') || lastMsg.includes('colleague') || lastMsg.includes('mentor') || lastMsg.includes('team') || lastMsg.includes('employer')) {
        reply = "I don't share details about internal work, employer operations, clients, colleagues, mentors or students. I focus strictly on personal projects, technical skills, and practical AI development."
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' })
      res.end(JSON.stringify({ content: reply, thread: data.thread || 'thread_' + Date.now() }))
    } catch (e) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ content: "I'm here to answer questions about Bhavy's projects, machine learning work, and AI journey. How can I help?" }))
    }
  })
}

const server = createServer((req, res) => {
  if (req.url === '/api/geo') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ country: 'IN' }))
    return
  }
  if (req.url === '/api/chat' && req.method === 'POST') {
    handleChat(req, res)
    return
  }

  const file = resolveFile(req.url || '/')
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not found')
    return
  }

  const type = mime[extname(file).toLowerCase()] || 'application/octet-stream'
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': 'no-cache',
  })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  createReadStream(file).pipe(res)
})

server.listen(port, () => {
  console.log(`Serving ${root}`)
  console.log(`  Local:   http://localhost:${port}/`)
})
