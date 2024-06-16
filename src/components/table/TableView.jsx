import PropTypes from "prop-types";
import React from "react";
import { flexRender } from "@tanstack/react-table";
import "./TableView.css";

export default function TableView({ onRowClick, table }) {
  return (
    <table className="overview-table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                {...{
                  key: header.id,
                  colSpan: header.colSpan,
                  style: {
                    width: header.getSize(),
                  },
                }}
              >
                <div
                  className={
                    header.column.getCanSort()
                      ? "cursor-pointer select-none"
                      : ""
                  }
                  onClick={header.column.getToggleSortingHandler()}
                  title={
                    header.column.getCanSort()
                      ? header.column.getNextSortingOrder() === "asc"
                        ? "Sort ascending"
                        : header.column.getNextSortingOrder() === "desc"
                        ? "Sort descending"
                        : "Clear sort"
                      : undefined
                  }
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()] ?? null}
                </div>
                <div
                  {...{
                    onDoubleClick: () => header.column.resetSize(),
                    onMouseDown: header.getResizeHandler(),
                    onTouchStart: header.getResizeHandler(),
                    className: `resizer ${
                      table.options.columnResizeDirection
                    } ${header.column.getIsResizing() ? "isResizing" : ""}`,
                    style: {
                      transform: header.column.getIsResizing()
                        ? `translateX(${
                            table.getState().columnSizingInfo.deltaOffset ?? 0
                          }px)`
                        : "",
                    },
                  }}
                ></div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} onClick={() => onRowClick(row)}>
            {row.original.type === "data" ? (
              row
                .getVisibleCells()
                .map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))
            ) : (
              <td colSpan="5" className={"calibration-td " + row.original.id}>
                <span>{row.original.id}</span>
                <span>Min: {row.original.minValue}</span>
                <span>Max: {row.original.maxValue}</span>
                <span>W: {row.original.offsetWidth.toFixed(2)}</span>
                <span>H: {row.original.offsetHeight.toFixed(2)}</span>
                <span>X: {row.original.x.toFixed(2)}</span>
                <span>Y: {row.original.y.toFixed(2)}</span>
                <span>R: {(row.original.rotation || 0).toFixed(2)}</span>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

TableView.propTypes = {
  onRowClick: PropTypes.func.isRequired,
  table: PropTypes.object.isRequired,
};
