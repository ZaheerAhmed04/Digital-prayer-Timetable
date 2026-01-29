# 🚀 Deployment Guide – Digital Prayer Timetable Clock

This guide explains how to deploy and run the **Digital Prayer Timetable Clock** locally, online, and in offline environments.  
The project is designed to be **simple, reliable, and flexible**, with no mandatory backend dependency.

---

## 🖥 Local Deployment (Recommended for Development)

### Option 1: Direct Browser Run
1. Download or clone the project folder
2. Ensure folder structure is intact
3. Open `index.html` in a modern browser (Chrome, Edge, Firefox)

⚠️ Note: Some browsers restrict local JSON loading.  
If prayer data does not load, use **Option 2**.

---

### Option 2: Using a Local Server (Best Practice)
#### Using VS Code Live Server
1. Open project folder in VS Code
2. Install **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**
4. Project runs at:

http://127.0.0.1:5500


✔ Recommended for proper JSON handling  
✔ Auto refresh supported

---

## 🌐 Hosting on GitHub Pages

### Steps
1. Push project to a GitHub repository
2. Go to **Repository → Settings**
3. Open **Pages**
4. Select:
   - Branch: `main`
   - Folder: `/root`
5. Save

Your project will be live at:
https://your-username.github.io/repository-name/


✔ Free hosting  
✔ No backend required  
✔ Ideal for static projects

---

## ☁ Hosting on Netlify (Recommended)

### Steps
1. Login to Netlify
2. Click **Add new site → Import from Git**
3. Connect GitHub repository
4. Build settings:

Build Command: (leave empty)
Publish Directory: /

5. Deploy site

✔ Fast CDN  
✔ Automatic redeploys  
✔ Free HTTPS

---

## 📴 Offline Usage (Masjid / TV Display)

### Offline Setup
1. Copy full project folder to:
   - USB drive
   - Local computer
   - Mini PC / Raspberry Pi
2. Open using local server or browser
3. No internet required

### Recommended Use Cases
- Masjid digital displays
- LED TV prayer boards
- Community halls
- Educational institutions

✔ Works 24/7  
✔ Zero downtime  
✔ No internet cost

---

## 🗄 Future Backend Deployment (Optional)

### When Backend is Needed
- Admin panel for editing prayer times
- Multi-location support
- Dynamic yearly updates
- User-based access control

### Suggested Backend Stack
- **Backend:** Node.js / PHP / Python
- **Database:** MySQL
- **API:** REST-based

### Deployment Flow

Frontend (HTML/CSS/JS)
│
▼
Backend API (Server)
│
▼
MySQL Database


### Migration Strategy
- Replace `timetable.json` with API endpoint
- Keep frontend logic unchanged
- Gradual upgrade without downtime

---

## 🔐 Security Considerations (Future)
- Read-only public APIs
- Admin authentication
- Input validation
- Server-side time checks

---

## 🧾 Conclusion
This deployment approach ensures:
- Easy local testing
- Free & reliable hosting
- Offline-first usability
- Smooth backend scalability

The system is ideal for **long-term, stable prayer timetable displays**.

---

📌 **Tip:**  
For production Masjid use, deploy on a local mini-PC with auto-start browser mode.

---
