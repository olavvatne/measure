import React, { useContext, useMemo, useState } from "react";
import { useTable, useSortBy, useResizeColumns, useBlockLayout, useAbsoluteLayout, usePagination } from "react-table"
import {SunIcon, MoonIcon, ImageIcon, UploadIcon, DownloadIcon, PaperAirplaneIcon} from '@primer/octicons-react'
import { createHash } from "../utils/guid.js";
import { isElectron } from "../utils/platform-util";
import { store } from "../store.js";
import * as dayjs from 'dayjs'
import { useHistory } from "react-router-dom";
import "./OverviewView.css";
import {exportToCsv, matchAndExportToCsv} from "../utils/csv-exporter";
import {isDarkTheme, setTheme} from "../utils/dark-mode";
import TableControls from "./TableControls.jsx";
import TableView from "./TableView.jsx";
import {persistState, hydrateState} from "../persist.js";

export default function OverviewView() {
    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    const [isLoading, setLoading ] =  useState(false);
    const [isDarkMode, setIsDarkMode ] =  useState(isDarkTheme());

    let history = useHistory();

    async function readFolder() {
        setLoading(true);
        window.imageApi.openDialog().then(async files => {
            var data = {};
            console.log(files);
            for (let i = 0; i < files.length; i++) {
                const guid = await createHash(files[i].path);
                const nextId = i >= files.length - 1 ? null : await createHash(files[i + 1].path);
                const prevId = i <= 0 ? null : await createHash(files[i - 1].path);
                data[guid] = {
                    id: guid,
                    path: files[i].path,
                    date: dayjs(files[i].date).unix(),
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

    async function onLoadAppData() {
        const jsonData = await window.fileApi.loadJson();
        const data = hydrateState(jsonData);
        dispatch({ type: "HydrateAction", data });
    }

    async function toggleDarkMode() {
        let isDark = false;
        if (isElectron()) {
            isDark = await window.darkMode.toggle();
        }
        else {
            isDark = isDarkTheme();
        }
        setTheme(!isDark);
        setIsDarkMode(isDark);
    }

    function toggleDropdown() {
        document.getElementById("export-dropdown").classList.toggle("show");
    }
    return (
        <div>
            <div style={{padding: "5px"}}>
                <button onClick={() => readFolder()}><ImageIcon size={16} /></button>
                <button onClick={toggleDarkMode}>{isDarkMode ? <MoonIcon size={16} /> : <SunIcon size={16} />}</button>
                <button onClick={toggleDropdown} disabled={!Object.keys(state.images).length > 0}><PaperAirplaneIcon size={16} /></button>
                <div id="export-dropdown" className="dropdown-content">
                    <a onClick={() => exportToCsv(state.images)}>Export to csv</a>
                    <a onClick={() => matchAndExportToCsv(state.images)}>Match and export to csv</a>
                </div>
                <button onClick={() => window.fileApi.storeJson(persistState(state))}><DownloadIcon size={16} /></button>
                <button onClick={onLoadAppData}><UploadIcon size={16} /></button>
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