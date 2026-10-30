# Zenith University Admissions Bureau - Student Portal

An interactive, responsive online application and candidate enrollment portal built with **HTML5, CSS3, JavaScript, jQuery, and PHP**.

Upon form submission (button click), user data is validated client-side with jQuery, submitted asynchronously to PHP via AJAX, validated and sanitized on the server, and displayed dynamically as a **formatted, stylized candidate provisional admission slip** directly in the browser with print and PDF export capabilities.

---

## 🎨 Design Highlights

- **Branding**: Zenith University of Advanced Technology (ZIAT).
- **Color Palette**: Royal Crimson Rose (`#e11d48`) & Deep Navy (`#0f172a`).
- **Typography**: Clean, modern pairings with Google Fonts `Lexend` & `Inter`.
- **Validation**: Strict client-side regex checks (email, 10-digit mobile, 6-digit PIN code) and server-side PHP validation.
- **Dynamic Output**: Displays a high-fidelity official provisional candidate pass with unique serial ID (`ZIAT-2026-XXXXX`), verified timestamp, and signature seal.
- **Print Layout**: Dedicated `@media print` CSS rules formatted for standard paper and PDF export.

---

## 📁 File Structure

```text
web-tech-anraj/
│
├── index.html       # Candidate registration form & provisional pass layout
├── style.css        # Crimson/Navy responsive styling & print layout
├── script.js        # jQuery client-side validation & AJAX handler
├── process.php      # PHP backend (validation, sanitization, ID generator)
├── server.js        # Built-in zero-dependency Node.js test server
├── Dockerfile       # Production PHP 8.2 + Apache container definition
├── render.yaml      # Blueprint for 1-click cloud deploy on Render
├── vercel.json      # Configuration for Vercel
└── README.md        # Documentation and deployment instructions
```

---

## 🚀 Running Locally

```bash
node server.js
```
Then visit: 👉 `http://localhost:3000`

---

## ☁️ Free Cloud Deployment on Render.com

1. Sign in to [Render.com](https://render.com) with GitHub.
2. Click **New +** -> **Web Service**.
3. Select this repository (`Anraj-web-tech`).
4. Select **Docker** environment and **Free** tier.
5. Click **Create Web Service** to deploy!
