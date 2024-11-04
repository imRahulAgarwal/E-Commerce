import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const ResetPassword = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, formState } = useForm();
    const { errors, isSubmitting } = formState;

    async function onSubmit(data) {
        await new Promise((res) => setTimeout(res, 10000)); // Simulated submission delay
        console.log(data);
    }

    return (
        <div className="flex justify-center items-center h-full w-full my-auto">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg flex flex-col gap-6 max-sm:m-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
                    <span className="text-center text-sm">Provide a new password that can be used to login</span>
                </div>
                <div className="flex flex-col">
                    <div className="flex">
                        <input
                            className={`w-full border rounded-l border-r-0 p-2 outline-none ${
                                errors.newPassword ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Password"
                            {...register("newPassword", {
                                required: { value: true, message: "New Password is required" },
                            })}
                            type={showNewPassword ? "text" : "password"}
                        />
                        <span
                            className={`p-2 bg-gray-200 rounded-r flex justify-center items-center border cursor-pointer ${
                                errors.newPassword ? "border-red-600" : "border-gray-300"
                            }`}
                            onClick={() => setShowNewPassword((prev) => !prev)}>
                            {showNewPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>
                    </div>
                    {errors.newPassword && (
                        <span className="text-red-600 text-sm mt-1">{errors.newPassword.message}</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="flex">
                        <input
                            className={`w-full border rounded-l border-r-0 p-2 outline-none ${
                                errors.confirmPassword ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Confirm Password"
                            {...register("confirmPassword", {
                                required: { value: true, message: "Confirm Password is required" },
                            })}
                            type={showConfirmPassword ? "text" : "password"}
                        />
                        <span
                            className={`p-2 bg-gray-200 rounded-r flex justify-center items-center border cursor-pointer ${
                                errors.confirmPassword ? "border-red-600" : "border-gray-300"
                            }`}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}>
                            {showConfirmPassword ? (
                                <FontAwesomeIcon icon={faEye} />
                            ) : (
                                <FontAwesomeIcon icon={faEyeSlash} />
                            )}
                        </span>
                    </div>
                    {errors.confirmPassword && (
                        <span className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-white text-lg py-2 rounded shadow-md transform transition-all duration-300 ${
                        isSubmitting
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:scale-[1.02] hover:bg-blue-700"
                    }`}>
                    {isSubmitting ? "Submitting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
