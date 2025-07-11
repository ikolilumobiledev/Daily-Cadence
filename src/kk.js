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

//   // Initialize branches state
//   const [branches, setBranches] = useState([
//     { label: 'Select Branch', value: '' }
//   ]);

//   // New state for adding new department
//   const [newDepartment, setNewDepartment] = useState('');
//   const [showAddDepartment, setShowAddDepartment] = useState(false);
  
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Fetch branches from API
//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await fetch('http://localhost:5001/fnb_branches');
//         if (!response.ok) {
//           throw new Error('Failed to fetch branches');
//         }
//         const data = await response.json();
//         setBranches([
//           { label: 'Select Branch', value: '' },
//           ...data
//         ]);
//       } catch (error) {
//         console.error('Error fetching branches:', error);
//         setError('Failed to load branches. Please try again.');
//       }
//     };

//     fetchBranches();
//   }, []);

//   // Save to localStorage when departments change
//   useEffect(() => {
//     localStorage.setItem('departments', JSON.stringify(departments));
//   }, [departments]);

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
//             <select
//               name="branch"
//               value={formData.branch}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             >
//               {branches.map((branch, index) => (
//                 <option key={index} value={branch.value}>
//                   {branch.value && `${branch.label} (${branch.value})`}
//                   {!branch.value && branch.label}
//                 </option>
//               ))}
//             </select>
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

// //mm
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

//   // Optimized branches state
//   const [branches, setBranches] = useState([]);
//   const [loadingBranches, setLoadingBranches] = useState(true);
//   const [branchError, setBranchError] = useState('');

//   // New state for adding new department
//   const [newDepartment, setNewDepartment] = useState('');
//   const [showAddDepartment, setShowAddDepartment] = useState(false);
  
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Optimized useEffect for fetching branches
//   useEffect(() => {
//     const fetchBranches = async () => {
//       setLoadingBranches(true);
//       setBranchError('');
      
//       try {
//         const response = await fetch('http://localhost:5001/fnb_branches');
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         // Assuming your API returns an array of objects with branch_name and branch_code
//         const formattedBranches = [
//           { branch_name: 'Select Branch', branch_code: '' }, // Default option
//           ...data
//         ];
        
//         setBranches(formattedBranches);
        
//       } catch (error) {
//         console.error('Error fetching branches:', error);
//         setBranchError('Failed to load branches. Please try again.');
        
//         // Fallback to default branches if API fails
//         setBranches([
//           { branch_name: 'Select Branch', branch_code: '' },
//           { branch_name: 'Main Branch', branch_code: 'MB001' },
//           { branch_name: 'Downtown Branch', branch_code: 'DB002' }
//         ]);
//       } finally {
//         setLoadingBranches(false);
//       }
//     };

//     fetchBranches();
//   }, []);

//   // Save to localStorage when departments change
//   useEffect(() => {
//     localStorage.setItem('departments', JSON.stringify(departments));
//   }, [departments]);

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
//     const selectedBranch = branches.find(branch => branch.branch_code === formData.branch);
    
//     if (!selectedBranch) {
//       setError('Please select a valid branch.');
//       return;
//     }

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
//           branch: formData.branch, // This will be the branch_code
//           branchName: selectedBranch.branch_name, // This will be the branch_name
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

//   // Retry function for branch loading
//   const retryBranchLoading = async () => {
//     setLoadingBranches(true);
//     setBranchError('');
    
//     try {
//       const response = await fetch('http://localhost:5001/fnb_branches');
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       setBranches([{ branch_name: 'Select Branch', branch_code: '' }, ...data]);
//     } catch (error) {
//       setBranchError('Failed to load branches. Please try again.');
//     } finally {
//       setLoadingBranches(false);
//     }
//   };

//   // Render optimized branch field
//   const renderBranchField = () => (
//     <div style={styles.formGroup}>
//       <label style={styles.label}>Branch: *</label>
      
//       {loadingBranches ? (
//         <div style={styles.loadingContainer}>
//           <span>Loading branches...</span>
//         </div>
//       ) : (
//         <>
//           <select
//             name="branch"
//             value={formData.branch}
//             onChange={handleChange}
//             style={{
//               ...styles.input,
//               backgroundColor: branchError ? '#ffebee' : styles.input.backgroundColor
//             }}
//             required
//           >
//             {branches.map((branch, index) => (
//               <option key={index} value={branch.branch_code}>
//                 {branch.branch_code ? 
//                   `${branch.branch_name} (${branch.branch_code})` : 
//                   branch.branch_name
//                 }
//               </option>
//             ))}
//           </select>
          
//           {branchError && (
//             <div style={styles.fieldError}>
//               {branchError}
//               <button 
//                 type="button" 
//                 onClick={retryBranchLoading}
//                 style={styles.retryButton}
//               >
//                 Retry
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );

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
          
//           {renderBranchField()}
          
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


// //back
// const pool = require('../db'); // Adjust path as needed

// // Get all branches
// const getAllBranches = async (req, res) => {
//   try {
//     console.log("Fetching all branches from fnb_branches table");
//     const result = await pool.query(`
//       SELECT 
//         id,
//         branch_name,
//         branch_code,
//         created_at
//       FROM fnb_branches
//       ORDER BY branch_name ASC
//     `);
//     console.log(`Found ${result.rows.length} branches`);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Database query error:", err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Get branch by ID
// const getBranchById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(`
//       SELECT 
//         id,
//         branch_name,
//         branch_code,
//         created_at
//       FROM fnb_branches 
//       WHERE id = $1
//     `, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Branch not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Create new branch
// const createBranch = async (req, res) => {
//   const { branch_name, branch_code } = req.body;

//   if (!branch_name || !branch_code) {
//     return res.status(400).json({ error: 'Branch name and code are required' });
//   }

//   try {
//     const result = await pool.query(
//       'INSERT INTO fnb_branches (branch_name, branch_code) VALUES ($1, $2) RETURNING *',
//       [branch_name, branch_code]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     if (err.code === '23505') {
//       res.status(409).json({ error: 'Branch name or code already exists' });
//     } else {
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };

// // Update branch with cascading updates
// const updateBranch = async (req, res) => {
//   const { id } = req.params;
//   const { branch_name, branch_code } = req.body;

//   if (!branch_name || !branch_code) {
//     return res.status(400).json({ error: 'Branch name and code are required' });
//   }

//   // Start a database transaction
//   const client = await pool.connect();
  
//   try {
//     await client.query('BEGIN');

//     // First, get the current branch data
//     const currentBranchResult = await client.query(
//       'SELECT branch_name, branch_code FROM fnb_branches WHERE id = $1',
//       [id]
//     );

//     if (currentBranchResult.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({ error: 'Branch not found' });
//     }

//     const currentBranch = currentBranchResult.rows[0];
//     const oldBranchName = currentBranch.branch_name;
//     const oldBranchCode = currentBranch.branch_code;

//     // Update the branch in fnb_branches table
//     const branchUpdateResult = await client.query(
//       'UPDATE fnb_branches SET branch_name = $1, branch_code = $2 WHERE id = $3 RETURNING *',
//       [branch_name, branch_code, id]
//     );

//     // Update visitor_log table - update branchName and branch columns
//     const visitorLogUpdateResult = await client.query(
//       'UPDATE visitor_log SET branchName = $1, branch = $2 WHERE branchName = $3 OR branch = $4',
//       [branch_name, branch_code, oldBranchName, oldBranchCode]
//     );

//     // Update users_table - update branch and branch_code columns
//     const usersUpdateResult = await client.query(
//       'UPDATE users_table SET branch = $1, branch_code = $2 WHERE branch = $3 OR branch_code = $4',
//       [branch_name, branch_code, oldBranchName, oldBranchCode]
//     );

//     // Update admin_users table - update branches array
//     // This is more complex because branches is an array
//     const adminUsersResult = await client.query(
//       'SELECT id, branches FROM admin_users WHERE $1 = ANY(branches) OR $2 = ANY(branches)',
//       [oldBranchName, oldBranchCode]
//     );

//     // Update each admin user's branches array
//     for (const adminUser of adminUsersResult.rows) {
//       let updatedBranches = adminUser.branches.map(branch => {
//         if (branch === oldBranchName || branch === oldBranchCode) {
//           return branch_name; // or branch_code, depending on what you store
//         }
//         return branch;
//       });

//       // Remove duplicates
//       updatedBranches = [...new Set(updatedBranches)];

//       await client.query(
//         'UPDATE admin_users SET branches = $1 WHERE id = $2',
//         [updatedBranches, adminUser.id]
//       );
//     }

//     // Commit the transaction
//     await client.query('COMMIT');

//     console.log(`Branch updated successfully. Affected records:`);
//     console.log(`- Visitor logs: ${visitorLogUpdateResult.rowCount}`);
//     console.log(`- Users: ${usersUpdateResult.rowCount}`);
//     console.log(`- Admin users: ${adminUsersResult.rows.length}`);

//     res.json({
//       updatedBranch: branchUpdateResult.rows[0],
//       affectedRecords: {
//         visitorLogs: visitorLogUpdateResult.rowCount,
//         users: usersUpdateResult.rowCount,
//         adminUsers: adminUsersResult.rows.length
//       }
//     });

