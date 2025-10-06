import React, { useState } from 'react';

function SimpleForm() {
  const [inputValue, setInputValue] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [showSecondForm, setShowSecondForm] = useState(true);
  const [firstApiResponse, setFirstApiResponse] = useState(null);
  const [showFirstForm, setShowFirstForm] = useState(true);
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'store'
  
  // User state
  const [currentUser, setCurrentUser] = useState(null); // Will store user info after login
  const [tempUserId, setTempUserId] = useState(''); // Temporary input for user ID
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Controls access to main app
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: ''
  });
  
  // Table data state
  const [tableData, setTableData] = useState([
    { id: 1, name: '', email: '', age: '', department: '' },
    { id: 2, name: '', email: '', age: '', department: '' },
    { id: 3, name: '', email: '', age: '', department: '' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Request Sent...')
      const response = await fetch('https://t87sqo7pfe.execute-api.us-east-1.amazonaws.com/prod/hello', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputValue }),
      });

      const data = await response.json();
      console.log('Response from API:', data);
      setFirstApiResponse(data);
      setShowFirstForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleSecondSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Second Request Sent...')
      const response = await fetch(`https://t87sqo7pfe.execute-api.us-east-1.amazonaws.com/prod/hello?user_id=${encodeURIComponent(secondInput)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      setApiResponse(data);
      setShowSecondForm(false);
    } catch (error) {
      console.error('Error submitting second form:', error);
    }
  };

  // Table functions
  const handleCellChange = (rowIndex, field, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][field] = value;
    setTableData(updatedData);
  };

  const addNewRow = () => {
    const newRow = {
      id: tableData.length + 1,
      name: '',
      email: '',
      age: '',
      department: ''
    };
    setTableData([...tableData, newRow]);
  };

  const deleteRow = (rowIndex) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedData);
  };

  const submitRow = (rowIndex) => {
    const rowData = tableData[rowIndex];
    console.log('Submitting row data:', rowData);
    // You can add API call here to submit the row data
    alert(`Row submitted: ${JSON.stringify(rowData, null, 2)}`);
  };

  // Navigation function
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  // Purchase handler function
  const handlePurchase = async (productId) => {
    // Check if user is logged in or has provided user ID
    const userId = currentUser?.id || tempUserId;
    
    if (!userId) {
      alert('Please provide a User ID before making a purchase.');
      return;
    }
    
    try {
      console.log('Purchase request sent for product ID:', productId, 'by user:', userId);
      
      const response = await fetch('https://t87sqo7pfe.execute-api.us-east-1.amazonaws.com/prod/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          product_id: productId,
          user_id: userId,
          action: 'add_to_cart'
        }),
      });

      const data = await response.json();
      console.log('Purchase response:', data);
      
      // Show success message
      alert(`Product ${productId} added to cart for user ${userId}!`);
    } catch (error) {
      console.error('Error processing purchase:', error);
      alert('Error processing purchase. Please try again.');
    }
  };

  // Sign-in handler function
  const handleSignIn = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Sign-in attempt for:', loginCredentials.username);
      
      // For demo purposes - you can replace this with actual authentication
      if (loginCredentials.username && loginCredentials.password) {
        // Simulate successful login
        setCurrentUser({
          id: loginCredentials.username,
          username: loginCredentials.username
        });
        setTempUserId(loginCredentials.username); // Auto-populate user ID
        setIsAuthenticated(true);
        
        console.log('Sign-in successful');
      } else {
        alert('Please enter both username and password');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed. Please try again.');
    }
  };

  // Sign-out handler function
  const handleSignOut = () => {
    setCurrentUser(null);
    setTempUserId('');
    setIsAuthenticated(false);
    setLoginCredentials({ username: '', password: '' });
    setCurrentPage('home'); // Reset to home page
  };

  // Handle login input changes
  const handleLoginChange = (field, value) => {
    setLoginCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{ fontFamily: 'Arial' }}>
      {!isAuthenticated ? (
        // Sign-In Page
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Sign In</h2>
            
            <form onSubmit={handleSignIn}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Username:</label>
                <input
                  type="text"
                  value={loginCredentials.username}
                  onChange={(e) => handleLoginChange('username', e.target.value)}
                  placeholder="Enter your username"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Password:</label>
                <input
                  type="password"
                  value={loginCredentials.password}
                  onChange={(e) => handleLoginChange('password', e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
            </form>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#f0f8ff', 
              borderRadius: '6px',
              fontSize: '14px',
              color: '#666'
            }}>
              <strong>Demo Mode:</strong> Enter any username and password to sign in.
            </div>
          </div>
        </div>
      ) : (
        // Authenticated Main App
        <div>
          {/* Navigation Menu */}
          <nav style={{
            backgroundColor: '#333',
            padding: '10px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={() => handleNavigation('home')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === 'home' ? '#4CAF50' : '#555',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('store')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === 'store' ? '#4CAF50' : '#555',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Store
                </button>
              </div>
              
              {/* User Info and Sign Out */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ color: 'white', fontSize: '14px' }}>
                  Welcome, {currentUser?.username}!
                </span>
                <button
                  onClick={handleSignOut}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          {currentPage === 'home' ? (
            // Home Page Content
            <div style={{ padding: '0 20px' }}>
              <h2>Simple React Form</h2>
              {showFirstForm ? (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add username"
                    style={{ padding: '8px', marginRight: '10px' }}
                  />
                  <button type="submit" style={{ padding: '8px 16px' }}>
                    Submit
                  </button>
                </form>
              ) : (
                <div>
                  <h3>First Form API Response:</h3>
                  <pre style={{ backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '4px' }}>
                    {JSON.stringify(firstApiResponse, null, 2)}
                  </pre>
                </div>
              )}

              {showSecondForm ? (
                <form onSubmit={handleSecondSubmit} style={{ marginTop: '20px' }}>
                  <input
                    type="text"
                    value={secondInput}
                    onChange={(e) => setSecondInput(e.target.value)}
                    placeholder="Enter User ID."
                    style={{ padding: '8px', marginRight: '10px' }}
                  />
                  <button type="submit" style={{ padding: '8px 16px' }}>
                    Submit Second Form
                  </button>
                </form>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  <h3>API Response:</h3>
                  <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              )}

              {/* Editable Table Section */}
              <div style={{ marginTop: '40px' }}>
                <h2>Editable User Data Table</h2>
                <button 
                  onClick={addNewRow}
                  style={{ 
                    padding: '8px 16px', 
                    marginBottom: '20px', 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add New Row
                </button>
                
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse', 
                  border: '1px solid #ddd'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Age</th>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Department</th>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={row.id}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => handleCellChange(rowIndex, 'name', e.target.value)}
                            style={{ 
                              width: '100%', 
                              border: 'none', 
                              padding: '4px',
                              backgroundColor: 'transparent'
                            }}
                            placeholder="Enter name"
                          />
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                          <input
                            type="email"
                            value={row.email}
                            onChange={(e) => handleCellChange(rowIndex, 'email', e.target.value)}
                            style={{ 
                              width: '100%', 
                              border: 'none', 
                              padding: '4px',
                              backgroundColor: 'transparent'
                            }}
                            placeholder="Enter email"
                          />
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                          <input
                            type="number"
                            value={row.age}
                            onChange={(e) => handleCellChange(rowIndex, 'age', e.target.value)}
                            style={{ 
                              width: '100%', 
                              border: 'none', 
                              padding: '4px',
                              backgroundColor: 'transparent'
                            }}
                            placeholder="Age"
                          />
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                          <input
                            type="text"
                            value={row.department}
                            onChange={(e) => handleCellChange(rowIndex, 'department', e.target.value)}
                            style={{ 
                              width: '100%', 
                              border: 'none', 
                              padding: '4px',
                              backgroundColor: 'transparent'
                            }}
                            placeholder="Department"
                          />
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <button
                            onClick={() => submitRow(rowIndex)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginRight: '5px'
                            }}
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => deleteRow(rowIndex)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Display current table data for testing */}
                <div style={{ marginTop: '20px' }}>
                  <h3>Current Table Data (for testing):</h3>
                  <pre style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
                    {JSON.stringify(tableData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            // Store Page Content
            <div style={{ padding: '0 20px' }}>
              <h2>Store</h2>
              <p>Welcome to our online store! Browse our available products below.</p>
              
              {/* User ID Input Section */}
              <div style={{
                backgroundColor: '#f0f8ff',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                maxWidth: '400px',
                margin: '0 auto 20px auto'
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>User Information</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label style={{ minWidth: '70px', color: '#666' }}>User ID:</label>
                  <input
                    type="text"
                    value={tempUserId}
                    onChange={(e) => setTempUserId(e.target.value)}
                    placeholder="Enter your User ID"
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                {tempUserId && (
                  <p style={{ margin: '10px 0 0 0', color: '#4CAF50', fontSize: '14px' }}>
                    ✓ Ready to purchase as user: {tempUserId}
                  </p>
                )}
              </div>
              
              {/* Gift Card Product */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                padding: '30px',
                borderRadius: '12px',
                marginTop: '20px',
                maxWidth: '300px',
                margin: '20px auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                {/* Placeholder Image */}
                <div style={{
                  width: '200px',
                  height: '120px',
                  backgroundColor: '#e0e0e0',
                  border: '2px dashed #999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '15px',
                  borderRadius: '8px'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Gift Card Image</span>
                </div>
                
                {/* Product Details */}
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Gift Card</h3>
                <p style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#4CAF50',
                  margin: '0 0 15px 0'
                }}>
                  $15.00
                </p>
                
                {/* Buy Button */}
                <button 
                  onClick={() => handlePurchase('gift-card-001')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SimpleForm;


//Testing to make sure this doesn't trigger a pipeline build
//This should trigger a build