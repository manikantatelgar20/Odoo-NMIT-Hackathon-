# 🌟 Corely – Adaptive Student Productivity & Academic Platform

Corely is a modern student-focused web application designed to bring **academics, attendance, tasks, schedules, profile management, and AI-powered insights** together in one platform.

The application provides a colourful, responsive and easy-to-use dashboard that helps students monitor their academic progress and manage their daily activities efficiently.

---

## 🚀 Features

### 🎓 Academics

- Add subjects manually
- Enter internal marks
- Enter semester-end marks
- Calculate total marks
- View subject-wise academic records
- Display academic performance
- Academic performance summary
- AI-based academic insights

---

### 📊 Attendance

- Add attendance manually
- Enter present classes
- Enter total classes
- Automatically calculate attendance percentage
- Subject-wise attendance tracking
- Visual attendance progress bars
- Safe / warning / low attendance indicators
- Overall attendance calculation
- AI-based attendance insights
- Delete attendance records

---

### 📅 Schedule

- View daily academic schedule
- Organize classes and activities
- Easy navigation from the Corely dashboard

---

### ✅ Tasks

- Manage academic and personal tasks
- Track pending activities
- Access tasks directly from the dashboard

---

### 👤 Profile

- View student information
- Manage profile-related information
- Access profile from the common Corely navigation

---

### 🔐 Authentication

Corely uses secure authentication with:

- User registration
- User login
- JWT authentication
- Protected API routes
- Automatic token handling
- Session expiration handling
- Logout functionality

---

## 🎨 UI & Design

Corely uses a modern **light-themed interface** with:

- 🌈 Colourful gradients
- ✨ Modern cards
- 💜 Purple and pink accent colours
- 📱 Responsive layout
- 🧊 Glass-style effects
- 🎯 Interactive navigation
- 📊 Visual progress indicators
- 🤖 AI insight sections
- 📐 Consistent page layouts

All major pages share the same Corely navigation and visual style.

---

## 🧠 AI Integration

Corely is designed to provide intelligent insights based on student data.

### Academic AI

The academic section can analyse:

- Subject performance
- Average marks
- Academic progress
- Estimated CGPA
- Areas requiring improvement

### Attendance AI

The attendance section can analyse:

- Overall attendance
- Low-attendance subjects
- Safe attendance levels
- Subjects requiring attention
- Attendance improvement suggestions

---

## 🏗️ Project Structure

```text
Corely/
│
├── backend/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── academics.routes.js
│   │   ├── attendance.routes.js
│   │   ├── schedule.routes.js
│   │   └── tasks.routes.js
│   │
│   ├── controllers/
│   │
│   ├── services/
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
│
├── frontend/
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── login.css
│   │   ├── register.css
│   │   └── landing.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── navigation.js
│   │   ├── academics.js
│   │   ├── attendance.js
│   │   └── auth.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── schedule.html
│   ├── tasks.html
│   ├── academics.html
│   ├── attendance.html
│   └── profile.html
│
└── README.md
