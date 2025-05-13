
import React from 'react';

const NoActiveSessionMessage = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">No Active Academic Session</h1>
        <p className="text-muted-foreground mb-4">To manage grades and sections, an active academic session is required.</p>
        <p className="text-muted-foreground">Please set an active academic session in the Academic Sessions page.</p>
      </div>
    </div>
  );
};

export default NoActiveSessionMessage;
