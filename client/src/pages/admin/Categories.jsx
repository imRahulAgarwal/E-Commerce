import React, { useCallback, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import adminPanelService from "../../api/admin/api-admin";
import loadingImage from "../../assets/loading.gif";
import ConfirmationModal from "../../components/admin/ConfirmationModal/ConfirmationModal";
import CategoryForm from "../../components/admin/CategoryForm/CategoryForm";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null); // For editing category
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // For delete confirmation
    const [categoryToDelete, setCategoryToDelete] = useState(null); // Track category to delete

    const columns = [
        { header: "Category", accessorKey: "name" },
        {
            header: "Actions",
            cell: ({ row: { original } }) => (
                <div className="flex justify-center gap-2">
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
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: categories,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const openEditModal = useCallback((category) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    }, []);

    const openAddModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setCurrentCategory(null);
    }, []);

    const openConfirmationModal = (roleId) => {
        setCategoryToDelete(roleId);
        setIsConfirmationOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationOpen(false);
        setCategoryToDelete(null);
    };

    const handleModalSubmit = async (bodyData) => {
        if (currentCategory) {
            // Edit existing category
            const { data } = await adminPanelService.updateCategory(currentCategory._id, bodyData);
            if (data && data.category) {
                setCategories((prev) =>
                    prev.map((category) => (category._id === currentCategory._id ? data.category : category))
                );
            }
        } else {
            // Add new category
            const { data } = await adminPanelService.createCategory(bodyData);
            if (data && data.category) {
                setCategories((prev) => [...prev, data.category]);
            }
        }
        setIsModalOpen(false); // Close the modal after submission
    };

    const fetchCategories = async () => {
        setLoading(true);
        adminPanelService.getCategories().then(({ data }) => {
            if (data) {
                setCategories(data.categories);
            }
            setLoading(false);
        });
    };

    const deleteRole = useCallback(async () => {
        if (categoryToDelete) {
            const result = await adminPanelService.deleteCategory(categoryToDelete);
            if (result) {
                fetchCategories();
            }
            closeConfirmationModal();
        }
    }, [categoryToDelete]);

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full">
            <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-bold">Categories</h2>
                <button onClick={openAddModal} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Add Category
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
                        ) : categories.length > 0 ? (
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
                                    No categories found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <CategoryForm onClose={closeModal} onSubmit={handleModalSubmit} initialData={currentCategory || {}} />
            )}
            {isConfirmationOpen && (
                <ConfirmationModal
                    isOpen={isConfirmationOpen}
                    onClose={closeConfirmationModal}
                    onConfirm={deleteRole}
                    message="Are you sure you want to delete this category?"
                />
            )}
        </div>
    );
};

export default Categories;
