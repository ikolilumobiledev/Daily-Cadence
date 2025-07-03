
// //visitorslogs
// const getAllVisitorLogs = async (req, res) => {
//     try {
//       console.log("Fetching all visitor logs");
//       const result = await pool.query(`
//         SELECT 
//           id, 
//           TO_CHAR(date, 'YYYY-MM-DD') as date, 
//           timeIn, 
//           timeOut, 
//           department, 
//           company, 
//           picture, 
//           telephone, 
//           reason, 
//           purpose, 
//           name, 
//           branch,
//           branchName
//         FROM visitor_log
//       `);
//       console.log(`Found ${result.rows.length} visitor logs`);
//       console.log("Sample data:", result.rows.slice(0, 2)); // Log first 2 entries
//       res.json(result.rows);
//     } catch (err) {
//       console.error("Database query error:", err);
//       res.status(500).send('Server error');
//     }
//   };
  
  
//   const getVisitorLogsByPhoneNumber = async (req, res) => {
//     const { telephone } = req.query;
//     try {
//       const result = await pool.query(`
//         SELECT 
//           id, 
//           TO_CHAR(date, 'YYYY-MM-DD') as date, 
//           timeIn, 
//           timeOut, 
//           department, 
//           company, 
//           picture, 
//           telephone, 
//           reason, 
//           purpose, 
//           name, 
//           branch,
//           branchName
//         FROM visitor_log 
//         WHERE telephone = $1
//       `, [telephone]);
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server error');
//     }
//   };
//   const checkTelephoneExists = async (req, res) => {
//     const { telephone } = req.params;
    
//     // Basic validation
//     if (!telephone || telephone.trim() === '') {
//       return res.status(400).json({ 
//         error: 'Telephone number is required',
//         exists: false
//       });
//     }
  
//     try {
//       console.log(`Checking if telephone exists: ${telephone}`);
      
//       // First check if the pool connection is working
//       const testQuery = await pool.query('SELECT NOW()');
//       console.log('Database connection successful');
      
//       // Then perform the actual query
//       const result = await pool.query(
//         'SELECT EXISTS(SELECT 1 FROM visitor_log WHERE telephone = $1) as "exists"', 
//         [telephone]
//       );
      
//       console.log('Query result:', result.rows[0]);
      
//       res.json({ 
//         exists: result.rows[0].exists,
//         message: result.rows[0].exists ? 'Telephone number already registered' : 'Telephone number is available'
//       });
//     } catch (err) {
//       console.error('Error checking telephone:', err);
//       res.status(500).json({ 
//         error: 'Failed to check telephone number', 
//         details: err.message,
//         exists: false
//       });
//     }
//   };
  
//   const getVisitorLogById = async (req, res) => {
//     const { id } = req.params;
//     try {
//       const result = await pool.query(`
//         SELECT 
//           id, 
//           TO_CHAR(date, 'YYYY-MM-DD') as date, 
//           timeIn, 
//           timeOut, 
//           department, 
//           company, 
//           picture, 
//           telephone, 
//           reason, 
//           purpose, 
//           name, 
//           branch,
//           branchName
//         FROM visitor_log 
//         WHERE id = $1
//       `, [id]);
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server error');
//     }
//   };
  
  
//   const getAllBranches = async (req, res) => {
//     try {
//       console.log("Fetching all unique branches");
//       const result = await pool.query(
//         'SELECT DISTINCT branchName, branch FROM visitor_log WHERE branchName IS NOT NULL AND branch IS NOT NULL'
//       );
      
//       const branches = result.rows.map(row => ({
//         branchName: row.branchname,
//         branchCode: row.branch
//       }));
      
//       console.log(`Found ${branches.length} unique branches`);
//       res.json(branches);
//     } catch (err) {
//       console.error("Database query error fetching branches:", err);
//       res.status(500).send('Server error');
//     }
//   };
  
//   const getVisitorLogsByBranchCode = async (req, res) => {
//     const { branchCode } = req.query;
    
//     if (!branchCode) {
//       return res.status(400).json({ error: 'Branch code is required' });
//     }
    
//     try {
//       console.log(`Fetching visitor logs for branch code: ${branchCode}`);
//       const result = await pool.query(
//         `SELECT 
//           id,
//           TO_CHAR(date, 'YYYY-MM-DD') AS date,
//           timeIn,
//           timeOut,
//           department,
//           company,
//           picture,
//           telephone,
//           reason,
//           purpose,
//           name,
//           branch,
//           branchName
//         FROM visitor_log 
//         WHERE branch = $1`,
//         [branchCode]
//       );
      
//       console.log(`Found ${result.rows.length} visitor logs for branch code ${branchCode}`);
//       res.json(result.rows);
//     } catch (err) {
//       console.error("Database query error fetching branch logs:", err);
//       res.status(500).send('Server error');
//     }
//   };
  
  
  
//   const createVisitorLog = async (req, res) => {
//     const { date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch,branchName // New field
//     } = req.body;
//     try {
//       const result = await pool.query(
//         'INSERT INTO visitor_log (date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch,branchName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12) RETURNING *',
//         [date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch,branchName]
//       );
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server error');
//     }
//   };
  
  
//   const updateVisitorLog = async (req, res) => {
//     const { id } = req.params;
//     const { timeOut } = req.body;
//     try {
//       const result = await pool.query(
//         'UPDATE visitor_log SET timeOut = $1 WHERE id = $2 RETURNING *',
//         [timeOut, id]
//       );
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Error updating visitor log:', err);
//       res.status(500).send('Server error');
//     }
//   };
  
//   const deleteVisitorLog = async (req, res) => {
//     const { id } = req.params;
//     try {
//       await pool.query('DELETE FROM visitor_log WHERE id = $1', [id]);
//       res.sendStatus(204);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server error');
//     }
//   };
  
//   module.exports = {
//     getAllVisitorLogs,
//     getVisitorLogsByPhoneNumber,
//     getVisitorLogById,
//     createVisitorLog,
//     updateVisitorLog,
//     deleteVisitorLog,
//     checkTelephoneExists, 
//     getAllBranches,              
//     getVisitorLogsByBranchCode 
//   };
  

//   //route
  
// const express = require('express');
// const router = express.Router();
// const visitorsController = require('../controllers/visitorsLogsController');



// router.get('/check-telephone/:telephone', visitorsController.checkTelephoneExists);
// router.get('/index', visitorsController.getAllBranches);
// router.get('/index/branch', visitorsController.getVisitorLogsByBranchCode);
// router.get('/', visitorsController.getAllVisitorLogs);
// router.get('/by-phone', visitorsController.getVisitorLogsByPhoneNumber);
// router.get('/:id', visitorsController.getVisitorLogById);
// router.post('/', visitorsController.createVisitorLog);
// router.put('/:id', visitorsController.updateVisitorLog);
// router.delete('/:id', visitorsController.deleteVisitorLog);

// module.exports = router;

// //frontend of fnb log book
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';

// function FirstTime() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     reason: '',
//     department: '',
//     branch: '',
//     purpose: '',
//     telephone: '',
//     company: '',
//     picture: null,
//   });

//   // Load departments from localStorage or use default list
//   const [departments, setDepartments] = useState(() => {
//     const savedDepartments = localStorage.getItem('departments');
//     return savedDepartments ? JSON.parse(savedDepartments) : [
//       'Select Department',
//       'Human Resources',
//       'Finance',
//       'Information Technology',
//       'Operations',
//       'Marketing',
//       'Legal',
//       'Customer Service',
//       'Risk Management',
//       'Compliance',
//       'Treasury'
//     ];
//   });

//   // Load branches from localStorage or use default list
//   const [branches, setBranches] = useState(() => {
//     const savedBranches = localStorage.getItem('branches');
//     return savedBranches ? JSON.parse(savedBranches) : [
//       { label: 'Select Branch', value: '' },
//       { label: 'ACCRA BRANCH', value: '330102' },
//       { label: 'MAKOLA BRANCH', value: '330111' },
//       { label: 'TEMA BRANCH (COMM', value: '330120' },
//       { label: 'AIRPORT BRANCH', value: '330119' },
//       { label: 'MARKET CIRCLE BRANCH TAKORADI', value: '330401' },
//       { label: 'ADUM BRANCH KUMASI', value: '330601' },
//       { label: 'WEST HILLS MALL', value: '330108' },
//       { label: 'JUNCTION SHOPPING CENTRE BRANCH', value: '330101' },
//       { label: 'TEMA BRANCH (COMM 11)', value: '330112' },
//       { label: 'ACHIMOTA MALL BRANCH', value: '330107' },
//       { label: 'ACCRA MALL BRANCH', value: '330106' },
//       { label: 'KEJETIA BRANCH', value: '330602' }
//     ];
//   });

//   // New state for adding new department and branch
//   const [newDepartment, setNewDepartment] = useState('');
//   const [newBranch, setNewBranch] = useState({ label: '', value: '' });
//   const [showAddDepartment, setShowAddDepartment] = useState(false);
//   const [showAddBranch, setShowAddBranch] = useState(false);
  
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Save to localStorage when departments or branches change
//   useEffect(() => {
//     localStorage.setItem('departments', JSON.stringify(departments));
//   }, [departments]);

//   useEffect(() => {
//     localStorage.setItem('branches', JSON.stringify(branches));
//   }, [branches]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle adding new department
//   const handleAddDepartment = () => {
//     if (!newDepartment.trim()) {
//       setError('Department name cannot be empty');
//       return;
//     }
    
//     if (departments.includes(newDepartment)) {
//       setError('Department already exists');
//       return;
//     }
    
//     setDepartments([...departments, newDepartment]);
//     setNewDepartment('');
//     setShowAddDepartment(false);
//     setError('');
//   };

//   // Handle adding new branch
//   const handleAddBranch = () => {
//     if (!newBranch.label.trim() || !newBranch.value.trim()) {
//       setError('Branch name and code cannot be empty');
//       return;
//     }
    
//     if (branches.some(branch => branch.value === newBranch.value)) {
//       setError('Branch code already exists');
//       return;
//     }
    
//     setBranches([...branches, newBranch]);
//     setNewBranch({ label: '', value: '' });
//     setShowAddBranch(false);
//     setError('');
//   };

//   const handlePictureCapture = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { facingMode: 'environment' } // Use back camera if available
//       });
      
//       const video = document.createElement('video');
//       const canvas = document.createElement('canvas');
//       video.srcObject = stream;
      
//       await new Promise(resolve => video.addEventListener('loadedmetadata', resolve));
//       video.play();
      
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
      
//       canvas.getContext('2d').drawImage(video, 0, 0);
      
//       const picture = canvas.toDataURL('image/jpeg');
      
//       const base64Size = picture.length * (3/4);
//       if (base64Size > 5 * 1024 * 1024) {
//         setError('Captured image is too large. Please try again.');
//         return;
//       }
      
//       setFormData({ ...formData, picture });
      
//       stream.getTracks().forEach(track => track.stop());
      
//     } catch (err) {
//       if (err.name === 'NotAllowedError') {
//         setError('Camera access denied. Please allow camera access to capture photos.');
//       } else {
//         setError('Failed to access camera. Please try again.');
//       }
//       console.error('Camera error:', err);
//     }
//   };

//   const validateTelephone = async () => {
//     if (!formData.telephone || formData.telephone.trim() === '') {
//       setError('Please enter a telephone number.');
//       return false;
//     }
  
//     try {
//       // Log the request URL for debugging
//       const url = `http://localhost:5001/visitors/check-telephone/${encodeURIComponent(formData.telephone)}`;
//       console.log(`Making request to: ${url}`);
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//         },
//       });
  
//       // Log the response status
//       console.log(`Response status: ${response.status}`);
  
//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error(`Endpoint not found (404). Please check server routes.`);
//         } else {
//           throw new Error(`Server responded with status: ${response.status}`);
//         }
//       }
  
//       const data = await response.json();
//       console.log('Telephone check response:', data);
      
//       if (data.exists) {
//         setError('Telephone number already registered.');
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.error('Error validating telephone:', error);
//       setError(`Failed to validate telephone number: ${error.message}`);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check required fields first
//     if (!formData.name || !formData.telephone || !formData.department || !formData.branch) {
//       setError('Please fill in all required fields.');
//       return;
//     }

//     const isValid = await validateTelephone();
//     if (!isValid) return;

//     if (!formData.picture) {
//       setError('Please take a picture before submitting.');
//       return;
//     }

//     // Find the selected branch object to get both code and name
//     const selectedBranch = branches.find(branch => branch.value === formData.branch);
//     const branchName = selectedBranch ? selectedBranch.label : '';

