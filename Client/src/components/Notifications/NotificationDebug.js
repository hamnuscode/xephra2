import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const NotificationDebug = () => {
  const { user } = useSelector((state) => state.auth);
  const [debugInfo, setDebugInfo] = useState({});
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    setDebugInfo({
      userId: user?._id,
      userExists: !!user,
      token: !!localStorage.getItem('token'),
      backendUrl: process.env.REACT_APP_BACKEND || 'http://localhost:5000'
    });
  }, [user]);

  const testNotificationAPI = async () => {
    try {
      setTestResult('Testing...');
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:5000';
      
      const response = await fetch(
        `${backendUrl}/notifications?userId=${user?._id}&userType=user&limit=5`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      setTestResult(`Status: ${response.status}, Success: ${data.success}, Data: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white m-4">
      <h3 className="text-xl font-bold mb-4">Notification Debug Panel</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <pre className="bg-gray-900 p-2 rounded text-sm">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <button 
        onClick={testNotificationAPI}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4"
      >
        Test Notification API
      </button>

      {testResult && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Test Result:</h4>
          <pre className="bg-gray-900 p-2 rounded text-sm max-h-64 overflow-y-auto">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default NotificationDebug;
