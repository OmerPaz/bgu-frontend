import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onChangePage }: PaginationProps) {
  const getPageNumbers = (): number[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage < 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= 3 && currentPage <= totalPages - 2) {
      return [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ].filter(page => page >= 1 && page <= totalPages);
    }

    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onChangePage(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div>
      {/* Navigation Buttons */}
      <button name="first" onClick={() => handlePageClick(1)} disabled={currentPage === 1}>
        First
      </button>

      <button
        name="previous"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Page Number Buttons */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          name={`page-${num}`}
          onClick={() => handlePageClick(num)}
          disabled={num === currentPage}
          style={{ fontWeight: num === currentPage ? 'bold' as const : 'normal' }}
        >
          {num}
        </button>
      ))}

      <button
        name="next"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      <button
        name="last"
        onClick={() => handlePageClick(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
}

export default Pagination;