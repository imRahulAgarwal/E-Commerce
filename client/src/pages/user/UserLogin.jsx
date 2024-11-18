import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import userService from "../../api/user/api";
import { useDispatch } from "react-redux";
import { userLogin } from "../../store/auth/userAuthSlice";

const UserLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState, reset } = useForm();
    const { errors, isSubmitting } = formState;
    const dispatch = useDispatch();

    async function onSubmit(data) {
        userService.login(data).then(({ data }) => {
            if (data) {
                const { user, token } = data;
                window.localStorage.setItem("token", token);
                dispatch(userLogin(user));
                reset();
            }
        });
    }

    return (
        <div className="flex-1 bg-gray-50 p-4 flex flex-col">
            <div className="flex flex-col m-auto max-w-md w-full bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-3xl font-bold text-center text-gray-800">Website</h2>
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
                                {showPassword ? (
                                    <FontAwesomeIcon icon={faEye} />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                )}
                            </span>
                        </div>
                        {errors.password && (
                            <span className="text-red-600 text-sm mt-1">{errors.password.message}</span>
                        )}
                    </div>

                    <div className="text-right">
                        <Link to="/forgot-password" className="text-blue-600">
                            Forgot your password?
                        </Link>
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

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        New to <span className="font-semibold text-gray-800">Website</span>?<br />
                        <Link to="/register" className="text-blue-600 font-medium">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