//     setIsLoading(true);
//     try {
//       const response = await fetch('http://localhost:5001/visitors', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           reason: formData.reason,
//           department: formData.department,
//           branch: formData.branch, // Branch code
//           branchName: branchName, // Branch name
//           purpose: formData.purpose,
//           telephone: formData.telephone,
//           company: formData.company,
//           picture: formData.picture,
//           date: new Date().toISOString().split('T')[0],
//           timeIn: new Date().toTimeString().split(' ')[0],
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit the form. Please try again later.');
//       }

//       alert('Thank you for Visiting First National Bank!');
//       navigate('/');
//     } catch (error) {
//       console.error("Error submitting data to the server:", error);
//       setError(error.message);
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div style={{ backgroundColor: '#0F384A' }}>
//       <div style={styles.formContainer}>
//         <div style={styles.logoContainer}>
//           <img src="fnb back.png" alt="FNB Logo" style={styles.logo} />
//           <h2 style={styles.logoText}>First National Bank</h2>
//         </div>
//         <header style={styles.formHeader}>
//           <h1>Welcome Visitor</h1>
//           <p>Please fill in the form below for your visit:</p>
//         </header>

//         <form onSubmit={handleSubmit} style={styles.form}>
//           {renderInput('Name', 'name', 'text', formData, handleChange)}
//           {renderInput('Reason to See', 'reason', 'text', formData, handleChange, false)}
          
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Department:</label>
//             <div style={styles.departmentContainer}>
//               <select
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 style={{...styles.input, width: '95%'}}
//                 required
//               >
//                 {departments.map((dept, index) => (
//                   <option key={index} value={index === 0 ? '' : dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//               <button 
//                 type="button" 
//                 onClick={() => setShowAddDepartment(!showAddDepartment)}
//                 style={styles.addButton}
//               >
//                 {showAddDepartment ? 'Cancel' : '+'}
//               </button>
//             </div>
            
//             {showAddDepartment && (
//               <div style={styles.addNewContainer}>
//                 <input
//                   type="text"
//                   value={newDepartment}
//                   onChange={(e) => setNewDepartment(e.target.value)}
//                   placeholder="Enter new department"
//                   style={styles.input}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={handleAddDepartment}
//                   style={styles.saveButton}
//                 >
//                   Save
//                 </button>
//               </div>
//             )}
//           </div>
          
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Branch:</label>
//             <div style={styles.departmentContainer}>
//               <select
//                 name="branch"
//                 value={formData.branch}
//                 onChange={handleChange}
//                 style={{...styles.input, width: '95%'}}
//                 required
//               >
//                 {branches.map((branch, index) => (
//                   <option key={index} value={branch.value}>
//                     {branch.value && `${branch.label} (${branch.value})`}
//                     {!branch.value && branch.label}
//                   </option>
//                 ))}
//               </select>
//               <button 
//                 type="button" 
//                 onClick={() => setShowAddBranch(!showAddBranch)}
//                 style={styles.addButton}
//               >
//                 {showAddBranch ? 'Cancel' : '+'}
//               </button>
//             </div>
            
//             {showAddBranch && (
//               <div style={styles.addNewContainer}>
//                 <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
//                   <input
//                     type="text"
//                     value={newBranch.label}
//                     onChange={(e) => setNewBranch({...newBranch, label: e.target.value})}
//                     placeholder="Enter branch name"
//                     style={{...styles.input, flex: '2'}}
//                   />
//                   <input
//                     type="text"
//                     value={newBranch.value}
//                     onChange={(e) => setNewBranch({...newBranch, value: e.target.value})}
//                     placeholder="Enter branch code"
//                     style={{...styles.input, flex: '1'}}
//                   />
//                 </div>
//                 <button 
//                   type="button" 
//                   onClick={handleAddBranch}
//                   style={styles.saveButton}
//                 >
//                   Save
//                 </button>
//               </div>
//             )}
//           </div>
          
//           {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
//           {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
//           {renderInput('Company', 'company', 'text', formData, handleChange)}

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Take a Picture:</label>
//             <button 
//               type="button"
//               onClick={handlePictureCapture}
//               style={{
//                 ...styles.button,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 backgroundColor: '#4CAF50'
//               }}
//             >
//               <svg 
//                 width="24" 
//                 height="24" 
//                 viewBox="0 0 24 24" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 strokeWidth="2"
//                 strokeLinecap="round" 
//                 strokeLinejoin="round"
//               >
//                 <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
//                 <circle cx="12" cy="13" r="4" />
//               </svg>
//               Open Camera
//             </button>
//             {formData.picture && (
//               <div style={styles.previewContainer}>
//                 <img 
//                   src={formData.picture} 
//                   alt="Captured" 
//                   style={styles.preview}
//                 />
//               </div>
//             )}
//           </div>
          
//           {error && <div style={styles.error}>{error}</div>}
//           <button type="submit" style={styles.submitButton} disabled={isLoading}>
//             {isLoading ? "Submitting..." : "Submit"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const renderInput = (label, name, type, formData, handleChange, required = true) => (
//   <div style={styles.formGroup} key={name}>
//     <label style={styles.label}>{label}:</label>
//     <input
//       type={type}
//       name={name}
//       value={formData[name]}
//       onChange={handleChange}
//       required={required}
//       style={styles.input}
//     />
//   </div>
// );

// //frontend of admin login

// import React, { useState, useEffect, useRef } from "react";
// import { useVisitor } from "../context/VisitorContext";
// import "../login.css";

// const Login = ({ onLogin }) => {
//   // Common state
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [selectedBranch, setSelectedBranch] = useState("");
//   const [branches, setBranches] = useState([]);
//   const [fetchingBranches, setFetchingBranches] = useState(false);
//   const [localError, setLocalError] = useState("");
//   const [manualLoginAttempt, setManualLoginAttempt] = useState(false);
//   const [loadingSpinner, setLoadingSpinner] = useState(false);
  
//   // 2FA state (for non-admin users)
//   const [showVerification, setShowVerification] = useState(false);
//   const [verificationCode, setVerificationCode] = useState("");
//   const [checkingStatus, setCheckingStatus] = useState(false);
//   const [showBranchSelection, setShowBranchSelection] = useState(false);
//   const [sessionToken, setSessionToken] = useState("");
//   const [savedIdentifier, setSavedIdentifier] = useState(""); 
//   const [authToken, setAuthToken] = useState("");
//   const [pollingStatus, setPollingStatus] = useState("pending"); // pending, success, failed
//   const [isAdminUser, setIsAdminUser] = useState(false);
//   const [showManualCodeEntry, setShowManualCodeEntry] = useState(false);
//   const [verifyButtonVisible, setVerifyButtonVisible] = useState(false); // Changed to false initially
  
//   // Timer states
//   const [remainingTime, setRemainingTime] = useState(60); // Changed from 50 to 60 seconds
//   const [showTimer, setShowTimer] = useState(false);
//   const [checkingBranches, setCheckingBranches] = useState(false);

//   // Transition states
//   const [showTransition, setShowTransition] = useState(false);
//   const [transitionMessage, setTransitionMessage] = useState("Checking your assigned branches...");
//   const [transitionProgress, setTransitionProgress] = useState(0);
  
//   const pollingIntervalRef = useRef(null);
//   const maxPollingTime = 120000; // 2 minutes
//   const pollingStartTimeRef = useRef(null);
//   const buttonFadeIntervalRef = useRef(null);
//   const timerIntervalRef = useRef(null);

//   const { login, loading, error, setError, authenticated } = useVisitor();

//   // API URLs
//   const API_URL = "http://localhost:5001";
//   const BRANCHES_URL = "http://localhost:5001/visitors/index";
//   const AUTH_URL = "http://localhost:5001/auth";

//   // Cleanup polling and timers on unmount
//   useEffect(() => {
//     return () => {
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//       }
//       if (buttonFadeIntervalRef.current) {
//         clearInterval(buttonFadeIntervalRef.current);
//       }
//       if (timerIntervalRef.current) {
//         clearInterval(timerIntervalRef.current);
//       }
//     };
//   }, []);

//   // Handle successful authentication
//   useEffect(() => {
//     if (authenticated && identifier && manualLoginAttempt) {
//       console.log("Authentication successful after manual login attempt, navigating to dashboard");
//       setTimeout(() => { 
//         onLogin(identifier);
//         setManualLoginAttempt(false);
//       }, 1000); 
//     } else if (authenticated) {
//       console.log("Already authenticated from storage, but not navigating (waiting for manual login)");
//     }
//   }, [authenticated, identifier, onLogin, manualLoginAttempt]);

//   // Fetch branches initially
//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         setFetchingBranches(true);
//         console.log("Fetching branches from:", BRANCHES_URL);
//         const response = await fetch(BRANCHES_URL);
        
//         if (!response.ok) {
//           throw new Error(`API response error: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log(`Received ${data.length} branches from API`);
        
//         const branchOptions = data
//           .filter(branch => branch.branchName && branch.branchName.trim() !== "")
//           .sort((a, b) => a.branchName.localeCompare(b.branchName));
        
//         console.log(`Found ${branchOptions.length} unique branches`);
//         setBranches(branchOptions);
//       } catch (err) {
//         console.error("Error fetching branches:", err);
//         setLocalError("Failed to load branches. Please try again later.");
//       } finally {
//         setFetchingBranches(false);
//       }
//     };

//     // Only fetch branches if we need them for the admin flow or branch selection screen
//     if (!showVerification || showBranchSelection) {
//       fetchBranches();
//     }
//   }, [BRANCHES_URL, showVerification, showBranchSelection]);

//   // New effect to show the check verification status button after 10 seconds
//   useEffect(() => {
//     if (showVerification && pollingStatus === "pending") {
//       // Initially hide the button for 10 seconds
//       setVerifyButtonVisible(false);
      
//       // Show button after 10 seconds
//       const buttonShowTimer = setTimeout(() => {
//         setVerifyButtonVisible(true);
        
//         // Start the fading effect after button appears
//         buttonFadeIntervalRef.current = setInterval(() => {
//           setVerifyButtonVisible(prev => !prev);
//         }, 1500); // Toggle visibility every 1.5 seconds
//       }, 10000); // 10 seconds delay
      
//       return () => {
//         clearTimeout(buttonShowTimer);
//         if (buttonFadeIntervalRef.current) {
//           clearInterval(buttonFadeIntervalRef.current);
//         }
//       };
//     }
//   }, [showVerification, pollingStatus]);
  
//   // Timer countdown effect
//   useEffect(() => {
//     if (showVerification && showTimer && remainingTime > 0) {
//       timerIntervalRef.current = setInterval(() => {
//         setRemainingTime(prev => {
//           if (prev <= 1) {
//             clearInterval(timerIntervalRef.current);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
    
//     return () => {
//       if (timerIntervalRef.current) {
//         clearInterval(timerIntervalRef.current);
//       }
//     };
//   }, [showVerification, showTimer, remainingTime]);

//   // Transition effect for successful verification
//  // Transition effect for successful verification
//  useEffect(() => {
//   if (showTransition) {
//     // Update progress over 15 seconds (increased from 10)
//     const progressInterval = setInterval(() => {
//       setTransitionProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(progressInterval);
//           return 100;
//         }
//         return prev + 0.67; // Adjusted for 15 seconds
//       });
//     }, 100); // 15 seconds = 100 steps × 150ms

//     // Change message halfway through
//     const messageTimer = setTimeout(() => {
//       setTransitionMessage("Thank you for hanging on");
//     }, 7500); // 7.5 seconds (half of 15)

//     // Complete transition after 15 seconds
//     const completeTimer = setTimeout(() => {
//       setShowTransition(false);
//       setShowVerification(false);
//       setShowBranchSelection(true);
//     }, 15000); // 15 seconds (increased from 10)

//     return () => {
//       clearInterval(progressInterval);
//       clearTimeout(messageTimer);
//       clearTimeout(completeTimer);
//     };
//   }
// }, [showTransition]);

//   // Check if a user is admin based on their identifier
//   const checkIfAdmin = (identifier) => {
//     return identifier.includes('@') && !identifier.startsWith('F');
//   };

//   // New function to track 2FA status
//   const track2FAStatus = async () => {
//     try {
//       console.log("Tracking 2FA status...");
//       const response = await fetch(`${API_URL}/users/track2FAStatus`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           token: authToken,
//           fnumber: savedIdentifier
//         })
//       });
      
//       const data = await response.json();
//       console.log("Track 2FA status response:", data);
      
//       if (response.ok && data.success && data.status === "Success") {
//         // 2FA verification was successful
//         setPollingStatus("success");
//         clearInterval(pollingIntervalRef.current);
        
//         // Save the 2FA status response for user data extraction
//         sessionStorage.setItem('verify2faResponse', JSON.stringify(data));
        
//         // Now check user branches
//         await checkUserBranches(data);
//       }
//     } catch (err) {
//       console.error("Error tracking 2FA status:", err);
//     }
//   };
  
