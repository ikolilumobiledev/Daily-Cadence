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