//   } catch (err) {
//     await client.query('ROLLBACK');
//     console.error('Error updating branch:', err);
//     if (err.code === '23505') {
//       res.status(409).json({ error: 'Branch name or code already exists' });
//     } else {
//       res.status(500).json({ error: 'Server error during branch update' });
//     }
//   } finally {
//     client.release();
//   }
// };

// // Delete branch with cascading updates
// const deleteBranch = async (req, res) => {
//   const { id } = req.params;
  
//   // Start a database transaction
//   const client = await pool.connect();
  
//   try {
//     await client.query('BEGIN');

//     // First, get the branch data before deletion
//     const branchResult = await client.query(
//       'SELECT branch_name, branch_code FROM fnb_branches WHERE id = $1',
//       [id]
//     );

//     if (branchResult.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({ error: 'Branch not found' });
//     }

//     const branchToDelete = branchResult.rows[0];
//     const { branch_name, branch_code } = branchToDelete;

//     // Option 1: Delete related records (CASCADE DELETE)
//     // Uncomment these if you want to delete related records
//     /*
//     const visitorLogDeleteResult = await client.query(
//       'DELETE FROM visitor_log WHERE branchName = $1 OR branch = $2',
//       [branch_name, branch_code]
//     );

//     const usersDeleteResult = await client.query(
//       'DELETE FROM users_table WHERE branch = $1 OR branch_code = $2',
//       [branch_name, branch_code]
//     );
//     */

//     // Option 2: Set related records to NULL or default value (NULLIFY)
//     // This is safer as it preserves the records
//     const visitorLogNullifyResult = await client.query(
//       'UPDATE visitor_log SET branchName = NULL, branch = NULL WHERE branchName = $1 OR branch = $2',
//       [branch_name, branch_code]
//     );

//     const usersNullifyResult = await client.query(
//       'UPDATE users_table SET branch = NULL, branch_code = NULL WHERE branch = $1 OR branch_code = $2',
//       [branch_name, branch_code]
//     );

//     // Update admin_users table - remove the branch from branches array
//     const adminUsersResult = await client.query(
//       'SELECT id, branches FROM admin_users WHERE $1 = ANY(branches) OR $2 = ANY(branches)',
//       [branch_name, branch_code]
//     );

//     // Update each admin user's branches array
//     for (const adminUser of adminUsersResult.rows) {
//       const updatedBranches = adminUser.branches.filter(branch => 
//         branch !== branch_name && branch !== branch_code
//       );

//       await client.query(
//         'UPDATE admin_users SET branches = $1 WHERE id = $2',
//         [updatedBranches, adminUser.id]
//       );
//     }

//     // Finally, delete the branch
//     const deleteBranchResult = await client.query(
//       'DELETE FROM fnb_branches WHERE id = $1 RETURNING *',
//       [id]
//     );

//     // Commit the transaction
//     await client.query('COMMIT');

//     console.log(`Branch deleted successfully. Affected records:`);
//     console.log(`- Visitor logs: ${visitorLogNullifyResult.rowCount}`);
//     console.log(`- Users: ${usersNullifyResult.rowCount}`);
//     console.log(`- Admin users: ${adminUsersResult.rows.length}`);

//     res.json({
//       message: 'Branch deleted successfully',
//       deletedBranch: deleteBranchResult.rows[0],
//       affectedRecords: {
//         visitorLogs: visitorLogNullifyResult.rowCount,
//         users: usersNullifyResult.rowCount,
//         adminUsers: adminUsersResult.rows.length
//       }
//     });

//   } catch (err) {
//     await client.query('ROLLBACK');
//     console.error('Error deleting branch:', err);
//     res.status(500).json({ error: 'Server error during branch deletion' });
//   } finally {
//     client.release();
//   }
// };

// // Optional: Add a function to check branch dependencies before deletion
// const checkBranchDependencies = async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     // Get branch info
//     const branchResult = await pool.query(
//       'SELECT branch_name, branch_code FROM fnb_branches WHERE id = $1',
//       [id]
//     );

//     if (branchResult.rows.length === 0) {
//       return res.status(404).json({ error: 'Branch not found' });
//     }

//     const { branch_name, branch_code } = branchResult.rows[0];

//     // Check dependencies
//     const visitorLogCount = await pool.query(
//       'SELECT COUNT(*) FROM visitor_log WHERE branchName = $1 OR branch = $2',
//       [branch_name, branch_code]
//     );

//     const usersCount = await pool.query(
//       'SELECT COUNT(*) FROM users_table WHERE branch = $1 OR branch_code = $2',
//       [branch_name, branch_code]
//     );

//     const adminUsersCount = await pool.query(
//       'SELECT COUNT(*) FROM admin_users WHERE $1 = ANY(branches) OR $2 = ANY(branches)',
//       [branch_name, branch_code]
//     );

//     res.json({
//       branchInfo: branchResult.rows[0],
//       dependencies: {
//         visitorLogs: parseInt(visitorLogCount.rows[0].count),
//         users: parseInt(usersCount.rows[0].count),
//         adminUsers: parseInt(adminUsersCount.rows[0].count)
//       }
//     });

//   } catch (err) {
//     console.error('Error checking branch dependencies:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = {
//   getAllBranches,
//   getBranchById,
//   createBranch,
//   updateBranch,
//   deleteBranch,
//   checkBranchDependencies // Optional dependency checker
// };





//addition
Dependencies
"@sequelize/core": "^7.0.0-alpha.14",
"@sequelize/postgres": "^7.0.0-alpha.43",
"pg": "^8.0.3",
"pg-hstore": "^2.3.2",
 
Look into this and implement it. It's very important. You won't have access to Prod DB to manually create tables


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

//Users Controller

const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = 'your-secret-key-should-be-in-env-file';
const LDAP_AUTH_URL = "https://172.29.18.126/adproxyservice/prod/ldap/authenticate";
const LDAP_VERIFY_2FA_URL = "https://172.29.18.126/adproxyservice/prod/ldap/verify2fa";
const TOKEN_URL = 'https://172.29.18.126/adproxyservice/prod/client/renew-token';
const CLIENT_ID = "8CA09F75-720F-4641-9B70-5344850DF34E";

const getAuthToken = async () => {
  try {
    console.log('Requesting token from:', TOKEN_URL);
    
    const tokenResponse = await axios.post(TOKEN_URL, {
      clientId: CLIENT_ID,
      duration: 300
    }, { 
      httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) 
    });

    console.log('Token response status:', tokenResponse.status);
    
    if (!tokenResponse.data || tokenResponse.data.statusCode !== 0 || !tokenResponse.data.data || !tokenResponse.data.data.token) {
      console.error('Invalid token response:', tokenResponse.data);
      throw new Error(`Failed to obtain authorization token: ${
        tokenResponse.data && tokenResponse.data.statusMessage 
          ? tokenResponse.data.statusMessage 
          : 'Unknown error'
      }`);
    }

    const rawToken = tokenResponse.data.data.token;
    return `Bearer ${rawToken}`;
  } catch (err) {
    console.error('Error getting auth token:', err.message);
    if (err.response) {
      console.error('Error response status:', err.response.status);
      console.error('Error response data:', JSON.stringify(err.response.data, null, 2));
    }
    throw err;
  }
};
const authenticateUser = async (req, res) => {
  const { fnumber, password } = req.body;

  if (!fnumber || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'F-number and password are required' 
    });
  }

  try {
    console.log(`[AUTH] Authentication attempt for user: ${fnumber}`);
    
    const authToken = await getAuthToken();
    console.log('[AUTH] Successfully obtained token for authentication');
    
    console.log('[AUTH] Sending authentication request to LDAP service');
    const authResponse = await axios.post(LDAP_AUTH_URL, {
      fnumber,
      password
    }, { 
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json'
      },
      httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) 
    });
    
    console.log('[AUTH] Auth response status:', authResponse.status);
    
    if (authResponse.data && 
        (authResponse.data.status_code === '401' || 
         authResponse.data.status_code === 401 ||
         (authResponse.data.status_message && 
          authResponse.data.status_message.toLowerCase().includes('invalid credentials')))) {
      console.log('[AUTH] Invalid credentials for user:', fnumber);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials. Please check your F-number and password.' 
      });
    }
    
    if (!authResponse.data || 
        (authResponse.data.status_code !== '000' && 
         authResponse.data.status_code !== '0' && 
         authResponse.data.status_code !== 0)) {
      console.error('[AUTH] Authentication failed:', JSON.stringify(authResponse.data, null, 2));
      return res.status(401).json({ 
        success: false, 
        error: authResponse.data?.status_message || 'Authentication failed. Please try again.' 
      });
    }
    
    if (!authResponse.data.token) {
      console.error('[AUTH] Authentication response missing token');
      return res.status(500).json({ 
        success: false, 
        error: 'Authentication system error. Please try again later.' 
      });
    }
    
    console.log('[AUTH] Authentication successful for user:', fnumber);
    console.log('[AUTH] Returning token for 2FA verification');
    
    console.log('[AUTH] Full auth response data:', JSON.stringify(authResponse.data, null, 2));
    
    return res.status(200).json({
      success: true,
      message: 'Authentication successful, proceed with 2FA verification',
      token: authResponse.data.token, 
      data: authResponse.data 
    });
    
  } catch (err) {
    console.error('[AUTH] Authentication error:', err.message);
    
    if (err.response && err.response.data) {
      const errorData = err.response.data;
      
      if (errorData.status_code === 401 || 
          (errorData.status_message && 
           errorData.status_message.toLowerCase().includes('invalid')) ||
          (errorData.error && 
           errorData.error.toLowerCase().includes('credentials'))) {
        
        console.log('[AUTH] Server reported invalid credentials');
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials. Please check your F-number and password.' 
        });
      }
      
      console.error('[AUTH] Error response status:', err.response.status);
      console.error('[AUTH] Error response data:', JSON.stringify(err.response.data, null, 2));
    }
    
    return res.status(500).json({ 
      success: false, 
      error: `Authentication failed. Please try again later.` 
    });
  }
};

