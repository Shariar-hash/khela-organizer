# 🏆 Khela Organizer | খেলা অর্গানাইজার

A modern, beginner-friendly tournament management web application with bilingual support (English/Bangla).

একটি আধুনিক, শিক্ষানবিস-বান্ধব টুর্নামেন্ট ম্যানেজমেন্ট ওয়েব অ্যাপ্লিকেশন যা ইংরেজি ও বাংলা উভয় ভাষায় কাজ করে।

![Kela Organizer](https://img.shields.io/badge/Kela-Organizer-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square)

## ✨ Features | বৈশিষ্ট্য

| English | বাংলা |
|---------|-------|
| 🏆 Create and manage tournaments | 🏆 টুর্নামেন্ট তৈরি ও পরিচালনা |
| 📱 Phone + OTP authentication | 📱 ফোন + OTP দিয়ে লগইন |
| 👥 Player registration with unique codes | 👥 ইউনিক কোড দিয়ে খেলোয়াড় রেজিস্ট্রেশন |
| 🎯 Team management (manual/random) | 🎯 দল ব্যবস্থাপনা (ম্যানুয়াল/র‍্যান্ডম) |
| 📢 Announcements and posts | 📢 ঘোষণা ও পোস্ট |
| 🎨 AI-powered logo generation | 🎨 AI লোগো জেনারেশন |
| 🌐 Bilingual support (EN/BN) | 🌐 দ্বিভাষিক সাপোর্ট (EN/BN) |
| 📱 Mobile-friendly design | 📱 মোবাইল-বান্ধব ডিজাইন |

## 🛠️ Tech Stack | প্রযুক্তি

- **Frontend**: Next.js 16 with TypeScript
- **Database**: NeonDB (PostgreSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **State**: Zustand
- **AI**: Google Gemini API
- **Icons**: Lucide React

## 🚀 Getting Started | শুরু করুন

### Prerequisites | পূর্বশর্ত

- Node.js 18+
- NeonDB account ([neon.tech](https://neon.tech))
- Google Gemini API key (optional, for logo generation)

### Installation | ইনস্টলেশন

1. **Clone the repository | রিপোজিটরি ক্লোন করুন:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/kela-organizer.git
   cd kela-organizer
   ```

2. **Install dependencies | ডিপেন্ডেন্সি ইনস্টল করুন:**
   ```bash
   npm install
   ```

3. **Set up environment variables | এনভায়রনমেন্ট ভেরিয়েবল সেট করুন:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your NeonDB connection string:
   ```
   DATABASE_URL=postgresql://username:password@host.neon.tech/neondb?sslmode=require
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Push database schema | ডেটাবেস স্কিমা পুশ করুন:**
   ```bash
   npx drizzle-kit push
   ```

5. **Run the development server | ডেভেলপমেন্ট সার্ভার চালান:**
   ```bash
   npm run dev
   ```

6. **Open in browser | ব্রাউজারে খুলুন:**
   ```
   http://localhost:3000
   ```

## 📖 Usage Guide | ব্যবহার নির্দেশিকা

### Creating a Tournament | টুর্নামেন্ট তৈরি

1. Login with your phone number (OTP shown in demo mode)
2. Click "Create Tournament" from dashboard
3. Fill in tournament details
4. Share the unique 6-character code with players

### Joining a Tournament | টুর্নামেন্টে যোগদান

1. Get the tournament code from organizer
2. Click "Join Tournament"
3. Enter the code and join

### Managing Teams | দল পরিচালনা

- **Manual**: Create teams and add players manually
- **Random**: Auto-distribute players into teams
- **Categories**: Set player categories (Batsman, Bowler, etc.) for balanced teams

### Posting Announcements | ঘোষণা পোস্ট

1. Go to Announcements tab
2. Create new announcement
3. Pin important ones to top

## 📁 Project Structure | প্রজেক্ট স্ট্রাকচার

```
kela-organizer/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Dashboard pages
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── tournaments/    # Tournament pages
│   │   │   ├── profile/        # User profile
│   │   │   └── docs/           # Documentation
│   │   ├── api/                # API routes
│   │   └── login/              # Login page
│   ├── components/
│   │   ├── ui/                 # UI components
│   │   └── layout/             # Layout components
│   └── lib/
│       ├── db/                 # Database schema & connection
│       ├── auth/               # Authentication utilities
│       ├── i18n/               # Internationalization
│       └── utils.ts            # Utility functions
├── drizzle.config.ts           # Drizzle ORM config
├── tailwind.config.ts          # Tailwind CSS config
└── package.json
```

## 🌐 API Endpoints | API এন্ডপয়েন্ট

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth` | POST | Send OTP / Verify OTP |
| `/api/auth/logout` | POST | Logout user |
| `/api/auth/me` | GET | Get current user |
| `/api/tournaments` | GET/POST | List/Create tournaments |
| `/api/tournaments/join` | POST | Join tournament |
| `/api/tournaments/[id]` | GET/PATCH/DELETE | Tournament details |
| `/api/tournaments/[id]/players` | GET/DELETE | Manage players |
| `/api/tournaments/[id]/teams` | GET/POST/PUT | Manage teams |
| `/api/tournaments/[id]/admins` | GET/POST/DELETE | Manage admins |
| `/api/tournaments/[id]/announcements` | GET/POST/DELETE | Announcements |
| `/api/tournaments/[id]/categories` | GET/POST/DELETE | Categories |
| `/api/generate-logo` | POST | AI logo generation |

## 🎨 Screenshots | স্ক্রিনশট

Coming soon... | শীঘ্রই আসছে...

## 🤝 Contributing | অবদান

Contributions are welcome! Feel free to open issues or submit pull requests.

অবদান স্বাগত! ইস্যু খুলুন বা পুল রিকুয়েস্ট জমা দিন।

## 📄 License | লাইসেন্স

MIT License - feel free to use this project for your own tournaments!

MIT লাইসেন্স - আপনার নিজের টুর্নামেন্টের জন্য এই প্রজেক্ট ব্যবহার করুন!

## 💬 Support | সাপোর্ট

If you have any questions or need help, open an issue on GitHub.

কোন প্রশ্ন থাকলে বা সাহায্য প্রয়োজন হলে, GitHub এ একটি ইস্যু খুলুন।

---

Made with ❤️ for the tournament organizing community | টুর্নামেন্ট আয়োজক সম্প্রদায়ের জন্য ❤️ দিয়ে তৈরি
