import React from "react";
import { useForm } from "react-hook-form";
import userService from "../../api/user/api";

const ContactUs = () => {
    const {
        reset,
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    async function onFormSubmit(data) {
        try {
            await userService.submitContactForm(data);
            reset();
        } catch (error) {
            console.error("Submission error:", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center p-4">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="md:flex">
                    {/* Static Content Section */}
                    <div className="md:w-1/2 max-md:bg-blue-400 md:bg-gradient-to-br from-blue-500 via-blue-300 to-blue-200 text-white p-8 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-lg">
                            We'd love to hear from you! Fill out the form and our team will get back to you as soon as
                            possible.
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="md:w-1/2 p-8">
                        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Full Name"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="E-Mail"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>

                            {/* Number */}
                            <div>
                                <label className="block text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    {...register("number", {
                                        required: "Phone Number is required",
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: "Invalid phone number",
                                        },
                                    })}
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Phone Number"
                                />
                                {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-gray-700">Message</label>
                                <textarea
                                    {...register("message", { required: "Message is required" })}
                                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="5"
                                    placeholder="Write your message here..."></textarea>
                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
