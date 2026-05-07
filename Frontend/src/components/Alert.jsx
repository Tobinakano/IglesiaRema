import React from "react";
import "../styles/alerts.css";

function Alert({ type = "info", title, message, onClose, autoClose = true }) {
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-header">
        <span className="alert-title">{title}</span>
        <button className="alert-close" onClick={onClose}>×</button>
      </div>
      <div className="alert-body">
        <p className="alert-message">{message}</p>
      </div>
    </div>
  );
}

export default Alert;
