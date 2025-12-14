# 🗺️ VSU Boardmap Web

**A modern property and occupant management system for Visayas State University**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge\&logo=vite\&logoColor=FFD62E)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)](https://supabase.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge\&logo=react-router\&logoColor=white)](https://reactrouter.com/)

---

VSU Boardmap Web is a comprehensive web application designed to streamline **property management**, **occupant tracking**, and **communication** within **Visayas State University**. It serves as a digital boardmap system connecting **property owners** with **students and staff** seeking accommodation.

🌐 **Live Demo:** [https://batch-2025-vsu-boardmap-web.vercel.app](https://batch-2025-vsu-boardmap-web.vercel.app)

---

## ✨ Features

### 🔐 Authentication & Security

* Secure authentication via **Supabase Auth**
* Role-based access control (Owners & Occupants)
* Protected routes and session handling

### 🏠 Property Management

* Create, update, view, and delete property listings
* Property details with images and specifications
* Real-time occupancy status tracking

### 👥 Occupant Management

* Track current and past occupants
* Manage agreements and occupancy terms
* View occupant history per property

### 💬 Messaging System

* Real-time owner–occupant communication
* Organized conversation threads
* Message history per property or inquiry

### 📊 Dashboard & Analytics

* Owner dashboard overview
* Inquiry and message notifications
* Quick-access management actions

### 🎨 UI / UX

* Responsive design (desktop, tablet, mobile)
* Clean and accessible interface
* Intuitive navigation and custom branding

---

## 🛠️ Technology Stack

| Category   | Technology   | Description                |
| ---------- | ------------ | -------------------------- |
| Frontend   | React 18     | Component-based UI         |
| Language   | TypeScript   | Type-safe development      |
| Build Tool | Vite         | Fast dev server & bundling |
| Routing    | React Router | Client-side navigation     |
| Styling    | CSS3         | Custom responsive styles   |
| Backend    | Supabase     | Auth, database, APIs       |
| Deployment | Vercel       | Production hosting         |

---

## 📁 Project Structure

```text
BATCH-2025-VSU-BOARDMAP-WEB/
├── board-map/ # Main application folder
├── build/ # Production build output
├── node_modules/ # Dependencies
├── public/ # Static assets
│ ├── BoardMap_Logo.png
│ ├── BoardMap_Logo_White.png
│ ├── index.html
│ ├── manifest.json
│ └── robots.txt
├── src/ # Source code
│ ├── assets/ # Images and static assets
│ ├── components/ # Reusable React components
│ │ ├── ui/ # UI components
│ │ ├── AboutPage.tsx
│ │ ├── ContactPage.tsx
│ │ ├── FilterModal.tsx
│ │ ├── Footer.tsx
│ │ ├── LandingPage.tsx
│ │ ├── LoadingScreen.tsx
│ │ ├── MessagingPage.tsx
│ │ ├── OwnerDashboard.tsx
│ │ ├── PropertyCard.tsx
│ │ ├── PropertyDetails.tsx
│ │ ├── PropertyForm.tsx
│ │ └── StudentDashboard.tsx
│ ├── imports/ # SVG and icon imports
│ ├── styles/ # Global styles
│ │ └── global.css
│ ├── utils/ # Utility functions
│ │ └── supabase/ # Supabase setup
│ │ ├── functions/ # Supabase edge functions
│ │ ├── client.tsx
│ │ ├── api.tsx
│ │ ├── info.ts
│ │ └── properties.ts
│ ├── App.tsx # Root component
│ ├── App.css
│ ├── index.tsx # Entry point
│ ├── index.css
│ ├── react-app-env.d.ts
│ ├── reportWebVitals.ts
│ └── setupTests.ts
├── .env # Environment variables
├── .gitignore
├── .npmrc
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```text
batch-2025-vsu-boardmap-web/
├── public/ # Static assets
│ ├── logo.png # Application logo
│ └── index.html # HTML template
├── src/ # Source code
│ ├── components/ # Reusable components
│ │ ├── auth/ # Authentication
│ │ ├── common/ # Shared UI
│ │ ├── dashboard/ # Dashboard UI
│ │ └── messaging/ # Messaging system
│ ├── pages/ # Page-level components
│ │ ├── LoginPage.tsx
│ │ ├── SignupPage.tsx
│ │ ├── OwnerDashboard.tsx
│ │ └── ...
│ ├── styles/ # CSS styles
│ ├── utils/ # Helpers & utilities
│ ├── types/ # TypeScript types
│ ├── App.tsx # Root component
│ └── main.tsx # Entry point
├── .env.example # Env template
├── package.json # Dependencies & scripts
├── tsconfig.json # TS config
├── vite.config.ts # Vite config
└── README.md # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** v16+
* **npm** v7+ or **yarn**
* **Git**
* **Supabase account** (free tier supported)

### Installation

```bash
# Clone repository
git clone https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-vsu-boardmap-web.git
cd batch-2025-vsu-boardmap-web

# Install dependencies
npm install
# or
yarn install
```

### Environment Variables

```bash
cp .env.example .env
```

Add the following from your Supabase dashboard:

* Project URL
* Anon public key

### Supabase Setup

In **Supabase → SQL Editor**, create tables for:

* `profiles`
* `properties`
* `occupants`
* `messages`
* `inquiries`

Enable **Row Level Security (RLS)** and configure policies accordingly.

### Run Locally

```bash
npm run dev
# or
yarn dev
```

App runs at: **[http://localhost:5173](http://localhost:5173)**

---

## 📜 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

## 📱 Application Workflow

### Property Owners

1. Register / Login
2. Access owner dashboard
3. Add and manage properties
4. Track occupants & agreements
5. Communicate via messaging system

### Students & Staff (Occupants)

1. Browse available properties
2. Send inquiries
3. Message property owners
4. Manage agreements

---

## 🔧 Development Guide

### Contribution Flow

```bash
git checkout -b feature/your-feature
git commit -m "feat: add new feature"
git push origin feature/your-feature
```

Open a **Pull Request** after testing.

### Code Standards

* TypeScript only
* Functional React components
* React Hooks for state management
* Responsive-first design
* Conventional commit messages

---

## 🧪 Testing

### Manual Testing

* Authentication flows
* Property CRUD operations
* Messaging system
* Responsive UI

### Recommended Tools

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Set environment variables
3. Auto-deploy on `main` branch

### Manual Build

```bash
npm run build
```

---

## 👥 Contributors

**Christian Earl James N. Boyles** – Lead Developer
**Kyle Anthony Nierras** – Developer

---

## 🎓 Course Information

Developed for **CSci 153: Web Systems and Technologies**
Visayas State University — Batch 2025

---

## 📄 License

This project is for **academic purposes only**.
All rights reserved by the developers and Visayas State University.

---

## 🙏 Acknowledgments

* Visayas State University
* Supabase
* React & Vite teams
* CSci 153 instructors
* Open-source community

---

## 📞 Support

* GitHub Issues
* Developer GitHub profiles
* Course instructors
