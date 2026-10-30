# Experiment 9: Connect React Frontend to Express Backend

A full-stack application connecting a React frontend (Vite) to an Express REST API backend using native `fetch()` with Cross-Origin Resource Sharing (`cors`) enabled.

---

## 📋 Features

- **Express Backend**:
  - `cors` middleware installed and configured with `app.use(cors())`.
  - `GET /api/students`: Returns a list of all student records.
  - `POST /api/students`: Allows adding new student records.
  - Runs on port `5001` (avoids macOS AirPlay Receiver port `5000` conflict).

- **React Frontend**:
  - Built with Vite & React.
  - Uses `useEffect()` and modern `async/await fetch()` to request `http://localhost:5001/api/students`.
  - Full state lifecycle: loading indicator, error handling with troubleshooting tips, and empty state.
  - Interactive UI: search/filter by name, roll no, or department, view toggling between **Table View** and **Card Grid View**, and an **Add Student** form.

---

## 📁 Project Structure

```text
exp-9/
├── backend/
│   ├── package.json        # Express & CORS dependencies
│   └── server.js           # Express API server with CORS & GET /api/students
├── frontend/
│   ├── package.json        # React & Vite dependencies
│   ├── vite.config.js      # Vite build & dev server config
│   ├── index.html          # HTML entry point
│   └── src/
│       ├── main.jsx        # React root rendering
│       ├── App.jsx         # Component fetching & displaying students
│       └── index.css       # Clean responsive styles
├── package.json            # Root convenience scripts
└── README.md
```

---

## 🚀 How to Run

### Step 1: Start the Express Backend
In a terminal, navigate to the `backend` folder and start the server:
```bash
cd backend
npm install   # If not already installed
npm start
```
> The backend server will start on **`http://localhost:5001`**.  
> Test in browser or curl: `http://localhost:5001/api/students`

### Step 2: Start the React Frontend
In a separate terminal, navigate to the `frontend` folder and launch the Vite dev server:
```bash
cd frontend
npm install   # If not already installed
npm run dev
```
> Vite will start the frontend on **`http://localhost:5173`**.  
> Open `http://localhost:5173` in your browser.

---

## ⚡ Key Implementation Highlights

### 1. Express Backend with CORS (`backend/server.js`)
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for all incoming cross-origin requests
app.use(cors());
app.use(express.json());

// In-memory student records
const students = [
  { id: 1, rollNo: "CS2026-001", name: "Aarav Sharma", department: "Computer Science", year: "3rd Year", email: "aarav.sharma@example.edu", gpa: 3.85 },
  // ...
];

// GET /api/students
app.get('/api/students', (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
```

### 2. React Frontend with `fetch()` (`frontend/src/App.jsx`)
```jsx
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setStudents(Array.isArray(json) ? json : json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Display students in JSX...
}
```

# exp-09