//   // Function to check user branches
//   const checkUserBranches = async () => {
//     setCheckingBranches(true);
//     try {
//       console.log("Checking user branches...");
//       const response = await fetch(`${API_URL}/users/checkUserBranches`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           fnumber: savedIdentifier
//         })
//       });
      
//       const data = await response.json();
//       console.log("Check user branches response:", data);
//       console.log("Response structure:", JSON.stringify(data));
      
//       if (!response.ok) {
//         setLocalError("Failed to retrieve branch access. Please contact support.");
//         return;
//       }
      
//       // Handle different possible response structures
//       const branchesArray = data.branches || (Array.isArray(data) ? data : []);
      
//       if (branchesArray && branchesArray.length > 0) {
//         // Store session token if provided
//         if (data.sessionToken) {
//           setSessionToken(data.sessionToken);
//         }
        
//         // Set branches from response
//         setBranches(branchesArray);
        
//         if (branchesArray.length === 1) {
//           // If only one branch, auto-select it and proceed to final login
//           setSelectedBranch(branchesArray[0].branchName);
//           console.log("Auto-selecting single branch:", branchesArray[0].branchName);
          
//           // Complete final login with the auto-selected branch
//           await handleFinalLogin(savedIdentifier, branchesArray[0].branchName, sessionToken || data.sessionToken);
//         } else {
//           // If multiple branches, show transition screen then branch selection
//           setShowTransition(true);
//           setTransitionProgress(0);
//         }
//       } else {
//         setLocalError('No branches available for this user');
//       }
//     } catch (err) {
//       console.error("Error checking user branches:", err);
//       setLocalError("Failed to check branch access. Please try again.");
//     } finally {
//       setCheckingBranches(false);
//     }
//   };

//   // Check verification status function
//   const checkVerificationStatus = async () => {
//     setCheckingStatus(true);
//     setLocalError("");
    
//     try {
//       console.log("Manually checking 2FA status...");
//       const response = await fetch(`${API_URL}/users/verify2fa`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           token: authToken,
//           code: "", // Empty code to just check status
//           fnumber: savedIdentifier
//         })
//       });
      
//       const data = await response.json();
//       console.log("Manual 2FA status check response:", data);
      
//       // First, check if 2FA verification itself was successful
//       const is2FASuccessful = response.ok && (
//         data.success === true || 
//         data.status_code === "000" || 
//         data.status_code === 0
//       );
      
//       if (is2FASuccessful) {
//         setPollingStatus("success"); // Mark 2FA itself as successful
        
//         // Now check user branches using the separate API
//         await checkUserBranches();
//         return;
//       }
      
//       // Handle pending status appropriately
//       if (data.status_code === "002" || data.status_message?.includes("Pending")) {
//         setLocalError("Authentication is still pending. Please approve the request on your phone.");
//         return;
//       }
      
//       // If it's not successful and not pending, it's failed
//       setPollingStatus("failed");
//       setLocalError(data.status_message || data.error || "Verification failed. Please try again.");
      
//     } catch (err) {
//       console.error("Error checking 2FA status:", err);
//       setLocalError("Error checking verification status. Please try again.");
//       setPollingStatus("failed");
//     } finally {
//       setCheckingStatus(false);
//     }
//   };

//   // Updated polling function that uses track2FAStatus
//   const startPollingFor2FA = (token) => {
//     console.log("Starting to poll for 2FA status with token:", token);
//     setPollingStatus("pending");
//     pollingStartTimeRef.current = Date.now();
    
//     // Start countdown timer
//     setRemainingTime(60); // Changed to 60 seconds
//     setShowTimer(true);
    
//     // Clear any existing interval
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//     }
    
//     // Use a longer interval to reduce API calls (5 seconds instead of 3)
//     pollingIntervalRef.current = setInterval(async () => {
//       // Skip polling if we're manually checking or if status is no longer pending
//       if (checkingStatus || pollingStatus !== "pending") {
//         return;
//       }
      
//       // Check if we've exceeded the max polling time
//       if (Date.now() - pollingStartTimeRef.current > maxPollingTime) {
//         clearInterval(pollingIntervalRef.current);
//         setPollingStatus("failed");
//         setLocalError("2FA verification timed out. Please try again.");
//         return;
//       }
      
//       // Use the new track2FAStatus API instead of calling verify2fa directly
//       await track2FAStatus();
      
//     }, 5000); 
//   };

//   // Handle initial form submission for both admin and non-admin users
//   const handleInitialSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Initial login form submitted");
//     setLocalError("");
//     setLoadingSpinner(true);

//     // Validate F-number length for non-admin users
//     if (!identifier.includes('@') && identifier.length !== 8) {
//       setLocalError("F number must be exactly 8 characters");
//       setLoadingSpinner(false);
//       return;
//     }

//     // Determine if this is an admin login or regular user
//     const isAdmin = checkIfAdmin(identifier);
//     setIsAdminUser(isAdmin);
    
//     try {
//       if (isAdmin) {
//         // Admin authentication flow
//         await handleAdminAuth(identifier, password);
//       } else {
//         // Regular user authentication flow (with 2FA)
//         await handleRegularUserAuth(identifier, password);
//       }
//     } catch (err) {
//       console.error("Authentication error:", err);
//       setLocalError(err.message || "Authentication failed. Please check your credentials and try again.");
//       setLoadingSpinner(false);
//     }
//   };

//   // Handle admin authentication
//   const handleAdminAuth = async (email, password) => {
//     try {
//       console.log("Using admin authentication flow");
//       setLoadingSpinner(true);
      
//       // Use a new endpoint specifically for admin credential verification
//       const response = await fetch(`${AUTH_URL}/verify-admin`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           email,
//           password
//         })
//       });
      
//       const data = await response.json();
      
//       if (!response.ok || !data.success) {
//         throw new Error(data.error || "Admin authentication failed. Please check your credentials.");
//       }
      
//       // Store admin token for use in final authentication
//       setSessionToken(data.token || "");
//       setSavedIdentifier(email);
      
//       // Set branches from response if available
//       if (data.branches && Array.isArray(data.branches)) {
//         setBranches(data.branches);
//         setFetchingBranches(false);
//       }
      
//       // Now show branch selection after successful authentication
//       setShowBranchSelection(true);
//       setLoadingSpinner(false);
      
//     } catch (err) {
//       console.error("Admin authentication error:", err);
//       setLocalError(err.message || "Admin authentication failed. Please check your credentials.");
//       setLoadingSpinner(false);
//     }
//   };

//   // Handle final login after branch selection
//   const handleFinalLogin = async (identifier, branch, sessionToken) => {
//     setLocalError("");
//     setLoadingSpinner(true);
    
//     try {
//       console.log(`Finalizing login with branch: ${branch}`);
      
//       const selectedBranchObj = branches.find(branchObj => branchObj.branchName === branch);
//       const branchCode = selectedBranchObj ? selectedBranchObj.branchCode : '';
      
//       // Get the stored 2FA response if available
//       const storedVerifyResponse = sessionStorage.getItem('verify2faResponse');
//       const verifyResponseData = storedVerifyResponse ? JSON.parse(storedVerifyResponse) : null;
      
//       // For admin users, make the final login call with the selected branch
//       if (isAdminUser) {
//         const response = await fetch(`${AUTH_URL}/login`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${sessionToken}` // Use the temp token for authorization
//           },
//           body: JSON.stringify({
//             email: identifier,
//             password: password, // You might want to remove this for security if using the token
//             branch
//           })
//         });
        
//         const data = await response.json();
        
//         if (!response.ok || (data.success === false)) {
//           throw new Error(data.error || 'Login failed');
//         }
        
//         // Store user data
//         const userData = {
//           ...(data.user || {}),
//           branchName: branch,
//           branchCode: branchCode || (data.user ? data.user.branchCode : ''),
//           role: 'admin'
//         };
        
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(userData));
        
//         setManualLoginAttempt(true);
//         const success = await login(
//           identifier, 
//           userData.branchCode, 
//           data.token, 
//           branch, 
//           userData.role,
//           verifyResponseData
//         );
        
//         if (!success) {
//           setManualLoginAttempt(false);
//           throw new Error("Login failed. Please try again.");
//         }
//       }
//       // Regular user flow
//       else {
//         console.log("Finalizing regular user login");
        
//         const userData = {
//           fnumber: identifier,
//           branchName: branch,
//           branchCode: branchCode,
//           role: 'user'
//         };
        
//         localStorage.setItem('token', sessionToken);
//         localStorage.setItem('user', JSON.stringify(userData));
        
//         setManualLoginAttempt(true);
//         const success = await login(
//           identifier, 
//           branchCode,
//           sessionToken, 
//           branch, 
//           userData.role,
//           verifyResponseData
//         );
        
//         if (!success) {
//           setManualLoginAttempt(false);
//           throw new Error("Login failed. Please try again.");
//         }
//       }
      
//       // Clean up the stored 2FA response after successful login
//       sessionStorage.removeItem('verify2faResponse');
      
//     } catch (err) {
//       console.error("Login finalization error:", err);
//       setManualLoginAttempt(false);
//       setLocalError(err.message || "An unexpected error occurred. Please try again.");
//     } finally {
//       setLoadingSpinner(false);
//     }
//   };

//   // Handle regular user authentication (with 2FA)
//   const handleRegularUserAuth = async (fnumber, password) => {
//     try {
//       console.log("Using regular user authentication flow with 2FA");
      
//       const response = await fetch(`${API_URL}/users/authenticate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           fnumber,
//           password
//         })
//       });
      
//       const data = await response.json();
      
//       if (!response.ok || !data.success) {
//         // Check for specific error messages from the server
//         if (data.status_code === "001" && data.status_message?.includes("User not found in LDAP")) {
//           throw new Error("User not found in LDAP. Please check your credentials.");
//         }
//         throw new Error(data.error || 'Authentication failed');
//       }
      
//       console.log("Authentication response:", data);
      
//       setAuthToken(data.token);
//       setSavedIdentifier(fnumber);
      
//       // Reset state for the verification screen
//       setVerifyButtonVisible(false); // Will be shown after 10 seconds timer
//       setShowManualCodeEntry(false);
//       setVerificationCode("");
//       setPollingStatus("pending");
      
//       // Now show verification screen and start polling
//       setShowVerification(true);
//       startPollingFor2FA(data.token);
      
//     } catch (err) {
//       console.error("Regular user authentication error:", err);
//       throw err; // Re-throw to be caught by the caller
//     } finally {
//       setLoadingSpinner(false);
//     }
//   };

//   // Handle 2FA verification with code (for non-admin users)
//   const handleVerify2FA = async (e) => {
//     e.preventDefault();
//     setLocalError("");
//     setLoadingSpinner(true);
    
//     try {
//       // Manual code verification if user entered a code
//       if (!verificationCode.trim()) {
//         setLocalError("Please enter a verification code");
//         setLoadingSpinner(false);
//         return;
//       }
      
//       const response = await fetch(`${API_URL}/users/verify2fa`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           token: authToken,
//           code: verificationCode,
//           fnumber: savedIdentifier // Make sure to send the fnumber
//         })
//       });
      
//       const data = await response.json();
//       console.log("Manual 2FA verification response:", data);
      
//       if (!response.ok || !data.success) {
//         throw new Error(data.error || 'Verification failed');
//       }
      
//       // Stop polling if it's still going
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//       }
      
//       setPollingStatus("success");
      
//       // Save the 2FA verification response for user data extraction
//       sessionStorage.setItem('verify2faResponse', JSON.stringify(data));
      
//       // After successful 2FA verification, check branches
//       await checkUserBranches(data);
      
//     } catch (err) {
//       console.error("2FA verification error:", err);
//       setLocalError(err.message || "Verification failed. Please try again.");
//     } finally {
//       setLoadingSpinner(false);
//     }
//   };

//   // Handle branch selection for both admin and non-admin users
//   const handleBranchSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Branch selection form submitted");
    
//     if (!selectedBranch) {
//       setLocalError("Please select a branch");
//       return;
//     }
    
//     await handleFinalLogin(savedIdentifier, selectedBranch, sessionToken);
//   };

//   // Toggle manual code entry
//   const toggleManualCodeEntry = () => {
//     setShowManualCodeEntry(!showManualCodeEntry);
//   };

//   // Cancel 2FA process and go back to login
//   const cancelAuth = () => {
//     // Stop the polling
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//     }
    
//     if (buttonFadeIntervalRef.current) {
//       clearInterval(buttonFadeIntervalRef.current);
//     }
    
//     if (timerIntervalRef.current) {
//       clearInterval(timerIntervalRef.current);
//     }
    
//     setShowVerification(false);
//     setPollingStatus("pending");
//     setLoadingSpinner(false);
//     setShowTimer(false);
//   };
  
//   const displayError = error || localError;
  
