import React, { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import usersData from "../../data/users.json";

const Transactions = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const data = useMemo(() => usersData, []);

    const columns = [
        { header: "Album ID", accessorKey: "albumId" },
        { header: "ID", accessorKey: "id" },
        { header: "Title", accessorKey: "title" },
        { header: "URL", accessorKey: "url" },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center gap-2">
                    {/* <button className="flex items-center px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View
                    </button> */}
                    <button className="flex items-center px-2 py-1 text-white bg-yellow-500 hover:bg-yellow-600 rounded">
                        <FontAwesomeIcon icon={faEdit} className="mr-1" />
                        Edit
                    </button>
                    <button className="flex items-center px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded">
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="bg-white shadow-lg rounded-lg w-full">
            <div className="w-full">
                <table className="w-full text-center overflow-x-auto">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="p-4 bg-blue-500 text-white">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <tr key={row.id} className={index % 2 === 0 ? "bg-blue-100" : "bg-white"}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-b-lg">
                <div>
                    <button
                        className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded mr-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        Previous
                    </button>
                    <button
                        className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded mr-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        Next
                    </button>
                </div>
                <div>
                    <select
                        className="px-2 py-1 border border-blue-400 rounded-md"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}>
                        {[10, 50, 100, 200].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
