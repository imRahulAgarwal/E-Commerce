import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import userService from "../../api/user/api";

const UserResetPassword = () => {
    const { token } = useParams();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, formState, reset } = useForm();
    const { errors, isSubmitting } = formState;
    const navigate = useNavigate();

    async function onSubmit(data) {
        userService.resetPassword({ ...data, token }).then((data) => {
            if (data) {
                navigate("/login");
                reset();
            }
        });
    }

    return (
        <div className="flex-1 bg-gray-50 p-4 flex flex-col">
            <div className="flex flex-col m-auto max-w-md w-full bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-3xl font-bold text-center text-gray-800">Website</h2>
                <p className="text-sm text-gray-500 text-center mt-2">
                    Reset your password with ease, the link will expiry in 2 minutes.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
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
                                {showNewPassword ? (
                                    <FontAwesomeIcon icon={faEye} />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                )}
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
        </div>
    );
};

export default UserResetPassword;