//   if (!showVerification && !showBranchSelection) {
//     return (
//       <div className="login-container">
//         <div className="login-card">
//           <img src="/FNB logo.png" alt="FNB Logo" className="login-logo" />
//           <h2>Welcome to FNB Admin</h2>
//           <form onSubmit={handleInitialSubmit}>
//             <input
//               type="text"
//               placeholder="F-Number or Email"
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//               maxLength={25}
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
            
//             {displayError && <p className="error-message">{displayError}</p>}
//             <button type="submit" className="login-button" disabled={loading || loadingSpinner}>
//               {loadingSpinner ? <span className="spinner"></span> : "Login"}
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }
  
//   // 2FA verification screen
//   if (showVerification) {
//     return (
//       <div className="login-container">
//         {/* Transition overlay for successful verification */}
//         {showTransition && (
//           <div style={styles.transitionOverlay}>
//             <div style={styles.transitionCard}>
//               <div style={styles.transitionSpinner}></div>
//               <div style={styles.transitionMessage}>{transitionMessage}</div>
//               <div style={styles.progressContainer}>
//                 <div style={styles.progressBar}></div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div className="login-card verification-card">
//           <img src="/FNB logo.png" alt="FNB Logo" className="login-logo" />
//           <h2>Two-Factor Authentication</h2>
          
//           <div className="verification-status">
//             <h3>Verification Request Sent</h3>
//             <p>Please check your phone for an authentication request and approve it to continue.</p>
            
//             {showTimer && (
//               <div style={styles.timerContainer}>
//                 <div style={styles.timerCircle}>
//                   <div style={styles.timerProgress}></div>
//                   <span style={styles.timerText}>{remainingTime}s</span>
//                 </div>
//               </div>
//             )}
            
//             <div className="status-indicator">
//               {pollingStatus === "pending" && (
//                 <div className="pending-status">
//                   <span className="spinner"></span>
//                   Waiting for approval on your phone...
//                 </div>
//               )}
//              {pollingStatus === "success" && (
//   <div className="success-status">
//     <span className="success-icon">✓</span>
//     Verification successful! 
//     {checkingBranches && <span> Checking your assigned branches...</span>}
//   </div>
// )}
// {pollingStatus === "failed" && (
//   <div className="failed-status">
//     <span className="failed-icon">✗</span>
//     Verification failed. Please try again.
//   </div>
// )}
// </div>
// </div>

// {/* Check Status Button - only visible after 10 seconds with fading effect */}
// {pollingStatus === "pending" && (
//   <button 
//     className="verify-status-button"
//     onClick={checkVerificationStatus}
//     disabled={checkingStatus}
//     style={styles.verifyButtonAppear}
//   >
//     {checkingStatus ? <span className="spinner"></span> : "Proceed to branch verifying"}
//   </button>
// )}

// {/* Manual code entry option - hidden by default */}
// <div className="manual-code-option">
//   <button 
//     type="button" 
//     className="toggle-code-button"
//     onClick={toggleManualCodeEntry}
//   >
//     {showManualCodeEntry ? "Hide Code Entry" : "Use Verification Code Instead"}
//   </button>
  
//   {showManualCodeEntry && (
//     <form onSubmit={handleVerify2FA}>
//       <input
//         type="text"
//         placeholder="Enter verification code"
//         value={verificationCode}
//         onChange={(e) => setVerificationCode(e.target.value)}
//       />
      
//       <button type="submit" className="login-button" disabled={loading || loadingSpinner || pollingStatus === "success"}>
//         {loadingSpinner ? <span className="spinner"></span> : "Verify with Code"}
//       </button>
//     </form>
//   )}
// </div>

// {displayError && <p className="error-message">{displayError}</p>}

// <button 
//   className="back-button" 
//   onClick={cancelAuth}
//   disabled={loadingSpinner || checkingStatus}
// >
//   Back to Login
// </button>
// </div>
// </div>
// );
// }

// // Branch selection form (for both admin and non-admin users)
// return (
// <div className="login-container">
// <div className="login-card">
//   <img src="/FNB logo.png" alt="FNB Logo" className="login-logo" />
//   <h2>Select Branch</h2>
//   <form onSubmit={handleBranchSubmit}>
//     <div className="select-container">
//       <select
//         value={selectedBranch}
//         onChange={(e) => setSelectedBranch(e.target.value)}
//         required
//         disabled={fetchingBranches}
//         className="branch-select"
//       >
//         <option value="">Select Branch</option>
//         {branches.map((branch) => (
//           <option key={branch.branchCode || branch.id || Math.random()} value={branch.branchName}>
//             {branch.branchName}
//           </option>
//         ))}
//       </select>
//       {fetchingBranches && (
//         <span className="select-spinner"></span>
//       )}
//     </div>
    
//     {displayError && <p className="error-message">{displayError}</p>}
//     <button type="submit" className="login-button" disabled={loading || loadingSpinner || fetchingBranches}>
//       {loadingSpinner ? <span className="spinner"></span> : "Continue"}
//     </button>
//   </form>
// </div>
// </div>
// );
// };

// export default Login;

// // Users.js

// import React, { useState, useEffect } from "react";
// import { useVisitor } from "../context/VisitorContext";

// const AddUsers = () => {
//   const [fNumber, setFNumber] = useState("");
//   const [selectedBranch, setSelectedBranch] = useState("");
//   const [role, setRole] = useState("user");

//   const [users, setUsers] = useState([]);
//   const [expandedUserId, setExpandedUserId] = useState(null);
//   const [editingUser, setEditingUser] = useState(null);
//   const [branches, setBranches] = useState([]);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [deleteUserId, setDeleteUserId] = useState(null);
//   const [fetchingBranches, setFetchingBranches] = useState(true);

//   const { token } = useVisitor();

//   const API_URL = "http://localhost:5001/users";
//   const BRANCHES_URL = "http://localhost:5001/visitors/index";

//   // Fetch branches and users on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch branches - using the same API as in Login component
//         setFetchingBranches(true);
//         console.log("Fetching branches from:", BRANCHES_URL);
//         const branchResponse = await fetch(BRANCHES_URL);
        
//         if (!branchResponse.ok) {
//           throw new Error(`API response error: ${branchResponse.status}`);
//         }
        
//         const branchData = await branchResponse.json();
//         console.log(`Received ${branchData.length} branches from API`);
        
//         // Store branches with their names and codes
//         const branchOptions = branchData
//           .filter(branch => branch.branchName && branch.branchName.trim() !== "")
//           .sort((a, b) => a.branchName.localeCompare(b.branchName));
        
//         console.log(`Found ${branchOptions.length} unique branches`);
//         setBranches(branchOptions);
//         setFetchingBranches(false);

//         // Fetch users
//         const usersResponse = await fetch(API_URL, {
//           headers: {
//             'x-auth-token': token
//           }
//         });
//         if (!usersResponse.ok) {
//           throw new Error(`API response error: ${usersResponse.status}`);
//         }
//         const userData = await usersResponse.json();
//         setUsers(userData);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load data. Please try again later.");
//         setFetchingBranches(false);
//       }
//     };

//     fetchData();
//   }, [token]);

//   // Handle new user creation
//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     // Validate inputs
//     if (!fNumber || !selectedBranch) {
//       setError("Please fill in all required fields");
//       return;
//     }

//     setLoading(true);

//     // Find the selected branch code from the branches array
//     const selectedBranchObj = branches.find(branch => branch.branchName === selectedBranch);
    
//     if (!selectedBranchObj) {
//       setError("Invalid branch selection");
//       setLoading(false);
//       return;
//     }
    
//     const branchCode = selectedBranchObj.branchCode;
//     console.log(`Selected branch: ${selectedBranch} (code: ${branchCode})`);

//     try {
//       // First call our backend to verify the F-number
//       const verifyResponse = await fetch(`${API_URL}/verify-fnumber`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-auth-token': token
//         },
//         body: JSON.stringify({
//           fnumber: fNumber
//         })
//       });

//       const verifyData = await verifyResponse.json();

//       if (!verifyResponse.ok) {
//         throw new Error(verifyData.error || 'Failed to verify F-number');
//       }

//       if (!verifyData.isValid) {
//         throw new Error('User not found in APPSTEAM_DEV_IT_Works group');
//       }

//       // If verification is successful, create the user
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-auth-token': token
//         },
//         body: JSON.stringify({
//           email: fNumber, // Using F-number as the email/username
//           branch: selectedBranch,
//           branchCode: branchCode,
//           role
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'User creation failed');
//       }

//       // Add new user to users list
//       setUsers([...users, data.user]);

//       setSuccess("User created successfully!");
      
//       // Reset form
//       setFNumber("");
//       setSelectedBranch("");
//       setRole("user");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle user deletion
//   const handleDeleteUser = async (userId) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           'x-auth-token': token
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete user');
//       }

//       // Remove user from local state
//       setUsers(users.filter(user => user.id !== userId));
//       setSuccess("User deleted successfully!");
//       setExpandedUserId(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setDeleteUserId(null);
//     }
//   };

//   // Handle user update
//   const handleUpdateUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Find the selected branch code
//     const selectedBranchObj = branches.find(branch => branch.branchName === editingUser.branch);
    
//     if (!selectedBranchObj) {
//       setError("Invalid branch selection");
//       setLoading(false);
//       return;
//     }
    
//     const branchCode = selectedBranchObj.branchCode;

//     try {
//       const updateData = {
//         email: editingUser.email,
//         branch: editingUser.branch,
//         branchCode: branchCode,
//         role: editingUser.role,
//         isActive: editingUser.isActive
//       };

//       const response = await fetch(`${API_URL}/${editingUser.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-auth-token': token
//         },
//         body: JSON.stringify(updateData)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'User update failed');
//       }

//       // Update users list
//       setUsers(users.map(user => 
//         user.id === editingUser.id ? { ...user, ...updateData } : user
//       ));

//       setSuccess("User updated successfully!");
//       setEditingUser(null);
//       setExpandedUserId(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle user enable/disable
//   const handleToggleUserStatus = async (user) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/${user.id}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-auth-token': token
//         },
//         body: JSON.stringify({
//           isActive: !user.isActive
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update user status');
//       }

//       // Update users list
//       setUsers(users.map(u => 
//         u.id === user.id ? { ...u, isActive: !u.isActive } : u
//       ));

//       setSuccess(`User ${!user.isActive ? 'enabled' : 'disabled'} successfully!`);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Styles (same as previous implementation)

//   return (
//     <div style={styles.container}>
//       {/* Left Panel - User Creation Form */}
//       <div style={styles.leftPanel}>
//         <div style={styles.card}>
//           <h2>Create New User</h2>
//           <form onSubmit={handleCreateUser}>
//             <input
//               type="text"
//               placeholder="F Number"
//               value={fNumber}
//               onChange={(e) => setFNumber(e.target.value)}
//               required
//               style={styles.input}
//             />
            
//             <div style={styles.selectContainer}>
//               <select
//                 value={selectedBranch}
//                 onChange={(e) => setSelectedBranch(e.target.value)}
//                 required
//                 style={styles.select}
//                 disabled={fetchingBranches}
//               >
//                 <option value="">Select Branch</option>
//                 {branches.map((branch) => (
//                   <option key={branch.branchCode} value={branch.branchName}>
//                     {branch.branchName}
//                   </option>
//                 ))}
//               </select>
//               {fetchingBranches && (
//                 <div style={styles.selectSpinner}></div>
//               )}
//             </div>

//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               style={styles.select}
//             >
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>

//             {error && <p style={styles.errorMessage}>{error}</p>}
//             {success && <p style={styles.successMessage}>{success}</p>}

//             <button 
//               type="submit" 
//               disabled={loading || fetchingBranches}
//               style={styles.button}
//             >
//               {loading ? 'Creating User...' : 'Create User'}
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Right Panel - User Management */}
//       <div style={styles.rightPanel}>
//         <h2>All Users</h2>
//         {users.map((user) => (
//           <div key={user.id} style={styles.userCard}>
//             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//               <div>
//                 <strong>{user.email}</strong>
//                 <span 
//                   style={{
//                     ...styles.statusBadge, 
//                     // ...(user.isActive ? styles.statusActive : styles.statusInactive)
//                   }}
//                 >
//                   {user.isActive }
//                 </span>
//               </div>
//               <div>
//                 <button 
//                   onClick={() => {
//                     setExpandedUserId(expandedUserId === user.id ? null : user.id);
//                     setEditingUser(null);
//                   }}
//                   style={{...styles.actionButton, backgroundColor: '#17a2b8', color: 'white'}}
//                 >
//                   {expandedUserId === user.id ? 'Collapse' : 'Expand'}
//                 </button>
//               </div>
//             </div>
            
