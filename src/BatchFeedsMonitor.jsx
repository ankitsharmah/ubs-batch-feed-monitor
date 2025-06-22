import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Filters from './components/Filters';
import Table from './components/Table';
import './styles.css';

const BatchFeedsMonitor = () => {
  const [selectedAction, setSelectedAction] = useState('view');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');
  const [selectedApplication, setSelectedApplication] = useState('');

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

  const streams = ['Stream 1', 'Stream 2', 'Stream 3', 'stream 4'];
  const clusters = ['Cluster A', 'Cluster B', 'Cluster C'];
  const applications = ['Application 1', 'Application 2', 'Application 3'];

  const filteredData = data.filter(item => {
    return (
      (!selectedStream || item.vendorName.includes(selectedStream)) &&
      (!selectedCluster || item.dq.includes(selectedCluster)) &&
      (!selectedApplication || item.jobName.includes(selectedApplication))
    );
  });

  const handleActionChange = (action) => {
    setSelectedAction(action);
  };

  const handleFilterChange = (filterType, value) => {
    switch(filterType) {
      case 'stream':
        setSelectedStream(value);
        break;
      case 'cluster':
        setSelectedCluster(value);
        break;
      case 'application':
        setSelectedApplication(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo">
              <span className="logo-text">UBS</span>
            </div>
            <h1 className="app-title">Batch Feeds monitor</h1>
          </div>
          <div className="header-right">
            <span className="user-email">ankit@ubs.com</span>
            <div className="user-avatar"></div>
          </div>
        </div>
      </div>

      <div className="main-container">
        <div className="content-wrapper">
          {/* Sidebar */}
          <Sidebar 
            selectedAction={selectedAction} 
            onActionChange={handleActionChange} 
          />

          {/* Main Content */}
          <div className="main-content">
            {/* Filters */}
            <Filters
              selectedStream={selectedStream}
              selectedCluster={selectedCluster}
              selectedApplication={selectedApplication}
              streams={streams}
              clusters={clusters}
              applications={applications}
              onFilterChange={handleFilterChange}
            />

            {/* Table */}
            <Table
              data={filteredData}
              allData={data}
              setData={setData}
              selectedAction={selectedAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchFeedsMonitor;