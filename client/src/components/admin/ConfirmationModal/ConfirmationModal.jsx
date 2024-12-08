import React from "react";

const ConfirmationModal = ({ onClose, onConfirm, message = "Are you sure you want to proceed?" }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999]">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-400 rounded text-white">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
