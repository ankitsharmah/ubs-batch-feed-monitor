import React from 'react';

const Filters = ({
  selectedStream,
  selectedCluster,
  selectedApplication,
  streams,
  clusters,
  applications,
  onFilterChange
}) => {
  const handleSearch = () => {
    // Search functionality - can be enhanced based on requirements
    console.log('Search triggered with filters:', {
      stream: selectedStream,
      cluster: selectedCluster,
      application: selectedApplication
    });
  };

  return (
    <div className="filters-container">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Stream</label>
          <select
            value={selectedStream}
            onChange={(e) => onFilterChange('stream', e.target.value)}
            className="filter-select"
          >
            <option value="">Stream</option>
            {streams.map(stream => (
              <option key={stream} value={stream}>{stream}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Cluster</label>
          <select
            value={selectedCluster}
            onChange={(e) => onFilterChange('cluster', e.target.value)}
            className="filter-select"
          >
            <option value="">Cluster</option>
            {clusters.map(cluster => (
              <option key={cluster} value={cluster}>{cluster}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Application</label>
          <select
            value={selectedApplication}
            onChange={(e) => onFilterChange('application', e.target.value)}
            className="filter-select"
          >
            <option value="">Application</option>
            {applications.map(app => (
              <option key={app} value={app}>{app}</option>
            ))}
          </select>
        </div>
        <button className="search-btn" onClick={handleSearch}>
          🔍 SEARCH
        </button>
      </div>
    </div>
  );
};

export default Filters;