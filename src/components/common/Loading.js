import React from 'react';
import './Loading.css';

const Loading = ({ fullScreen = false, size = 'medium', text = '' }) => {
  const content = (
    <div className="loading-container">
      <div className={`loading-spinner loading-${size}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loading-fullscreen">{content}</div>;
  }

  return content;
};

export default Loading;
