import React, { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import adminPanelService from "../../api/admin/api-admin";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1, limit: 10 });

    const columns = [
        { header: "Name", accessorFn: (data, index) => `${data.fName} ${data.lName}` },
        { header: "Email", accessorKey: "email" },
        { header: "Number", accessorKey: "number" },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex justify-center gap-2">
                    <Link
                        to={`/panel/customers/${row.original._id}`}
                        className="flex items-center px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View
                    </Link>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: customers,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const increasePageNo = () => {
        if (pagination.page < pagination.pages) {
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const decreasePageNo = () => {
        if (pagination.page > 1) {
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    useEffect(() => {
        adminPanelService.getCustomers(pagination.page, pagination.limit).then(({ data }) => {
            setPagination({
                page: data.page,
                total: data.total,
                pages: data.pages,
                limit: data.limit,
            });
            setCustomers(data.customers);
        });
    }, [pagination.page, pagination.limit]);

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
                    <div className="px-3 py-1">
                        Showing Page {pagination.page} / {pagination.pages}
                    </div>
                    <button
                        className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                        onClick={decreasePageNo}
                        disabled={pagination.page === 1}>
                        Previous
                    </button>
                    <button
                        className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                        onClick={increasePageNo}
                        disabled={pagination.page === pagination.pages}>
                        Next
                    </button>
                </div>
                <div>
                    <select
                        className="px-2 py-1 border border-blue-400 rounded-md"
                        value={pagination.limit}
                        onChange={(e) => setPagination((prev) => ({ ...prev, limit: Number(e.target.value) }))}>
                        {[10, 25, 50, 100].map((pageSize) => (
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

export default Customers;
