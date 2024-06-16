import TableControls from "./TableControls.jsx";
import * as dayjs from "dayjs";
import React, { useState } from "react";
import TableView from "./TableView.jsx";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

function createMeasureTable(data, onRowClick) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor((row) => row.date || row.fromDate, {
      id: "date",
      size: 170,
      cell: (info) => dayjs.unix(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
      header: () => <span>Date</span>,
    }),
    columnHelper.accessor((row) => row.values?.og, {
      id: "og",
      size: 60,
      cell: (info) => info.getValue()?.toFixed(3),
      header: () => <span>O/G</span>,
    }),
    columnHelper.accessor((row) => row.values?.ow, {
      id: "ow",
      size: 60,
      cell: (info) => info.getValue()?.toFixed(3),
      header: () => <span>O/W</span>,
    }),
    columnHelper.accessor((row) => row.path, {
      id: "path",
      cell: (info) => info.getValue(),
      header: () => <span>Path</span>,
    }),
    columnHelper.accessor((row) => row.id, {
      id: "id",
      cell: (info) => info.getValue(),
      header: () => <span>Id</span>,
    }),
  ];
  const table = useReactTable({
    columns,
    data,
    initialState: {
      pagination: pagination,
      sorting: [
        {
          id: "date",
          desc: false,
        },
      ],
    },
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
  });

  if (!data || data.length === 0) {
    return [null, null];
  }

  return [
    <TableView table={table} onRowClick={onRowClick} />,
    <TableControls table={table} />,
  ];
}

export { TableControls, TableView, createMeasureTable };
