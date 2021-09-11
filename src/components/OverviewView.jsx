import React, { useContext, useMemo, useState } from "react";
import { useTable, useSortBy, useResizeColumns, useBlockLayout, useAbsoluteLayout, usePagination } from "react-table"
import { createGuid, createHash } from "./utils/guid.js";
import { store } from "../store.js";
import Moment from "moment";
import { useHistory } from "react-router-dom";
import "./OverviewView.css";
import {exportToCsv, matchAndExportToCsv} from "./utils/csv-exporter";
import TableControls from "./TableControls.jsx";
import TableView from "./TableView.jsx";

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

    const columns = useMemo(

        () => TableView.columnConfig,
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
                pageIndex: state.table.pageIndex,
                pageSize: state.table.pageSize,
                sortBy: [
                    {
                        id: 'Date',
                        desc: false
                    }
                ]
            },
        },
        useSortBy,
        useBlockLayout,
        useResizeColumns,
        usePagination
    );

    function onRowClick(row) {
        if (!row.values.path) {
            return;
        }
        history.push("/image/" + row.values.id);
    }

    return (
        <div>
            <div style={{padding: "5px"}}>
                <button onClick={() => readFolder()}>Import images</button>
                <button onClick={() => window.darkMode.toggle()}>Toggle</button>
                <button onClick={() => exportToCsv(state.images)} disabled={!Object.keys(state.images).length > 0}>Export data to CSV</button>
                <label htmlFor="csv-timestamps">Import timestamps</label>
                <input id="csv-timestamps" style={{display: "inline"}}type="file" name="file" onChange={e => matchAndExportToCsv(e.target.files[0], state.images)} />
                {/* <button className={buttonStyle} onClick={() => exportWithTimestampsToCsv()} disabled={!Object.keys(state.images).length > 0}>Matcht timestamps to CSV</button> */}
            </div>
            { isLoading ? <div className="center-spinner loader"></div> : null }
            { data.length > 0 ? 
            <TableView tableInstance={tableInstance} onRowClick={onRowClick} />
            : null}
            {data.length > 0 ? 
                <TableControls tableInstance={tableInstance} onTableChange={data => dispatch({ type: "TableChangeAction", data })} />
            : null}
        </div>
    );
}