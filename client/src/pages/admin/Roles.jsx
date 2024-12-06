import React, { useCallback, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import adminPanelService from "../../api/admin/api-admin";
import moment from "moment";
import { Link } from "react-router-dom";
import loadingImage from "../../assets/loading.gif";
import RoleForm from "../../components/admin/RoleForm/RoleForm";
import ConfirmationModal from "../../components/admin/ConfirmationModal/ConfirmationModal";

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState(null); // For editing role
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // For delete confirmation
    const [roleToDelete, setRoleToDelete] = useState(null); // Track role to delete

    const columns = [
        { header: "Role Name", accessorKey: "name" },
        {
            header: "Created At",
            accessorFn: (data, index) => moment(data.createdAt).format("DD.MM.YYYY, hh:mm A"),
        },
        {
            header: "Actions",
            cell: ({ row: { original } }) => (
                <div className="flex justify-center gap-2">
                    <Link
                        to={`/panel/roles/${original._id}`}
                        className="flex items-center px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View
                    </Link>
                    {original.name !== "Admin" && (
                        <>
                            <button
                                className="flex items-center px-2 py-1 text-white bg-yellow-500 hover:bg-yellow-600 rounded"
                                onClick={() => openEditModal(original)}>
                                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                                Edit
                            </button>
                            {original.isDynamic && (
                                <button
                                    className="flex items-center px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded"
                                    onClick={() => openConfirmationModal(original._id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                                    Delete
                                </button>
                            )}
                        </>
                    )}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: roles,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const openEditModal = useCallback((role) => {
        setCurrentRole(role);
        setIsModalOpen(true);
    }, []);

    const openAddModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setCurrentRole(null);
    }, []);

    const openConfirmationModal = (roleId) => {
        setRoleToDelete(roleId);
        setIsConfirmationOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationOpen(false);
        setRoleToDelete(null);
    };

    const handleModalSubmit = async (bodyData) => {
        if (currentRole) {
            // Edit existing role
            const { data } = await adminPanelService.updateRole(currentRole._id, bodyData);
            if (data && data.role) {
                setRoles((prev) => prev.map((role) => (role._id === currentRole._id ? data.role : role)));
            }
        } else {
            // Add new role
            const { data } = await adminPanelService.createRole(bodyData);
            if (data && data.role) {
                setRoles((prev) => [...prev, data.role]);
            }
        }
        setIsModalOpen(false); // Close the modal after submission
    };

    const fetchRoles = async () => {
        setLoading(true);
        adminPanelService.getRoles().then(({ data }) => {
            if (data) {
                setRoles(data.roles);
            }
            setLoading(false);
        });
    };

    const deleteRole = useCallback(async () => {
        if (roleToDelete) {
            const result = await adminPanelService.deleteRole(roleToDelete);
            if (result) {
                fetchRoles();
            }
            closeConfirmationModal();
        }
    }, [roleToDelete]);

    useEffect(() => {
        fetchRoles();
        adminPanelService.getPermissions().then(({ data }) => setPermissions(data.permissions));
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full">
            <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-bold">User Roles</h2>
                <button onClick={openAddModal} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Add User Role
                </button>
            </div>
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
                        ) : roles.length > 0 ? (
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
                                    No user roles found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <RoleForm
                    onClose={closeModal}
                    onSubmit={handleModalSubmit}
                    initialData={currentRole || {}}
                    permissions={permissions}
                />
            )}
            {isConfirmationOpen && (
                <ConfirmationModal
                    isOpen={isConfirmationOpen}
                    onClose={closeConfirmationModal}
                    onConfirm={deleteRole}
                    message="Are you sure you want to delete this role?"
                />
            )}
        </div>
    );
};

export default Roles;
