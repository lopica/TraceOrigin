import React from 'react';
import PropTypes from 'prop-types';

function Pagination({ active, totalPages, onPageChange }) {
  const getItemClassName = (index) => {
    return index === active ? 'join-item btn btn-active' : 'join-item btn';
  };

  return (
    <div className="join">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={getItemClassName(index)}
          onClick={() => onPageChange(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

Pagination.propTypes = {
  active: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
