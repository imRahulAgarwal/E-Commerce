import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../api/user/api";

const UserForgotPassword = () => {
    const { register, handleSubmit, formState, reset } = useForm();
    const { errors, isSubmitting } = formState;
    const navigate = useNavigate();

    async function onSubmit(data) {
        await userService.forgotPassword(data).then((data) => {
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
                    Provide your e-mail address to send the password reset link.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col">
                        <div className="flex">
                            <input
                                className={`w-full border rounded-l border-r-0 p-2 outline-none ${
                                    errors.email ? "border-red-600" : "border-gray-300"
                                }`}
                                placeholder="Email"
                                {...register("email", { required: { value: true, message: "Email is required" } })}
                                type="email"
                            />
                            <span
                                className={`p-2 bg-gray-200 rounded-r flex justify-center items-center border ${
                                    errors.email ? "border-red-600" : "border-gray-300"
                                }`}>
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                        </div>
                        {errors.email && <span className="text-red-600 text-sm mt-1">{errors.email.message}</span>}
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
                        {isSubmitting ? "Submitting..." : "Send E-Mail"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        <Link to="/login" className="text-blue-600 font-medium">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserForgotPassword;
