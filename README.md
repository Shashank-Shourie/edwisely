# 📚 Academic Syllabus Management System

A backend system built with **FastAPI + MongoDB (Beanie)** that allows universities/colleges to manage syllabus documents with versioning and AI-based comparison.

---

## 🚀 Features

### 👤 Authentication
- JWT-based login system
- Role support (user/admin)
- Secure password hashing (bcrypt)

---

### 📄 Subject Management
- Create subjects with metadata:
  - University
  - College
  - Academic Year
  - Regulation
  - Semester
  - Branch
  - Type (core/elective/lab)
  - Name
- Unique **USIC (Unique Subject Identification Code)**

---

### 📁 File Storage
- Upload syllabus (PDF / DOC / DOCX)
- Stored in **AWS S3**
- Unique filenames (`usic + uuid + filename`)

---

### 🔁 Version Control
- Each upload creates a new version
- Tracks:
  - version number
  - previous version reference
- Latest version retrieval

---

### 🤖 AI Comparison
- Compares new syllabus with previous version
- Uses **Groq (Llama 3.1)** for:
  - Added topics
  - Removed topics
  - Modified topics

---

### 🔍 Subject Retrieval
- Fetch subjects by user’s college
- Returns only **latest version**
- Multi-tenant support

---

### 🗑️ Delete Subjects
- Delete subject (with access control)
- Optional: delete all versions

---

## 🏗️ Tech Stack

- **FastAPI**
- **MongoDB + Beanie ODM**
- **AWS S3**
- **Groq API (LLM)**
- **JWT Authentication**
- **Pydantic**

---

---

## ⚙️ Setup Instructions

### 1️⃣ Clone repo
```bash
git clone -b master https://github.com/Shashank-Shourie/edwisely
cd edwisely
docker compose up --build
```

open localhost 3000

test user
email:tt@gmail.com
password:abcd
