# Students Test Management System

A full-stack web application for managing student tests, results, and user authentication. The system allows administrators to create tests, manage students, evaluate results, and track performance through an easy-to-use interface.

---

## 🚀 Features

- Student Registration & Login
- Secure Authentication using JWT
- Role-Based Access (Admin & Student)
- Create, Update, and Delete Tests
- Assign Tests to Students
- Submit Test Answers
- Automatic Score Calculation
- View Test Results
- Responsive User Interface
- RESTful API

---

## 🛠 Tech Stack

### Frontend
- React.js
- Axios
- Bootstrap / CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### Tools
- Git
- GitHub
- Postman
- Render

---

## 📂 Project Structure

```
students-test-system/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/students-test-system.git
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

---

## ▶️ Running the Project

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
npm start
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

### Students

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/students | Get All Students |
| POST | /api/students | Add Student |
| PUT | /api/students/:id | Update Student |
| DELETE | /api/students/:id | Delete Student |

### Tests

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/tests | Get All Tests |
| POST | /api/tests | Create Test |
| PUT | /api/tests/:id | Update Test |
| DELETE | /api/tests/:id | Delete Test |

### Results

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/results | Submit Test |
| GET | /api/results/:studentId | Student Results |

---

## 📸 Screenshots

Add screenshots of:

- Login Page
- Dashboard
- Test Creation
- Student Test Page
- Results Page

---

## 🌐 Live Demo

Frontend:
```
https://your-frontend-url.onrender.com
```

Backend:
```
https://your-backend-url.onrender.com
```

---

## 🔮 Future Improvements

- Email Notifications
- Leaderboard
- Timer-Based Tests
- Question Categories
- CSV/PDF Result Export
- Dashboard Analytics
- Unit Testing
- Docker Support
- CI/CD Pipeline

---

## 👨‍💻 Author

**Your Name**

GitHub: https://github.com/your-username

---

## 📄 License

This project is licensed under the MIT License.
