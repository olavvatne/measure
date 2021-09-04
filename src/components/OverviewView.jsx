import React, { useContext, useMemo, useState } from "react";
import { useTable, useSortBy, useResizeColumns, useBlockLayout, useAbsoluteLayout, usePagination } from "react-table"
import { createGuid, createHash } from "./utils/guid.js";
import { store } from "../store.js";
import Moment from "moment";
import { useHistory } from "react-router-dom";
import "./OverviewView.css";

export default function OverviewView() {
    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    const [isLoading, setLoading ] =  useState(false);

    let history = useHistory();

    function readFolder() {
        setLoading(true);
        window.fileApi.openDialog().then(async files => {
            var data = {};
            console.log(files);
            for (let i = 0; i < files.length; i++) {
                const guid = await createHash(files[i].path);
                const nextId = i >= files.length - 1 ? null : await createHash(files[i + 1].path);
                const prevId = i <= 0 ? null : await createHash(files[i - 1].path);
                data[guid] = {
                    id: guid,
                    path: files[i].path,
                    date: Moment(files[i].date).unix(),
                    values: {},
                    nextId,
                    prevId
                };
            }
            setLoading(false);
            dispatch({ type: "ImagesChangeAction", data });
        }).catch(() => {
            setLoading(false);
        })
    }

    function exportToCsv() {
        const data = Object.values(state.images).sort((a, b) => a.date < b.date);
        let csv = "Date,Time,Unix,OG,OW\n";
        for (let i = 0; i < data.length; i++) {
            if (data[i].values.og || data[i].values.ow) {
                var m = Moment.unix(data[i].date);
                csv += `${m.format("MM/DD/YY")},${m.format("HH:mm:ss")},${data[i].date},${data[i].values.og || ""},${data[i].values.ow || ""}\n`;
            }
        }
        var exportedFilename = createGuid() + ".csv";

        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a')
        if (link.download !== undefined) {
          var url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', exportedFilename)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
    }

    const columns = useMemo(

        () => [
            {
                Header: "Date", width: 180, minWidth: 180, accessor: row => {
                    const d = row.date || row.fromDate;
                    const t = Moment.unix(d).format("YYYY-MM-DD HH:mm:ss");
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
        ],
        []
    )

    const data = React.useMemo(() => {
        let og = Object.values(state.historicMeasurer.og);
        let ow = Object.values(state.historicMeasurer.ow);
        og = og.filter(m => m.fromDate > 0).map((m) => {
            m.id = "og";
            return m;
        });
        ow = ow.filter(m => m.fromDate > 0).map((m) => {
            m.id = "ow";
            return m;
        })
        console.log(og);
        return [...og, ...ow, ...Object.values(state.images)]; 
    }, [state.images]);

    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: {
                sortBy: [
                    {
                        id: 'Date',
                        desc: false
                    }
                ]
            }
        },
        useSortBy,
        useBlockLayout,
        useResizeColumns,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        // rows,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize}
    } = tableInstance

    function onRowClick(row) {
        if (!row.values.path) {
            return;
        }
        history.push("/image/" + row.values.id);
    }
    const buttonStyle = ""
    return (
        <div>
            <button className={buttonStyle} onClick={() => readFolder()}>Import images</button>
            <button className={buttonStyle} onClick={() => window.darkMode.toggle()}>Toggle</button>
            <button className={buttonStyle} onClick={() => exportToCsv()} disabled={!Object.keys(state.images).length > 0}>Export CSV</button>
            { isLoading ? <div className="center-spinner loader"></div> : null }
            { data.length > 0 ? 
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
        : null}
        {data.length > 0 ? <div className="table-pagination">
            <button className={buttonStyle} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
            </button>{' '}
            <button className={buttonStyle} onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
            </button>{' '}
            <button className={buttonStyle} onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
            </button>{' '}
            <button className={buttonStyle} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
            </button>
            <span>
            Page{' '}
            <strong>
                {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
            </span>
            <select className={buttonStyle}
                value={pageSize}
                onChange={e => {
                    setPageSize(Number(e.target.value))
                }}
                >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                    </option>
                ))}
            </select>
        </div> : null}
        </div>
    );
}