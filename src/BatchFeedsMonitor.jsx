import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Mail, Plus, X, Check } from 'lucide-react';

const BatchFeedsMonitor = () => {
  const [selectedAction, setSelectedAction] = useState('view');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');
  const [selectedApplication, setSelectedApplication] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [showInsertForm, setShowInsertForm] = useState(false);

  // Handle action change - exit edit mode when changing actions
  const handleActionChange = (action) => {
    setSelectedAction(action);
    setEditingRow(null); // Exit edit mode when changing actions
    if (action === 'insert') {
      setShowInsertForm(true); // Auto-open form when insert is selected
    } else {
      setShowInsertForm(false); // Close form for other actions
    }
  };
  const [data, setData] = useState([
    {
      id: 1,
      jobName: 'JPMA_DrpBRM_5363_PP_AZ_BA_BRA_XREF_ACCT_LBS_raw_4_multi_20220127.txt',
      vendorName: 'A.L O\'Boer and Associates LLC (RJO)',
      dq: '',
      transmitted: 'E2500',
      terminal: '2:26:50 AM',
      receivedStatus: 'Not Received',
      notStarted: 'Not Start'
    },
    {
      id: 2,
      jobName: 'JPMA_DrpBRM_5363_PP_AZ_BA_BRA_XREF_ACCT_LBS_raw_4_multi_marked_20220128.csv',
      vendorName: 'A.L O\'Boer and Associates LLC (RJO)',
      dq: '',
      transmitted: '2:5500',
      terminal: '2:26:50 AM',
      receivedStatus: 'Not Received',
      notStarted: 'Not Start'
    },
    {
      id: 3,
      jobName: 'JPMA_DrpBRM_5363_DQ_ADDRESS_I',
      vendorName: 'e_data5',
      dq: 'SolLm (SMS)',
      transmitted: '5:5200',
      terminal: '4:30:30 AM',
      receivedStatus: 'Not Received',
      notStarted: 'Not Start'
    },
    {
      id: 4,
      jobName: 'JPMA_DrpBRM_5363_PP_AZ_FP_ADHOC_APP_ST_CARR_CMPS_20220127.txt',
      vendorName: 'SolLm (SMS)',
      dq: '',
      transmitted: '4:5500',
      terminal: '5:30:30 AM',
      receivedStatus: 'Not Received',
      notStarted: 'Not Start'
    },
    {
      id: 5,
      jobName: 'JPMA_DrpBRM_5363_DQ_FINANCIAL_INSTRUMENT',
      vendorName: 'e_data_codes_20220128.txt',
      dq: 'SolLm (SMS)',
      transmitted: '7:5200',
      terminal: '8:30:30 AM',
      receivedStatus: 'Not Received',
      notStarted: 'Not Start'
    }
  ]);

  const [newRecord, setNewRecord] = useState({
    jobName: '',
    vendorName: '',
    dq: '',
    transmitted: '',
    terminal: '',
    receivedStatus: '',
    notStarted: ''
  });

  const streams = ['Stream 1', 'Stream 2', 'Stream 3'];
  const clusters = ['Cluster A', 'Cluster B', 'Cluster C'];
  const applications = ['Application 1', 'Application 2', 'Application 3'];

  const filteredData = data.filter(item => {
    return (
      (!selectedStream || item.vendorName.includes(selectedStream)) &&
      (!selectedCluster || item.dq.includes(selectedCluster)) &&
      (!selectedApplication || item.jobName.includes(selectedApplication))
    );
  });

  const handleEdit = (id) => {
    setEditingRow(id);
  };

  const handleSave = (id, updatedData) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
    setEditingRow(null);
  };

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const handleInsert = () => {
    const newId = Math.max(...data.map(item => item.id)) + 1;
    setData(prev => [...prev, { id: newId, ...newRecord }]);
    setNewRecord({
      jobName: '',
      vendorName: '',
      dq: '',
      transmitted: '',
      terminal: '',
      receivedStatus: '',
      notStarted: ''
    });
    setShowInsertForm(false);
  };

  const handleSendMail = (record) => {
    alert(`Sending mail for: ${record.jobName}`);
  };

  const ActionButton = ({ action, record }) => {
    switch(action) {
      case 'view':
        return (
          <button 
            onClick={() => handleSendMail(record)}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            title="Send Mail"
          >
            <Mail size={16} />
          </button>
        );
      case 'update':
        return (
          <button 
            onClick={() => handleEdit(record.id)}
            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
        );
      case 'delete':
        return (
          <button 
            onClick={() => handleDelete(record.id)}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        );
      default:
        return null;
    }
  };

  const EditableCell = ({ value, onSave, fieldName }) => {
    const [editValue, setEditValue] = useState(value);

    return (
      <div className="flex items-center gap-2 min-w-0 w-full">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 min-w-0 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={() => onSave({ [fieldName]: editValue })}
          className="p-1 bg-green-500 hover:bg-green-600 text-white rounded flex-shrink-0"
        >
          <Check size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UBS</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Batch Feeds monitor</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">meri.shraddha@ubs.com</span>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-48 space-y-2">
            {['view', 'insert', 'update', 'delete'].map((action) => (
              <button
                key={action}
                onClick={() => handleActionChange(action)}
                className={`w-full text-left px-4 py-2 rounded capitalize transition-colors ${
                  selectedAction === action
                    ? action === 'delete' 
                      ? 'bg-red-100 text-red-700 border-l-4 border-red-500'
                      : 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stream</label>
                  <select
                    value={selectedStream}
                    onChange={(e) => setSelectedStream(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="">Stream</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cluster</label>
                  <select
                    value={selectedCluster}
                    onChange={(e) => setSelectedCluster(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="">Cluster</option>
                    {clusters.map(cluster => (
                      <option key={cluster} value={cluster}>{cluster}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application</label>
                  <select
                    value={selectedApplication}
                    onChange={(e) => setSelectedApplication(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="">Application</option>
                    {applications.map(app => (
                      <option key={app} value={app}>{app}</option>
                    ))}
                  </select>
                </div>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md transition-colors flex items-center justify-center">
                  <Search size={16} className="mr-2" />
                  SEARCH
                </button>
              </div>
            </div>

            {/* Insert Form */}
            {selectedAction === 'insert' && (
              <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add New Record</h3>
                  <button
                    onClick={() => setShowInsertForm(!showInsertForm)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    {showInsertForm ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                    {showInsertForm ? 'Close Form' : 'New Record'}
                  </button>
                </div>
                
                {showInsertForm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Name</label>
                      <input
                        type="text"
                        value={newRecord.jobName}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, jobName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                      <input
                        type="text"
                        value={newRecord.vendorName}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, vendorName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DQ</label>
                      <input
                        type="text"
                        value={newRecord.dq}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, dq: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transmitted</label>
                      <input
                        type="text"
                        value={newRecord.transmitted}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, transmitted: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Terminal</label>
                      <input
                        type="text"
                        value={newRecord.terminal}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, terminal: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Received Status</label>
                      <input
                        type="text"
                        value={newRecord.receivedStatus}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, receivedStatus: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Not Started</label>
                      <input
                        type="text"
                        value={newRecord.notStarted}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, notStarted: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-4 pt-4">
                      <button
                        onClick={handleInsert}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
                      >
                        Add Record
                      </button>
                      <button
                        onClick={() => setShowInsertForm(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Data Table - Hidden when insert form is open */}
            {!(selectedAction === 'insert' && showInsertForm) && (
            <>
              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-900">
                  {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)} Mode
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  📤 EXPORT
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-yellow-300">
                    <tr>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 w-1/5">Job Name</th>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 w-1/6">Vendor Name</th>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 w-1/8">DQ</th>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 w-1/8">Transmitted on $Tra</th>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 w-1/8">Terminal on Time</th>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 w-1/8">Received Status</th>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 w-1/8">Not Start</th>
                      <th className="px-2 py-3 text-left text-sm font-medium text-gray-900 w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((record, index) => (
                      <tr 
                        key={record.id} 
                        className={`hover:bg-gray-50 ${editingRow === record.id ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-2 py-3 text-sm max-w-xs">
                          {editingRow === record.id ? (
                            <EditableCell 
                              value={record.jobName} 
                              onSave={(data) => handleSave(record.id, data)}
                              fieldName="jobName"
                            />
                          ) : (
                            <div className="break-words overflow-hidden">{record.jobName}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm max-w-xs">
                          {editingRow === record.id ? (
                            <EditableCell 
                              value={record.vendorName} 
                              onSave={(data) => handleSave(record.id, data)}
                              fieldName="vendorName"
                            />
                          ) : (
                            <div className="break-words overflow-hidden">{record.vendorName}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm max-w-xs">
                          {editingRow === record.id ? (
                            <EditableCell 
                              value={record.dq} 
                              onSave={(data) => handleSave(record.id, data)}
                              fieldName="dq"
                            />
                          ) : (
                            <div className="break-words overflow-hidden">{record.dq}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm max-w-xs">
                          {editingRow === record.id ? (
                            <EditableCell 
                              value={record.transmitted} 
                              onSave={(data) => handleSave(record.id, data)}
                              fieldName="transmitted"
                            />
                          ) : (
                            <div className="break-words overflow-hidden">{record.transmitted}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm max-w-xs">
                          {editingRow === record.id ? (
                            <EditableCell 
                              value={record.terminal} 
                              onSave={(data) => handleSave(record.id, data)}
                              fieldName="terminal"
                            />
                          ) : (
                            <div className="break-words overflow-hidden">{record.terminal}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm max-w-xs">
                          {editingRow === record.id ? (
                            <EditableCell 
                              value={record.receivedStatus} 
                              onSave={(data) => handleSave(record.id, data)}
                              fieldName="receivedStatus"
                            />
                          ) : (
                            <div className="break-words overflow-hidden">{record.receivedStatus}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm max-w-xs">
                          {editingRow === record.id ? (
                            <EditableCell 
                              value={record.notStarted} 
                              onSave={(data) => handleSave(record.id, data)}
                              fieldName="notStarted"
                            />
                          ) : (
                            <div className="break-words overflow-hidden">{record.notStarted}</div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-sm">
                          <ActionButton action={selectedAction} record={record} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
            
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchFeedsMonitor;