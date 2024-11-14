import React, { useCallback, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import adminPanelService from "../../api/admin/api-admin";
import { Link } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import loadingImage from "../../assets/loading.gif";
import PanelUserForm from "../../components/admin/PanelUserForm/PanelUserForm";
import ConfirmationModal from "../../components/admin/ConfirmationModal/ConfirmationModal";

const PanelUsers = () => {
    const [panelUsers, setPanelUsers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1, limit: 10 });
    const [loading, setLoading] = useState(true);
    // This will store an array of an object containing id and desc field
    // id will be the column id and desc will be boolean value
    // if true the order will be descending else ascending
    const [sorting, setSorting] = useState([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPanelUser, setCurrentPanelUser] = useState(null); // For editing panel user
    const [roles, setRoles] = useState([]);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // New state for confirmation modal
    const [userToDelete, setUserToDelete] = useState(null); // Track the user to delete

    const columns = [
        { header: "Name", accessorFn: (data, index) => `${data.fName} ${data.lName}`, id: "name" },
        { header: "Email", accessorKey: "email" },
        { header: "Role", accessorKey: "role.name" },
        {
            header: "Actions",
            cell: ({ row: { original } }) => (
                <div className="flex justify-center gap-2">
                    <Link
                        to={`/panel/panel-users/${original._id}`}
                        className="flex items-center px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View
                    </Link>
                    {original.role.name !== "Admin" && (
                        <>
                            <button
                                className="flex items-center px-2 py-1 text-white bg-yellow-500 hover:bg-yellow-600 rounded"
                                onClick={() => openEditModal(original)}>
                                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                                Edit
                            </button>
                            <button
                                className="flex items-center px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded"
                                onClick={() => openConfirmationModal(original._id)}>
                                <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: panelUsers,
        columns,
        manualPagination: true,
        manualSorting: true,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
    });

    const fetchPanelUsers = async () => {
        const sortField = sorting[0]?.id || "fName";
        const sortOrder = sorting[0]?.desc ? "desc" : "asc";

        adminPanelService
            .getPanelUsers({
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
                    setPanelUsers(data.panelUsers);
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

    const openEditModal = useCallback((panelUser) => {
        setCurrentPanelUser(panelUser);
        setIsModalOpen(true);
    }, []);

    const openAddModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setCurrentPanelUser(null);
    }, []);

    const handleModalSubmit = async (bodyData) => {
        if (currentPanelUser) {
            // Edit existing panel user
            const { data } = await adminPanelService.updatePanelUser(currentPanelUser._id, bodyData);
            if (data && data.panelUser) {
                setPanelUsers((prev) =>
                    prev.map((panelUser) => (panelUser._id === currentPanelUser._id ? data.panelUser : panelUser))
                );
            }
        } else {
            // Add new panel user
            const { data } = await adminPanelService.createPanelUser(bodyData);
            if (data && data.panelUser) {
                fetchPanelUsers();
            }
        }
        setIsModalOpen(false); // Close the modal after submission
    };

    const openConfirmationModal = (userId) => {
        setUserToDelete(userId);
        setIsConfirmationOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationOpen(false);
        setUserToDelete(null);
    };

    const deletePanelUser = useCallback(async () => {
        if (userToDelete) {
            const result = await adminPanelService.deletePanelUser(userToDelete);
            if (result) {
                fetchPanelUsers(); // Reload data to ensure pagination is accurate
            }
            closeConfirmationModal(); // Close the confirmation modal
        }
    }, [userToDelete]);

    useEffect(() => {
        fetchPanelUsers();
    }, [pagination.page, pagination.limit, sorting, debouncedSearch]);

    useEffect(() => {
        adminPanelService.getRoles().then(({ data }) => {
            if (data && data.roles) {
                setRoles(data.roles);
            }
        });
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full">
            <div className="flex justify-between items-center px-4 pt-4">
                <h2 className="text-xl font-bold">Panel Users</h2>
                <button onClick={openAddModal} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Add Panel User
                </button>
            </div>
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search panel user"
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
                        ) : panelUsers.length > 0 ? (
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
                                    No panel users found
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
                            Showing Page {panelUsers.length > 0 ? pagination.page : 0} /&nbsp;
                            {panelUsers.length > 0 ? pagination.pages : 0}
                        </span>
                        <span className="hidden sm:block">&nbsp;|&nbsp;</span>
                        <span>Total Results: {pagination.total}</span>
                    </div>
                    <div className="flex gap-x-3">
                        <button
                            className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                            onClick={decreasePageNo}
                            disabled={pagination.page === 1 || panelUsers.length === 0}>
                            Previous
                        </button>
                        <button
                            className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                            onClick={increasePageNo}
                            disabled={pagination.page === pagination.pages || panelUsers.length === 0}>
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
            {isModalOpen && (
                <PanelUserForm
                    onClose={closeModal}
                    onSubmit={handleModalSubmit}
                    initialData={currentPanelUser || {}}
                    roles={roles}
                />
            )}
            {isConfirmationOpen && (
                <ConfirmationModal
                    isOpen={isConfirmationOpen}
                    onClose={closeConfirmationModal}
                    onConfirm={deletePanelUser}
                    message="Are you sure you want to delete this panel user?"
                />
            )}
        </div>
    );
};

export default PanelUsers;
