import React from "react";

const Notification = ({ message, severity }) => {
  if (message == null) {
    return null;
  }
  return <div className={severity}>{message}</div>;
};

export default Notification;
