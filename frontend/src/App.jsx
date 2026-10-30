import { useState, useEffect } from 'react';

// Express backend API base URL
const API_URL = 'http://localhost:5001/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // New student form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    department: 'Computer Science',
    year: '3rd Year',
    email: '',
    gpa: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch students from the Express backend using native fetch()
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Server responded with HTTP status ${response.status} (${response.statusText})`);
      }
      const json = await response.json();
      
      // Handle both { success: true, data: [...] } and direct array formats
      const studentList = Array.isArray(json) ? json : json.data || [];
      setStudents(studentList);
    } catch (err) {
      console.error('Error fetching student records:', err);
      setError(
        err.message.includes('Failed to fetch')
          ? 'Cannot connect to Express backend. Please ensure the backend server is running on http://localhost:5001 with cors enabled.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch on initial component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Add Student submission
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo || !formData.department) {
      alert('Please fill out the required fields: Roll No, Name, and Department');
      return;
    }

    setFormSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to add student. Server status: ${response.status}`);
      }

      // Reset form and reload student list
      setFormData({
        rollNo: '',
        name: '',
        department: 'Computer Science',
        year: '3rd Year',
        email: '',
        gpa: ''
      });
      setShowAddForm(false);
      await fetchStudents();
    } catch (err) {
      alert(`Error saving student: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const q = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(q) ||
      student.rollNo?.toLowerCase().includes(q) ||
      student.department?.toLowerCase().includes(q) ||
      student.email?.toLowerCase().includes(q)
    );
  });

  // Calculate quick stats
  const totalCount = students.length;
  const avgGpa = totalCount > 0
    ? (students.reduce((acc, s) => acc + (parseFloat(s.gpa) || 0), 0) / totalCount).toFixed(2)
    : '0.00';
  const deptCount = new Set(students.map((s) => s.department)).size;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-badge">🎓</div>
          <div>
            <h1>Student Management Portal</h1>
            <p className="subtitle">
              Connected to Express REST API (<code className="code-pill">GET /api/students</code>) via <code className="code-pill">fetch()</code> with CORS
            </p>
          </div>
        </div>
        <div className="header-actions">
          <div className={`status-badge ${error ? 'status-error' : loading ? 'status-loading' : 'status-online'}`}>
            <span className="dot"></span>
            {error ? 'Backend Offline' : loading ? 'Fetching...' : 'Backend Connected (Port 5001)'}
          </div>
          <button className="btn btn-secondary" onClick={fetchStudents} disabled={loading} title="Refresh data">
            🔄 Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '✕ Close Form' : '+ Add Student'}
          </button>
        </div>
      </header>

      {/* Quick Stats Bar */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Total Enrolled</span>
          <span className="stat-value">{totalCount}</span>
          <span className="stat-caption">Active students</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Departments</span>
          <span className="stat-value">{deptCount}</span>
          <span className="stat-caption">Academic faculties</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Average GPA</span>
          <span className="stat-value">{avgGpa}</span>
          <span className="stat-caption">Across all cohorts</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">API Endpoint</span>
          <span className="stat-value stat-code">/api/students</span>
          <span className="stat-caption">Express backend port 5001</span>
        </div>
      </div>

      {/* Add Student Modal / Form Dropdown */}
      {showAddForm && (
        <div className="card form-card">
          <h2 className="section-title">Add New Student Record</h2>
          <p className="section-desc">Submit a new student to Express backend via <code className="code-pill">POST /api/students</code></p>
          <form onSubmit={handleAddStudent} className="form-grid">
            <div className="form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. CS2026-007"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
              </select>
            </div>
            <div className="form-group">
              <label>Academic Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="e.g. priya.sharma@example.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>GPA / Marks</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                placeholder="e.g. 3.80"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                {formSubmitting ? 'Saving...' : 'Save Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Area */}
      <div className="card">
        {/* Controls Bar */}
        <div className="controls-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, roll no, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>

          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📋 Table View
            </button>
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              🗂️ Cards View
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="status-container">
            <div className="spinner"></div>
            <p className="loading-text">Fetching students from Express backend (<code className="code-pill">GET /api/students</code>)...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="alert alert-error">
            <div className="alert-header">
              <span className="alert-icon">⚠️</span>
              <h3>Connection Error</h3>
            </div>
            <p className="alert-message">{error}</p>
            <div className="alert-guidance">
              <p><strong>Troubleshooting Steps:</strong></p>
              <ol>
                <li>Start the Express backend in the terminal: <code>cd backend && npm start</code></li>
                <li>Verify Express is listening on port 5001 (<a href="http://localhost:5001/api/students" target="_blank" rel="noreferrer">http://localhost:5001/api/students</a>)</li>
                <li>Verify CORS middleware is active (<code className="code-pill">app.use(cors())</code>)</li>
              </ol>
            </div>
            <button className="btn btn-primary mt-3" onClick={fetchStudents}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredStudents.length === 0 && (
          <div className="status-container empty-state">
            <span className="empty-icon">📂</span>
            <h3>No students found</h3>
            <p>{searchTerm ? `No records matched "${searchTerm}". Try another search.` : 'No student records available.'}</p>
            {searchTerm && (
              <button className="btn btn-secondary mt-3" onClick={() => setSearchTerm('')}>
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Data Display: Table View */}
        {!loading && !error && filteredStudents.length > 0 && viewMode === 'table' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Academic Year</th>
                  <th>Email</th>
                  <th>GPA</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id || student.rollNo}>
                    <td>
                      <span className="roll-tag">{student.rollNo}</span>
                    </td>
                    <td>
                      <div className="student-profile">
                        <div className="avatar">
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <span className="student-name">{student.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="dept-badge">{student.department}</span>
                    </td>
                    <td>{student.year || 'N/A'}</td>
                    <td>
                      <a href={`mailto:${student.email}`} className="email-link">
                        {student.email || '—'}
                      </a>
                    </td>
                    <td>
                      <span className="gpa-badge">{parseFloat(student.gpa || 0).toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Data Display: Grid / Cards View */}
        {!loading && !error && filteredStudents.length > 0 && viewMode === 'grid' && (
          <div className="cards-grid">
            {filteredStudents.map((student) => (
              <div key={student.id || student.rollNo} className="student-card">
                <div className="student-card-header">
                  <div className="avatar lg">
                    {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h3 className="card-name">{student.name}</h3>
                    <span className="roll-tag">{student.rollNo}</span>
                  </div>
                </div>
                <div className="student-card-body">
                  <div className="card-row">
                    <span className="row-label">Department:</span>
                    <span className="dept-badge">{student.department}</span>
                  </div>
                  <div className="card-row">
                    <span className="row-label">Year:</span>
                    <span>{student.year || 'N/A'}</span>
                  </div>
                  <div className="card-row">
                    <span className="row-label">GPA:</span>
                    <span className="gpa-badge">{parseFloat(student.gpa || 0).toFixed(2)}</span>
                  </div>
                  <div className="card-row">
                    <span className="row-label">Email:</span>
                    <a href={`mailto:${student.email}`} className="email-link ellipsis">
                      {student.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer info within card */}
        {!loading && !error && (
          <div className="table-footer">
            <span>Showing {filteredStudents.length} of {students.length} students</span>
            <span className="api-source">Data source: <code>fetch('http://localhost:5001/api/students')</code></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