const checkUserBranches = async (req, res) => {
  const { fnumber } = req.body;
  
  if (!fnumber) {
    return res.status(400).json({
      success: false,
      error: 'F-number is required'
    });
  }
  
  try {
    console.log(`[BRANCH] Checking branches for user: ${fnumber}`);
    
    const lowerCaseFnumber = fnumber.toLowerCase();
    
    console.log(`[BRANCH] Querying database with value: ${lowerCaseFnumber}`);
        const result = await pool.query(
      'SELECT id, email, branch, branch_code FROM users_table WHERE email = $1',
      [lowerCaseFnumber]
    );
    
    if (result.rows.length === 0) {
      console.log(`[BRANCH] User ${fnumber} not found in system`);
      return res.status(404).json({
        success: false,
        error: 'User not found in system. Please contact administrator.',
        userExists: false,
        fnumber
      });
    }
    
    const branches = result.rows.map(row => ({
      branchName: row.branch,
      branchCode: row.branch_code
    }));
    
    console.log(`[BRANCH] User ${fnumber} has access to ${branches.length} branches:`,
      JSON.stringify(branches, null, 2));
    
    const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    return res.status(200).json({
      success: true,
      userExists: true,
      fnumber,
      branches,
      sessionToken 
    });
    
  } catch (err) {
    console.error('[BRANCH] Error checking user branches:', err.message);
    return res.status(500).json({
      success: false,
      error: `Server error during branch checking: ${err.message}`
    });
  }
};

const track2FAStatus = async (req, res) => {
  const { token, fnumber } = req.body;

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      error: 'Token is required' 
    });
  }

  try {
    console.log("[TRACK] Checking 2FA verification status for token:", 
      token.substring(0, 10) + "..." + token.substring(token.length - 10));
    
    const authToken = await getAuthToken();
    console.log('[TRACK] Successfully obtained token for status tracking');
    
    console.log('[TRACK] Sending status check to LDAP service');
    const verifyResponse = await axios.post(LDAP_VERIFY_2FA_URL, {
      token,
      code: "" 
    }, { 
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json'
      },
      httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) 
    });
    
    console.log('[TRACK] Status response code:', verifyResponse.status);
    
    const statusCode = verifyResponse.data.status_code;
    const statusMessage = verifyResponse.data.status_message;
    const dataStatus = verifyResponse.data.data?.status;
    
    console.log(`[TRACK] Status code: ${statusCode}, Message: ${statusMessage}, Data status: ${dataStatus}`);
    
    let verificationStatus = "pending";
    
    if (statusCode === "000" || statusCode === "0" || statusCode === 0) {
      verificationStatus = "success";
    } 
    else if (statusCode !== "002" && statusMessage?.toLowerCase() !== "pending authentication") {
      verificationStatus = "failed";
    }
    
    const responseFnumber = verifyResponse.data.data?.fnumber || fnumber;
    
    return res.status(200).json({
      success: true,
      statusCode,
      statusMessage,
      dataStatus,
      verificationStatus,
      fnumber: responseFnumber
    });
    
  } catch (err) {
    console.error('[TRACK] Status tracking error:', err.message);
    
    if (err.response) {
      console.error('[TRACK] Error response status:', err.response.status);
      console.error('[TRACK] Error response data:', JSON.stringify(err.response.data, null, 2));
    }
    
    return res.status(500).json({ 
      success: false, 
      error: `Server error during status tracking: ${err.message}` 
    });
  }
};



const verify2FA = async (req, res) => {
  const { token, code, fnumber: requestFnumber } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    console.log("[2FA] Starting 2FA verification process");
    if (code) {
      console.log("[2FA] Verifying with code:", code);
    } else {
      console.log("[2FA] Checking 2FA status without code");
    }
    console.log("[2FA] Using token:", token.substring(0, 10) + "..." + token.substring(token.length - 10));
    
    const authToken = await getAuthToken();
    console.log('[2FA] Successfully obtained token for 2FA verification');
    
    console.log('[2FA] Sending verification request to LDAP service');
    const verifyResponse = await axios.post(LDAP_VERIFY_2FA_URL, {
      token,
      code: code || "" 
    }, { 
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json'
      },
      httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) 
    });
    
    console.log('[2FA] Verify response status:', verifyResponse.status);
    console.log('[2FA] Verify response data:', JSON.stringify(verifyResponse.data, null, 2));
    
    if (!verifyResponse.data || 
        (verifyResponse.data.status_code !== '000' && 
         verifyResponse.data.status_code !== '0' && 
         verifyResponse.data.status_code !== 0)) {
      console.error('[2FA] 2FA verification failed:', JSON.stringify(verifyResponse.data, null, 2));
      return res.status(401).json({ 
        success: false, 
        error: verifyResponse.data?.status_message || '2FA verification failed',
        data: verifyResponse.data 
      });
    }
    
    console.log('[2FA] 2FA verification successful');
    
    const fnumber = verifyResponse.data.fnumber || 
                   (verifyResponse.data.data && verifyResponse.data.data.fnumber) ||
                   requestFnumber;
                   
    if (!fnumber) {
      console.error('[2FA] No fnumber found in response or request');
      return res.status(400).json({
        success: false,
        error: 'Unable to identify user. Missing F-number in response.',
      });
    }
    
    console.log(`[2FA] User identified as: ${fnumber}`);
    
    const sessionToken = jwt.sign(
      { 
        fnumber: fnumber
      }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );
    
    console.log(`[2FA] Session token generated for user: ${fnumber}`);
    console.log('[2FA] 2FA verification process complete, returning success response');
    
  
    console.log('[2FA] Full verify response data:', JSON.stringify(verifyResponse.data, null, 2));
    
    return res.status(200).json({
      success: true,
      message: '2FA verification successful',
      fnumber,
      sessionToken,
      verifyResponseData: verifyResponse.data 
    });
    
  } catch (err) {
    console.error('[2FA] 2FA verification error:', err.message);
    
    if (err.response) {
      console.error('[2FA] Error response status:', err.response.status);
      console.error('[2FA] Error response data:', JSON.stringify(err.response.data, null, 2));
    }
    
    return res.status(500).json({ 
      success: false, 
      error: `Server error during 2FA verification: ${err.message}` 
    });
  }
};







const finalizeLogin = async (req, res) => {
  const { fnumber, branch, sessionToken } = req.body;

  if (!fnumber || !branch || !sessionToken) {
    return res.status(400).json({ error: 'F-number, branch, and session token are required' });
  }
  
  try {
    let decodedToken;
    try {
      decodedToken = jwt.verify(sessionToken, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid session token' });
    }
    
    const result = await pool.query(
      'SELECT * FROM users_table WHERE email = $1 AND branch = $2',
      [fnumber, branch]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'You do not have access to the selected branch' });
    }
    
    const user = result.rows[0];
    
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        branch: user.branch, 
        branchCode: user.branch_code, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        branch: user.branch,
        branchCode: user.branch_code,
        role: user.role
      }
    });
    
  } catch (err) {
    console.error('Login finalization error:', err);
    return res.status(500).json({ error: 'Server error during login finalization' });
  }
};






