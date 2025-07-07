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