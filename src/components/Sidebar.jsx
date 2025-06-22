import React from 'react';

const Sidebar = ({ selectedAction, onActionChange }) => {
  const actions = [
    { key: 'view', label: 'View' },
    { key: 'insert', label: 'Insert' },
    { key: 'update', label: 'Update' },
    { key: 'delete', label: 'Delete' }
  ];

  return (
    <div className="sidebar">
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={() => onActionChange(action.key)}
          className={`sidebar-btn ${selectedAction === action.key ? 'active' : ''} ${
            action.key === 'delete' ? 'delete' : ''
          }`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;