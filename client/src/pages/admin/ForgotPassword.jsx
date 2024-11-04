import React from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
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
                    <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
                    <span className="text-center text-sm">
                        Provide the E-Mail address to receive reset password link.
                    </span>
                </div>
                {/* Email Field */}
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
                <Link to="/panel/login" className="text-blue-500 text-center text-sm underline underline-offset-2">
                    Back to Admin Panel Login
                </Link>
            </form>
        </div>
    );
};

export default ForgotPassword;
