import React from "react";

const QuickActions = ({ actions }) => {
  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <button key={index} onClick={action.onClick}>
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
