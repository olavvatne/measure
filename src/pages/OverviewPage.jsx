import { DownloadIcon, ImageIcon, MoonIcon, PaperAirplaneIcon, SunIcon, UploadIcon } from '@primer/octicons-react';
import * as dayjs from 'dayjs';
import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlockLayout, usePagination, useResizeColumns, useSortBy, useTable } from "react-table";
import TableControls from "../components/TableControls.jsx";
import TableView from "../components/TableView.jsx";
import { hydrateState, persistState } from "../persist.js";
import { store } from "../store.js";
import { exportToCsv, matchAndExportToCsv } from "../utils/csv-exporter";
import { isDarkTheme, setTheme } from "../utils/dark-mode";
import { createHash } from "../utils/guid.js";
import { isElectron } from "../utils/platform-util";
import "./OverviewPage.css";

const imageTooltip = "Open folder containing images";
const exportTooltip = "Export data options";
const saveTooltip = "Save current project to file";
const loadTooltip = "Load exisiting project";
const darkModeTooltip = "Toggle between dark and light theme";


export default function OverviewPage() {
    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    const [isLoading, setLoading ] =  useState(false);
    const [isDarkMode, setIsDarkMode ] =  useState(isDarkTheme());

    // Only edge and chrome support the file access api
    const isFileAccessSupport = !!window.showSaveFilePicker || isElectron();

    let navigate = useNavigate();

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
        navigate("/image/" + row.values.id);
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
                <button title={imageTooltip} onClick={() => readFolder()}><ImageIcon size={16} /></button>
                <button title={darkModeTooltip} onClick={toggleDarkMode}>{isDarkMode ? <MoonIcon size={16} /> : <SunIcon size={16} />}</button>
                <button title={exportTooltip} onClick={toggleDropdown} disabled={!Object.keys(state.images).length > 0}><PaperAirplaneIcon size={16} /></button>
                <div id="export-dropdown" className="dropdown-content">
                    <a onClick={() => exportToCsv(state.images)}>Export to csv</a>
                    <a onClick={() => matchAndExportToCsv(state.images)}>Match and export to csv</a>
                </div>
                <button title={saveTooltip} onClick={() => window.fileApi.storeJson(persistState(state))}><DownloadIcon size={16} /></button>
                <button title={loadTooltip} onClick={onLoadAppData}><UploadIcon size={16} /></button>
                {isFileAccessSupport ? null : <span style={{color: "red"}}>Measure only works in Chrome or Edge</span>}
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