const verifyFnumber = async (req, res) => {
  const { fnumber } = req.body;

  if (!fnumber) {
    return res.status(400).json({ error: 'F-number is required' });
  }

  try {
    const createTokenUrl = 'https://172.29.18.126/adproxyservice/prod/client/renew-token';
    console.log('Requesting token from:', createTokenUrl);
    
    const tokenResponse = await axios.post(createTokenUrl, {
      clientId: "8CA09F75-720F-4641-9B70-5344850DF34E",
      duration: 300
    }, { 
      httpsAgent: new require('https').Agent({ rejectUnauthorized: false }) 
    });

    console.log('Token response status:', tokenResponse.status);
    console.log('Token response data:', JSON.stringify(tokenResponse.data, null, 2));

    if (!tokenResponse.data || tokenResponse.data.statusCode !== 0 || !tokenResponse.data.data || !tokenResponse.data.data.token) {
      console.error('Invalid token response:', tokenResponse.data);
      return res.status(400).json({ 
        isValid: false, 
        error: `Failed to obtain authorization token: ${
          tokenResponse.data && tokenResponse.data.statusMessage 
            ? tokenResponse.data.statusMessage 
            : 'Unknown error'
        }` 
      });
    }

    const rawToken = tokenResponse.data.data.token;
    const authToken = `Bearer ${rawToken}`;
    console.log('Successfully obtained token');
    console.log('Using authorization header:', authToken);

    const searchApiUrl = 'https://172.29.18.126/adproxyservice/prod/ldap/search';
    console.log('Searching for user at:', searchApiUrl);
    
    console.log('Attempting API call with Bearer token in Authorization header');
    try {
      const requestConfig = {
        url: searchApiUrl,
        method: 'post',
        data: { fnumber: fnumber },
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        },
        httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
      };
      
      console.log('Request configuration:', JSON.stringify({
        url: requestConfig.url,
        method: requestConfig.method,
        headers: requestConfig.headers,
        data: requestConfig.data
      }, null, 2));
      
      const response = await axios(requestConfig);
      
      console.log('Search response status:', response.status);
      console.log('Search response data:', JSON.stringify(response.data, null, 2));

      if (response.data.statusCode !== 0) {
        return res.status(400).json({ 
          isValid: false, 
          error: `Search API error: ${response.data.statusMessage}` 
        });
      }

      
      return res.status(200).json({
        isValid: true,
        userData: {
          name: response.data.data.name,
          email: response.data.data.email,
          title: response.data.data.title,
          memberOf: response.data.data.memberOf
        }
      });
    } catch (err) {
      console.error('Search API call failed:', err.message);
      
      if (err.response) {
        console.error('Error response status:', err.response.status);
        console.error('Error response data:', JSON.stringify(err.response.data, null, 2));
      }
      
      throw new Error(`Failed to authenticate with the search API: ${err.message}`);
    }
  } catch (err) {
    console.error('F-number verification error details:', err.message);
    
    if (err.response) {
      console.error('Error response status:', err.response.status);
      console.error('Error response data:', JSON.stringify(err.response.data, null, 2));
    }
    
    return res.status(500).json({ 
      isValid: false, 
      error: `Server error during F-number verification: ${err.message}` 
    });
  }
};

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

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, branch, branchCode, role, is_active } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users_table SET email = $1, branch = $2, branch_code = $3, role = $4, is_active = COALESCE($5, is_active) WHERE id = $6 RETURNING *',
      [email, branch, branchCode, role, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        branch: result.rows[0].branch,
        role: result.rows[0].role,
        is_active: result.rows[0].is_active
      }
    });
  } catch (err) {
    console.error('User update error:', err);
    res.status(500).json({ error: 'Server error during user update' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, branch, role, created_at, is_active FROM users_table');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users_table WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('User deletion error:', err);
    res.status(500).json({ error: 'Server error during user deletion' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  verifyFnumber,
  authenticateUser,
  verify2FA,
  finalizeLogin,
  track2FAStatus,
  checkUserBranches
};

//branches Controller
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

// Update branch with cascading updates
const updateBranch = async (req, res) => {
  const { id } = req.params;
  const { branch_name, branch_code } = req.body;

  if (!branch_name || !branch_code) {
    return res.status(400).json({ error: 'Branch name and code are required' });
  }

  // Start a database transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // First, get the current branch data
    const currentBranchResult = await client.query(
      'SELECT branch_name, branch_code FROM fnb_branches WHERE id = $1',
      [id]
    );

    if (currentBranchResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Branch not found' });
    }

    const currentBranch = currentBranchResult.rows[0];
    const oldBranchName = currentBranch.branch_name;
    const oldBranchCode = currentBranch.branch_code;

    // Update the branch in fnb_branches table
    const branchUpdateResult = await client.query(
      'UPDATE fnb_branches SET branch_name = $1, branch_code = $2 WHERE id = $3 RETURNING *',
      [branch_name, branch_code, id]
    );

    // Update visitor_log table - update branchName and branch columns
    const visitorLogUpdateResult = await client.query(
      'UPDATE visitor_log SET branchName = $1, branch = $2 WHERE branchName = $3 OR branch = $4',
      [branch_name, branch_code, oldBranchName, oldBranchCode]
    );

    // Update users_table - update branch and branch_code columns
    const usersUpdateResult = await client.query(
      'UPDATE users_table SET branch = $1, branch_code = $2 WHERE branch = $3 OR branch_code = $4',
      [branch_name, branch_code, oldBranchName, oldBranchCode]
    );

    // Update admin_users table - update branches array
    // This is more complex because branches is an array
    const adminUsersResult = await client.query(
      'SELECT id, branches FROM admin_users WHERE $1 = ANY(branches) OR $2 = ANY(branches)',
      [oldBranchName, oldBranchCode]
    );

    // Update each admin user's branches array
    for (const adminUser of adminUsersResult.rows) {
      let updatedBranches = adminUser.branches.map(branch => {
        if (branch === oldBranchName || branch === oldBranchCode) {
          return branch_name; // or branch_code, depending on what you store
        }
        return branch;
      });

      // Remove duplicates
      updatedBranches = [...new Set(updatedBranches)];

      await client.query(
        'UPDATE admin_users SET branches = $1 WHERE id = $2',
        [updatedBranches, adminUser.id]
      );
    }

    // Commit the transaction
    await client.query('COMMIT');

    console.log(`Branch updated successfully. Affected records:`);
    console.log(`- Visitor logs: ${visitorLogUpdateResult.rowCount}`);
    console.log(`- Users: ${usersUpdateResult.rowCount}`);
    console.log(`- Admin users: ${adminUsersResult.rows.length}`);

    res.json({
      updatedBranch: branchUpdateResult.rows[0],
      affectedRecords: {
        visitorLogs: visitorLogUpdateResult.rowCount,
        users: usersUpdateResult.rowCount,
        adminUsers: adminUsersResult.rows.length
      }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating branch:', err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Branch name or code already exists' });
    } else {
      res.status(500).json({ error: 'Server error during branch update' });
    }
  } finally {
    client.release();
  }
};

// Delete branch with cascading updates
const deleteBranch = async (req, res) => {
  const { id } = req.params;
  
  // Start a database transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // First, get the branch data before deletion
    const branchResult = await client.query(
      'SELECT branch_name, branch_code FROM fnb_branches WHERE id = $1',
      [id]
    );

    if (branchResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Branch not found' });
    }

    const branchToDelete = branchResult.rows[0];
    const { branch_name, branch_code } = branchToDelete;

    // Option 1: Delete related records (CASCADE DELETE)
    // Uncomment these if you want to delete related records
    /*
    const visitorLogDeleteResult = await client.query(
      'DELETE FROM visitor_log WHERE branchName = $1 OR branch = $2',
      [branch_name, branch_code]
    );

    const usersDeleteResult = await client.query(
      'DELETE FROM users_table WHERE branch = $1 OR branch_code = $2',
      [branch_name, branch_code]
    );
    */

    // Option 2: Set related records to NULL or default value (NULLIFY)
    // This is safer as it preserves the records
    const visitorLogNullifyResult = await client.query(
      'UPDATE visitor_log SET branchName = NULL, branch = NULL WHERE branchName = $1 OR branch = $2',
      [branch_name, branch_code]
    );

    const usersNullifyResult = await client.query(
      'UPDATE users_table SET branch = NULL, branch_code = NULL WHERE branch = $1 OR branch_code = $2',
      [branch_name, branch_code]
    );

    // Update admin_users table - remove the branch from branches array
    const adminUsersResult = await client.query(
      'SELECT id, branches FROM admin_users WHERE $1 = ANY(branches) OR $2 = ANY(branches)',
      [branch_name, branch_code]
    );

    // Update each admin user's branches array
    for (const adminUser of adminUsersResult.rows) {
      const updatedBranches = adminUser.branches.filter(branch => 
        branch !== branch_name && branch !== branch_code
      );

      await client.query(
        'UPDATE admin_users SET branches = $1 WHERE id = $2',
        [updatedBranches, adminUser.id]
      );
    }

    // Finally, delete the branch
    const deleteBranchResult = await client.query(
      'DELETE FROM fnb_branches WHERE id = $1 RETURNING *',
      [id]
    );

    // Commit the transaction
    await client.query('COMMIT');

    console.log(`Branch deleted successfully. Affected records:`);
    console.log(`- Visitor logs: ${visitorLogNullifyResult.rowCount}`);
    console.log(`- Users: ${usersNullifyResult.rowCount}`);
    console.log(`- Admin users: ${adminUsersResult.rows.length}`);

    res.json({
      message: 'Branch deleted successfully',
      deletedBranch: deleteBranchResult.rows[0],
      affectedRecords: {
        visitorLogs: visitorLogNullifyResult.rowCount,
        users: usersNullifyResult.rowCount,
        adminUsers: adminUsersResult.rows.length
      }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting branch:', err);
    res.status(500).json({ error: 'Server error during branch deletion' });
  } finally {
    client.release();
  }
};


module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  // checkBranchDependencies // Optional dependency checker
};

//visitorsLogsController


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


//
INSERT INTO departments (branch_name, branch_code) VALUES
  ('ACCRA BRANCH', '330102'),
  ('MAKOLA BRANCH', '330111'),
  ('TEMA BRANCH (COMM', '330120'),
  ('AIRPORT BRANCH', '330119'),
  ('MARKET CIRCLE BRANCH TAKORADI', '330401'),
  ('ADUM BRANCH KUMASI', '330601'),
  ('WEST HILLS MALL', '330108'),
  ('JUNCTION SHOPPING CENTRE BRANCH', '330101'),
  ('TEMA BRANCH (COMM 11)', '330112'),
  ('ACHIMOTA MALL BRANCH', '330107'),
  ('ACCRA MALL BRANCH', '330106'),
  ('KEJETIA BRANCH', '330602');
//
  const email = 'admin@fnb.com';
    const password = 'password12345'



    //model
    // models.js - Your 4 tables automatically created
const { Sequelize, DataTypes, Model } = require('@sequelize/core');
const { PostgresDialect } = require('@sequelize/postgres');

// Database connection
const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: process.env.DB_NAME || 'your_db',
  user: process.env.DB_USER || 'your_user',
  password: process.env.DB_PASSWORD || 'your_password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  logging: false // Set to console.log to see SQL queries
});

