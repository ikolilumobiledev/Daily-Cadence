import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function FirstTime() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    reason: '',
    department: '',
    branch: '',
    purpose: '',
    telephone: '',
    company: '',
    picture: null,
  });

  // Load departments from localStorage or use default list
  const [departments, setDepartments] = useState(() => {
    const savedDepartments = localStorage.getItem('departments');
    return savedDepartments ? JSON.parse(savedDepartments) : [
      'Select Department',
      'Human Resources',
      'Finance',
      'Information Technology',
      'Operations',
      'Marketing',
      'Legal',
      'Customer Service',
      'Risk Management',
      'Compliance',
      'Treasury'
    ];
  });

  // Initialize branches state
  const [branches, setBranches] = useState([
    { label: 'Select Branch', value: '' }
  ]);

  // New state for adding new department
  const [newDepartment, setNewDepartment] = useState('');
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:5001/fnb_branches');
        if (!response.ok) {
          throw new Error('Failed to fetch branches');
        }
        const data = await response.json();
        setBranches([
          { label: 'Select Branch', value: '' },
          ...data
        ]);
      } catch (error) {
        console.error('Error fetching branches:', error);
        setError('Failed to load branches. Please try again.');
      }
    };

    fetchBranches();
  }, []);

  // Save to localStorage when departments change
  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding new department
  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      setError('Department name cannot be empty');
      return;
    }
    
    if (departments.includes(newDepartment)) {
      setError('Department already exists');
      return;
    }
    
    setDepartments([...departments, newDepartment]);
    setNewDepartment('');
    setShowAddDepartment(false);
    setError('');
  };

  const handlePictureCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      video.srcObject = stream;
      
      await new Promise(resolve => video.addEventListener('loadedmetadata', resolve));
      video.play();
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      const picture = canvas.toDataURL('image/jpeg');
      
      const base64Size = picture.length * (3/4);
      if (base64Size > 5 * 1024 * 1024) {
        setError('Captured image is too large. Please try again.');
        return;
      }
      
      setFormData({ ...formData, picture });
      
      stream.getTracks().forEach(track => track.stop());
      
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera access to capture photos.');
      } else {
        setError('Failed to access camera. Please try again.');
      }
      console.error('Camera error:', err);
    }
  };

  const validateTelephone = async () => {
    if (!formData.telephone || formData.telephone.trim() === '') {
      setError('Please enter a telephone number.');
      return false;
    }
  
    try {
      // Log the request URL for debugging
      const url = `http://localhost:5001/visitors/check-telephone/${encodeURIComponent(formData.telephone)}`;
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      // Log the response status
      console.log(`Response status: ${response.status}`);
  
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Endpoint not found (404). Please check server routes.`);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      }
  
      const data = await response.json();
      console.log('Telephone check response:', data);
      
      if (data.exists) {
        setError('Telephone number already registered.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validating telephone:', error);
      setError(`Failed to validate telephone number: ${error.message}`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields first
    if (!formData.name || !formData.telephone || !formData.department || !formData.branch) {
      setError('Please fill in all required fields.');
      return;
    }

    const isValid = await validateTelephone();
    if (!isValid) return;

    if (!formData.picture) {
      setError('Please take a picture before submitting.');
      return;
    }

    // Find the selected branch object to get both code and name
    const selectedBranch = branches.find(branch => branch.value === formData.branch);
    const branchName = selectedBranch ? selectedBranch.label : '';

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          reason: formData.reason,
          department: formData.department,
          branch: formData.branch, // Branch code
          branchName: branchName, // Branch name
          purpose: formData.purpose,
          telephone: formData.telephone,
          company: formData.company,
          picture: formData.picture,
          date: new Date().toISOString().split('T')[0],
          timeIn: new Date().toTimeString().split(' ')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form. Please try again later.');
      }

      alert('Thank you for Visiting First National Bank!');
      navigate('/');
    } catch (error) {
      console.error("Error submitting data to the server:", error);
      setError(error.message);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0F384A' }}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <img src="fnb back.png" alt="FNB Logo" style={styles.logo} />
          <h2 style={styles.logoText}>First National Bank</h2>
        </div>
        <header style={styles.formHeader}>
          <h1>Welcome Visitor</h1>
          <p>Please fill in the form below for your visit:</p>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          {renderInput('Name', 'name', 'text', formData, handleChange)}
          {renderInput('Reason to See', 'reason', 'text', formData, handleChange, false)}
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Department:</label>
            <div style={styles.departmentContainer}>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{...styles.input, width: '95%'}}
                required
              >
                {departments.map((dept, index) => (
                  <option key={index} value={index === 0 ? '' : dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => setShowAddDepartment(!showAddDepartment)}
                style={styles.addButton}
              >
                {showAddDepartment ? 'Cancel' : '+'}
              </button>
            </div>
            
            {showAddDepartment && (
              <div style={styles.addNewContainer}>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="Enter new department"
                  style={styles.input}
                />
                <button 
                  type="button" 
                  onClick={handleAddDepartment}
                  style={styles.saveButton}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Branch:</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              style={styles.input}
              required
            >
              {branches.map((branch, index) => (
                <option key={index} value={branch.value}>
                  {branch.value && `${branch.label} (${branch.value})`}
                  {!branch.value && branch.label}
                </option>
              ))}
            </select>
          </div>
          
          {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
          {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
          {renderInput('Company', 'company', 'text', formData, handleChange)}

          <div style={styles.formGroup}>
            <label style={styles.label}>Take a Picture:</label>
            <button 
              type="button"
              onClick={handlePictureCapture}
              style={{
                ...styles.button,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#4CAF50'
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Open Camera
            </button>
            {formData.picture && (
              <div style={styles.previewContainer}>
                <img 
                  src={formData.picture} 
                  alt="Captured" 
                  style={styles.preview}
                />
              </div>
            )}
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

const renderInput = (label, name, type, formData, handleChange, required = true) => (
  <div style={styles.formGroup} key={name}>
    <label style={styles.label}>{label}:</label>
    <input
      type={type}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      required={required}
      style={styles.input}
    />
  </div>
);

//mm
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function FirstTime() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    reason: '',
    department: '',
    branch: '',
    purpose: '',
    telephone: '',
    company: '',
    picture: null,
  });

  // Load departments from localStorage or use default list
  const [departments, setDepartments] = useState(() => {
    const savedDepartments = localStorage.getItem('departments');
    return savedDepartments ? JSON.parse(savedDepartments) : [
      'Select Department',
      'Human Resources',
      'Finance',
      'Information Technology',
      'Operations',
      'Marketing',
      'Legal',
      'Customer Service',
      'Risk Management',
      'Compliance',
      'Treasury'
    ];
  });

  // Optimized branches state
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [branchError, setBranchError] = useState('');

  // New state for adding new department
  const [newDepartment, setNewDepartment] = useState('');
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Optimized useEffect for fetching branches
  useEffect(() => {
    const fetchBranches = async () => {
      setLoadingBranches(true);
      setBranchError('');
      
      try {
        const response = await fetch('http://localhost:5001/fnb_branches');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Assuming your API returns an array of objects with branch_name and branch_code
        const formattedBranches = [
          { branch_name: 'Select Branch', branch_code: '' }, // Default option
          ...data
        ];
        
        setBranches(formattedBranches);
        
      } catch (error) {
        console.error('Error fetching branches:', error);
        setBranchError('Failed to load branches. Please try again.');
        
        // Fallback to default branches if API fails
        setBranches([
          { branch_name: 'Select Branch', branch_code: '' },
          { branch_name: 'Main Branch', branch_code: 'MB001' },
          { branch_name: 'Downtown Branch', branch_code: 'DB002' }
        ]);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  // Save to localStorage when departments change
  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding new department
  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      setError('Department name cannot be empty');
      return;
    }
    
    if (departments.includes(newDepartment)) {
      setError('Department already exists');
      return;
    }
    
    setDepartments([...departments, newDepartment]);
    setNewDepartment('');
    setShowAddDepartment(false);
    setError('');
  };

  const handlePictureCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      video.srcObject = stream;
      
      await new Promise(resolve => video.addEventListener('loadedmetadata', resolve));
      video.play();
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      const picture = canvas.toDataURL('image/jpeg');
      
      const base64Size = picture.length * (3/4);
      if (base64Size > 5 * 1024 * 1024) {
        setError('Captured image is too large. Please try again.');
        return;
      }
      
      setFormData({ ...formData, picture });
      
      stream.getTracks().forEach(track => track.stop());
      
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera access to capture photos.');
      } else {
        setError('Failed to access camera. Please try again.');
      }
      console.error('Camera error:', err);
    }
  };

  const validateTelephone = async () => {
    if (!formData.telephone || formData.telephone.trim() === '') {
      setError('Please enter a telephone number.');
      return false;
    }
  
    try {
      // Log the request URL for debugging
      const url = `http://localhost:5001/visitors/check-telephone/${encodeURIComponent(formData.telephone)}`;
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      // Log the response status
      console.log(`Response status: ${response.status}`);
  
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Endpoint not found (404). Please check server routes.`);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      }
  
      const data = await response.json();
      console.log('Telephone check response:', data);
      
      if (data.exists) {
        setError('Telephone number already registered.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validating telephone:', error);
      setError(`Failed to validate telephone number: ${error.message}`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields first
    if (!formData.name || !formData.telephone || !formData.department || !formData.branch) {
      setError('Please fill in all required fields.');
      return;
    }

    const isValid = await validateTelephone();
    if (!isValid) return;

    if (!formData.picture) {
      setError('Please take a picture before submitting.');
      return;
    }

    // Find the selected branch object to get both code and name
    const selectedBranch = branches.find(branch => branch.branch_code === formData.branch);
    
    if (!selectedBranch) {
      setError('Please select a valid branch.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          reason: formData.reason,
          department: formData.department,
          branch: formData.branch, // This will be the branch_code
          branchName: selectedBranch.branch_name, // This will be the branch_name
          purpose: formData.purpose,
          telephone: formData.telephone,
          company: formData.company,
          picture: formData.picture,
          date: new Date().toISOString().split('T')[0],
          timeIn: new Date().toTimeString().split(' ')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form. Please try again later.');
      }

      alert('Thank you for Visiting First National Bank!');
      navigate('/');
    } catch (error) {
      console.error("Error submitting data to the server:", error);
      setError(error.message);
    }

    setIsLoading(false);
  };

  // Retry function for branch loading
  const retryBranchLoading = async () => {
    setLoadingBranches(true);
    setBranchError('');
    
    try {
      const response = await fetch('http://localhost:5001/fnb_branches');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setBranches([{ branch_name: 'Select Branch', branch_code: '' }, ...data]);
    } catch (error) {
      setBranchError('Failed to load branches. Please try again.');
    } finally {
      setLoadingBranches(false);
    }
  };

  // Render optimized branch field
  const renderBranchField = () => (
    <div style={styles.formGroup}>
      <label style={styles.label}>Branch: *</label>
      
      {loadingBranches ? (
        <div style={styles.loadingContainer}>
          <span>Loading branches...</span>
        </div>
      ) : (
        <>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: branchError ? '#ffebee' : styles.input.backgroundColor
            }}
            required
          >
            {branches.map((branch, index) => (
              <option key={index} value={branch.branch_code}>
                {branch.branch_code ? 
                  `${branch.branch_name} (${branch.branch_code})` : 
                  branch.branch_name
                }
              </option>
            ))}
          </select>
          
          {branchError && (
            <div style={styles.fieldError}>
              {branchError}
              <button 
                type="button" 
                onClick={retryBranchLoading}
                style={styles.retryButton}
              >
                Retry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#0F384A' }}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <img src="fnb back.png" alt="FNB Logo" style={styles.logo} />
          <h2 style={styles.logoText}>First National Bank</h2>
        </div>
        <header style={styles.formHeader}>
          <h1>Welcome Visitor</h1>
          <p>Please fill in the form below for your visit:</p>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          {renderInput('Name', 'name', 'text', formData, handleChange)}
          {renderInput('Reason to See', 'reason', 'text', formData, handleChange, false)}
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Department:</label>
            <div style={styles.departmentContainer}>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{...styles.input, width: '95%'}}
                required
              >
                {departments.map((dept, index) => (
                  <option key={index} value={index === 0 ? '' : dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => setShowAddDepartment(!showAddDepartment)}
                style={styles.addButton}
              >
                {showAddDepartment ? 'Cancel' : '+'}
              </button>
            </div>
            
            {showAddDepartment && (
              <div style={styles.addNewContainer}>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="Enter new department"
                  style={styles.input}
                />
                <button 
                  type="button" 
                  onClick={handleAddDepartment}
                  style={styles.saveButton}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          
          {renderBranchField()}
          
          {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
          {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
          {renderInput('Company', 'company', 'text', formData, handleChange)}

          <div style={styles.formGroup}>
            <label style={styles.label}>Take a Picture:</label>
            <button 
              type="button"
              onClick={handlePictureCapture}
              style={{
                ...styles.button,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#4CAF50'
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Open Camera
            </button>
            {formData.picture && (
              <div style={styles.previewContainer}>
                <img 
                  src={formData.picture} 
                  alt="Captured" 
                  style={styles.preview}
                />
              </div>
            )}
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

const renderInput = (label, name, type, formData, handleChange, required = true) => (
  <div style={styles.formGroup} key={name}>
    <label style={styles.label}>{label}:</label>
    <input
      type={type}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      required={required}
      style={styles.input}
    />
  </div>
);


//back


const getAllVisitorLogs = async (req, res) => {
  try {
    console.log("Fetching all visitor logs");
    const result = await pool.query(`
      SELECT 
        id, 
        TO_CHAR(date, 'YYYY-MM-DD') as date, 
        timeIn, 
        timeOut, 
        department, 
        company, 
        picture, 
        telephone, 
        reason, 
        purpose, 
        name, 
        branch,
        branchName
      FROM visitor_log
    `);
    console.log(`Found ${result.rows.length} visitor logs`);
    console.log("Sample data:", result.rows.slice(0, 2)); // Log first 2 entries
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send('Server error');
  }
};


const getVisitorLogsByPhoneNumber = async (req, res) => {
  const { telephone } = req.query;
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        TO_CHAR(date, 'YYYY-MM-DD') as date, 
        timeIn, 
        timeOut, 
        department, 
        company, 
        picture, 
        telephone, 
        reason, 
        purpose, 
        name, 
        branch,
        branchName
      FROM visitor_log 
      WHERE telephone = $1
    `, [telephone]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
const checkTelephoneExists = async (req, res) => {
  const { telephone } = req.params;
  
  // Basic validation
  if (!telephone || telephone.trim() === '') {
    return res.status(400).json({ 
      error: 'Telephone number is required',
      exists: false
    });
  }

  try {
    console.log(`Checking if telephone exists: ${telephone}`);
    
    // First check if the pool connection is working
    const testQuery = await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    
    // Then perform the actual query
    const result = await pool.query(
      'SELECT EXISTS(SELECT 1 FROM visitor_log WHERE telephone = $1) as "exists"', 
      [telephone]
    );
    
    console.log('Query result:', result.rows[0]);
    
    res.json({ 
      exists: result.rows[0].exists,
      message: result.rows[0].exists ? 'Telephone number already registered' : 'Telephone number is available'
    });
  } catch (err) {
    console.error('Error checking telephone:', err);
    res.status(500).json({ 
      error: 'Failed to check telephone number', 
      details: err.message,
      exists: false
    });
  }
};

const getVisitorLogById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        TO_CHAR(date, 'YYYY-MM-DD') as date, 
        timeIn, 
        timeOut, 
        department, 
        company, 
        picture, 
        telephone, 
        reason, 
        purpose, 
        name, 
        branch,
        branchName
      FROM visitor_log 
      WHERE id = $1
    `, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


const getAllBranches = async (req, res) => {
  try {
    console.log("Fetching all unique branches");
    const result = await pool.query(
      'SELECT DISTINCT branchName, branch FROM visitor_log WHERE branchName IS NOT NULL AND branch IS NOT NULL'
    );
    
    const branches = result.rows.map(row => ({
      branchName: row.branchname,
      branchCode: row.branch
    }));
    
    console.log(`Found ${branches.length} unique branches`);
    res.json(branches);
  } catch (err) {
    console.error("Database query error fetching branches:", err);
    res.status(500).send('Server error');
  }
};

const getVisitorLogsByBranchCode = async (req, res) => {
  const { branchCode } = req.query;
  
  if (!branchCode) {
    return res.status(400).json({ error: 'Branch code is required' });
  }
  
  try {
    console.log(`Fetching visitor logs for branch code: ${branchCode}`);
    const result = await pool.query(
      `SELECT 
        id,
        TO_CHAR(date, 'YYYY-MM-DD') AS date,
        timeIn,
        timeOut,
        department,
        company,
        picture,
        telephone,
        reason,
        purpose,
        name,
        branch,
        branchName
      FROM visitor_log 
      WHERE branch = $1`,
      [branchCode]
    );
    
    console.log(`Found ${result.rows.length} visitor logs for branch code ${branchCode}`);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error fetching branch logs:", err);
    res.status(500).send('Server error');
  }
};



const createVisitorLog = async (req, res) => {
  const { date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch,branchName // New field
  } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO visitor_log (date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch,branchName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12) RETURNING *',
      [date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch,branchName]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


const updateVisitorLog = async (req, res) => {
  const { id } = req.params;
  const { timeOut } = req.body;
  try {
    const result = await pool.query(
      'UPDATE visitor_log SET timeOut = $1 WHERE id = $2 RETURNING *',
      [timeOut, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating visitor log:', err);
    res.status(500).send('Server error');
  }
};

const deleteVisitorLog = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM visitor_log WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllVisitorLogs,
  getVisitorLogsByPhoneNumber,
  getVisitorLogById,
  createVisitorLog,
  updateVisitorLog,
  deleteVisitorLog,
  checkTelephoneExists, 
  getAllBranches,              
  getVisitorLogsByBranchCode 
};


//users controller
const createUser = async (req, res) => {
  const { email, branch, branchCode, role = 'user' } = req.body;

  try {
    if (!email || !branch) {
      return res.status(400).json({ error: 'F-number and branch are required' });
    }

    const checkUser = await pool.query('SELECT * FROM users_table WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }


    const result = await pool.query(
      'INSERT INTO users_table (email, branch, branch_code, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, branch, role, created_at',
      [email, branch, branchCode, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        branch: result.rows[0].branch,
        role: result.rows[0].role,
        created_at: result.rows[0].created_at
      }
    });
  } catch (err) {
    console.error('User creation error:', err);
    res.status(500).json({ error: 'Server error during user creation' });
  }
};

//branchController
const pool = require('../db'); // Adjust path as needed

// Get all branches
const getAllBranches = async (req, res) => {
  try {
    console.log("Fetching all branches from fnb_branches table");
    const result = await pool.query(`
      SELECT 
        id,
        branch_name,
        branch_code,
        created_at
      FROM fnb_branches
      ORDER BY branch_name ASC
    `);
    console.log(`Found ${result.rows.length} branches`);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get branch by ID
const getBranchById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        id,
        branch_name,
        branch_code,
        created_at
      FROM fnb_branches 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new branch
const createBranch = async (req, res) => {
  const { branch_name, branch_code } = req.body;

  if (!branch_name || !branch_code) {
    return res.status(400).json({ error: 'Branch name and code are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO fnb_branches (branch_name, branch_code) VALUES ($1, $2) RETURNING *',
      [branch_name, branch_code]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Branch name or code already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

// Update branch
const updateBranch = async (req, res) => {
  const { id } = req.params;
  const { branch_name, branch_code } = req.body;

  if (!branch_name || !branch_code) {
    return res.status(400).json({ error: 'Branch name and code are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE fnb_branches SET branch_name = $1, branch_code = $2 WHERE id = $3 RETURNING *',
      [branch_name, branch_code, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating branch:', err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Branch name or code already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

// Delete branch
const deleteBranch = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM fnb_branches WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json({ message: 'Branch deleted successfully', deletedBranch: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
};

//authController

const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'your-secret-key-should-be-in-env-file';


const login = async (req, res) => {
  const { email, password, branch } = req.body;

  try {
    console.log(`Login attempt: ${email} for branch ${branch}`);

    if (!email || !password || !branch) {
      return res.status(400).json({ error: 'Email, password, and branch are required' });
    }

    const adminResult = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email]
    );

    let user = adminResult.rows[0];
    let userTable = 'admin_users';

    if (!user) {
      const userResult = await pool.query(
        'SELECT * FROM users_table WHERE email = $1',
        [email]
      );
      user = userResult.rows[0];
      userTable = 'users_table';
    }

    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const branchesKey = userTable === 'admin_users' ? 'branches' : 'branch';
    const userBranches = userTable === 'admin_users' ? user[branchesKey] : [user[branchesKey]];

    if (!userBranches.includes(branch)) {
      console.log(`User ${email} attempted to access unauthorized branch: ${branch}`);
      return res.status(403).json({ error: 'You do not have access to this branch' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Invalid password for user: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      user_id: user.id,
      email: user.email,
      branch: branch,
      role: user.role || 'user',
      user_table: userTable
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        branch: branch,
        role: user.role || 'user',
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};


const registerUser = async (req, res) => {
  const { email, password, branches, role } = req.body;

  try {
   
    
    
    if (!email || !password || !branches || !Array.isArray(branches)) {
      return res.status(400).json({ error: 'Email, password, and branches array are required' });
    }

   
    const checkUser = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const result = await pool.query(
      'INSERT INTO admin_users (email, password, branches, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, role, created_at',
      [email, hashedPassword, branches, role || 'user']
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        role: result.rows[0].role,
        created_at: result.rows[0].created_at
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};


const verifyToken = (req, res) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// In your authController.js
const verifyAdminCredentials = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const adminResult = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email]
    );

    const user = adminResult.rows[0];

    if (!user) {
      console.log(`Admin not found: ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Invalid password for admin: ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const branches = user.branches || [];
        const tempToken = jwt.sign({ 
      user_id: user.id,
      email: user.email,
      role: user.role || 'admin',
      temp: true 
    }, JWT_SECRET, { expiresIn: '5m' });

    return res.json({
      success: true,
      token: tempToken,
      branches: branches.map(branch => ({ branchName: branch, branchCode: branch })) 
    });

  } catch (err) {
    console.error('Admin verification error:', err);
    res.status(500).json({ success: false, error: 'Server error during verification' });
  }
};

module.exports = {
  login,
  registerUser,
  verifyToken,
  verifyAdminCredentials
};