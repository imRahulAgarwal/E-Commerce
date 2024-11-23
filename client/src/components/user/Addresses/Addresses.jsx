import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import userService from "../../../api/user/api";
import { setAddresses } from "../../../store/auth/userAuthSlice";
import ConfirmationModal from "../../admin/ConfirmationModal/ConfirmationModal";

const formFields = [
    { fieldName: "addressLine1", placeholder: "Address Line 1", inputType: "text" },
    { fieldName: "addressLine2", placeholder: "Address Line 2", inputType: "text" },
    { fieldName: "city", placeholder: "City", inputType: "text" },
    { fieldName: "state", placeholder: "State", inputType: "text" },
    { fieldName: "country", placeholder: "Country", inputType: "text" },
    { fieldName: "pincode", placeholder: "Pincode", inputType: "number" },
];

const Addresses = () => {
    const addresses = useSelector((state) => state.userAuth.addresses);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const {
        formState: { errors },
        register,
        handleSubmit,
        reset,
        setValue,
    } = useForm();
    const dispatch = useDispatch();

    const deleteAddress = () => {
        userService.deleteAddress(addressToDelete).then((data) => {
            if (data) {
                dispatch(setAddresses(addresses.filter((address) => address._id !== addressToDelete)));
                closeConfirmationModal();
            }
        });
    };

    const onFormSubmit = (data) => {
        if (addressToEdit) {
        } else {
            userService.addAddress(data).then(({ data }) => {
                if (data) {
                    dispatch(setAddresses([...addresses, data.address]));
                    handleModalClose();
                }
            });
        }
    };

    const openConfirmationModal = (addressId) => {
        setAddressToDelete(addressId);
        setIsConfirmationOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationOpen(false);
        setAddressToDelete(null);
    };

    const handleModalClose = () => {
        setIsAddressModalOpen(false);
        setAddressToEdit(null);
        reset();
    };

    const handleEditModal = (address) => {
        setAddressToEdit(address);
        setIsAddressModalOpen(true);
        formFields.map((field) => setValue(field.fieldName, address[field.fieldName]));
    };

    return (
        <>
            <div className="flex sm:flex-row flex-col justify-between">
                <h2 className="text-2xl font-semibold mb-4 text-blue-700">Addresses</h2>
                <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">
                    Add New Address
                </button>
            </div>
            {addresses.length ? (
                addresses.map((address, index) => (
                    <div key={index} className="border p-4 mb-4 rounded-lg shadow-sm bg-gray-50">
                        <p>{address.addressLine1}</p>
                        <p>{address.addressLine2}</p>
                        <p>
                            {address.city} - {address.state}
                        </p>
                        <p>
                            {address.country} - {address.pincode}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleEditModal(address)}
                                className="text-gray-50 bg-blue-600 px-6 py-2 rounded">
                                Edit
                            </button>
                            <button
                                className="text-gray-50 bg-red-600 px-6 py-2 rounded"
                                onClick={() => openConfirmationModal(address._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="border p-4 mb-4 rounded-lg shadow-sm bg-gray-50">
                    <p>No addresses created</p>
                </div>
            )}

            {isAddressModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
                        <h2 className="text-xl font-semibold mb-4 text-blue-700">
                            {addressToEdit ? "Edit" : "Add"} Address
                        </h2>
                        {formFields.map((field) => (
                            <div key={field.fieldName} className="flex flex-col mb-2">
                                <input
                                    {...register(field.fieldName, {
                                        required: { value: true, message: `${field.placeholder} is required.` },
                                    })}
                                    className={`w-full border rounded p-2 outline-none ${
                                        errors[field.fieldName] ? "border-red-600" : "border-gray-300"
                                    }`}
                                    type={field.inputType}
                                    placeholder={field.placeholder}
                                />
                                {errors[field.fieldName] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[field.fieldName].message}</p>
                                )}
                            </div>
                        ))}
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={handleModalClose} className="text-gray-600 hover:underline">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isConfirmationOpen && (
                <ConfirmationModal
                    isOpen={isConfirmationOpen}
                    onClose={closeConfirmationModal}
                    onConfirm={deleteAddress}
                    message="Are you sure you want to delete the address?"
                />
            )}
        </>
    );
};

export default Addresses;
