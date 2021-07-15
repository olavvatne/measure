import React, { useContext, useMemo } from "react";
import { useTable, useSortBy, useFlexLayout, useResizeColumns, useBlockLayout, useAbsoluteLayout } from "react-table"
import { createGuid, createHash } from "./utils/guid.js";
import { store } from "../store.js";
import Moment from "moment";
import { useHistory } from "react-router-dom";
import "./OverviewView.css";

export default function OverviewView() {
    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    let history = useHistory();
    function readFolder() {
        window.openDialog().then(async files => {
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
                    nextId,
                    prevId
                };
            }
            dispatch({ type: "ImagesChangeAction", data });
        })
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
            { Header: "O/G", accessor: "ogValue", width: 50},
            { Header: "O/W", accessor: "owValue", width: 50},
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
                    return `W: ${row.offsetWidth.toFixed(2)} H: ${row.offsetHeight.toFixed(2)} X: ${row.x.toFixed(2)} Y: ${row.y.toFixed(2)}`;
                },
            },
            { Header: "Path", accessor: "path", width: 80},
            { Header: "Id", accessor: "id", width: 50}
        ],
        []
    )

    const data = React.useMemo(() => {
        const og = Object.values(state.historicMeasurer.og);
        const ow = Object.values(state.historicMeasurer.ow);
        og.map((m) => {
            m.id = "og";
            return m;
        });
        ow.map((m) => {
            m.id = "ow";
            return m;
        })

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
        useResizeColumns
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    function onRowClick(row) {
        if (!row.values.path) {
            return;
        }
        history.push("/image/" + row.values.id);
    }

    return (
        <div>
            <h2>Overview</h2>
            <button onClick={() => readFolder()}>test</button>
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
                    {rows.map(row => {
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
        </div>
    );
}