# Egyptian Society of Landscape Architects (ESLA) - Membership Portal
## بوابة تسجيل العضوية واعتماد المستندات الرقمية - الجمعية المصرية لمعماريي تنسيق الموقع

A modern, full-stack, bilingual (Arabic primary RTL / English toggle LTR) portal for the **Egyptian Society of Landscape Architects (ESLA)** (الجمعية المصرية لمعماريي تنسيق الموقع).

---

## 🌟 Key Features

1. **Bilingual Experience**: Built with Arabic as the primary language with full RTL support (Cairo typography), plus instant toggle to English (LTR).
2. **Standard Egyptian Membership Categories**:
   - **Student (عضو طالب)**: Undergraduate students in Architecture / Landscape programs.
   - **Associate / Graduate (عضو منتسب - حديث تخرج)**: Recent graduates (0–3 years) with B.Sc. and Syndicate registration.
   - **Full / Professional (عضو عامل - ممارس محترف)**: Practicing landscape architects with 3+ years experience and project portfolio.
   - **Fellow / Consultant (عضو استشاري - زميل)**: Certified Syndicate Consultant with 15+ years experience and landmark projects.
3. **Dynamic Document Checklist**:
   - Automatically changes required documents based on the chosen tier.
   - Drag-and-drop file upload with format validation (`.pdf`, `.jpg`, `.png`) and max size limit (10MB–20MB).
   - Instant file preview and secure downloads.
4. **Application Tracking Stepper**:
   - Visual 4-step progress: `فئة العضوية -> رفع المستندات -> الفحص الفني والتدقيق -> الاعتماد الرسمي`.
   - Real-time notification banners for administrative feedback or re-upload requests.
5. **Admin Review Board**:
   - Comprehensive dashboard with statistics (Total, Under Review, Approved, Needs Action).
   - Fast search (name, email, phone) and filter tags.
   - Applicant inspection drawer with direct WhatsApp contact link, document preview/download buttons, and decision controls (Approve, Request Additional Documents, Reject).

---

## ⚡ Quick Start (Windows)

### Option 1: One-Click Startup
Double-click `run_portal.bat` in the project root directory:
```powershell
.\run_portal.bat
```
This will automatically activate the Python virtual environment, seed test data, launch the server, and open `http://localhost:8000` in your default browser.

### Option 2: Step-by-Step Terminal Instructions

#### 1. Navigate to the backend directory:
```powershell
cd C:\Users\mouda\.gemini\antigravity\scratch\esla-portal\backend
```

#### 2. Activate the virtual environment:
```powershell
.\venv\Scripts\Activate.ps1
```

#### 3. (Optional) Run the database seed:
```powershell
python -m app.seed
```

#### 4. Launch the FastAPI server:
```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 5. Open in browser:
- **Web Portal**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔐 Pre-Seeded Test Accounts

You can test any role instantly using the **Quick Demo Buttons** at the top of the portal, or log in with these credentials:

| Role / Scenario | Email | Password | Status |
| :--- | :--- | :--- | :--- |
| **System Admin (رئيس لجنة العضوية)** | `admin@esla.org.eg` | `Admin@ESLA2026` | Has full access to the Admin Review Board |
| **Student Applicant (طالب جديد)** | `student@esla.org.eg` | `student123` | `pending_review` (Awaiting review) |
| **Graduate Applicant (خريجة)** | `yasmine@esla.org.eg` | `member123` | `needs_action` (Requires Syndicate card re-upload) |
| **Professional Architect (ممارس)** | `tarek@esla.org.eg` | `member123` | `under_verification` (Portfolio under review) |
| **Consultant Architect (استشاري معتمد)** | `sami@esla.org.eg` | `member123` | `approved` (Membership officially approved) |

---

## 📁 Project Structure

```
esla-portal/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI server & static file serving
│   │   ├── database.py          # SQLite database connection
│   │   ├── models.py            # SQLAlchemy models (User, Application, Document)
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── auth.py              # JWT authentication & bcrypt password hashing
│   │   ├── seed.py              # Seed script for initial admin & realistic applicants
│   │   └── routers/
│   │       ├── auth_routes.py   # Register, Login, Me
│   │       ├── tier_routes.py   # Membership tiers & document requirements
│   │       ├── application_routes.py # Tier selection & submission
│   │       ├── document_routes.py    # File upload, preview & download
│   │       └── admin_routes.py       # Admin applicant table, inspection & decisions
│   ├── uploads/                 # Local directory storing uploaded PDFs & images
│   ├── esla_portal.db           # SQLite database
│   ├── requirements.txt         # Backend Python dependencies
│   └── venv/                    # Python virtual environment
├── frontend/
│   ├── index.html               # Self-contained bilingual React + Tailwind application
│   ├── package.json             # React / Vite project configuration
│   ├── vite.config.js           # Vite development server configuration
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── translations.js      # Full Arabic & English dictionaries
│       └── components/
│           ├── Navbar.jsx
│           ├── TierSelector.jsx
│           ├── DocumentUpload.jsx
│           ├── StatusDashboard.jsx
│           └── AdminDashboard.jsx
├── run_portal.bat               # Windows 1-click launch script
└── README.md                    # Project documentation
```