//             {expandedUserId === user.id && (
//               <div>
//                 {editingUser && editingUser.id === user.id ? (
//                   <form onSubmit={handleUpdateUser}>
//                     <input
//                       type="text"
//                       value={editingUser.email}
//                       onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
//                       style={styles.input}
//                       required
//                     />
//                     <div style={styles.selectContainer}>
//                       <select
//                         value={editingUser.branch}
//                         onChange={(e) => setEditingUser({...editingUser, branch: e.target.value})}
//                         style={styles.select}
//                         required
//                         disabled={fetchingBranches}
//                       >
//                         {branches.map((branch) => (
//                           <option key={branch.branchCode} value={branch.branchName}>
//                             {branch.branchName}
//                           </option>
//                         ))}
//                       </select>
//                       {fetchingBranches && (
//                         <div style={styles.selectSpinner}></div>
//                       )}
//                     </div>
//                     <select
//                       value={editingUser.role}
//                       onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
//                       style={styles.select}
//                     >
//                       <option value="user">User</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                     <div style={{display: 'flex', justifyContent: 'space-between'}}>
//                       <button 
//                         type="submit" 
//                         style={{...styles.actionButton, ...styles.editButton}}
//                         disabled={loading}
//                       >
//                         {loading ? 'Updating...' : 'Save Changes'}
//                       </button>
//                       <button 
//                         type="button"
//                         onClick={() => {
//                           setEditingUser(null);
//                           setExpandedUserId(null);
//                         }}
//                         style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 ) : (
//                   <div>
//                     <p>Branch: {user.branch}</p>
//                     <p>Role: {user.role}</p>
//                     <p>Created At: {new Date(user.created_at).toLocaleString()}</p>
//                     <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>
                    
//                     <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
//                       <button 
//                         onClick={() => setDeleteUserId(user.id)}
//                         style={{...styles.actionButton, ...styles.deleteButton}}
//                       >
//                         Delete
//                       </button>
//                       <button 
//                         onClick={() => {
//                           setEditingUser({
//                             id: user.id,
//                             email: user.email,
//                             branch: user.branch,
//                             role: user.role,
//                             isActive: user.isActive
//                           });
//                         }}
//                         style={{...styles.actionButton, ...styles.editButton}}
//                       >
//                         Edit
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Delete Confirmation Dialog */}
//       {deleteUserId && (
//         <div style={styles.confirmationDialog}>
//           <p>Are you sure you want to delete this user?</p>
//           <div style={{display: 'flex', justifyContent: 'space-between'}}>
//             <button 
//               onClick={() => handleDeleteUser(deleteUserId)}
//               style={{...styles.actionButton, ...styles.deleteButton}}
//             >
//               Yes
//             </button>
//             <button 
//               onClick={() => setDeleteUserId(null)}
//               style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
//             >
//               No
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Define the spinner animation */}
//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default AddUsers;


//addusers
// Add these state variables after the existing state declarations
const [showBranchManagement, setShowBranchManagement] = useState(false);
const [newBranch, setNewBranch] = useState({ branch_name: '', branch_code: '' });
const [editingBranch, setEditingBranch] = useState(null);
const [branchError, setBranchError] = useState('');
const [branchSuccess, setBranchSuccess] = useState('');

// Replace the BRANCHES_URL
const BRANCHES_URL = "http://localhost:5001/fnb_branches";

// Replace the branch fetching part in useEffect
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch branches - using new fnb_branches API
      setFetchingBranches(true);
      console.log("Fetching branches from:", BRANCHES_URL);
      const branchResponse = await fetch(BRANCHES_URL, {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!branchResponse.ok) {
        throw new Error(`API response error: ${branchResponse.status}`);
      }
      
      const branchData = await branchResponse.json();
      console.log(`Received ${branchData.length} branches from API`);
      
      // Store branches with their names and codes
      const branchOptions = branchData
        .filter(branch => branch.branch_name && branch.branch_name.trim() !== "")
        .sort((a, b) => a.branch_name.localeCompare(b.branch_name));
      
      console.log(`Found ${branchOptions.length} unique branches`);
      setBranches(branchOptions);
      setFetchingBranches(false);

      // Fetch users (existing code remains the same)
      const usersResponse = await fetch(API_URL, {
        headers: {
          'x-auth-token': token
        }
      });
      if (!usersResponse.ok) {
        throw new Error(`API response error: ${usersResponse.status}`);
      }
      const userData = await usersResponse.json();
      setUsers(userData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
      setFetchingBranches(false);
    }
  };

  fetchData();
}, [token]);

// Update the branch selection logic in handleCreateUser
const handleCreateUser = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  // Validate inputs
  if (!fNumber || !selectedBranch) {
    setError("Please fill in all required fields");
    return;
  }

  setLoading(true);

  // Find the selected branch code from the branches array
  const selectedBranchObj = branches.find(branch => branch.branch_name === selectedBranch);
  
  if (!selectedBranchObj) {
    setError("Invalid branch selection");
    setLoading(false);
    return;
  }
  
  const branchCode = selectedBranchObj.branch_code;
  console.log(`Selected branch: ${selectedBranch} (code: ${branchCode})`);

  // Rest of the function remains the same...
};

// Update the branch selection logic in handleUpdateUser
const handleUpdateUser = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Find the selected branch code
  const selectedBranchObj = branches.find(branch => branch.branch_name === editingUser.branch);
  
  if (!selectedBranchObj) {
    setError("Invalid branch selection");
    setLoading(false);
    return;
  }
  
  const branchCode = selectedBranchObj.branch_code;

  // Rest of the function remains the same...
};

