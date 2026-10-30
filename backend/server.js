const express = require('express');
const cors = require('cors');

const app = express();
// Default to port 5001 because macOS AirPlay Receiver occupies port 5000 by default
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend requests
app.use(express.json());

// In-memory student records database
const students = [
  {
    id: 1,
    rollNo: "CS2026-001",
    name: "Aarav Sharma",
    department: "Computer Science",
    year: "3rd Year",
    email: "aarav.sharma@example.edu",
    gpa: 3.85
  },
  {
    id: 2,
    rollNo: "CS2026-002",
    name: "Diya Patel",
    department: "Information Technology",
    year: "3rd Year",
    email: "diya.patel@example.edu",
    gpa: 3.92
  },
  {
    id: 3,
    rollNo: "CS2026-003",
    name: "Rohan Verma",
    department: "Data Science & AI",
    year: "2nd Year",
    email: "rohan.verma@example.edu",
    gpa: 3.68
  },
  {
    id: 4,
    rollNo: "CS2026-004",
    name: "Ananya Iyer",
    department: "Computer Science",
    year: "4th Year",
    email: "ananya.iyer@example.edu",
    gpa: 3.95
  },
  {
    id: 5,
    rollNo: "CS2026-005",
    name: "Mohammad Shadab",
    department: "Software Engineering",
    year: "3rd Year",
    email: "shadab.ansari@example.edu",
    gpa: 3.89
  },
  {
    id: 6,
    rollNo: "CS2026-006",
    name: "Pooja Gupta",
    department: "Electronics & Communication",
    year: "2nd Year",
    email: "pooja.gupta@example.edu",
    gpa: 3.75
  }
];

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Student Management API Server is running',
    endpoints: {
      getAllStudents: 'GET /api/students',
      getStudentById: 'GET /api/students/:id',
      createStudent: 'POST /api/students'
    }
  });
});

// GET /api/students - Fetch and return all student records
app.get('/api/students', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students',
      error: error.message
    });
  }
});

// GET /api/students/:id - Fetch single student
app.get('/api/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// POST /api/students - Add a new student
app.post('/api/students', (req, res) => {
  const { name, rollNo, department, year, email, gpa } = req.body;

  if (!name || !rollNo || !department) {
    return res.status(400).json({
      success: false,
      message: 'name, rollNo, and department are required fields'
    });
  }

  const newStudent = {
    id: students.length ? Math.max(...students.map(s => s.id)) + 1 : 1,
    rollNo,
    name,
    department,
    year: year || '1st Year',
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.edu`,
    gpa: gpa ? parseFloat(gpa) : 3.50
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: newStudent
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Students API available at http://localhost:${PORT}/api/students`);
});