// Table 1: users_table
class UsersTable extends Model {}
UsersTable.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  branch: { type: DataTypes.STRING, allowNull: false },
  branch_code: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { 
  sequelize, 
  modelName: 'UsersTable', 
  tableName: 'users_table',
  timestamps: false // Since you have custom created_at
});

// Table 2: fnb_branches
class FnbBranches extends Model {}
FnbBranches.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  branch_name: { type: DataTypes.STRING, allowNull: false },
  branch_code: { type: DataTypes.STRING, allowNull: false, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  sequelize, 
  modelName: 'FnbBranches', 
  tableName: 'fnb_branches',
  timestamps: false
});

// Table 3: admin_users
class AdminUsers extends Model {}
AdminUsers.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  branches: { type: DataTypes.TEXT }, // Can store multiple branches as JSON or comma-separated
  role: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  last_login: { type: DataTypes.DATE, allowNull: true }
}, { 
  sequelize, 
  modelName: 'AdminUsers', 
  tableName: 'admin_users',
  timestamps: false
});

// Table 4: visitor_log
class VisitorLog extends Model {}
VisitorLog.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  timein: { type: DataTypes.DATE, allowNull: false },
  timeout: { type: DataTypes.DATE, allowNull: true },
  department: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  picture: { type: DataTypes.TEXT, allowNull: true }, // Store file path or base64
  telephone: { type: DataTypes.STRING, allowNull: true },
  reason: { type: DataTypes.TEXT, allowNull: false },
  purpose: { type: DataTypes.TEXT, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  branch: { type: DataTypes.STRING, allowNull: false },
  branchname: { type: DataTypes.STRING, allowNull: false }
}, { 
  sequelize, 
  modelName: 'VisitorLog', 
  tableName: 'visitor_log',
  timestamps: false
});

// Optional: Define relationships if needed
// FnbBranches.hasMany(UsersTable, { foreignKey: 'branch_code', sourceKey: 'branch_code' });
// FnbBranches.hasMany(VisitorLog, { foreignKey: 'branch', sourceKey: 'branch_code' });

// Auto-create all tables function
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // This creates all 4 tables automatically
    await sequelize.sync({ alter: true });
    console.log('✅ All 4 tables created successfully:');
    console.log('   - users_table');
    console.log('   - fnb_branches');
    console.log('   - admin_users');
    console.log('   - visitor_log');
    
    // Insert default branches data
    await seedBranches();
    
    // Insert default admin user
    await seedAdminUser();
    
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

// Seed branches data
async function seedBranches() {
  try {
    const branchesData = [
      { branch_name: 'ACCRA BRANCH', branch_code: '330102' },
      { branch_name: 'MAKOLA BRANCH', branch_code: '330111' },
      { branch_name: 'TEMA BRANCH (COMM', branch_code: '330120' },
      { branch_name: 'AIRPORT BRANCH', branch_code: '330119' },
      { branch_name: 'MARKET CIRCLE BRANCH TAKORADI', branch_code: '330401' },
      { branch_name: 'ADUM BRANCH KUMASI', branch_code: '330601' },
      { branch_name: 'WEST HILLS MALL', branch_code: '330108' },
      { branch_name: 'JUNCTION SHOPPING CENTRE BRANCH', branch_code: '330101' },
      { branch_name: 'TEMA BRANCH (COMM 11)', branch_code: '330112' },
      { branch_name: 'ACHIMOTA MALL BRANCH', branch_code: '330107' },
      { branch_name: 'ACCRA MALL BRANCH', branch_code: '330106' },
      { branch_name: 'KEJETIA BRANCH', branch_code: '330602' }
    ];
    
    // Insert branches (only if they don't exist)
    for (const branch of branchesData) {
      const [branchRecord, created] = await FnbBranches.findOrCreate({
        where: { branch_code: branch.branch_code },
        defaults: branch
      });
      
      if (created) {
        console.log(`✅ Added branch: ${branch.branch_name}`);
      }
    }
    
    console.log('✅ All branches seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding branches:', error);
  }
}

