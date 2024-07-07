import React from 'react';
import PropTypes from 'prop-types';

function Pagination({ active, totalPages, onPageChange }) {
  const getItemClassName = (index) => {
    return index === active ? 'join-item btn btn-active' : 'join-item btn';
  };

  const renderPaginationButtons = () => {
    let buttons = [];
    const delta = 2; // Number of buttons to show around the current page

    // Add "Previous" arrow button
    if (active > 0) {
      buttons.push(
        <button
          key="prev"
          className="join-item btn"
          onClick={() => onPageChange(active - 1)}
        >
          &lt;
        </button>
      );
    }

    // Always show the first page and the last page
    buttons.push(
      <button
        key={0}
        className={getItemClassName(0)}
        onClick={() => onPageChange(0)}
      >
        1
      </button>
    );

    if (active > delta + 1) {
      buttons.push(
        <button key="start-ellipsis" className="join-item btn btn-disabled">
          ...
        </button>
      );
    }

    // Show buttons around the current page
    for (let i = Math.max(active - delta, 1); i <= Math.min(active + delta, totalPages - 2); i++) {
      buttons.push(
        <button
          key={i}
          className={getItemClassName(i)}
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </button>
      );
    }

    if (active < totalPages - delta - 2) {
      buttons.push(
        <button key="end-ellipsis" className="join-item btn btn-disabled">
          ...
        </button>
      );
    }

    // Always show the last page if there are more than one page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages - 1}
          className={getItemClassName(totalPages - 1)}
          onClick={() => onPageChange(totalPages - 1)}
        >
          {totalPages}
        </button>
      );
    }

    // Add "Next" arrow button
    if (active < totalPages - 1) {
      buttons.push(
        <button
          key="next"
          className="join-item btn"
          onClick={() => onPageChange(active + 1)}
        >
          &gt;
        </button>
      );
    }

    return buttons;
  };

  return <div className="join">{renderPaginationButtons()}</div>;
}

Pagination.propTypes = {
  active: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
