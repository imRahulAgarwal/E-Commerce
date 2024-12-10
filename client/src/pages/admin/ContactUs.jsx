import React, { useCallback, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import adminPanelService from "../../api/admin/api-admin";
import moment from "moment-timezone";
import Loader from "../../components/Loader/Loader";

const ContactUs = () => {
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [queries, setQueries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1, limit: 10 });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const columns = [
        { header: "Name", accessorKey: "name" },
        { header: "Email", accessorKey: "email" },
        { header: "Number", accessorKey: "number" },
        {
            header: "Created Time",
            accessorFn: (data) => moment(data.createdAt).tz(timezone).format("DD-MM-YYYY, hh:mm A"),
            id: "createdAt",
        },
        {
            header: "Actions",
            cell: ({ row: { original } }) => (
                <div className="flex justify-center gap-2">
                    <button
                        data-id={original._id}
                        onClick={() => openModal(original)}
                        className="flex items-center px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: queries,
        columns,
        manualPagination: true,
        manualSorting: true,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
    });

    const fetchQueries = async () => {
        const sortField = sorting[0]?.id || "name";
        const sortOrder = sorting[0]?.desc ? "desc" : "asc";

        adminPanelService
            .getContactUsQueries({
                page: pagination.page,
                limit: pagination.limit,
                sort: sortField,
                order: sortOrder,
            })
            .then(({ data }) => {
                if (data) {
                    setPagination({
                        page: data.page,
                        total: data.total,
                        pages: data.pages,
                        limit: data.limit,
                    });
                    setQueries(data.queries);
                }
            })
            .finally(() => setLoading(false));
    };

    const openModal = useCallback((query) => {
        setSelectedQuery(query);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setSelectedQuery(null);
        setIsModalOpen(false);
    }, []);

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
        fetchQueries();
    }, [pagination.page, pagination.limit, sorting]);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full">
            <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-bold">Contact Us Queries</h2>
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
                                    <Loader />
                                </td>
                            </tr>
                        ) : queries.length > 0 ? (
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
                                    No queries found
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
                            Showing Page {queries.length > 0 ? pagination.page : 0} /&nbsp;
                            {queries.length > 0 ? pagination.pages : 0}
                        </span>
                        <span className="hidden sm:block">&nbsp;|&nbsp;</span>
                        <span>Total Results: {pagination.total}</span>
                    </div>
                    <div className="flex gap-x-3">
                        <button
                            className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                            onClick={decreasePageNo}
                            disabled={pagination.page === 1 || queries.length === 0}>
                            Previous
                        </button>
                        <button
                            className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                            onClick={increasePageNo}
                            disabled={pagination.page === pagination.pages || queries.length === 0}>
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

            {/* Modal */}
            {isModalOpen && selectedQuery && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] sm:w-[500px] max-h-[80%] overflow-hidden">
                        <h3 className="text-lg font-bold mb-4 text-center">Query Details</h3>
                        <div className="space-y-2">
                            <p>
                                <strong>Name:</strong> {selectedQuery.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedQuery.email}
                            </p>
                            <p>
                                <strong>Number:</strong> {selectedQuery.number}
                            </p>
                            <p>
                                <strong>Message:</strong>
                            </p>
                            <div className="bg-gray-100 p-2 rounded text-sm break-words overflow-y-auto max-h-[150px] border border-gray-300">
                                {selectedQuery.message}
                            </div>
                            <p>
                                <strong>Created At:</strong>{" "}
                                {moment(selectedQuery.createdAt).tz(timezone).format("DD-MM-YYYY, hh:mm A")}
                            </p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
                                onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactUs;