// Seed admin user
async function seedAdminUser() {
  try {
    const allBranches = [
      'ACCRA BRANCH',
      'MAKOLA BRANCH',
      'TEMA BRANCH (COMM',
      'AIRPORT BRANCH',
      'MARKET CIRCLE BRANCH TAKORADI',
      'ADUM BRANCH KUMASI',
      'WEST HILLS MALL',
      'JUNCTION SHOPPING CENTRE BRANCH',
      'TEMA BRANCH (COMM 11)',
      'ACHIMOTA MALL BRANCH',
      'ACCRA MALL BRANCH',
      'KEJETIA BRANCH'
    ];
    
    const adminData = {
      email: 'admin@fnb.com',
      password: 'password12345', // In production, hash this password!
      branches: JSON.stringify(allBranches), // Store as JSON array
      role: 'super_admin'
    };
    
    // Insert admin user (only if doesn't exist)
    const [adminUser, created] = await AdminUsers.findOrCreate({
      where: { email: adminData.email },
      defaults: adminData
    });
    
    if (created) {
      console.log('✅ Default admin user created');
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: ${adminData.password}`);
      console.log(`   Branches: ${allBranches.length} branches assigned`);
    } else {
      console.log('✅ Admin user already exists');
    }
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
}

// Export everything
module.exports = {
  sequelize,
  UsersTable,
  FnbBranches,
  AdminUsers,
  VisitorLog,
  initDatabase
};

// Usage in your main app file (app.js or server.js):
/*
const { initDatabase, UsersTable, FnbBranches, AdminUsers, VisitorLog } = require('./models');

// Initialize database and create tables
initDatabase().then(() => {
  console.log('Database ready!');
  
  // Now you can use your models
  // Example: Create a user
  // UsersTable.create({
  //   email: 'user@example.com',
  //   branch: 'Main Branch',
  //   branch_code: 'MB001',
  //   role: 'staff'
  // });
  
}).catch(error => {
  console.error('Failed to initialize database:', error);
});
*/


//
npm install @sequelize/core @sequelize/postgres pg pg-hstore



//
const { initDatabase } = require('./models');
initDatabase(); // Creates all 4 tables instantly
initDatabase().then(() => {
  console.log('🚀 Database and tables ready!');
  const { initDatabase, UsersTable, FnbBranches, AdminUsers, VisitorLog } = require('./models');


  //
  CREATE TABLE users_table (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    branch VARCHAR(100),
    branch_code VARCHAR(50),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
  );


  CREATE TABLE visitor_log (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    timeIn TIME NOT NULL,
    timeOut TIME,
    department VARCHAR(100),
    company VARCHAR(100),
    picture TEXT, -- or BYTEA if storing binary image data
    telephone VARCHAR(20),
    reason TEXT,
    purpose TEXT,
    name VARCHAR(100),
    branch VARCHAR(50),
    branchName VARCHAR(100)
  );
    

  //error
  PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend> node server.js
Connected to the database
✅ Database connected successfully
❌ Database error: DatabaseError [SequelizeDatabaseError]: column "timein" cannot be cast automatically to type timestamp with time zone
    at PostgresQuery.formatError (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\postgres\lib\query.js:344:16)
    at PostgresQuery.run (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\postgres\lib\query.js:79:18)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:338:16
    at async Sequelize.queryRaw (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:325:12)
    at async VisitorLog.sync (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\model.js:700:11)
    at async Sequelize.sync (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:419:9)
    at async initDatabase (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\models\models.js:96:5) {
  sql: 'ALTER TABLE "visitor_log" ALTER COLUMN "timein" SET NOT NULL;ALTER TABLE "visitor_log" ALTER COLUMN "timein" DROP DEFAULT;ALTER TABLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
  parameters: {},
  [cause]: error: column "timein" cannot be cast automatically to type timestamp with time zone
      at Parser.parseErrorMessage (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:285:98)
      at Parser.handlePacket (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:122:29)
      at Parser.parse (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:35:38)
      at Socket.<anonymous> (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\index.js:11:42)
      at Socket.emit (node:events:518:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
      at Readable.push (node:internal/streams/readable:392:5)
      at TCP.onStreamRead (node:internal/stream_base_commons:189:23) {
    length: 282,
    severity: 'ERROR',
    code: '42804',
    detail: undefined,
    hint: 'You might need to specify "USING timein::timestamp with time zone".',
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: undefined,
    table: undefined,
    column: undefined,
    dataType: undefined,
    constraint: undefined,
    file: 'd:\\pginstaller_12.auto\\postgres.windows-x64\\src\\backend\\commands\\tablecmds.c',
    line: '10964',
    routine: 'ATPrepAlterColumnType',
    sql: 'ALTER TABLE "visitor_log" ALTER COLUMN "timein" SET NOT NULL;ALTER TABLE "visitor_log" ALTER COLUMN "timein" DROP DEFAULT;ALTER TABLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}
node:internal/process/promises:394
    triggerUncaughtException(err, true /* fromPromise */);
    ^

DatabaseError [SequelizeDatabaseError]: column "timein" cannot be cast automatically to type timestamp with time zone
    at PostgresQuery.formatError (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\postgres\lib\query.js:344:16)
    at PostgresQuery.run (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\postgres\lib\query.js:79:18)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:338:16
    at async Sequelize.queryRaw (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:325:12)
    at async VisitorLog.sync (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\model.js:700:11)
    at async Sequelize.sync (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:419:9)
    at async initDatabase (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\models\models.js:96:5) {
  sql: 'ALTER TABLE "visitor_log" ALTER COLUMN "timein" SET NOT NULL;ALTER TABLE "visitor_log" ALTER COLUMN "timein" DROP DEFAULT;ALTER TABLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
  parameters: {},
  [cause]: error: column "timein" cannot be cast automatically to type timestamp with time zone
      at Parser.parseErrorMessage (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:285:98)
      at Parser.handlePacket (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:122:29)
      at Parser.parse (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:35:38)
      at Socket.<anonymous> (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\index.js:11:42)
      at Socket.emit (node:events:518:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
      at Readable.push (node:internal/streams/readable:392:5)
      at TCP.onStreamRead (node:internal/stream_base_commons:189:23) {
    length: 282,
    severity: 'ERROR',
    code: '42804',
    detail: undefined,
    hint: 'You might need to specify "USING timein::timestamp with time zone".',
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: undefined,
    table: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: undefined,
    table: undefined,
    where: undefined,
    schema: undefined,
    table: undefined,
    schema: undefined,
    table: undefined,
    column: undefined,
    table: undefined,
    column: undefined,
    column: undefined,
    dataType: undefined,
    dataType: undefined,
    constraint: undefined,
    constraint: undefined,
    file: 'd:\\pginstaller_12.auto\\postgres.windows-x64\\src\\backend\\commands\\tablecmds.c',
    line: '10964',
    routine: 'ATPrepAlterColumnType',
    sql: 'ALTER TABLE "visitor_log" ALTER COLUMN "timein" SET NOT NULL;ALTER TABLE "visitor_log" ALTER COLUMN "timein" DROP DEFAULT;ALTER TA    sql: 'ALTER TABLE "visitor_log" ALTER COLUMN "timein" SET NOT NULL;ALTER TABLE "visitor_log" ALTER COLUMN "timein" DROP DEFAULT;ALTER TABLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}

Node.js v22.16.0
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend>






BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}

Node.js v22.16.0
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend>




BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}

Node.js v22.16.0
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend>


BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}

Node.js v22.16.0
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend>
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}

Node.js v22.16.0
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend>




BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}

Node.js v22.16.0
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend>


BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}

Node.js v22.16.0
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
BLE "visitor_log" ALTER COLUMN "timein" TYPE TIMESTAMP WITH TIME ZONE;',
    parameters: undefined
  }
}

Node.js v22.16.0
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend>

//new

const { Sequelize, DataTypes, Model } = require('@sequelize/core');
const { PostgresDialect } = require('@sequelize/postgres');

// Database connection
const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: process.env.DB_NAME || 'your_db',
  user: process.env.DB_USER || 'your_user',
  password: process.env.DB_PASSWORD || 'your_password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  logging: false // Set to console.log to see SQL queries
});

// Table 1: users_table
class UsersTable extends Model {}
UsersTable.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  branch: { type: DataTypes.STRING(100), allowNull: true },
  branch_code: { type: DataTypes.STRING(50), allowNull: true },
  role: { type: DataTypes.STRING(50), allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { 
  sequelize, 
  modelName: 'UsersTable', 
  tableName: 'users_table',
  timestamps: false // Since you have custom created_at
});

// Table 2: fnb_branches
class FnbBranches extends Model {}
FnbBranches.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  branch_name: { type: DataTypes.STRING, allowNull: false },
  branch_code: { type: DataTypes.STRING, allowNull: false, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  sequelize, 
  modelName: 'FnbBranches', 
  tableName: 'fnb_branches',
  timestamps: false
});

// Table 3: admin_users
class AdminUsers extends Model {}
AdminUsers.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  branches: { type: DataTypes.TEXT }, // Can store multiple branches as JSON or comma-separated
  role: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  last_login: { type: DataTypes.DATE, allowNull: true }
}, { 
  sequelize, 
  modelName: 'AdminUsers', 
  tableName: 'admin_users',
  timestamps: false
});

// Table 4: visitor_log - Fixed to match original table structure
class VisitorLog extends Model {}
VisitorLog.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATEONLY, allowNull: false }, // DATE type
  timein: { type: DataTypes.TIME, allowNull: false }, // TIME type (changed from 'timeIn')
  timeout: { type: DataTypes.TIME, allowNull: true }, // TIME type (changed from 'timeOut')
  department: { type: DataTypes.STRING(100), allowNull: true },
  company: { type: DataTypes.STRING(100), allowNull: true },
  picture: { type: DataTypes.TEXT, allowNull: true }, // Store file path or base64
  telephone: { type: DataTypes.STRING(20), allowNull: true },
  reason: { type: DataTypes.TEXT, allowNull: true },
  purpose: { type: DataTypes.TEXT, allowNull: true },
  name: { type: DataTypes.STRING(100), allowNull: true },
  branch: { type: DataTypes.STRING(50), allowNull: true },
  branchname: { type: DataTypes.STRING(100), allowNull: true } // Changed from 'branchName'
}, { 
  sequelize, 
  modelName: 'VisitorLog', 
  tableName: 'visitor_log',
  timestamps: false
});

// Optional: Define relationships if needed
// FnbBranches.hasMany(UsersTable, { foreignKey: 'branch_code', sourceKey: 'branch_code' });
// FnbBranches.hasMany(VisitorLog, { foreignKey: 'branch', sourceKey: 'branch_code' });

// Auto-create all tables function
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // This creates all 4 tables automatically
    await sequelize.sync({ alter: true });
    console.log('✅ All 4 tables created successfully:');
    console.log('   - users_table');
    console.log('   - fnb_branches');
    console.log('   - admin_users');
    console.log('   - visitor_log');
    
    // Insert default branches data
    await seedBranches();
    
    // Insert default admin user
    await seedAdminUser();
    
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

// Seed branches data
async function seedBranches() {
  try {
    const branchesData = [
      { branch_name: 'ACCRA BRANCH', branch_code: '330102' },
      { branch_name: 'MAKOLA BRANCH', branch_code: '330111' },
      { branch_name: 'TEMA BRANCH (COMM', branch_code: '330120' },
      { branch_name: 'AIRPORT BRANCH', branch_code: '330119' },
      { branch_name: 'MARKET CIRCLE BRANCH TAKORADI', branch_code: '330401' },
      { branch_name: 'ADUM BRANCH KUMASI', branch_code: '330601' },
      { branch_name: 'WEST HILLS MALL', branch_code: '330108' },
      { branch_name: 'JUNCTION SHOPPING CENTRE BRANCH', branch_code: '330101' },
      { branch_name: 'TEMA BRANCH (COMM 11)', branch_code: '330112' },
      { branch_name: 'ACHIMOTA MALL BRANCH', branch_code: '330107' },
      { branch_name: 'ACCRA MALL BRANCH', branch_code: '330106' },
      { branch_name: 'KEJETIA BRANCH', branch_code: '330602' }
    ];
    
    // Insert branches (only if they don't exist)
    for (const branch of branchesData) {
      const [branchRecord, created] = await FnbBranches.findOrCreate({
        where: { branch_code: branch.branch_code },
        defaults: branch
      });
      
      if (created) {
        console.log(`✅ Added branch: ${branch.branch_name}`);
      }
    }
    
    console.log('✅ All branches seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding branches:', error);
  }
}

// Seed admin user
async function seedAdminUser() {
  try {
    const allBranches = [
      'ACCRA BRANCH',
      'MAKOLA BRANCH',
      'TEMA BRANCH (COMM',
      'AIRPORT BRANCH',
      'MARKET CIRCLE BRANCH TAKORADI',
      'ADUM BRANCH KUMASI',
      'WEST HILLS MALL',
      'JUNCTION SHOPPING CENTRE BRANCH',
      'TEMA BRANCH (COMM 11)',
      'ACHIMOTA MALL BRANCH',
      'ACCRA MALL BRANCH',
      'KEJETIA BRANCH'
    ];
    
    const adminData = {
      email: 'admin@fnb.com',
      password: 'password12345', // In production, hash this password!
      branches: JSON.stringify(allBranches), // Store as JSON array
      role: 'admin' // Changed from 'super_admin' to 'admin'
    };
    
    // Insert admin user (only if doesn't exist)
    const [adminUser, created] = await AdminUsers.findOrCreate({
      where: { email: adminData.email },
      defaults: adminData
    });
    
    if (created) {
      console.log('✅ Default admin user created');
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: ${adminData.password}`);
      console.log(`   Branches: ${allBranches.length} branches assigned`);
    } else {
      console.log('✅ Admin user already exists');
    }
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
}

// Export everything
module.exports = {
  sequelize,
  UsersTable,
  FnbBranches,
  AdminUsers,
  VisitorLog,
  initDatabase
};


