import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import adminPanelService from "../../api/admin/api-admin";
import { useDispatch } from "react-redux";
import { login } from "../../store/auth/adminAuthSlice";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState, reset } = useForm();
    const { errors, isSubmitting } = formState;
    const dispatch = useDispatch();

    async function onSubmit(data) {
        adminPanelService.login(data).then((data) => {
            if (data) {
                const {
                    data: { user, token },
                } = data;
                window.localStorage.setItem("token", token);
                dispatch(login(user));
                reset();
            }
        });
    }

    return (
        <div className="flex justify-center items-center h-full w-full my-auto">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg flex flex-col gap-6 max-sm:m-4">
                <h2 className="text-2xl font-bold text-center text-gray-800">Admin Panel Login</h2>

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

                {/* Password Field */}
                <div className="flex flex-col">
                    <div className="flex">
                        <input
                            className={`w-full border rounded-l border-r-0 p-2 outline-none ${
                                errors.password ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Password"
                            {...register("password", {
                                required: { value: true, message: "Password is required" },
                            })}
                            type={showPassword ? "text" : "password"}
                        />
                        <span
                            className={`p-2 bg-gray-200 rounded-r flex justify-center items-center border cursor-pointer ${
                                errors.password ? "border-red-600" : "border-gray-300"
                            }`}
                            onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>
                    </div>
                    {errors.password && <span className="text-red-600 text-sm mt-1">{errors.password.message}</span>}
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
                    {isSubmitting ? "Submitting..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
