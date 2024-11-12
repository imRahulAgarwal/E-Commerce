import React, { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import adminPanelService from "../../api/admin/api-admin";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import loadingImage from "../../assets/loading.gif";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1, limit: 10 });
    const [loading, setLoading] = useState(true);
    // This will store an array of an object containing id and desc field
    // id will be the column id and desc will be boolean value
    // if true the order will be descending else ascending
    const [sorting, setSorting] = useState([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const columns = [
        { header: "Name", accessorFn: (data) => `${data.fName} ${data.lName}`, id: "name" },
        { header: "Email", accessorKey: "email", enableSorting: true },
        { header: "Number", accessorKey: "number", enableSorting: true },
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
        manualSorting: true,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
    });

    const fetchCustomers = async () => {
        const sortField = sorting[0]?.id || "fName";
        const sortOrder = sorting[0]?.desc ? "desc" : "asc";

        adminPanelService
            .getCustomers({
                page: pagination.page,
                limit: pagination.limit,
                sort: sortField,
                order: sortOrder,
                search: debouncedSearch,
            })
            .then(({ data }) => {
                setLoading(false);
                if (data) {
                    setPagination({
                        page: data.page,
                        total: data.total,
                        pages: data.pages,
                        limit: data.limit,
                    });
                    setCustomers(data.customers);
                }
            });
    };

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
        fetchCustomers();
    }, [pagination.page, pagination.limit, sorting, debouncedSearch]);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full">
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search customers..."
                    className="w-full p-2 border border-gray-300 rounded mb-4 outline-none"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-center min-w-[600px]">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="p-4 bg-blue-500 text-white cursor-pointer"
                                        onClick={header.column.getToggleSortingHandler()}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: " ↑",
                                            desc: " ↓",
                                        }[header.column.getIsSorted()] || null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="p-4">
                                    <img
                                        src={loadingImage}
                                        width={40}
                                        height={40}
                                        alt="Loading GIF"
                                        className="mx-auto"
                                    />
                                </td>
                            </tr>
                        ) : customers.length > 0 ? (
                            table.getRowModel().rows.map((row, index) => (
                                <tr key={row.id} className={index % 2 === 0 ? "bg-blue-100" : "bg-white"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-4">
                                    No customers found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col sm:flex-row gap-y-2 sm:items-center sm:justify-between p-4 bg-blue-50 rounded-b-lg">
                <div className="flex lg:flex-row flex-col lg:space-x-2 gap-y-2 mb-2 sm:mb-0">
                    <div className="flex sm:flex-row flex-col gap-y-2 lg:items-center">
                        <span>
                            Showing Page {customers.length > 0 ? pagination.page : 0} /&nbsp;
                            {customers.length > 0 ? pagination.pages : 0}
                        </span>
                        <span className="hidden sm:block">&nbsp;|&nbsp;</span>
                        <span>Total Results: {pagination.total}</span>
                    </div>
                    <div className="flex gap-x-3">
                        <button
                            className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                            onClick={decreasePageNo}
                            disabled={pagination.page === 1 || customers.length === 0}>
                            Previous
                        </button>
                        <button
                            className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                            onClick={increasePageNo}
                            disabled={pagination.page === pagination.pages || customers.length === 0}>
                            Next
                        </button>
                    </div>
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
