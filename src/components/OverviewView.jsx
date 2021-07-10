import React, {useContext, useMemo} from "react";
import { useTable } from "react-table"
import { createGuid, createHash } from "./utils/guid.js";
import { store } from "../store.js";
import Moment from "moment";
import {
    useHistory ,
  } from "react-router-dom";

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
                const nextId = i >= files.length -1 ? null : await createHash(files[i+1].path);
                const prevId = i <= 0 ? null : await createHash(files[i-1].path);
                data[guid] = {
                    id: guid,
                    path: files[i].path, 
                    date: files[i].date,
                    nextId,
                    prevId 
                };
            }
            console.log(data);
            dispatch({ type: "ImagesChangeAction", data });
        })
    }
    const columns = useMemo(

        () => [
          {Header: "Date", accessor: row => Moment(row.date).local().format("YYYY-MM-DD HH:mm:ss")},
          {Header: "Path", accessor: "path"},
          {Header: "Id", accessor: "id"},
        ],
     
        []
    )
    console.log(state.images);
    const tableInstance = useTable({ columns, data: Object.values(state.images) })
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = tableInstance

    function onRowClick(row) {
        history.push("/image/" + row.values.id);
    }

    return (
        <div>
            <h2>Overview</h2>
            <button onClick={() => readFolder()}>test</button>
            <table {...getTableProps()}>
                <thead>
                {
                headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {
                    headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>
                        {
                        column.render("Header")}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {
                rows.map(row => {
                    prepareRow(row)
                    return (
                    <tr {...row.getRowProps()} onClick={props=>onRowClick(row)}>
                        {
                        row.cells.map(cell => {
                        return (
                            <td {...cell.getCellProps()}>
                            {
                            cell.render("Cell")}
                            </td>
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