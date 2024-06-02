import * as dayjs from 'dayjs';
import PropTypes from "prop-types";
import React from "react";

export default function TableView({onRowClick, tableInstance}) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
    } = tableInstance

    return (
        <table {...getTableProps()} className="overview-table">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                <span {...column.getSortByToggleProps()}>{column.render("Header")}
                                {column.isSorted
                                    ? column.isSortedDesc
                                        ? ' 🔽 '
                                        : ' 🔼 '
                                    : ''}
                                </span>
                                <div {...column.getResizerProps()} className={`resizer ${
                                        column.isResizing ? 'isResizing' : ''
                                    }`}
                                    >
                                </div>
                                
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {page.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()} onClick={props => onRowClick(row)} className={(row.original.fromDate !== undefined ? "measure-row": null)}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}

TableView.propTypes = {
    onRowClick: PropTypes.func.isRequired,
    tableInstance: PropTypes.object.isRequired,
};

TableView.columnConfig = [
    {
        Header: "Date", width: 180, minWidth: 180, accessor: row => {
            const d = row.date || row.fromDate;
            const t = dayjs.unix(d).format("YYYY-MM-DD HH:mm:ss");
            return t;
        }
    },
    { Header: "O/G", accessor: row => row.values?.og ? row.values.og.toFixed(3) : undefined, width: 60},
    { Header: "O/W", accessor: row => row.values?.ow ? row.values.ow.toFixed(3): undefined, width: 60},
    {
        Header: "Limits", accessor: row => {
            if (!row.fromDate) {
                return "";
            }
            return `Min: ${row.minValue} Max: ${row.maxValue}`;
        }
    },
    {
        Header: "Shape", accessor: row => {
            if (!row.fromDate) {
                return "";
            }
            return `W: ${row.offsetWidth.toFixed(2)} H: ${row.offsetHeight.toFixed(2)} X: ${row.x.toFixed(2)} Y: ${row.y.toFixed(2)} R: ${(row.rotation || 0).toFixed(2)}`;
        },
    },
    { Header: "Path", accessor: "path", width: 80},
    { Header: "Id", accessor: "id", width: 50}
];
