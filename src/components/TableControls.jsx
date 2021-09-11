import React from "react";
import PropTypes from "prop-types";

export default function TableControls({onTableChange, tableInstance}) {

    const {
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        page,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize}
    } = tableInstance;

    function UpdateAndGoToPage(page) {
        onTableChange({pageIndex: page});
        gotoPage(page)
    }

    function UpdateAndGoNext() {
        onTableChange({pageIndex: pageIndex + 1});
        nextPage()
    }

    function UpdateAndGoPrevious() {
        onTableChange({pageIndex: pageIndex - 1 });
        previousPage()
    }

    return (
        <div className="table-pagination">
            <button onClick={() => UpdateAndGoToPage(0)} disabled={!canPreviousPage}>
            {'<<'}
            </button>{' '}
            <button  onClick={UpdateAndGoPrevious} disabled={!canPreviousPage}>
            {'<'}
            </button>{' '}
            <button onClick={UpdateAndGoNext} disabled={!canNextPage}>
            {'>'}
            </button>{' '}
            <button onClick={() => UpdateAndGoToPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
            </button>
            <span>
            Page{' '}
            <strong>
                {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
            </span>
            <select
                value={pageSize}
                onChange={e => {
                    const newPageSize = Number(e.target.value);
                    onTableChange({pageSize:newPageSize, pageIndex:  Math.floor(page[0].index / newPageSize)});
                    setPageSize(newPageSize)
                }}
                >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                    </option>
                ))}
            </select>
        </div>
    );
}

TableControls.propTypes = {
    onTableChange: PropTypes.func.isRequired,
    tableInstance: PropTypes.object.isRequired,
};