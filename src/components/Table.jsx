import React, { useState, useEffect } from 'react';
import { MultiGrid } from 'react-virtualized';

const Table = ({ data, allData, setData, selectedAction }) => {
  const [showInsertForm, setShowInsertForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(900);

// Add this useEffect to handle container width updates
useEffect(() => {
  const updateWidth = () => {
    setContainerWidth(900); // Match your CSS max-width
  };
  
  updateWidth();
  window.addEventListener('resize', updateWidth);
  return () => window.removeEventListener('resize', updateWidth);
}, []);
  const [formData, setFormData] = useState({
    jobName: '',
    vendorName: '',
    dq: '',
    transmitted: '',
    terminal: '',
    receivedStatus: '',
    notStarted: ''
  });

  // MultiGrid configuration
  const rowHeight = 40;
  const columnWidth = ({ index }) => {
    if (index === 0) return 80; // Serial number column - smaller width
    if (index === columnCount - 1) return 120; // Action column - smaller width
    return 180; // Other columns - standard width
  };
  const columnHeaders = [
    "S.No", "Job Name", "Vendor Name", "DQ", "Transmitted on $Tra", 
    "Terminal on Time", "Received Status", "Not Start", "Action"
  ];
  const columnCount = columnHeaders.length;

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
// Calculate total table width based on columns
const getTotalTableWidth = () => {
  let totalWidth = 0;
  for (let i = 0; i < columnCount; i++) {
    totalWidth += columnWidth({ index: i });
  }
  return totalWidth;
};
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
          return { 
            success: true, 
            id: Date.now(),
            message: 'Record created successfully'
          };
        case 'PUT':
          return { 
            success: true, 
            message: 'Record updated successfully'
          };
        case 'DELETE':
          return { 
            success: true, 
            message: 'Record deleted successfully'
          };
        case 'GET':
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
    const buttonStyle = {
      padding: '4px 8px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      minWidth: '60px'
    };

    switch(selectedAction) {
      case 'view':
        return (
          <button 
            onClick={() => handleSendMail(record)}
            style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
            title="Send Mail"
            disabled={isLoading}
          >
            <input type='checkbox'/>
          </button>
        );
      case 'update':
        return (
          <button 
            onClick={() => handleEdit(record)}
            style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white' }}
            title="Edit"
            disabled={isLoading}
          >
            ✏️ Edit
          </button>
        );
      case 'delete':
        return (
          <button 
            onClick={() => handleDelete(record)}
            style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
            title="Delete"
            disabled={isLoading}
          >
            🗑️ Delete
          </button>
        );
      default:
        return null;
    }
  };

  // MultiGrid cell renderer
  const cellRenderer = ({ columnIndex, rowIndex, key, style }) => {
    const isEvenRow = rowIndex % 2 === 0;
    const cellStyle = {
      ...style,
      padding: "8px",
      boxSizing: "border-box",
      borderBottom: "1px solid #ddd",
      borderRight: "1px solid #ddd",
      background: rowIndex === 0 ? "#f8f9fa" : (isEvenRow ? "#f9f9f9" : "#fff"),
      fontWeight: rowIndex === 0 ? "bold" : "normal",
      display: "flex",
      alignItems: "center",
      fontSize: "13px",
      overflow: "hidden"
    };

    // Header row
    if (rowIndex === 0) {
      return (
        <div key={key} style={cellStyle} title={columnHeaders[columnIndex]}>
          {columnHeaders[columnIndex]}
        </div>
      );
    }

    // Data rows
    const record = data[rowIndex - 1];
    if (!record) {
      return <div key={key} style={cellStyle}></div>;
    }

    let cellContent = '';
    switch (columnIndex) {
      case 0:
        cellContent = rowIndex; // Serial number
        break;
      case 1:
        cellContent = record.jobName;
        break;
      case 2:
        cellContent = record.vendorName;
        break;
      case 3:
        cellContent = record.dq;
        break;
      case 4:
        cellContent = record.transmitted;
        break;
      case 5:
        cellContent = record.terminal;
        break;
      case 6:
        cellContent = record.receivedStatus;
        break;
      case 7:
        cellContent = record.notStarted;
        break;
      case 8:
        return (
          <div key={key} style={{ ...cellStyle, justifyContent: 'center' }}>
            {getActionButton(record)}
          </div>
        );
      default:
        cellContent = '';
    }

    return (
      <div key={key} style={cellStyle} title={cellContent}>
        <span style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%"
        }}>
          {cellContent}
        </span>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px' 
          }}>
            <h3 style={{ margin: 0, color: '#333' }}>
              {editingRecord ? 'Update Record' : 'Add New Record'}
            </h3>
            {selectedAction !== 'insert' && (
              <button
                onClick={() => setShowInsertForm(!showInsertForm)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  cursor: 'pointer'
                }}
                disabled={isLoading}
              >
                {showInsertForm ? '❌ Close Form' : '➕ New Record'}
              </button>
            )}
          </div>
          
          {(showInsertForm || selectedAction === 'insert') && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '15px' 
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Job Name *
                </label>
                <input
                  type="text"
                  value={formData.jobName}
                  onChange={(e) => handleFormInputChange('jobName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Vendor Name *
                </label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => handleFormInputChange('vendorName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  DQ
                </label>
                <input
                  type="text"
                  value={formData.dq}
                  onChange={(e) => handleFormInputChange('dq', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Transmitted
                </label>
                <input
                  type="text"
                  value={formData.transmitted}
                  onChange={(e) => handleFormInputChange('transmitted', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Terminal
                </label>
                <input
                  type="text"
                  value={formData.terminal}
                  onChange={(e) => handleFormInputChange('terminal', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Received Status
                </label>
                <input
                  type="text"
                  value={formData.receivedStatus}
                  onChange={(e) => handleFormInputChange('receivedStatus', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  disabled={isLoading}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Not Started
                </label>
                <input
                  type="text"
                  value={formData.notStarted}
                  onChange={(e) => handleFormInputChange('notStarted', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  disabled={isLoading}
                />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={editingRecord ? handleUpdate : handleInsert}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (editingRecord ? 'Update Record' : 'Add Record')}
                </button>
                <button
                  onClick={resetForm}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #6c757d',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#6c757d',
                    cursor: 'pointer'
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Table with MultiGrid */}
      {!(selectedAction === 'insert' && showInsertForm) && (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px' 
          }}>
            <h2 style={{ margin: 0, color: '#333' }}>
              {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)} Mode
            </h2>
            <button 
              onClick={handleExport}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              disabled={isLoading}
            >
              📤 EXPORT
            </button>
          </div>
          
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            overflow: 'hidden',
            backgroundColor: 'white'
          }}>
            {data.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#666',
                fontSize: '16px'
              }}>
                No data found matching the current filters.
              </div>
            ) : (
             <div className='multi-grid-parent'>
              <MultiGrid
                fixedRowCount={1}
                rowHeight={rowHeight}
                columnWidth={columnWidth}
                rowCount={data.length + 1}
                columnCount={columnCount}
                width={containerWidth}
                height={Math.min(600, (data.length + 1) * rowHeight + 20)}
                cellRenderer={cellRenderer}
                styleTopRightGrid={{ backgroundColor: "#f8f9fa" }}
                style={{ outline: 'none' }}
                overscanRowCount={5}
                overscanColumnCount={2}
                enableFixedColumnScroll={true}
                enableFixedRowScroll={true}
                hideTopRightGridScrollbar={true}
                hideBottomLeftGridScrollbar={true}
              />
          </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Table;