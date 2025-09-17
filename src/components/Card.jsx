import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;