//another error
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend> cd new-backend
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend> node server.js
Connected to the database
✅ Database connected successfully
❌ Database error: DatabaseError [SequelizeDatabaseError]: column "date" contains null values
    at PostgresQuery.formatError (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\postgres\lib\query.js:344:16)
    at PostgresQuery.run (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\postgres\lib\query.js:79:18)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:338:16
    at async Sequelize.queryRaw (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:325:12)
    at async PostgresQueryInterface.addColumn (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\abstract-dialect\query-interface.js:158:12)
    at async VisitorLog.sync (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\model.js:665:11)
    at async Sequelize.sync (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:419:9)
    at async initDatabase (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\models\models.js:97:5) {
  sql: 'ALTER TABLE "visitor_log" ADD COLUMN  "date" DATE NOT NULL;',
  parameters: {},
  [cause]: error: column "date" contains null values
      at Parser.parseErrorMessage (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:285:98)
      at Parser.handlePacket (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:122:29)
      at Parser.parse (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:35:38)
      at Socket.<anonymous> (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\index.js:11:42)
      at Socket.emit (node:events:518:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
      at Readable.push (node:internal/streams/readable:392:5)
      at TCP.onStreamRead (node:internal/stream_base_commons:189:23) {
    length: 189,
    severity: 'ERROR',
    code: '23502',
    detail: undefined,
    hint: undefined,
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: 'public',
    table: 'visitor_log',
    column: 'date',
    dataType: undefined,
    constraint: undefined,
    file: 'd:\\pginstaller_12.auto\\postgres.windows-x64\\src\\backend\\commands\\tablecmds.c',
    line: '5295',
    routine: 'ATRewriteTable',
    sql: 'ALTER TABLE "visitor_log" ADD COLUMN  "date" DATE NOT NULL;',
    parameters: undefined
  }
}
node:internal/process/promises:394
    triggerUncaughtException(err, true /* fromPromise */);
    ^

DatabaseError [SequelizeDatabaseError]: column "date" contains null values
    at PostgresQuery.formatError (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\postgres\lib\query.js:344:16)
    at PostgresQuery.run (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\postgres\lib\query.js:79:18)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:338:16
    at async Sequelize.queryRaw (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:325:12)
    at async PostgresQueryInterface.addColumn (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\abstract-dialect\query-interface.js:158:12)
    at async VisitorLog.sync (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\model.js:665:11)
    at async Sequelize.sync (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\@sequelize\core\lib\sequelize.js:419:9)
    at async initDatabase (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\models\models.js:97:5) {
  sql: 'ALTER TABLE "visitor_log" ADD COLUMN  "date" DATE NOT NULL;',
  parameters: {},
  [cause]: error: column "date" contains null values
      at Parser.parseErrorMessage (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:285:98)
      at Parser.handlePacket (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:122:29)
      at Parser.parse (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\parser.js:35:38)
      at Socket.<anonymous> (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\node_modules\pg-protocol\dist\index.js:11:42)
      at Socket.emit (node:events:518:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
      at Readable.push (node:internal/streams/readable:392:5)
      at TCP.onStreamRead (node:internal/stream_base_commons:189:23) {
    length: 189,
    severity: 'ERROR',
    code: '23502',
    detail: undefined,
    hint: undefined,
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: 'public',
    table: 'visitor_log',
    column: 'date',
    dataType: undefined,
    constraint: undefined,
    file: 'd:\\pginstaller_12.auto\\postgres.windows-x64\\src\\backend\\commands\\tablecmds.c',
    line: '5295',
    routine: 'ATRewriteTable',
    sql: 'ALTER TABLE "visitor_log" ADD COLUMN  "date" DATE NOT NULL;',
    parameters: undefined
  }
}

Node.js v22.16.0
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend>




//new model

const { Sequelize, DataTypes, Model } = require('@sequelize/core');
const { PostgresDialect } = require('@sequelize/postgres');

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  user: 'devuser01',
  host: '172.29.18.103',
  database: 'visitorslog',
  password: 'devuser0124',
  port: 5432,
  logging: false 
});

// Table 1: users_table
class UsersTable extends Model {}
UsersTable.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  branch: { type: DataTypes.STRING(100), allowNull: true },
  branch_code: { type: DataTypes.STRING(50), allowNull: true },
  role: { type: DataTypes.STRING(50), allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { 
  sequelize, 
  modelName: 'UsersTable', 
  tableName: 'users_table',
  timestamps: false 
});

// Table 2: fnb_branches
class FnbBranches extends Model {}
FnbBranches.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  branch_name: { type: DataTypes.STRING, allowNull: false },
  branch_code: { type: DataTypes.STRING, allowNull: false, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  sequelize, 
  modelName: 'FnbBranches', 
  tableName: 'fnb_branches',
  timestamps: false
});

// Table 3: admin_users
class AdminUsers extends Model {}
AdminUsers.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  branches: { type: DataTypes.TEXT }, // Can store multiple branches as JSON or comma-separated
  role: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  last_login: { type: DataTypes.DATE, allowNull: true }
}, { 
  sequelize, 
  modelName: 'AdminUsers', 
  tableName: 'admin_users',
  timestamps: false
});

// Table 4: visitor_log - Fixed to match original table structure
class VisitorLog extends Model {}
VisitorLog.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   date: { type: DataTypes.DATEONLY, allowNull: false }, // DATE type
  timein: { type: DataTypes.TIME, allowNull: false }, // TIME type (changed from 'timeIn')
  timeout: { type: DataTypes.TIME, allowNull: true }, // TIME type (changed from 'timeOut')
  department: { type: DataTypes.STRING(100), allowNull: true },
  company: { type: DataTypes.STRING(100), allowNull: true },
  picture: { type: DataTypes.TEXT, allowNull: true }, // Store file path or base64
  telephone: { type: DataTypes.STRING(20), allowNull: true },
  reason: { type: DataTypes.TEXT, allowNull: true },
  purpose: { type: DataTypes.TEXT, allowNull: true },
  name: { type: DataTypes.STRING(100), allowNull: true },
  branch: { type: DataTypes.STRING(50), allowNull: true },
  branchname: { type: DataTypes.STRING(100), allowNull: true } // Changed from 'branchName'
}, { 
  sequelize, 
  modelName: 'VisitorLog', 
  tableName: 'visitor_log',
  timestamps: false
});

// Optional: Define relationships if needed
// FnbBranches.hasMany(UsersTable, { foreignKey: 'branch_code', sourceKey: 'branch_code' });
// FnbBranches.hasMany(VisitorLog, { foreignKey: 'branch', sourceKey: 'branch_code' });

// Auto-create all tables function
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // This creates all 4 tables automatically
    await sequelize.sync({ alter: true });
    console.log('✅ All 4 tables created successfully:');
    console.log('   - users_table');
    console.log('   - fnb_branches');
    console.log('   - admin_users');
    console.log('   - visitor_log');
    
    // Insert default branches data
    await seedBranches();
    
    // Insert default admin user
    await seedAdminUser();
    
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

// Seed branches data
async function seedBranches() {
  try {
    const branchesData = [
      { branch_name: 'ACCRA BRANCH', branch_code: '330102' },
      { branch_name: 'MAKOLA BRANCH', branch_code: '330111' },
      { branch_name: 'TEMA BRANCH (COMM', branch_code: '330120' },
      { branch_name: 'AIRPORT BRANCH', branch_code: '330119' },
      { branch_name: 'MARKET CIRCLE BRANCH TAKORADI', branch_code: '330401' },
      { branch_name: 'ADUM BRANCH KUMASI', branch_code: '330601' },
      { branch_name: 'WEST HILLS MALL', branch_code: '330108' },
      { branch_name: 'JUNCTION SHOPPING CENTRE BRANCH', branch_code: '330101' },
      { branch_name: 'TEMA BRANCH (COMM 11)', branch_code: '330112' },
      { branch_name: 'ACHIMOTA MALL BRANCH', branch_code: '330107' },
      { branch_name: 'ACCRA MALL BRANCH', branch_code: '330106' },
      { branch_name: 'KEJETIA BRANCH', branch_code: '330602' }
    ];
    
    // Insert branches (only if they don't exist)
    for (const branch of branchesData) {
      const [branchRecord, created] = await FnbBranches.findOrCreate({
        where: { branch_code: branch.branch_code },
        defaults: branch
      });
      
      if (created) {
        console.log(`✅ Added branch: ${branch.branch_name}`);
      }
    }
    
    console.log('✅ All branches seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding branches:', error);
  }
}