// Add these new functions for branch management
const handleAddBranch = async () => {
  if (!newBranch.branch_name.trim() || !newBranch.branch_code.trim()) {
    setBranchError('Branch name and code cannot be empty');
    return;
  }

  setLoading(true);
  setBranchError('');
  
  try {
    const response = await fetch(BRANCHES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(newBranch)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add branch');
    }

    setBranches([...branches, data]);
    setNewBranch({ branch_name: '', branch_code: '' });
    setBranchSuccess('Branch added successfully!');
  } catch (err) {
    setBranchError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleUpdateBranch = async (branchId) => {
  if (!editingBranch.branch_name.trim() || !editingBranch.branch_code.trim()) {
    setBranchError('Branch name and code cannot be empty');
    return;
  }

  setLoading(true);
  setBranchError('');
  
  try {
    const response = await fetch(`${BRANCHES_URL}/${branchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({
        branch_name: editingBranch.branch_name,
        branch_code: editingBranch.branch_code
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update branch');
    }

    setBranches(branches.map(branch => 
      branch.id === branchId ? { ...branch, ...editingBranch } : branch
    ));
    setEditingBranch(null);
    setBranchSuccess('Branch updated successfully!');
  } catch (err) {
    setBranchError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleDeleteBranch = async (branchId) => {
  setLoading(true);
  setBranchError('');
  
  try {
    const response = await fetch(`${BRANCHES_URL}/${branchId}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete branch');
    }

    setBranches(branches.filter(branch => branch.id !== branchId));
    setBranchSuccess('Branch deleted successfully!');
  } catch (err) {
    setBranchError(err.message);
  } finally {
    setLoading(false);
  }
};

// Update the branch select dropdown in the form
<select
  value={selectedBranch}
  onChange={(e) => setSelectedBranch(e.target.value)}
  required
  style={styles.select}
  disabled={fetchingBranches}
>
  <option value="">Select Branch</option>
  {branches.map((branch) => (
    <option key={branch.id} value={branch.branch_name}>
      {branch.branch_name} ({branch.branch_code})
    </option>
  ))}
</select>

// Add branch management button after the create user form

<button 
  type="button"
  onClick={() => setShowBranchManagement(!showBranchManagement)}
  style={{...styles.button, backgroundColor: '#28a745', marginTop: '10px'}}
>
  {showBranchManagement ? 'Hide Branch Management' : 'Manage Branches'}
</button>

// Add branch management section after the button
{showBranchManagement && (
  <div style={{...styles.card, marginTop: '20px'}}>
    <h3>Branch Management</h3>
    
    {/* Add New Branch Form */}
    <div style={{marginBottom: '20px'}}>
      <h4>Add New Branch</h4>
      <input
        type="text"
        placeholder="Branch Name"
        value={newBranch.branch_name}
        onChange={(e) => setNewBranch({...newBranch, branch_name: e.target.value})}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Branch Code"
        value={newBranch.branch_code}
        onChange={(e) => setNewBranch({...newBranch, branch_code: e.target.value})}
        style={styles.input}
      />
      <button 
        type="button"
        onClick={handleAddBranch}
        style={{...styles.button, backgroundColor: '#007bff'}}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Branch'}
      </button>
    </div>

    {/* Branch List */}
    <div>
      <h4>Existing Branches</h4>
      {branches.map((branch) => (
        <div key={branch.id} style={{...styles.userCard, marginBottom: '10px'}}>
          {editingBranch && editingBranch.id === branch.id ? (
            <div>
              <input
                type="text"
                value={editingBranch.branch_name}
                onChange={(e) => setEditingBranch({...editingBranch, branch_name: e.target.value})}
                style={styles.input}
              />
              <input
                type="text"
                value={editingBranch.branch_code}
                onChange={(e) => setEditingBranch({...editingBranch, branch_code: e.target.value})}
                style={styles.input}
              />
              <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                <button 
                  onClick={() => handleUpdateBranch(branch.id)}
                  style={{...styles.actionButton, backgroundColor: '#28a745', color: 'white'}}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={() => setEditingBranch(null)}
                  style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <strong>{branch.branch_name}</strong> ({branch.branch_code})
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  onClick={() => setEditingBranch({
                    id: branch.id,
                    branch_name: branch.branch_name,
                    branch_code: branch.branch_code
                  })}
                  style={{...styles.actionButton, backgroundColor: '#17a2b8', color: 'white'}}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteBranch(branch.id)}
                  style={{...styles.actionButton, backgroundColor: '#dc3545', color: 'white'}}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>

    {branchError && <p style={styles.errorMessage}>{branchError}</p>}
    {branchSuccess && <p style={styles.successMessage}>{branchSuccess}</p>}
  </div>
)}

<select
  value={editingUser.branch}
  onChange={(e) => setEditingUser({...editingUser, branch: e.target.value})}
  style={styles.select}
  required
  disabled={fetchingBranches}
>
  {branches.map((branch) => (
    <option key={branch.id} value={branch.branch_name}>
      {branch.branch_name} ({branch.branch_code})
    </option>
  ))}
</select>


// first time
// Replace the branches state initialization
const [branches, setBranches] = useState([]);

// Remove the useEffect that saves branches to localStorage and replace with this
useEffect(() => {
  localStorage.setItem('departments', JSON.stringify(departments));
}, [departments]);

// Add new useEffect to fetch branches from API
useEffect(() => {
  const fetchBranches = async () => {
    try {
      const response = await fetch('http://localhost:5001/fnb_branches');
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      const branchData = await response.json();
      
      // Format branches for the select dropdown
      const formattedBranches = [
        { label: 'Select Branch', value: '' },
        ...branchData.map(branch => ({
          label: branch.branch_name,
          value: branch.branch_code,
          id: branch.id
        }))
      ];
      
      setBranches(formattedBranches);
    } catch (error) {
      console.error('Error fetching branches:', error);
      // Fall back to default branches if API fails
      setBranches([
        { label: 'Select Branch', value: '' },
        { label: 'ACCRA BRANCH', value: '330102' },
        { label: 'MAKOLA BRANCH', value: '330111' },
        { label: 'TEMA BRANCH (COMM', value: '330120' },
        { label: 'AIRPORT BRANCH', value: '330119' },
        { label: 'MARKET CIRCLE BRANCH TAKORADI', value: '330401' },
        { label: 'ADUM BRANCH KUMASI', value: '330601' },
        { label: 'WEST HILLS MALL', value: '330108' },
        { label: 'JUNCTION SHOPPING CENTRE BRANCH', value: '330101' },
        { label: 'TEMA BRANCH (COMM 11)', value: '330112' },
        { label: 'ACHIMOTA MALL BRANCH', value: '330107' },
        { label: 'ACCRA MALL BRANCH', value: '330106' },
        { label: 'KEJETIA BRANCH', value: '330602' }
      ]);
    }
  };

  fetchBranches();
}, []);

// Update the handleAddBranch function to save to API
const handleAddBranch = async () => {
  if (!newBranch.label.trim() || !newBranch.value.trim()) {
    setError('Branch name and code cannot be empty');
    return;
  }
  
  if (branches.some(branch => branch.value === newBranch.value)) {
    setError('Branch code already exists');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5001/fnb_branches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        branch_name: newBranch.label,
        branch_code: newBranch.value
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save branch');
    }

    const savedBranch = await response.json();
    
    // Add the new branch to the local state
    const newBranchFormatted = {
      label: savedBranch.branch_name,
      value: savedBranch.branch_code,
      id: savedBranch.id
    };
    
    setBranches([...branches, newBranchFormatted]);
    setNewBranch({ label: '', value: '' });
    setShowAddBranch(false);
    setError('');
  } catch (error) {
    console.error('Error saving branch:', error);
    setError('Failed to save branch. Please try again.');
  }
};


// branchesController

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
    if (err.code === '23505') { // Unique constraint violation
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
    if (err.code === '23505') { // Unique constraint violation
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

//branchesRoutes

const express = require('express');
const router = express.Router();
const branchesController = require('../controllers/branchesController');

// Get all branches
router.get('/', branchesController.getAllBranches);

// Get branch by ID
router.get('/:id', branchesController.getBranchById);

// Create new branch
router.post('/', branchesController.createBranch);

// Update branch
router.put('/:id', branchesController.updateBranch);

// Delete branch
router.delete('/:id', branchesController.deleteBranch);

module.exports = router;

// add this to the server
app.use('/fnb_branches', require('./routes/branchesRoutes'));


// admin login
// Add this function to your Login component after the existing useEffect for fetching branches

// Modified fetch branches function for admin users
const fetchBranchesForAdmin = async () => {
  try {
    setFetchingBranches(true);
    console.log("Fetching branches for admin from fnb_branches API");
    const response = await fetch(`${API_URL}/fnb_branches`);
    
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Received ${data.length} branches from fnb_branches API`);
    
    // Transform the data to match the expected format
    const branchOptions = data
      .filter(branch => branch.branch_name && branch.branch_name.trim() !== "")
      .map(branch => ({
        branchName: branch.branch_name,
        branchCode: branch.branch_code,
        id: branch.id
      }))
      .sort((a, b) => a.branchName.localeCompare(b.branchName));
    
    console.log(`Found ${branchOptions.length} branches for admin`);
    setBranches(branchOptions);
  } catch (err) {
    console.error("Error fetching branches for admin:", err);
    setLocalError("Failed to load branches. Please try again later.");
  } finally {
    setFetchingBranches(false);
  }
};

// Update the handleAdminAuth function to use the new API
const handleAdminAuth = async (email, password) => {
  try {
    console.log("Using admin authentication flow");
    setLoadingSpinner(true);
    
    // Use a new endpoint specifically for admin credential verification
    const response = await fetch(`${AUTH_URL}/verify-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Admin authentication failed. Please check your credentials.");
    }
    
    // Store admin token for use in final authentication
    setSessionToken(data.token || "");
    setSavedIdentifier(email);
    
    // Fetch branches specifically for admin users using the new API
    await fetchBranchesForAdmin();
    
    // Now show branch selection after successful authentication
    setShowBranchSelection(true);
    setLoadingSpinner(false);
    
  } catch (err) {
    console.error("Admin authentication error:", err);
    setLocalError(err.message || "Admin authentication failed. Please check your credentials.");
    setLoadingSpinner(false);
  }
};



//add user


import React, { useState, useEffect } from "react";
import { useVisitor } from "../context/VisitorContext";

const AddUsers = () => {
  const [fNumber, setFNumber] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [role, setRole] = useState("user");

  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [branches, setBranches] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [fetchingBranches, setFetchingBranches] = useState(true);
   
  const { token } = useVisitor();

  const API_URL = "http://localhost:5001/users";
  const BRANCHES_URL = "http://localhost:5001/visitors/index";

  // Fetch branches and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch branches - using the same API as in Login component
        setFetchingBranches(true);
        console.log("Fetching branches from:", BRANCHES_URL);
        const branchResponse = await fetch(BRANCHES_URL);
        
        if (!branchResponse.ok) {
          throw new Error(`API response error: ${branchResponse.status}`);
        }
        
        const branchData = await branchResponse.json();
        console.log(`Received ${branchData.length} branches from API`);
        
        // Store branches with their names and codes
        const branchOptions = branchData
          .filter(branch => branch.branchName && branch.branchName.trim() !== "")
          .sort((a, b) => a.branchName.localeCompare(b.branchName));
        
        console.log(`Found ${branchOptions.length} unique branches`);
        setBranches(branchOptions);
        setFetchingBranches(false);

        // Fetch users
        const usersResponse = await fetch(API_URL, {
          headers: {
            'x-auth-token': token
          }
        });
        if (!usersResponse.ok) {
          throw new Error(`API response error: ${usersResponse.status}`);
        }
        const userData = await usersResponse.json();
        setUsers(userData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setFetchingBranches(false);
      }
    };

    fetchData();
  }, [token]);

  // Handle new user creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate inputs
    if (!fNumber || !selectedBranch) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    // Find the selected branch code from the branches array
    const selectedBranchObj = branches.find(branch => branch.branchName === selectedBranch);
    
    if (!selectedBranchObj) {
      setError("Invalid branch selection");
      setLoading(false);
      return;
    }
    
    const branchCode = selectedBranchObj.branchCode;
    console.log(`Selected branch: ${selectedBranch} (code: ${branchCode})`);

    try {
      // First call our backend to verify the F-number
      const verifyResponse = await fetch(`${API_URL}/verify-fnumber`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          fnumber: fNumber
        })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Failed to verify F-number');
      }

      if (!verifyData.isValid) {
        throw new Error('User not found in APPSTEAM_DEV_IT_Works group');
      }

      // If verification is successful, create the user
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          email: fNumber, // Using F-number as the email/username
          branch: selectedBranch,
          branchCode: branchCode,
          role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'User creation failed');
      }

      // Add new user to users list
      setUsers([...users, data.user]);

      setSuccess("User created successfully!");
      
      // Reset form
      setFNumber("");
      setSelectedBranch("");
      setRole("user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove user from local state
      setUsers(users.filter(user => user.id !== userId));
      setSuccess("User deleted successfully!");
      setExpandedUserId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setDeleteUserId(null);
    }
  };

  // Handle user update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Find the selected branch code
    const selectedBranchObj = branches.find(branch => branch.branchName === editingUser.branch);
    
    if (!selectedBranchObj) {
      setError("Invalid branch selection");
      setLoading(false);
      return;
    }
    
    const branchCode = selectedBranchObj.branchCode;

    try {
      const updateData = {
        email: editingUser.email,
        branch: editingUser.branch,
        branchCode: branchCode,
        role: editingUser.role,
        isActive: editingUser.isActive
      };

      const response = await fetch(`${API_URL}/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'User update failed');
      }

      // Update users list
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...updateData } : user
      ));

      setSuccess("User updated successfully!");
      setEditingUser(null);
      setExpandedUserId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user enable/disable
  const handleToggleUserStatus = async (user) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          isActive: !user.isActive
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user status');
      }

      // Update users list
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      ));

      setSuccess(`User ${!user.isActive ? 'enabled' : 'disabled'} successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Styles (same as previous implementation)
  const styles = {
    container: {
      display: 'flex',
      padding: '20px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
    },
    leftPanel: {
      width: '60%',
      paddingRight: '20px',
    },
    rightPanel: {
      width: '50%',
      overflowY: 'auto',
      maxHeight: '100vh',
    },
    card: {
      background: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
      position: 'relative',
    },
    selectContainer: {
      position: 'relative',
      marginBottom: '1rem',
    },
    selectSpinner: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '20px',
      height: '20px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    userCard: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      margin: '10px 0',
      padding: '15px',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    errorMessage: {
      color: '#e74c3c',
      marginBottom: '1rem',
    },
    successMessage: {
      color: '#2ecc71',
      marginBottom: '1rem',
    },
    actionButton: {
      padding: '8px 15px',
      margin: '0 5px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    deleteButton: {
      backgroundColor: 'red',
      color: 'white',
      border: 'none',
    },
    editButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
    },
    confirmationDialog: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
      zIndex: 1000,
    },
    statusBadge: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '10px',
    },
    statusActive: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    statusInactive: {
      backgroundColor: '#F44336',
      color: 'white',
    },
    toggleButton: {
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      border: 'none',
      color: 'white',
    },
    enableButton: {
      backgroundColor: '#4CAF50',
    },
    disableButton: {
      backgroundColor: '#F44336',
    },
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - User Creation Form */}
      <div style={styles.leftPanel}>
        <div style={styles.card}>
          <h2>Create New User</h2>
          <form onSubmit={handleCreateUser}>
            <input
              type="text"
              placeholder="F Number"
              value={fNumber}
              onChange={(e) => setFNumber(e.target.value)}
              required
              style={styles.input}
            />
            
            <div style={styles.selectContainer}>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
                style={styles.select}
                disabled={fetchingBranches}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.branchCode} value={branch.branchName}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
              {fetchingBranches && (
                <div style={styles.selectSpinner}></div>
              )}
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {error && <p style={styles.errorMessage}>{error}</p>}
            {success && <p style={styles.successMessage}>{success}</p>}

            <button 
              type="submit" 
              disabled={loading || fetchingBranches}
              style={styles.button}
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel - User Management */}
      <div style={styles.rightPanel}>
        <h2>All Users</h2>
        {users.map((user) => (
          <div key={user.id} style={styles.userCard}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <strong>{user.email}</strong>
                <span 
                  style={{
                    ...styles.statusBadge, 
                    // ...(user.isActive ? styles.statusActive : styles.statusInactive)
                  }}
                >
                  {user.isActive }
                </span>
              </div>
              <div>
                <button 
                  onClick={() => {
                    setExpandedUserId(expandedUserId === user.id ? null : user.id);
                    setEditingUser(null);
                  }}
                  style={{...styles.actionButton, backgroundColor: '#17a2b8', color: 'white'}}
                >
                  {expandedUserId === user.id ? 'Collapse' : 'Expand'}
                </button>
              </div>
            </div>
            
            {expandedUserId === user.id && (
              <div>
                {editingUser && editingUser.id === user.id ? (
                  <form onSubmit={handleUpdateUser}>
                    <input
                      type="text"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      style={styles.input}
                      required
                    />
                    <div style={styles.selectContainer}>
                      <select
                        value={editingUser.branch}
                        onChange={(e) => setEditingUser({...editingUser, branch: e.target.value})}
                        style={styles.select}
                        required
                        disabled={fetchingBranches}
                      >
                        {branches.map((branch) => (
                          <option key={branch.branchCode} value={branch.branchName}>
                            {branch.branchName}
                          </option>
                        ))}
                      </select>
                      {fetchingBranches && (
                        <div style={styles.selectSpinner}></div>
                      )}
                    </div>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                      style={styles.select}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <button 
                        type="submit" 
                        style={{...styles.actionButton, ...styles.editButton}}
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setExpandedUserId(null);
                        }}
                        style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p>Branch: {user.branch}</p>
                    <p>Role: {user.role}</p>
                    <p>Created At: {new Date(user.created_at).toLocaleString()}</p>
                    <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                      <button 
                        onClick={() => setDeleteUserId(user.id)}
                        style={{...styles.actionButton, ...styles.deleteButton}}
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => {
                          setEditingUser({
                            id: user.id,
                            email: user.email,
                            branch: user.branch,
                            role: user.role,
                            isActive: user.isActive
                          });
                        }}
                        style={{...styles.actionButton, ...styles.editButton}}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteUserId && (
        <div style={styles.confirmationDialog}>
          <p>Are you sure you want to delete this user?</p>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <button 
              onClick={() => handleDeleteUser(deleteUserId)}
              style={{...styles.actionButton, ...styles.deleteButton}}
            >
              Yes
            </button>
            <button 
              onClick={() => setDeleteUserId(null)}
              style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Define the spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AddUsers;




//new add user
import React, { useState, useEffect } from "react";
import { useVisitor } from "../context/VisitorContext";

const AddUsers = () => {
  const [fNumber, setFNumber] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [role, setRole] = useState("user");

  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [branches, setBranches] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [fetchingBranches, setFetchingBranches] = useState(true);

  // Branch management states
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deleteBranchId, setDeleteBranchId] = useState(null);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchCode, setNewBranchCode] = useState("");
  const [branchLoading, setBranchLoading] = useState(false);
   
  const { token } = useVisitor();

  const API_URL = "http://localhost:5001/users";
  const BRANCHES_URL = "http://localhost:5001/fnb_branches";

  // Fetch branches and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch branches from new API
        setFetchingBranches(true);
        console.log("Fetching branches from:", BRANCHES_URL);
        const branchResponse = await fetch(BRANCHES_URL, {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!branchResponse.ok) {
          throw new Error(`API response error: ${branchResponse.status}`);
        }
        
        const branchData = await branchResponse.json();
        console.log(`Received ${branchData.length} branches from API`);
        
        // Store branches with their names and codes
        const branchOptions = branchData
          .filter(branch => branch.branchName && branch.branchName.trim() !== "")
          .sort((a, b) => a.branchName.localeCompare(b.branchName));
        
        console.log(`Found ${branchOptions.length} unique branches`);
        setBranches(branchOptions);
        setFetchingBranches(false);

        // Fetch users
        const usersResponse = await fetch(API_URL, {
          headers: {
            'x-auth-token': token
          }
        });
        if (!usersResponse.ok) {
          throw new Error(`API response error: ${usersResponse.status}`);
        }
        const userData = await usersResponse.json();
        setUsers(userData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setFetchingBranches(false);
      }
    };

    fetchData();
  }, [token]);

  // Handle new user creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate inputs
    if (!fNumber || !selectedBranch) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    // Find the selected branch code from the branches array
    const selectedBranchObj = branches.find(branch => branch.branchName === selectedBranch);
    
    if (!selectedBranchObj) {
      setError("Invalid branch selection");
      setLoading(false);
      return;
    }
    
    const branchCode = selectedBranchObj.branchCode;
    console.log(`Selected branch: ${selectedBranch} (code: ${branchCode})`);

    try {
      // First call our backend to verify the F-number
      const verifyResponse = await fetch(`${API_URL}/verify-fnumber`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          fnumber: fNumber
        })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Failed to verify F-number');
      }

      if (!verifyData.isValid) {
        throw new Error('User not found in APPSTEAM_DEV_IT_Works group');
      }

      // If verification is successful, create the user
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          email: fNumber, // Using F-number as the email/username
          branch: selectedBranch,
          branchCode: branchCode,
          role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'User creation failed');
      }

      // Add new user to users list
      setUsers([...users, data.user]);

      setSuccess("User created successfully!");
      
      // Reset form
      setFNumber("");
      setSelectedBranch("");
      setRole("user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove user from local state
      setUsers(users.filter(user => user.id !== userId));
      setSuccess("User deleted successfully!");
      setExpandedUserId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setDeleteUserId(null);
    }
  };

  // Handle user update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Find the selected branch code
    const selectedBranchObj = branches.find(branch => branch.branchName === editingUser.branch);
    
    if (!selectedBranchObj) {
      setError("Invalid branch selection");
      setLoading(false);
      return;
    }
    
    const branchCode = selectedBranchObj.branchCode;

    try {
      const updateData = {
        email: editingUser.email,
        branch: editingUser.branch,
        branchCode: branchCode,
        role: editingUser.role,
        isActive: editingUser.isActive
      };

      const response = await fetch(`${API_URL}/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'User update failed');
      }

      // Update users list
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...updateData } : user
      ));

      setSuccess("User updated successfully!");
      setEditingUser(null);
      setExpandedUserId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user enable/disable
  const handleToggleUserStatus = async (user) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          isActive: !user.isActive
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user status');
      }

      // Update users list
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      ));

      setSuccess(`User ${!user.isActive ? 'enabled' : 'disabled'} successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Branch management functions
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setBranchLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(BRANCHES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          branchName: newBranchName,
          branchCode: newBranchCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Branch creation failed');
      }

      // Add new branch to branches list
      setBranches([...branches, data.branch].sort((a, b) => a.branchName.localeCompare(b.branchName)));
      setSuccess("Branch created successfully!");
      setNewBranchName("");
      setNewBranchCode("");
      setShowBranchModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBranchLoading(false);
    }
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    setBranchLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${BRANCHES_URL}/${editingBranch.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          branchName: editingBranch.branchName,
          branchCode: editingBranch.branchCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Branch update failed');
      }

      // Update branches list
      setBranches(branches.map(branch => 
        branch.id === editingBranch.id ? { ...branch, ...editingBranch } : branch
      ).sort((a, b) => a.branchName.localeCompare(b.branchName)));

      setSuccess("Branch updated successfully!");
      setEditingBranch(null);
      setShowBranchModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBranchLoading(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    setBranchLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${BRANCHES_URL}/${branchId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete branch');
      }

      // Remove branch from local state
      setBranches(branches.filter(branch => branch.id !== branchId));
      setSuccess("Branch deleted successfully!");
      setDeleteBranchId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBranchLoading(false);
    }
  };

  // Styles
  const styles = {
    container: {
      display: 'flex',
      padding: '20px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
    },
    leftPanel: {
      width: '60%',
      paddingRight: '20px',
    },
    rightPanel: {
      width: '50%',
      overflowY: 'auto',
      maxHeight: '100vh',
    },
    card: {
      background: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
      position: 'relative',
    },
    selectContainer: {
      position: 'relative',
      marginBottom: '1rem',
    },
    selectSpinner: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '20px',
      height: '20px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    userCard: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      margin: '10px 0',
      padding: '15px',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    errorMessage: {
      color: '#e74c3c',
      marginBottom: '1rem',
    },
    successMessage: {
      color: '#2ecc71',
      marginBottom: '1rem',
    },
    actionButton: {
      padding: '8px 15px',
      margin: '0 5px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    deleteButton: {
      backgroundColor: 'red',
      color: 'white',
      border: 'none',
    },
    editButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
    },
    confirmationDialog: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
      zIndex: 1000,
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      width: '500px',
      maxWidth: '90%',
    },
    branchManagementButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    branchItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      borderBottom: '1px solid #eee',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '10px',
    },
    statusActive: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    statusInactive: {
      backgroundColor: '#F44336',
      color: 'white',
    },
    toggleButton: {
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      border: 'none',
      color: 'white',
    },
    enableButton: {
      backgroundColor: '#4CAF50',
    },
    disableButton: {
      backgroundColor: '#F44336',
    },
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - User Creation Form */}
      <div style={styles.leftPanel}>
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2>Create New User</h2>
            <button 
              style={styles.branchManagementButton}
              onClick={() => setShowBranchModal(true)}
            >
              Manage Branches
            </button>
          </div>
          
          <form onSubmit={handleCreateUser}>
            <input
              type="text"
              placeholder="F Number"
              value={fNumber}
              onChange={(e) => setFNumber(e.target.value)}
              required
              style={styles.input}
            />
            
            <div style={styles.selectContainer}>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
                style={styles.select}
                disabled={fetchingBranches}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.branchCode} value={branch.branchName}>
                    {branch.branchName} ({branch.branchCode})
                  </option>
                ))}
              </select>
              {fetchingBranches && (
                <div style={styles.selectSpinner}></div>
              )}
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {error && <p style={styles.errorMessage}>{error}</p>}
            {success && <p style={styles.successMessage}>{success}</p>}

            <button 
              type="submit" 
              disabled={loading || fetchingBranches}
              style={styles.button}
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel - User Management */}
      <div style={styles.rightPanel}>
        <h2>All Users</h2>
        {users.map((user) => (
          <div key={user.id} style={styles.userCard}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <strong>{user.email}</strong>
                <span 
                  style={{
                    ...styles.statusBadge, 
                    ...(user.isActive ? styles.statusActive : styles.statusInactive)
                  }}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <button 
                  onClick={() => {
                    setExpandedUserId(expandedUserId === user.id ? null : user.id);
                    setEditingUser(null);
                  }}
                  style={{...styles.actionButton, backgroundColor: '#17a2b8', color: 'white'}}
                >
                  {expandedUserId === user.id ? 'Collapse' : 'Expand'}
                </button>
              </div>
            </div>
            
            {expandedUserId === user.id && (
              <div>
                {editingUser && editingUser.id === user.id ? (
                  <form onSubmit={handleUpdateUser}>
                    <input
                      type="text"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      style={styles.input}
                      required
                    />
                    <div style={styles.selectContainer}>
                      <select
                        value={editingUser.branch}
                        onChange={(e) => setEditingUser({...editingUser, branch: e.target.value})}
                        style={styles.select}
                        required
                        disabled={fetchingBranches}
                      >
                        {branches.map((branch) => (
                          <option key={branch.branchCode} value={branch.branchName}>
                            {branch.branchName} ({branch.branchCode})
                          </option>
                        ))}
                      </select>
                      {fetchingBranches && (
                        <div style={styles.selectSpinner}></div>
                      )}
                    </div>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                      style={styles.select}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <button 
                        type="submit" 
                        style={{...styles.actionButton, ...styles.editButton}}
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setExpandedUserId(null);
                        }}
                        style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p>Branch: {user.branch}</p>
                    <p>Role: {user.role}</p>
                    <p>Created At: {new Date(user.created_at).toLocaleString()}</p>
                    <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                      <button 
                        onClick={() => setDeleteUserId(user.id)}
                        style={{...styles.actionButton, ...styles.deleteButton}}
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => {
                          setEditingUser({
                            id: user.id,
                            email: user.email,
                            branch: user.branch,
                            role: user.role,
                            isActive: user.isActive
                          });
                        }}
                        style={{...styles.actionButton, ...styles.editButton}}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleToggleUserStatus(user)}
                        style={{
                          ...styles.actionButton, 
                          ...styles.toggleButton,
                          ...(user.isActive ? styles.disableButton : styles.enableButton)
                        }}
                      >
                        {user.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Branch Management Modal */}
      {showBranchModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2>Manage Branches</h2>
              <button 
                onClick={() => {
                  setShowBranchModal(false);
                  setEditingBranch(null);
                  setNewBranchName("");
                  setNewBranchCode("");
                }}
                style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'}}
              >
                ×
              </button>
            </div>

            {/* Add New Branch Form */}
            <form onSubmit={editingBranch ? handleUpdateBranch : handleCreateBranch}>
              <h3>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</h3>
              <input
                type="text"
                placeholder="Branch Name"
                value={editingBranch ? editingBranch.branchName : newBranchName}
                onChange={(e) => editingBranch 
                  ? setEditingBranch({...editingBranch, branchName: e.target.value})
                  : setNewBranchName(e.target.value)
                }
                required
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Branch Code"
                value={editingBranch ? editingBranch.branchCode : newBranchCode}
                onChange={(e) => editingBranch 
                  ? setEditingBranch({...editingBranch, branchCode: e.target.value})
                  : setNewBranchCode(e.target.value)
                }
                required
                style={styles.input}
              />
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  type="submit" 
                  disabled={branchLoading}
                  style={{...styles.button, width: 'auto', padding: '10px 20px'}}
                >
                  {branchLoading ? 'Saving...' : editingBranch ? 'Update Branch' : 'Add Branch'}
                </button>
                {editingBranch && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingBranch(null);
                      setNewBranchName("");
                      setNewBranchCode("");
                    }}
                    style={{...styles.button, width: 'auto', padding: '10px 20px', backgroundColor: '#6c757d'}}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Branch List */}
            <div style={{marginTop: '30px'}}>
              <h3>Existing Branches</h3>
              <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                {branches.map((branch) => (
                  <div key={branch.id} style={styles.branchItem}>
                    <div>
                      <strong>{branch.branchName}</strong>
                      <span style={{color: '#666', marginLeft: '10px'}}>({branch.branchCode})</span>
                    </div>
                    <div>
                      <button 
                        onClick={() => {
                          setEditingBranch(branch);
                          setNewBranchName("");
                          setNewBranchCode("");
                        }}
                        style={{...styles.actionButton, ...styles.editButton, marginRight: '5px'}}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => setDeleteBranchId(branch.id)}
                        style={{...styles.actionButton, ...styles.deleteButton}}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Dialog */}
      {deleteUserId && (
        <div style={styles.confirmationDialog}>
          <p>Are you sure you want to delete this user?</p>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <button 
              onClick={() => handleDeleteUser(deleteUserId)}
              style={{...styles.actionButton, ...styles.deleteButton}}
            >
              Yes
            </button>
            <button 
              onClick={() => setDeleteUserId(null)}
              style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Delete Branch Confirmation Dialog */}
      {deleteBranchId && (
        <div style={styles.confirmationDialog}>
          <p>Are you sure you want to delete this branch?</p>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <button 
              onClick={() => handleDeleteBranch(deleteBranchId)}
              style={{...styles.actionButton, ...styles.deleteButton}}
            >
              Yes
            </button>
            <button 
              onClick={() => setDeleteBranchId(null)}
              style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Define the spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AddUsers



//UPDATED
import React, { useState, useEffect } from "react";
import { useVisitor } from "../context/VisitorContext";

const AddUsers = () => {
  const [fNumber, setFNumber] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [role, setRole] = useState("user");

  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [branches, setBranches] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [fetchingBranches, setFetchingBranches] = useState(true);

  // Branch management states
  const [showBranchManagement, setShowBranchManagement] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchCode, setNewBranchCode] = useState("");
  const [editingBranch, setEditingBranch] = useState(null);
  const [deleteBranchId, setDeleteBranchId] = useState(null);
  const [branchLoading, setBranchLoading] = useState(false);
  const [branchError, setBranchError] = useState("");
  const [branchSuccess, setBranchSuccess] = useState("");
   
  const { token } = useVisitor();

  const API_URL = "http://localhost:5001/users";
  const BRANCHES_URL = "http://localhost:5001/fnb_branches";

  // Fetch branches from the new API
  const fetchBranches = async () => {
    try {
      setFetchingBranches(true);
      console.log("Fetching branches from:", BRANCHES_URL);
      const branchResponse = await fetch(BRANCHES_URL, {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!branchResponse.ok) {
        throw new Error(`API response error: ${branchResponse.status}`);
      }
      
      const branchData = await branchResponse.json();
      console.log(`Received ${branchData.length} branches from API`);
      
      // Store branches with their names and codes
      const branchOptions = branchData
        .filter(branch => branch.branch_name && branch.branch_name.trim() !== "")
        .sort((a, b) => a.branch_name.localeCompare(b.branch_name));
      
      console.log(`Found ${branchOptions.length} unique branches`);
      setBranches(branchOptions);
    } catch (err) {
      console.error("Error fetching branches:", err);
      setError("Failed to load branches. Please try again later.");
    } finally {
      setFetchingBranches(false);
    }
  };

  // Fetch users and branches on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch branches
        await fetchBranches();

        // Fetch users
        const usersResponse = await fetch(API_URL, {
          headers: {
            'x-auth-token': token
          }
        });
        if (!usersResponse.ok) {
          throw new Error(`API response error: ${usersResponse.status}`);
        }
        const userData = await usersResponse.json();
        setUsers(userData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [token]);

  // Handle new user creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate inputs
    if (!fNumber || !selectedBranch) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    // Find the selected branch code from the branches array
    const selectedBranchObj = branches.find(branch => branch.branch_name === selectedBranch);
    
    if (!selectedBranchObj) {
      setError("Invalid branch selection");
      setLoading(false);
      return;
    }
    
    const branchCode = selectedBranchObj.branch_code;
    console.log(`Selected branch: ${selectedBranch} (code: ${branchCode})`);

    try {
      // First call our backend to verify the F-number
      const verifyResponse = await fetch(`${API_URL}/verify-fnumber`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          fnumber: fNumber
        })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Failed to verify F-number');
      }

      if (!verifyData.isValid) {
        throw new Error('User not found in APPSTEAM_DEV_IT_Works group');
      }

      // If verification is successful, create the user
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          email: fNumber, // Using F-number as the email/username
          branch: selectedBranch,
          branchCode: branchCode,
          role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'User creation failed');
      }

      // Add new user to users list
      setUsers([...users, data.user]);

      setSuccess("User created successfully!");
      
      // Reset form
      setFNumber("");
      setSelectedBranch("");
      setRole("user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove user from local state
      setUsers(users.filter(user => user.id !== userId));
      setSuccess("User deleted successfully!");
      setExpandedUserId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setDeleteUserId(null);
    }
  };

  // Handle user update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Find the selected branch code
    const selectedBranchObj = branches.find(branch => branch.branch_name === editingUser.branch);
    
    if (!selectedBranchObj) {
      setError("Invalid branch selection");
      setLoading(false);
      return;
    }
    
    const branchCode = selectedBranchObj.branch_code;

    try {
      const updateData = {
        email: editingUser.email,
        branch: editingUser.branch,
        branchCode: branchCode,
        role: editingUser.role,
        isActive: editingUser.isActive
      };

      const response = await fetch(`${API_URL}/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'User update failed');
      }

      // Update users list
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...updateData } : user
      ));

      setSuccess("User updated successfully!");
      setEditingUser(null);
      setExpandedUserId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user enable/disable
  const handleToggleUserStatus = async (user) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          isActive: !user.isActive
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user status');
      }

      // Update users list
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      ));

      setSuccess(`User ${!user.isActive ? 'enabled' : 'disabled'} successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Branch Management Functions
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setBranchError("");
    setBranchSuccess("");

    if (!newBranchName || !newBranchCode) {
      setBranchError("Please fill in all branch fields");
      return;
    }

    setBranchLoading(true);

    try {
      const response = await fetch(BRANCHES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          branch_name: newBranchName,
          branch_code: newBranchCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Branch creation failed');
      }

      // Add new branch to branches list
      setBranches([...branches, data.branch]);
      setBranchSuccess("Branch created successfully!");
      
      // Reset form
      setNewBranchName("");
      setNewBranchCode("");
    } catch (err) {
      setBranchError(err.message);
    } finally {
      setBranchLoading(false);
    }
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    setBranchLoading(true);

    try {
      const response = await fetch(`${BRANCHES_URL}/${editingBranch.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          branch_name: editingBranch.branch_name,
          branch_code: editingBranch.branch_code
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Branch update failed');
      }

      // Update branches list
      setBranches(branches.map(branch => 
        branch.id === editingBranch.id ? { ...branch, ...editingBranch } : branch
      ));

      setBranchSuccess("Branch updated successfully!");
      setEditingBranch(null);
    } catch (err) {
      setBranchError(err.message);
    } finally {
      setBranchLoading(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    setBranchLoading(true);
    try {
      const response = await fetch(`${BRANCHES_URL}/${branchId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete branch');
      }

      // Remove branch from local state
      setBranches(branches.filter(branch => branch.id !== branchId));
      setBranchSuccess("Branch deleted successfully!");
    } catch (err) {
      setBranchError(err.message);
    } finally {
      setBranchLoading(false);
      setDeleteBranchId(null);
    }
  };

  // Styles
  const styles = {
    container: {
      display: 'flex',
      padding: '20px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
    },
    leftPanel: {
      width: '60%',
      paddingRight: '20px',
    },
    rightPanel: {
      width: '50%',
      overflowY: 'auto',
      maxHeight: '100vh',
    },
    card: {
      background: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
      position: 'relative',
    },
    selectContainer: {
      position: 'relative',
      marginBottom: '1rem',
    },
    selectSpinner: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '20px',
      height: '20px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    userCard: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      margin: '10px 0',
      padding: '15px',
    },
    branchCard: {
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      margin: '10px 0',
      padding: '15px',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    errorMessage: {
      color: '#e74c3c',
      marginBottom: '1rem',
    },
    successMessage: {
      color: '#2ecc71',
      marginBottom: '1rem',
    },
    actionButton: {
      padding: '8px 15px',
      margin: '0 5px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    deleteButton: {
      backgroundColor: 'red',
      color: 'white',
      border: 'none',
    },
    editButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
    },
    confirmationDialog: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
      zIndex: 1000,
    },
    statusBadge: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '10px',
    },
    statusActive: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    statusInactive: {
      backgroundColor: '#F44336',
      color: 'white',
    },
    toggleButton: {
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      border: 'none',
      color: 'white',
    },
    enableButton: {
      backgroundColor: '#4CAF50',
    },
    disableButton: {
      backgroundColor: '#F44336',
    },
    branchManagementButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - User Creation Form */}
      <div style={styles.leftPanel}>
        <div style={styles.card}>
          <h2>Create New User</h2>
          <form onSubmit={handleCreateUser}>
            <input
              type="text"
              placeholder="F Number"
              value={fNumber}
              onChange={(e) => setFNumber(e.target.value)}
              required
              style={styles.input}
            />
            
            <div style={styles.selectContainer}>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
                style={styles.select}
                disabled={fetchingBranches}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.branch_name}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
              {fetchingBranches && (
                <div style={styles.selectSpinner}></div>
              )}
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {error && <p style={styles.errorMessage}>{error}</p>}
            {success && <p style={styles.successMessage}>{success}</p>}

            <button 
              type="submit" 
              disabled={loading || fetchingBranches}
              style={styles.button}
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </form>
        </div>

        {/* Branch Management Section */}
        <div style={styles.card}>
          <button 
            onClick={() => setShowBranchManagement(!showBranchManagement)}
            style={styles.branchManagementButton}
          >
            {showBranchManagement ? 'Hide Branch Management' : 'Manage Branches'}
          </button>

          {showBranchManagement && (
            <div>
              <h3>Branch Management</h3>
              
              {/* Add New Branch Form */}
              <form onSubmit={handleCreateBranch}>
                <input
                  type="text"
                  placeholder="Branch Name"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  required
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Branch Code"
                  value={newBranchCode}
                  onChange={(e) => setNewBranchCode(e.target.value)}
                  required
                  style={styles.input}
                />
                
                {branchError && <p style={styles.errorMessage}>{branchError}</p>}
                {branchSuccess && <p style={styles.successMessage}>{branchSuccess}</p>}

                <button 
                  type="submit" 
                  disabled={branchLoading}
                  style={{...styles.button, backgroundColor: '#28a745'}}
                >
                  {branchLoading ? 'Adding Branch...' : 'Add Branch'}
                </button>
              </form>

              {/* Existing Branches List */}
              <div style={{marginTop: '20px'}}>
                <h4>Existing Branches</h4>
                {branches.map((branch) => (
                  <div key={branch.id} style={styles.branchCard}>
                    {editingBranch && editingBranch.id === branch.id ? (
                      <form onSubmit={handleUpdateBranch}>
                        <input
                          type="text"
                          value={editingBranch.branch_name}
                          onChange={(e) => setEditingBranch({...editingBranch, branch_name: e.target.value})}
                          style={styles.input}
                          required
                        />
                        <input
                          type="text"
                          value={editingBranch.branch_code}
                          onChange={(e) => setEditingBranch({...editingBranch, branch_code: e.target.value})}
                          style={styles.input}
                          required
                        />
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <button 
                            type="submit" 
                            style={{...styles.actionButton, ...styles.editButton}}
                            disabled={branchLoading}
                          >
                            {branchLoading ? 'Updating...' : 'Save'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingBranch(null)}
                            style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div>
                            <strong>{branch.branch_name}</strong>
                            <span style={{marginLeft: '10px', color: '#666'}}>
                              Code: {branch.branch_code}
                            </span>
                          </div>
                          <div>
                            <button 
                              onClick={() => setEditingBranch({
                                id: branch.id,
                                branch_name: branch.branch_name,
                                branch_code: branch.branch_code
                              })}
                              style={{...styles.actionButton, ...styles.editButton}}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => setDeleteBranchId(branch.id)}
                              style={{...styles.actionButton, ...styles.deleteButton}}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - User Management */}
      <div style={styles.rightPanel}>
        <h2>All Users</h2>
        {users.map((user) => (
          <div key={user.id} style={styles.userCard}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <strong>{user.email}</strong>
                <span 
                  style={{
                    ...styles.statusBadge, 
                    // ...(user.isActive ? styles.statusActive : styles.statusInactive)
                  }}
                >
                  {user.isActive}
                </span>
              </div>
              <div>
                <button 
                  onClick={() => {
                    setExpandedUserId(expandedUserId === user.id ? null : user.id);
                    setEditingUser(null);
                  }}
                  style={{...styles.actionButton, backgroundColor: '#17a2b8', color: 'white'}}
                >
                  {expandedUserId === user.id ? 'Collapse' : 'Expand'}
                </button>
              </div>
            </div>
            
            {expandedUserId === user.id && (
              <div>
                {editingUser && editingUser.id === user.id ? (
                  <form onSubmit={handleUpdateUser}>
                    <input
                      type="text"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      style={styles.input}
                      required
                    />
                    <div style={styles.selectContainer}>
                      <select
                        value={editingUser.branch}
                        onChange={(e) => setEditingUser({...editingUser, branch: e.target.value})}
                        style={styles.select}
                        required
                        disabled={fetchingBranches}
                      >
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.branch_name}>
                            {branch.branch_name}
                          </option>
                        ))}
                      </select>
                      {fetchingBranches && (
                        <div style={styles.selectSpinner}></div>
                      )}
                    </div>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                      style={styles.select}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <button 
                        type="submit" 
                        style={{...styles.actionButton, ...styles.editButton}}
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setExpandedUserId(null);
                        }}
                        style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p>Branch: {user.branch}</p>
                    <p>Role: {user.role}</p>
                    <p>Created At: {new Date(user.created_at).toLocaleString()}</p>
                    <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                      <button 
                        onClick={() => setDeleteUserId(user.id)}
                        style={{...styles.actionButton, ...styles.deleteButton}}
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => {
                          setEditingUser({
                            id: user.id,
                            email: user.email,
                            branch: user.branch,
                            role: user.role,
                            isActive: user.isActive
                          });
                        }}
                        style={{...styles.actionButton, ...styles.editButton}}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete User Confirmation Dialog */}
      {deleteUserId && (
        <div style={styles.confirmationDialog}>
          <p>Are you sure you want to delete this user?</p>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <button 
              onClick={() => handleDeleteUser(deleteUserId)}
              style={{...styles.actionButton, ...styles.deleteButton}}
            >
              Yes
            </button>
            <button 
              onClick={() => setDeleteUserId(null)}
              style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Delete Branch Confirmation Dialog */}
      {deleteBranchId && (
        <div style={styles.confirmationDialog}>
          <p>Are you sure you want to delete this branch?</p>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <button 
              onClick={() => handleDeleteBranch(deleteBranchId)}
              style={{...styles.actionButton, ...styles.deleteButton}}
            >
              Yes
            </button>
            <button 
              onClick={() => setDeleteBranchId(null)}
              style={{...styles.actionButton, backgroundColor: '#6c757d', color: 'white'}}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Define the spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AddUsers;