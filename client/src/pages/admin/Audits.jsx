import React, { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import adminPanelService from "../../api/admin/api-admin";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import moment from "moment";

const Audits = () => {
    const [audits, setAudits] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const columns = [
        { header: "Target Module", accessorKey: "targetModule" },
        { header: "Action Type", accessorKey: "actionType" },
        { header: "Action User", accessorFn: (data, index) => `${data.userId.fName} ${data.userId.lName}` },
        { header: "User Role", accessorFn: (data, index) => `${data.userId.role.name}` },
        { header: "Action Time", accessorFn: (data, index) => moment(data.createdAt).format("DD.MM.YYYY hh:mm A") },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center gap-2">
                    <button className="flex items-center px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View
                    </button>
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
        data: audits,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    useEffect(() => {
        adminPanelService.getAudits().then(({ data: { audits } }) => setAudits(audits));
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full">
            <div className="w-full overflow-x-auto">
                <table className="w-full text-center min-w-[600px]">
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
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-blue-50 rounded-b-lg">
                <div className="flex space-x-1 mb-2 sm:mb-0">
                    <button
                        className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        Previous
                    </button>
                    <button
                        className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
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

export default Audits;