// Seed admin user
async function seedAdminUser() {
  try {
    const allBranches = [
      'ACCRA BRANCH',
      'MAKOLA BRANCH',
      'TEMA BRANCH (COMM',
      'AIRPORT BRANCH',
      'MARKET CIRCLE BRANCH TAKORADI',
      'ADUM BRANCH KUMASI',
      'WEST HILLS MALL',
      'JUNCTION SHOPPING CENTRE BRANCH',
      'TEMA BRANCH (COMM 11)',
      'ACHIMOTA MALL BRANCH',
      'ACCRA MALL BRANCH',
      'KEJETIA BRANCH'
    ];
    
    const adminData = {
      email: 'admin@fnb.com',
      password: 'password12345', 
      branches: JSON.stringify(allBranches), 
      role: 'admin' 
    };
    
    const [adminUser, created] = await AdminUsers.findOrCreate({
      where: { email: adminData.email },
      defaults: adminData
    });
    
    if (created) {
      console.log('✅ Default admin user created');
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: ${adminData.password}`);
      console.log(`   Branches: ${allBranches.length} branches assigned`);
    } else {
      console.log('✅ Admin user already exists');
    }
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
}

// Export everything
module.exports = {
  sequelize,
  UsersTable,
  FnbBranches,
  AdminUsers,
  VisitorLog,
  initDatabase
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

//server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const visitorsRouter = require('./route/visitors');
const authRouter = require('./route/auth'); 
const usersRouter = require('./route/users');
const branchesRouter = require('./route/branches');
// const { initDatabase } = require('./models/models');

// initDatabase().then(() => {
//   console.log('🚀 Database and tables ready!');

  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/visitors', visitorsRouter);
  app.use('/auth', authRouter); 
  app.use('/users', usersRouter);
  app.use('/fnb_branches', branchesRouter);

  app.use((req, res) => {
    console.log(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  });

  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
    console.log(`Auth endpoints available at: http://localhost:${PORT}/auth`);
  });
// });
//error
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend> cd new-backend
PS C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend> node server.js
Connected to the database
✅ Database connected successfully
✅ All 4 tables created successfully:
   - users_table
   - fnb_branches
   - admin_users
   - visitor_log
✅ All branches seeded successfully
✅ Admin user already exists
🚀 Database and tables ready!
Server is running on port 5001
Health check available at: http://localhost:5001/health
Auth endpoints available at: http://localhost:5001/auth
2025-07-11T09:55:55.581Z - GET /visitors/index
Fetching all unique branches
2025-07-11T09:55:55.584Z - GET /fnb_branches
Server is running on port 5001
Health check available at: http://localhost:5001/health
Auth endpoints available at: http://localhost:5001/auth
2025-07-11T09:55:55.581Z - GET /visitors/index
Fetching all unique branches
2025-07-11T09:55:55.584Z - GET /fnb_branches
Auth endpoints available at: http://localhost:5001/auth
2025-07-11T09:55:55.581Z - GET /visitors/index
Fetching all unique branches
2025-07-11T09:55:55.584Z - GET /fnb_branches
2025-07-11T09:55:55.581Z - GET /visitors/index
Fetching all unique branches
2025-07-11T09:55:55.584Z - GET /fnb_branches
2025-07-11T09:55:55.584Z - GET /fnb_branches
Fetching all branches from fnb_branches table
Fetching all branches from fnb_branches table
Found 12 branches
Found 3 unique branches
2025-07-11T09:56:21.659Z - POST /auth/verify-admin
2025-07-11T09:56:21.661Z - GET /visitors/index
Fetching all unique branches
Found 3 unique branches
Admin verification error: TypeError: branches.map is not a function
    at verifyAdminCredentials (C:\Users\f8877557\OneDrive - FRG\Desktop\Production\file-backend\new-backend\controllers\authController.js:330:26)
//new updated model
const { Sequelize, DataTypes, Model } = require('@sequelize/core');
const { PostgresDialect } = require('@sequelize/postgres');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  user: 'devuser01',
  host: '172.29.18.103',
  database: 'visitorslog',
  password: 'devuser0124',
  port: 5432,
  logging: false 
});

// Table 1: users_table
class UsersTable extends Model {}
UsersTable.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  branch: { type: DataTypes.STRING(100), allowNull: true },
  branch_code: { type: DataTypes.STRING(50), allowNull: true },
  role: { type: DataTypes.STRING(50), allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { 
  sequelize, 
  modelName: 'UsersTable', 
  tableName: 'users_table',
  timestamps: false 
});

// Table 2: fnb_branches
class FnbBranches extends Model {}
FnbBranches.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  branch_name: { type: DataTypes.STRING, allowNull: false },
  branch_code: { type: DataTypes.STRING, allowNull: false, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  sequelize, 
  modelName: 'FnbBranches', 
  tableName: 'fnb_branches',
  timestamps: false
});

// Table 3: admin_users - Use PostgreSQL ARRAY type to store as actual array
class AdminUsers extends Model {}
AdminUsers.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  branches: { type: DataTypes.ARRAY(DataTypes.STRING) }, // PostgreSQL array - will be returned as JS array
  role: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  last_login: { type: DataTypes.DATE, allowNull: true }
}, { 
  sequelize, 
  modelName: 'AdminUsers', 
  tableName: 'admin_users',
  timestamps: false
});

// Table 4: visitor_log - Fixed to match original table structure
class VisitorLog extends Model {}
VisitorLog.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   date: { type: DataTypes.DATEONLY, allowNull: false }, // DATE type
  timein: { type: DataTypes.TIME, allowNull: false }, // TIME type (changed from 'timeIn')
  timeout: { type: DataTypes.TIME, allowNull: true }, // TIME type (changed from 'timeOut')
  department: { type: DataTypes.STRING(100), allowNull: true },
  company: { type: DataTypes.STRING(100), allowNull: true },
  picture: { type: DataTypes.TEXT, allowNull: true }, // Store file path or base64
  telephone: { type: DataTypes.STRING(20), allowNull: true },
  reason: { type: DataTypes.TEXT, allowNull: true },
  purpose: { type: DataTypes.TEXT, allowNull: true },
  name: { type: DataTypes.STRING(100), allowNull: true },
  branch: { type: DataTypes.STRING(50), allowNull: true },
  branchname: { type: DataTypes.STRING(100), allowNull: true } // Changed from 'branchName'
}, { 
  sequelize, 
  modelName: 'VisitorLog', 
  tableName: 'visitor_log',
  timestamps: false
});

// Optional: Define relationships if needed
// FnbBranches.hasMany(UsersTable, { foreignKey: 'branch_code', sourceKey: 'branch_code' });
// FnbBranches.hasMany(VisitorLog, { foreignKey: 'branch', sourceKey: 'branch_code' });

// Auto-create all tables function
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // This creates all 4 tables automatically
    await sequelize.sync({ alter: true });
    console.log('✅ All 4 tables created successfully:');
    console.log('   - users_table');
    console.log('   - fnb_branches');
    console.log('   - admin_users');
    console.log('   - visitor_log');
    
    // Insert default branches data
    await seedBranches();
    
    // Insert default admin user
    await seedAdminUser();
    
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

// Seed branches data
async function seedBranches() {
  try {
    const branchesData = [
      { branch_name: 'ACCRA BRANCH', branch_code: '330102' },
      { branch_name: 'MAKOLA BRANCH', branch_code: '330111' },
      { branch_name: 'TEMA BRANCH (COMM', branch_code: '330120' },
      { branch_name: 'AIRPORT BRANCH', branch_code: '330119' },
      { branch_name: 'MARKET CIRCLE BRANCH TAKORADI', branch_code: '330401' },
      { branch_name: 'ADUM BRANCH KUMASI', branch_code: '330601' },
      { branch_name: 'WEST HILLS MALL', branch_code: '330108' },
      { branch_name: 'JUNCTION SHOPPING CENTRE BRANCH', branch_code: '330101' },
      { branch_name: 'TEMA BRANCH (COMM 11)', branch_code: '330112' },
      { branch_name: 'ACHIMOTA MALL BRANCH', branch_code: '330107' },
      { branch_name: 'ACCRA MALL BRANCH', branch_code: '330106' },
      { branch_name: 'KEJETIA BRANCH', branch_code: '330602' }
    ];
    
    // Insert branches (only if they don't exist)
    for (const branch of branchesData) {
      const [branchRecord, created] = await FnbBranches.findOrCreate({
        where: { branch_code: branch.branch_code },
        defaults: branch
      });
      
      if (created) {
        console.log(`✅ Added branch: ${branch.branch_name}`);
      }
    }
    
    console.log('✅ All branches seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding branches:', error);
  }
}

// Seed admin user using raw SQL to ensure compatibility with authController
async function seedAdminUser() {
  try {
    const allBranches = [
      'ACCRA BRANCH',
      'MAKOLA BRANCH',
      'TEMA BRANCH (COMM',
      'AIRPORT BRANCH',
      'MARKET CIRCLE BRANCH TAKORADI',
      'ADUM BRANCH KUMASI',
      'WEST HILLS MALL',
      'JUNCTION SHOPPING CENTRE BRANCH',
      'TEMA BRANCH (COMM 11)',
      'ACHIMOTA MALL BRANCH',
      'ACCRA MALL BRANCH',
      'KEJETIA BRANCH'
    ];
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password12345', salt);
    
    // Use raw SQL to insert admin user with PostgreSQL array syntax
    const insertQuery = `
      INSERT INTO admin_users (email, password, branches, role, created_at) 
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;
    
    const result = await sequelize.query(insertQuery, {
      replacements: [
        'admin@fnb.com',
        hashedPassword,
        allBranches, // PostgreSQL will handle this as an array
        'admin'
      ],
      type: Sequelize.QueryTypes.INSERT
    });
    
    if (result[1] > 0) { // result[1] is the number of affected rows
      console.log('✅ Default admin user created');
      console.log(`   Email: admin@fnb.com`);
      console.log(`   Password: password12345`);
      console.log(`   Branches: ${allBranches.length} branches assigned`);
    } else {
      console.log('✅ Admin user already exists');
    }
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
}

// Export everything
module.exports = {
  sequelize,
  UsersTable,
  FnbBranches,
  AdminUsers,
  VisitorLog,
  initDatabase
};


//nnnnnß