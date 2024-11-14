import React, { useCallback, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin";
import loadingImage from "../../assets/loading.gif";
import ProductForm from "../../components/admin/ProductForm/ProductForm";
import ConfirmationModal from "../../components/admin/ConfirmationModal/ConfirmationModal";
import useDebounce from "../../hooks/useDebounce";

const Products = () => {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null); // For editing product
    const [categories, setCategories] = useState([]);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // New state for confirmation modal
    const [productToDelete, setProductToDelete] = useState(null); // Track the product to delete
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1, limit: 10 });
    const debouncedSearch = useDebounce(search, 300);

    const columns = [
        { header: "Product Name", accessorKey: "name" },
        { header: "Product Price", accessorKey: "price" },
        { header: "Category", accessorKey: "category.name", enableSorting: false },
        { header: "Is Active", accessorFn: (data, index) => (data.isActive ? "Yes" : "No") },
        {
            header: "Actions",
            cell: ({ row: { original } }) => (
                <div className="flex justify-center gap-2">
                    <Link
                        to={`/panel/products/${original._id}`}
                        className="flex items-center px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View
                    </Link>
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
        data: products,
        columns,
        manualPagination: true,
        manualSorting: true,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
    });

    const fetchProducts = async () => {
        const sortField = sorting[0]?.id || "name";
        const sortOrder = sorting[0]?.desc ? "desc" : "asc";

        adminPanelService
            .getProducts({
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
                    setProducts(data.products);
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

    const openEditModal = useCallback((product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    }, []);

    const openAddModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    }, []);

    const openConfirmationModal = (productId) => {
        setProductToDelete(productId);
        setIsConfirmationOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationOpen(false);
        setProductToDelete(null);
    };

    const handleSubmit = async (bodyData) => {
        if (currentProduct) {
            // Edit existing product
            const { data } = await adminPanelService.updateProduct(currentProduct._id, bodyData);
            if (data && data.product) {
                setProducts((prev) =>
                    prev.map((product) => (product._id === currentProduct._id ? data.product : product))
                );
            }
        } else {
            // Add new product
            const { data } = await adminPanelService.createProduct(bodyData);
            if (data && data.product) {
                fetchProducts();
            }
        }
        setIsModalOpen(false); // Close the modal after submission
    };

    const deleteProduct = useCallback(async () => {
        if (productToDelete) {
            const result = await adminPanelService.deleteProduct(productToDelete);
            if (result) {
                fetchProducts(); // Reload data to ensure pagination is accurate
            }
            closeConfirmationModal(); // Close the confirmation modal
        }
    }, [productToDelete]);

    useEffect(() => {
        fetchProducts();
    }, [pagination.page, pagination.limit, sorting, debouncedSearch]);

    useEffect(() => {
        adminPanelService.getCategories().then(({ data }) => {
            if (data && data.categories) {
                setCategories(data.categories);
            }
        });
    }, []);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full">
            <div className="flex justify-between items-center px-4 pt-4">
                <h2 className="text-xl font-bold">Products</h2>
                <button onClick={openAddModal} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Add Product
                </button>
            </div>
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search products by name"
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
                        ) : products.length > 0 ? (
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
                                    No products found
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
                            Showing Page {products.length > 0 ? pagination.page : 0} /&nbsp;
                            {products.length > 0 ? pagination.pages : 0}
                        </span>
                        <span className="hidden sm:block">&nbsp;|&nbsp;</span>
                        <span>Total Results: {pagination.total}</span>
                    </div>
                    <div className="flex gap-x-3">
                        <button
                            className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                            onClick={decreasePageNo}
                            disabled={pagination.page === 1 || products.length === 0}>
                            Previous
                        </button>
                        <button
                            className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded disabled:bg-gray-300"
                            onClick={increasePageNo}
                            disabled={pagination.page === pagination.pages || products.length === 0}>
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
                <ProductForm
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    initialData={currentProduct || {}}
                    categories={categories}
                />
            )}
            {isConfirmationOpen && (
                <ConfirmationModal
                    isOpen={isConfirmationOpen}
                    onClose={closeConfirmationModal}
                    onConfirm={deleteProduct}
                    message="Are you sure you want to delete this product?"
                />
            )}
        </div>
    );
};

export default Products;
