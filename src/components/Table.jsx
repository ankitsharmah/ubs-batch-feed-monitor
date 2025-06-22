import React, { useState, useEffect } from 'react';

const Table = ({ data, allData, setData, selectedAction }) => {
  const [showInsertForm, setShowInsertForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobName: '',
    vendorName: '',
    dq: '',
    transmitted: '',
    terminal: '',
    receivedStatus: '',
    notStarted: ''
  });

  // Show form automatically when insert action is selected
  useEffect(() => {
    if (selectedAction === 'insert') {
      setShowInsertForm(true);
      resetForm();
    } else {
      setShowInsertForm(false);
      setEditingRecord(null);
    }
  }, [selectedAction]);

  // API simulation functions
  const apiCall = async (method, endpoint, requestData = null) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`API Call: ${method} ${endpoint}`, requestData);
    
    try {
      // Simulate API response based on method
      switch (method) {
        case 'POST':
          // Simulate successful insert
          return { 
            success: true, 
            id: Date.now(),
            message: 'Record created successfully'
          };
        case 'PUT':
          // Simulate successful update
          return { 
            success: true, 
            message: 'Record updated successfully'
          };
        case 'DELETE':
          // Simulate successful delete
          return { 
            success: true, 
            message: 'Record deleted successfully'
          };
        case 'GET':
          // Simulate fetch
          return { 
            success: true, 
            data: requestData,
            message: 'Data fetched successfully'
          };
        default:
          return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'An error occurred'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = async () => {
    if (!validateForm()) return;

    try {
      const response = await apiCall('POST', '/api/batch-feeds', formData);
      
      if (response.success) {
        const newRecord = { 
          id: response.id, 
          ...formData 
        };
        setData(prev => [...prev, newRecord]);
        resetForm();
        alert(response.message || 'Record inserted successfully!');
      } else {
        alert(response.message || 'Error inserting record');
      }
    } catch (error) {
      alert('Error inserting record: ' + error.message);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const response = await apiCall('PUT', `/api/batch-feeds/${editingRecord.id}`, formData);
      
      if (response.success) {
        setData(prev => prev.map(item => 
          item.id === editingRecord.id ? { ...item, ...formData } : item
        ));
        resetForm();
        alert(response.message || 'Record updated successfully!');
      } else {
        alert(response.message || 'Error updating record');
      }
    } catch (error) {
      alert('Error updating record: ' + error.message);
    }
  };

  const handleDelete = async (record) => {
    const confirmMessage = `Are you sure you want to delete the record with Job Name: ${record.jobName}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await apiCall('DELETE', `/api/batch-feeds/${record.id}`, { id: record.id });
        
        if (response.success) {
          setData(prev => prev.filter(item => item.id !== record.id));
          alert(response.message || 'Record deleted successfully!');
        } else {
          alert(response.message || 'Error deleting record');
        }
      } catch (error) {
        alert('Error deleting record: ' + error.message);
      }
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      jobName: record.jobName,
      vendorName: record.vendorName,
      dq: record.dq,
      transmitted: record.transmitted,
      terminal: record.terminal,
      receivedStatus: record.receivedStatus,
      notStarted: record.notStarted
    });
    setShowInsertForm(true);
  };

  const handleSendMail = async (record) => {
    try {
      const response = await apiCall('POST', `/api/send-mail/${record.id}`, {
        jobName: record.jobName,
        vendorName: record.vendorName,
        recipient: 'meri.shraddha@ubs.com'
      });
      
      if (response.success) {
        alert(`Mail sent successfully for: ${record.jobName}`);
      } else {
        alert(response.message || 'Error sending mail');
      }
    } catch (error) {
      alert('Error sending mail: ' + error.message);
    }
  };

  const handleExport = async () => {
    try {
      const response = await apiCall('GET', '/api/export-data', { data: allData });
      
      if (response.success) {
        // Simulate CSV export
        const csvContent = generateCSV(allData);
        downloadCSV(csvContent, 'batch_feeds_data.csv');
        alert('Data exported successfully!');
      } else {
        alert(response.message || 'Error exporting data');
      }
    } catch (error) {
      alert('Error exporting data: ' + error.message);
    }
  };

  const generateCSV = (data) => {
    const headers = ['ID', 'Job Name', 'Vendor Name', 'DQ', 'Transmitted', 'Terminal', 'Received Status', 'Not Started'];
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = [
        row.id,
        `"${row.jobName}"`,
        `"${row.vendorName}"`,
        `"${row.dq}"`,
        `"${row.transmitted}"`,
        `"${row.terminal}"`,
        `"${row.receivedStatus}"`,
        `"${row.notStarted}"`
      ];
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const validateForm = () => {
    const requiredFields = ['jobName', 'vendorName'];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    
    if (emptyFields.length > 0) {
      alert(`Please fill in the following required fields: ${emptyFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      jobName: '',
      vendorName: '',
      dq: '',
      transmitted: '',
      terminal: '',
      receivedStatus: '',
      notStarted: ''
    });
    setShowInsertForm(selectedAction === 'insert');
    setEditingRecord(null);
  };

  const handleFormInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getActionButton = (record) => {
    switch(selectedAction) {
      case 'view':
        return (
          <button 
            onClick={() => handleSendMail(record)}
            className="action-btn mail-btn"
            title="Send Mail"
            disabled={isLoading}
          >
            📧
          </button>
        );
      case 'update':
        return (
          <button 
            onClick={() => handleEdit(record)}
            className="action-btn edit-btn"
            title="Edit"
            disabled={isLoading}
          >
            ✏️
          </button>
        );
      case 'delete':
        return (
          <button 
            onClick={() => handleDelete(record)}
            className="action-btn delete-btn"
            title="Delete"
            disabled={isLoading}
          >
            🗑️
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="table-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          color: 'white',
          fontSize: '18px'
        }}>
          Loading...
        </div>
      )}

      {/* Insert/Update Form */}
      {(selectedAction === 'insert' || showInsertForm) && (
        <div className="form-container">
          <div className="form-header">
            <h3 className="form-title">
              {editingRecord ? 'Update Record' : 'Add New Record'}
            </h3>
            {selectedAction !== 'insert' && (
              <button
                onClick={() => setShowInsertForm(!showInsertForm)}
                className="toggle-form-btn"
                disabled={isLoading}
              >
                {showInsertForm ? '❌ Close Form' : '➕ New Record'}
              </button>
            )}
          </div>
          
          {(showInsertForm || selectedAction === 'insert') && (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Job Name *</label>
                <input
                  type="text"
                  value={formData.jobName}
                  onChange={(e) => handleFormInputChange('jobName', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vendor Name *</label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => handleFormInputChange('vendorName', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">DQ</label>
                <input
                  type="text"
                  value={formData.dq}
                  onChange={(e) => handleFormInputChange('dq', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Transmitted</label>
                <input
                  type="text"
                  value={formData.transmitted}
                  onChange={(e) => handleFormInputChange('transmitted', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Terminal</label>
                <input
                  type="text"
                  value={formData.terminal}
                  onChange={(e) => handleFormInputChange('terminal', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Received Status</label>
                <input
                  type="text"
                  value={formData.receivedStatus}
                  onChange={(e) => handleFormInputChange('receivedStatus', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Not Started</label>
                <input
                  type="text"
                  value={formData.notStarted}
                  onChange={(e) => handleFormInputChange('notStarted', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-actions full-width">
                <button
                  onClick={editingRecord ? handleUpdate : handleInsert}
                  className="form-btn submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (editingRecord ? 'Update Record' : 'Add Record')}
                </button>
                <button
                  onClick={resetForm}
                  className="form-btn cancel-btn"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Table */}
      {!(selectedAction === 'insert' && showInsertForm) && (
        <>
          <div className="table-header">
            <h2 className="table-title">
              {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)} Mode
            </h2>
            <button 
              className="export-btn"
              onClick={handleExport}
              disabled={isLoading}
            >
              📤 EXPORT
            </button>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead className="table-head">
                <tr>
                  <th className="table-th">Job Name</th>
                  <th className="table-th">Vendor Name</th>
                  <th className="table-th">DQ</th>
                  <th className="table-th">Transmitted on $Tra</th>
                  <th className="table-th">Terminal on Time</th>
                  <th className="table-th">Received Status</th>
                  <th className="table-th">Not Start</th>
                  <th className="table-th">Action</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {data.length === 0 ? (
                  <tr>
                    <td colspan="8" style={{ textAlign: 'center', padding: '20px' }}>
                      No data found matching the current filters.
                    </td>
                  </tr>
                ) : (
                  data.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="table-td" title={record.jobName}>
                        {record.jobName}
                      </td>
                      <td className="table-td" title={record.vendorName}>
                        {record.vendorName}
                      </td>
                      <td className="table-td" title={record.dq}>
                        {record.dq}
                      </td>
                      <td className="table-td" title={record.transmitted}>
                        {record.transmitted}
                      </td>
                      <td className="table-td" title={record.terminal}>
                        {record.terminal}
                      </td>
                      <td className="table-td" title={record.receivedStatus}>
                        {record.receivedStatus}
                      </td>
                      <td className="table-td" title={record.notStarted}>
                        {record.notStarted}
                      </td>
                      <td className="table-td">
                        {getActionButton(record)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;