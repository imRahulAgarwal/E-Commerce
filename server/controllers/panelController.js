import asyncHandler from "../middlewares/asyncHandler.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import User from "../models/user.js";
import UserRole from "../models/role.js";
import Product from "../models/product.js";
import ProductSize from "../models/product-size.js";
import ProductColour from "../models/product-colour.js";
import UserPermission from "../models/permission.js";
import Order from "../models/order.js";
import AuditLogs from "../models/audit.js";
import loginSchema from "../schemas/login.js";
import { validateEmail } from "../schemas/validation.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import { generateToken, verifyToken } from "../utils/token.js";
import { changePasswordSchema, resetPasswordSchema } from "../schemas/password.js";
import roleSchema from "../schemas/role.js";
import { productSchema } from "../schemas/product.js";
import productColourSchema from "../schemas/product-colour.js";
import { upload } from "../middlewares/upload.js";
import validateObjectId from "../schemas/object-id.js";
import saveImage from "../utils/saveImage.js";
import removeImage from "../utils/removeImage.js";
import panelUserSchema from "../schemas/panel-user.js";
import productSizeSchema from "../schemas/product-size.js";
import noteAudits from "../utils/note-audit.js";
import customerSchema from "../schemas/customer.js";
import Address from "../models/address.js";
import Category from "../models/category.js";
import categorySchema from "../schemas/categorySchema.js";
import getAggregationStages from "../utils/getAggregationStages.js";
import ContactUs from "../models/contact-us.js";
import moment from "moment";
import { Types } from "mongoose";
const DOMAIN = process.env.DOMAIN;
const ADMIN_PANEL_RESET_PASSWORD_URL = process.env.ADMIN_PANEL_RESET_PASSWORD_URL;
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD;

// Authentication and Password Reset

// @desc    Log in a panel user
// @route   POST /api/panel/login
export const login = asyncHandler(async (req, res, next) => {
    const validation = loginSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, isCustomer: false, isDeleted: false }).populate({
        path: "role",
        populate: {
            path: "permissions",
        },
    });
    if (!user) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Check if password is correct
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid credentials", 401));
    }

    // Generate JWT token
    const token = generateToken({ id: user._id });

    user.loginTokens.push(token);
    await user.save();

    // Send response
    res.status(200).json({
        success: true,
        message: "User logged in successful",
        data: {
            user: {
                id: user._id,
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                role: user.role.name,
                permissions: user.role.permissions.map((permission) => permission.uniqueName),
            },
            token,
        },
    });
});

// @desc    Send a forgot password email with reset token
// @route   POST /api/panel/forgot-password
export const forgotPassword = asyncHandler(async (req, res, next) => {
    const validation = validateEmail.validate(req.body.email);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const { email } = req.body;
    const user = await User.findOne({ email, isCustomer: false, isDeleted: false });
    if (!user) {
        return next(new ErrorHandler("No user found with this email", 404));
    }

    // Generate token for password reset
    const resetToken = generateToken({ id: user._id });

    // Save token to user profile for verification
    user.resetPasswordToken = resetToken;
    await user.save();

    // Send reset email
    const resetUrl = `${ADMIN_PANEL_RESET_PASSWORD_URL}${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        link: resetUrl,
        name: user.fName + " " + user.lName,
    });

    res.status(200).json({ success: true, message: "E-Mail sent to reset password." });
});

// @desc    Reset password using token
// @route   POST /api/panel/reset-password/:token
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    const validation = resetPasswordSchema.validate({ newPassword, confirmPassword });
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (err) {
        return next(new ErrorHandler("Invalid or expired token", 400));
    }

    const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        isCustomer: false,
        isDeleted: false,
    });
    if (!user) {
        return next(new ErrorHandler("Invalid or expired token", 400));
    }

    user.password = hashPassword(newPassword);
    user.resetPasswordToken = undefined; // Clear token from user document
    user.loginTokens = [];
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
});

// Profile and Password Management

// @desc    Get logged-in panel user profile
// @route   GET /api/panel/profile
export const getProfile = asyncHandler(async (req, res, next) => {
    let { fName, lName, email, number, role, id } = req.user;
    return res.status(200).json({
        success: true,
        data: {
            user: {
                id,
                fName,
                lName,
                email,
                number,
                role: role.name,
                permissions: role.permissions.map((permission) => permission.uniqueName),
            },
        },
    });
});

// @desc    Change password for logged-in panel user
// @route   POST /api/panel/change-password
export const changePassword = asyncHandler(async (req, res, next) => {
    const validation = changePasswordSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Check if the old password is correct
    const isMatch = comparePassword(oldPassword, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    user.password = hashPassword(newPassword);
    user.loginTokens = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
});

// Dashboard

// @desc    Get dashboard data for panel user
// @route   GET /api/panel/dashboard
export const getDashboard = asyncHandler(async (req, res, next) => {
    const todayOrders = await Order.countDocuments({
        paymentStatus: "Completed",
        paymentDateTime: { $gte: moment().utc().startOf("day").toDate(), $lt: moment().utc().endOf("day").toDate() },
    });
    const totalOrders = await Order.countDocuments({ paymentStatus: "Completed" });

    const todayCustomers = await User.countDocuments({
        isCustomer: true,
        isDeleted: false,
        createdAt: { $gte: moment().utc().startOf("day").toDate(), $lt: moment().utc().endOf("day").toDate() },
    });
    const totalCustomers = await User.countDocuments({ isCustomer: true, isDeleted: false });

    let todayRevenue = await Order.aggregate([
        {
            $match: {
                paymentStatus: "Completed",
                paymentDateTime: {
                    $gte: moment().utc().startOf("day").toDate(),
                    $lt: moment().utc().endOf("day").toDate(),
                },
            },
        },
        { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
    ]);

    if (todayRevenue.length) {
        todayRevenue = todayRevenue[0].revenue;
    } else {
        todayRevenue = 0;
    }

    let totalRevenue = await Order.aggregate([
        { $match: { paymentStatus: "Completed" } },
        { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
    ]);

    if (totalRevenue.length) {
        totalRevenue = totalRevenue[0].revenue;
    } else {
        totalRevenue = 0;
    }

    return res.status(200).json({
        success: true,
        data: {
            todayCustomers,
            todayOrders,
            todayRevenue,
            totalCustomers,
            totalOrders,
            totalRevenue,
        },
    });
});

// Customer Management

// @desc    Get list of customers
// @route   GET /api/panel/customers
export const getCustomers = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, sort = "fName", order = "asc", search = "" } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    order = order.toLowerCase() === "desc" ? "desc" : "asc";

    let searchQuery = { isDeleted: false, isCustomer: true };

    if (search.trim()) {
        searchQuery.$or = [
            { fName: { $regex: search, $options: "i" } },
            { lName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { number: { $regex: search, $options: "i" } },
        ];
    }

    const allowedSortFields = ["fName", "lName", "email", "number"];
    if (!allowedSortFields.includes(sort)) {
        sort = "fName";
    }

    const customers = await User.find(searchQuery, { fName: 1, lName: 1, email: 1, number: 1, createdAt: 1 })
        .sort({ [sort]: order })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const total = await User.countDocuments(searchQuery);
    let pages = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        data: {
            customers,
            pages,
            total,
            page: page > pages ? 1 : page,
            limit,
        },
    });
});

// @desc    Get details of a specific customer
// @route   GET /api/panel/customers/:customerId
export const getCustomerById = asyncHandler(async (req, res, next) => {
    let { customerId } = req.params;
    if (!customerId || !validateObjectId(customerId)) {
        return next(new ErrorHandler("Invalid Customer ID format", 400));
    }

    let customer = await User.findOne(
        { _id: customerId, isDeleted: false, isCustomer: true },
        { fName: 1, lName: 1, email: 1, number: 1, createdAt: 1, updatedAt: 1 }
    ).lean();

    if (!customer) {
        return next(new ErrorHandler("Customer details not found", 404));
    }

    customer.addresses = await Address.find({ userId: customer._id, isDeleted: false });

    return res.status(200).json({ success: true, data: { customer } });
});

// @desc    Create a new customer
// @route   POST /api/panel/customers
export const createCustomer = asyncHandler(async (req, res, next) => {
    let validation = customerSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const { fName, lName, email, number } = validation.value;

    let customerRole = await UserRole.findOne({ name: "Customer", isDeleted: false, isDynamic: false });
    let hashedPassword = hashPassword(DEFAULT_PASSWORD);
    let newCustomer = await User.create({
        fName,
        lName,
        email,
        number,
        password: hashedPassword,
        isCustomer: true,
        role: customerRole.id,
    });

    return res.status(201).json({
        success: true,
        message: "Customer details added",
        data: { customer: { fName, lName, email, number, _id: newCustomer._id } },
    });
});

// Order Management

// @desc    Get list of orders
// @route   GET /api/panel/orders
export const getOrders = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, sort = "createdAt", order = "asc", search } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    order = order.toLowerCase() === "desc" ? "desc" : "asc";

    let searchQuery = {};

    if (search.trim()) {
        searchQuery.$or = [{ razorpay_order_id: search }, { razorpay_payment_id: search }];
    }

    const allowedSortFields = ["createdAt", "totalAmount"];
    if (!allowedSortFields.includes(sort)) {
        sort = "createdAt";
    }

    let orders = await Order.find(searchQuery, { totalAmount: 1, paymentStatus: 1, createdAt: 1, razorpay_order_id: 1 })
        .sort({ [sort]: order })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    let total = await Order.countDocuments(searchQuery);
    let pages = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        data: {
            orders,
            pages,
            total,
            page: page > pages ? 1 : page,
            limit,
        },
    });
});

// @desc    Get details of a specific order
// @route   GET /api/panel/orders/:orderId
export const getOrderById = asyncHandler(async (req, res, next) => {
    let { orderId } = req.params;
    if (!orderId) {
        return next(new ErrorHandler("Provide an order ID", 400));
    }

    let order = await Order.aggregate([
        { $match: { _id: new Types.ObjectId(orderId) } },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "userId",
                as: "user",
                pipeline: [{ $project: { fName: 1, lName: 1, email: 1, number: 1 } }],
            },
        },
        { $unwind: "$user" },
        {
            $lookup: {
                from: "addresses",
                foreignField: "_id",
                localField: "address",
                as: "address",
                pipeline: [{ $project: { isDeleted: 0, userId: 0, __v: 0 } }],
            },
        },
        { $unwind: "$address" },
        { $unwind: "$products" },
        {
            $lookup: {
                from: "product_sizes",
                foreignField: "_id",
                localField: "products.productSizeId",
                as: "productSize",
            },
        },
        { $unwind: "$productSize" },
        {
            $lookup: {
                from: "product_colours",
                foreignField: "_id",
                localField: "productSize.productColourId",
                as: "productColour",
            },
        },
        { $unwind: "$productColour" },
        {
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "productColour.productId",
                as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $lookup: {
                from: "categories",
                foreignField: "_id",
                localField: "product.category",
                as: "category",
            },
        },
        { $unwind: "$category" },
        // {
        //     $addFields: {
        //         createdAt: {
        //             $dateToString: {
        //                 format: "%d-%m-%Y, %H:%M",
        //                 date: "$createdAt",
        //                 timezone: "Asia/Kolkata",
        //             },
        //         },
        //         paymentDateTime: {
        //             $dateToString: {
        //                 format: "%d-%m-%Y, %H:%M",
        //                 date: "$paymentDateTime",
        //                 timezone: "Asia/Kolkata",
        //             },
        //         },
        //     },
        // },
        {
            $group: {
                _id: "$_id",
                user: { $first: "$user" },
                address: { $first: "$address" },
                totalAmount: { $first: "$totalAmount" },
                taxableAmount: { $first: "$taxableAmount" },
                taxAmount: { $first: "$taxAmount" },
                roundOffAmount: { $first: "$roundOffAmount" },
                paymentStatus: { $first: "$paymentStatus" },
                paymentDateTime: { $first: "$paymentDateTime" },
                razorpay_payment_id: { $first: "$razorpay_payment_id" },
                razorpay_order_id: { $first: "$razorpay_order_id" },
                createdAt: { $first: "$createdAt" },
                products: {
                    $push: {
                        productId: "$product._id",
                        productName: "$product.name",
                        productPrice: "$products.price",
                        productCategory: "$category.name",
                        productColourId: "$productColour._id",
                        productColour: "$productColour.colour",
                        productImage: {
                            $let: {
                                vars: {
                                    image: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$productColour.images",
                                                    as: "image",
                                                    cond: { $eq: ["$$image.isDefault", true] },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                                in: {
                                    $concat: [DOMAIN, "$$image.url"],
                                },
                            },
                        },
                        productSizeId: "$productSize._id",
                        productQuantity: "$products.quantity",
                        productSize: "$productSize.size",
                    },
                },
            },
        },
    ]);

    if (!order.length) {
        return next(new ErrorHandler("Order details not found", 404));
    }

    order = order[0];

    return res.status(200).json({ success: true, data: { order } });
});

// Category Management

// @desc    Get list of categories
// @route   GET /api/panel/categories
export const getCategories = asyncHandler(async (req, res, next) => {
    let categories = await Category.find({ isDeleted: false });
    return res.status(200).json({ success: true, data: { categories } });
});

// @desc    Get details of a specific category
// @route   GET /api/panel/categories/:categoryId
export const getCategory = asyncHandler(async (req, res, next) => {
    let { categoryId } = req.params;
    if (!categoryId || !validateObjectId(categoryId)) {
        return next(new ErrorHandler("Invalid Category ID format", 400));
    }

    let category = await Category.findOne({ _id: categoryId, isDeleted: false });
    if (!category) {
        return next(new ErrorHandler("Category details not found", 404));
    }

    return res.status(200).json({ success: true, data: { category } });
});

// @desc    Create a new category
// @route   POST /api/panel/categories
export const createCategory = asyncHandler(async (req, res, next) => {
    let validation = categorySchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let { name } = req.body;

    let newCategory = await Category.create({ name });

    await noteAudits(req.user, "POST", "Category", { documentId: newCategory.id });

    return res.status(201).json({
        success: true,
        message: "Category details added",
        data: { category: { _id: newCategory._id, name } },
    });
});

// @desc    Update a category
// @route   PUT /api/panel/categories/:categoryId
export const udpateCategory = asyncHandler(async (req, res, next) => {
    let { categoryId } = req.params;
    if (!categoryId || !validateObjectId(categoryId)) {
        return next(new ErrorHandler("Invalid Category ID format", 400));
    }

    let validation = categorySchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let { name } = req.body;
    let categoryExists = await Category.findOne({ _id: categoryId, isDeleted: false });
    if (!categoryExists) {
        return next(new ErrorHandler("Category details not found", 404));
    }

    let updatedData = await Category.findOneAndUpdate(
        { _id: categoryId, isDeleted: false },
        { $set: { name } },
        { new: true }
    );

    await noteAudits(req.user, "PUT", "Category", { documentId: updatedData.id });

    return res.status(200).json({
        success: true,
        message: "Category details updated",
        data: { category: { _id: updatedData._id, name } },
    });
});

// @desc    Delete a category
// @route   DELETE /api/panel/categories/:categoryId
export const deleteCategory = asyncHandler(async (req, res, next) => {
    let { categoryId } = req.params;
    if (!categoryId || !validateObjectId(categoryId)) {
        return next(new ErrorHandler("Invalid Category ID format", 400));
    }

    let category = await Category.findOne({ _id: categoryId, isDeleted: false });
    if (!category) {
        return next(new ErrorHandler("Category details not found", 404));
    }

    let updateResult = await Category.updateOne({ _id: categoryId, isDeleted: false }, { $set: { isDeleted: true } });

    if (!updateResult.modifiedCount) {
        return next(new ErrorHandler("Internal server error", 500));
    }

    await noteAudits(req.user, "DELETE", "Category", { documentId: category.id });

    return res.status(200).json({ success: true, message: "Category details removed" });
});

// Product Management

// @desc    Get list of products
// @route   GET /api/panel/products
export const getProducts = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, sort = "name", order = "asc", search } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    order = order.toLowerCase() === "desc" ? "desc" : "asc";
    const filter = { isDeleted: false };

    if (search.trim()) {
        filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    const allowedSortFields = ["name", "price", "isActive"];
    if (!allowedSortFields.includes(sort)) {
        sort = "name";
    }

    const products = await Product.find(filter)
        .populate("category")
        .sort({ [sort]: order })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const total = await Product.countDocuments(filter);

    let pages = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        data: {
            products,
            pages,
            total,
            page: page > pages ? 1 : page,
            limit,
        },
    });
});

// @desc    Get details of a specific product
// @route   GET /api/panel/products/:productId
export const getProductById = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format", 400));
    }

    const product = await Product.findOne({ _id: productId, isDeleted: false }).lean();

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const productColours = await ProductColour.find({ productId, isDeleted: false }).lean();
    for (const productColour of productColours) {
        productColour.sizes = await ProductSize.find({ productColourId: productColour._id }).lean();

        productColour.images = productColour.images.map((image) => ({
            isDefault: image.isDefault,
            file: DOMAIN + image.url,
            id: image._id,
        }));
    }

    product.colours = productColours;
    res.status(200).json({ success: true, data: { product } });
});

// @desc    Create a new product
// @route   POST /api/panel/products
export const createProduct = asyncHandler(async (req, res, next) => {
    const validation = productSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const { categoryId } = req.body;
    if (!categoryId || !validateObjectId(categoryId)) {
        return next(new ErrorHandler("Invalid Category ID format", 422));
    }

    const category = await Category.findOne({ _id: categoryId, isDeleted: false });
    if (!category) {
        return next(new ErrorHandler("Category details not found", 404));
    }

    const product = new Product({ category: categoryId, ...validation.value });
    await product.save();

    await noteAudits(req.user, "POST", "Product", { documentId: product.id });

    return res.status(201).json({ success: true, message: "Product details added", data: { product } });
});

// @desc    Update a product
// @route   PUT /api/panel/products/:productId
export const updateProduct = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format", 400));
    }

    const { categoryId } = req.body;
    if (!categoryId || !validateObjectId(categoryId)) {
        return next(new ErrorHandler("Invalid Category ID format", 422));
    }

    const validation = productSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const category = await Category.findOne({ _id: categoryId, isDeleted: false });
    if (!category) {
        return next(new ErrorHandler("Category details not found", 404));
    }

    const product = await Product.findOneAndUpdate(
        { _id: productId, isDeleted: false },
        { $set: { category: categoryId, ...validation.value } },
        { new: true }
    ).populate("category");

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await noteAudits(req.user, "PUT", "Product", { documentId: product.id });

    return res.status(200).json({ success: true, message: "Product details updated", data: { product } });
});

// @desc    Delete a product
// @route   DELETE /api/panel/products/:productId
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format", 400));
    }

    const product = await Product.findOneAndUpdate(
        { _id: productId, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
    );

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await noteAudits(req.user, "DELETE", "Product", { documentId: product.id });

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
});

// Product Colour Management

// @desc    Get list of product colours
// @route   GET /api/panel/product/colours
export const getProductColours = asyncHandler(async (req, res, next) => {
    let { productId } = req.query;
    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format"));
    }

    let productExists = await Product.findOne({ _id: productId, isDeleted: false });
    if (!productExists) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const colours = await ProductColour.find({ isDeleted: false });
    return res.status(200).json({ success: true, message: "Product colour details added", data: { colours } });
});

// @desc    Get details of a specific product colour
// @route   GET /api/panel/product/colours/:colourId
export const getProductColourById = asyncHandler(async (req, res, next) => {
    let { colourId } = req.params;
    if (!colourId || !validateObjectId(colourId)) {
        return next(new ErrorHandler("Invalid Colour ID format", 400));
    }

    let { productId } = req.query;
    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format"));
    }

    let productExists = await Product.findOne({ _id: productId, isDeleted: false });
    if (!productExists) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const colour = await ProductColour.findOne({ _id: colourId, isDeleted: false, productId: productExists._id });
    if (!colour) {
        return next(new ErrorHandler("Colour not found", 404));
    }

    return res.status(200).json({ success: true, data: { colour } });
});

// @desc    Create a new product colour
// @route   POST /api/panel/products/colours
export const createProductColour = [
    upload.fields([
        { name: "main-image", maxCount: 1 },
        { name: "other-image", maxCount: 3 },
    ]),
    asyncHandler(async (req, res, next, error) => {
        let { productId } = req.query;
        if (!productId || !validateObjectId(productId)) {
            return next(new ErrorHandler("Invalid Product ID format"));
        }

        const validation = productColourSchema.validate(req.body);
        if (validation.error) {
            return next(new ErrorHandler(validation.error.details[0].message, 400));
        }

        let allImages = req.files;
        let { colour } = req.body;

        if (!allImages["main-image"] || !allImages["main-image"].length) {
            return next(new ErrorHandler("Main Image is required", 400));
        }

        const existingColour = await ProductColour.findOne({
            colour: req.body.colour,
            productId: req.body.productId,
            isDeleted: false,
        });

        if (existingColour) {
            return next(new ErrorHandler("Colour already exists for this product", 400));
        }

        let productExists = await Product.findOne({ _id: productId, isDeleted: false });
        if (!productExists) {
            return next(new ErrorHandler("Product details not found", 400));
        }

        let newColour = new ProductColour({ colour, productId });

        let images = [];
        let mainImage = saveImage(productExists.id, newColour.id, allImages["main-image"][0]);
        images.push({ url: mainImage, isDefault: true });

        if (allImages["other-image"]) {
            let otherImages = allImages["other-image"].map((image) => ({
                url: saveImage(productExists.id, newColour.id, image),
                isDefault: false,
            }));
            images = [...images, ...otherImages];
        }

        newColour.set("images", images);
        await newColour.save();

        await noteAudits(req.user, "POST", "Product Colour", { documentId: newColour.id });

        res.status(201).json({ success: true, message: "Product colour added", data: { newColour } });
    }),
];

// @desc    Update a product colour
// @route   PUT /api/panel/product/colours/:colourId
export const updateProductColour = [
    upload.fields([
        { name: "main-image", maxCount: 1 },
        { name: "other-image", maxCount: 3 },
    ]),
    asyncHandler(async (req, res, next) => {
        let { productId } = req.query;
        if (!productId || !validateObjectId(productId)) {
            return next(new ErrorHandler("Invalid Product ID format"));
        }

        let { colourId } = req.params;
        if (!colourId || !validateObjectId(colourId)) {
            return next(new ErrorHandler("Invalid Colour ID format", 400));
        }

        const validation = productColourSchema.validate(req.body);
        if (validation.error) {
            return next(new ErrorHandler(validation.error.details[0].message, 400));
        }

        const existingColour = await ProductColour.findOne({
            colour: req.body.colour,
            productId,
            _id: { $ne: colourId },
            isDeleted: false,
        });

        if (existingColour) {
            return next(new ErrorHandler("Colour already exists for this product", 400));
        }

        const colour = await ProductColour.findOne({ _id: colourId, isDeleted: false });
        if (!colour) {
            return next(new ErrorHandler("Colour not found", 404));
        }

        let allImages = req.files;
        const { removeImages = [] } = req.body;
        let mainImage = colour.images.filter((image) => image.isDefault)[0];
        let images = [];

        if (allImages["main-image"] && allImages["main-image"].length) {
            removeImage(mainImage.url);
            mainImage = saveImage(colour.productId.toString(), colour.id, allImages["main-image"][0]);
            images.push({ url: mainImage, isDefault: true });
        } else {
            images.push(mainImage);
        }

        colour.images
            .filter((image) => !image.isDefault)
            .map((image) => {
                if (!removeImages.includes(image.id)) {
                    images.push(image);
                } else {
                    removeImage(image.url);
                }
            });

        if (allImages["other-image"]) {
            let otherImages = allImages["other-image"].map((image) => ({
                url: saveImage(colour.productId.toString(), colour.id, image),
                isDefault: false,
            }));
            images = [...images, ...otherImages];
        }

        colour.set("colour", req.body.colour);
        colour.set("images", images);
        await colour.save();

        await noteAudits(req.user, "PUT", "Product Colour", { documentId: colour.id });

        res.status(200).json({ success: true, message: "Product colour updated", data: { colour } });
    }),
];

// @desc    Delete a product colour
// @route   DELETE /api/panel/product/colours/:colourId
export const deleteProductColour = asyncHandler(async (req, res, next) => {
    let { colourId } = req.params;
    if (!colourId || !validateObjectId(colourId)) {
        return next(new ErrorHandler("Invalid Product ID format"));
    }

    const colour = await ProductColour.findOneAndUpdate(
        { _id: colourId, isDeleted: false },
        { isDeleted: true },
        { returnDocument: "after" }
    );

    if (!colour) {
        return next(new ErrorHandler("Colour not found", 404));
    }

    await noteAudits(req.user, "DELETE", "Product Colour", { documentId: colour.id });

    return res.status(200).json({ success: true, message: "Colour removed successfully" });
});

// @desc    Get list of product sizes
// @route   GET /api/panel/product/sizes
export const getProductSizes = asyncHandler(async (req, res, next) => {
    const { productId, productColourId } = req.query;

    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format"));
    }

    if (!productColourId || !validateObjectId(productColourId)) {
        return next(new ErrorHandler("Invalid Product Colour ID format"));
    }

    // Validate product and colour existence
    await validateExistence(productId, productColourId, next);

    const sizes = await ProductSize.find({ productColourId });
    res.status(200).json({ success: true, data: { sizes } });
});

// @desc    Get details of a specific product size
// @route   GET /api/panel/product/sizes/:sizeId
export const getProductSizeById = asyncHandler(async (req, res, next) => {
    const { productId, productColourId } = req.query;
    const { sizeId } = req.params;

    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format"));
    }

    if (!productColourId || !validateObjectId(productColourId)) {
        return next(new ErrorHandler("Invalid Product Colour ID format"));
    }

    if (!sizeId || !validateObjectId(sizeId)) {
        return next(new ErrorHandler("Invalid Product Size ID format", 400));
    }

    await validateExistence(productId, productColourId, next);

    const size = await ProductSize.findById(sizeId);
    if (!size) {
        return next(new ErrorHandler("Product size not found", 404));
    }
    res.status(200).json({ success: true, data: { size } });
});

// @desc    Create a new product size
// @route   POST /api/panel/products/sizes
export const createProductSize = asyncHandler(async (req, res, next) => {
    const { productId, productColourId } = req.query;

    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format"));
    }

    if (!productColourId || !validateObjectId(productColourId)) {
        return next(new ErrorHandler("Invalid Product Colour ID format"));
    }

    const validation = productSizeSchema.validate(req.body);

    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    await validateExistence(productId, productColourId, next);

    const newSize = new ProductSize({ ...validation.value, productColourId });
    await newSize.save();

    await noteAudits(req.user, "POST", "Product Size", { documentId: newSize.id });

    res.status(201).json({ success: true, message: "Product size added", data: { newSize } });
});

// @desc    Update a product size
// @route   PUT /api/panel/product/sizes/:sizeId
export const updateProductSize = asyncHandler(async (req, res, next) => {
    const { productId, productColourId } = req.query;
    const { sizeId } = req.params;

    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format"));
    }

    if (!productColourId || !validateObjectId(productColourId)) {
        return next(new ErrorHandler("Invalid Product Colour ID format"));
    }

    if (!sizeId || !validateObjectId(sizeId)) {
        return next(new ErrorHandler("Invalid Product Size ID format", 400));
    }

    const validation = productSizeSchema.validate(req.body);

    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    await validateExistence(productId, productColourId, next);

    const updatedSize = await ProductSize.findByIdAndUpdate(sizeId, validation.value, { new: true });
    if (!updatedSize) {
        return next(new ErrorHandler("Product size not found", 404));
    }

    await noteAudits(req.user, "PUT", "Product Size", { documentId: updatedSize.id });

    res.status(200).json({ success: true, message: "Product size updated", data: { updatedSize } });
});

// Function to validate existence of product and colour
const validateExistence = async (productId, productColourId, next) => {
    if (!validateObjectId(productId)) {
        throw new ErrorHandler("Invalid Product ID format", 400);
    }

    if (!validateObjectId(productColourId)) {
        throw new ErrorHandler("Invalid Product Colour ID format", 400);
    }

    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) {
        throw new ErrorHandler("Product not found", 404);
    }

    const colour = await ProductColour.findOne({ _id: productColourId, isDeleted: false });
    if (!colour) {
        throw new ErrorHandler("Product colour not found", 404);
    }
};

// Audit Management

// @desc    Get list of audit records
// @route   GET /api/panel/audits
export const getAudits = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, order = "asc", sort = "createdAt", search = "" } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    order = order.toLowerCase() === "desc" ? "desc" : "asc";

    let searchQuery = {};

    if (search.trim()) {
        searchQuery.$or = [
            { actionType: { $regex: search, $options: "i" } },
            { targetModule: { $regex: search, $options: "i" } },
        ];
    }

    let audits = await AuditLogs.find(searchQuery)
        .sort({ [sort]: order })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "userId", select: "fName lName email role", populate: { path: "role", select: "name" } })
        .lean();

    let total = await AuditLogs.countDocuments(searchQuery);
    let pages = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        data: {
            audits,
            pages,
            total,
            page: page > pages ? 1 : page,
            limit,
        },
    });
});

// @desc    Get details of a specific audit record
// @route   GET /api/panel/audits/:auditId
export const getAuditById = asyncHandler(async (req, res, next) => {
    let { auditId } = req.params;
    if (!auditId || !validateObjectId(auditId)) {
        return next(new ErrorHandler("Invalid Audit ID format", 400));
    }

    let audit = await AuditLogs.findOne({ _id: auditId }).populate({
        path: "userId",
        select: "fName lName email role",
        populate: { path: "role", select: "name" },
    });

    if (!audit) {
        return next(new ErrorHandler("Audit details not found", 404));
    }

    return res.status(200).json({ success: true, data: { audit } });
});

// Permission Management

// @desc    Get list of permissions
// @route   GET /api/panel/permissions
export const getPermissions = asyncHandler(async (req, res, next) => {
    let permissions = await UserPermission.find({ uniqueName: { $ne: "manage_role" } });
    return res.status(200).json({ success: true, data: { permissions } });
});

// Role Management

// @desc    Get list of roles
// @route   GET /api/panel/roles
export const getRoles = asyncHandler(async (req, res, next) => {
    let roles = await UserRole.find({ isDeleted: false, name: { $ne: "Customer" } })
        .populate("permissions", "_id name")
        .select("-isDeleted");
    return res.status(200).json({ success: true, data: { roles } });
});

// @desc    Get details of a specific role
// @route   GET /api/panel/roles/:roleId
export const getRoleById = asyncHandler(async (req, res, next) => {
    let { roleId } = req.params;
    if (!roleId || !validateObjectId(roleId)) {
        return next(new ErrorHandler("Invalid Role ID format", 400));
    }

    let role = await UserRole.findOne({ _id: roleId, isDeleted: false }).populate("permissions", "_id name");
    if (!role) {
        return next(new ErrorHandler("User role details not found", 404));
    }

    return res.status(200).json({ success: true, data: { role } });
});

// @desc    Create a new role
// @route   POST /api/panel/roles
export const createRole = asyncHandler(async (req, res, next) => {
    let validation = roleSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let { name, description, permissions } = req.body;
    let permissionIds = [];

    if (!permissions || !permissions.length) {
        return next(new ErrorHandler("Select the permissions to provide", 400));
    }

    for (const permission of permissions) {
        if (permission && validateObjectId(permission)) {
            await UserPermission.findOne({ _id: permission }).then((data) => permissionIds.push(data._id));
        }
    }

    let newRole = await UserRole.create({ name, description, permissions: permissionIds });

    await noteAudits(req.user, "POST", "Roles", { documentId: newRole.id });

    return res.status(201).json({
        success: true,
        message: "User role details added",
        data: { role: newRole },
    });
});

// @desc    Update a role
// @route   PUT /api/panel/roles/:roleId
export const updateRole = asyncHandler(async (req, res, next) => {
    let { roleId } = req.params;
    if (!roleId || !validateObjectId(roleId)) {
        return next(new ErrorHandler("Invalid Role ID format", 400));
    }

    let validation = roleSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let { name, description, permissions } = req.body;
    let roleExists = await UserRole.findOne({ _id: roleId, isDeleted: false });
    if (!roleExists) {
        return next(new ErrorHandler("User role details not found", 404));
    }

    let permissionIds = [];

    for (const permission of permissions) {
        if (permission && validateObjectId(permission)) {
            await UserPermission.findOne({ _id: permission }).then((data) => permissionIds.push(data._id));
        }
    }

    let updatedData = await UserRole.findOneAndUpdate(
        { _id: roleId, isDeleted: false },
        { $set: { name, description, permissions: permissionIds } },
        { new: true }
    );

    await noteAudits(req.user, "PUT", "Roles", { documentId: updatedData.id });

    return res.status(201).json({
        success: true,
        message: "User role details updated",
        data: { role: updatedData },
    });
});

// @desc    Delete a role
// @route   DELETE /api/panel/roles/:roleId
export const deleteRole = asyncHandler(async (req, res, next) => {
    let { roleId } = req.params;
    if (!roleId || !validateObjectId(roleId)) {
        return next(new ErrorHandler("Invalid Role ID format", 400));
    }

    let role = await UserRole.findOne({ _id: roleId, isDeleted: false, isDynamic: true });
    if (!role) {
        return next(new ErrorHandler("User role details not found", 404));
    }

    let updateResult = await UserRole.updateOne(
        { _id: roleId, isDeleted: false, isDynamic: true },
        { $set: { isDeleted: true } }
    );

    if (!updateResult.modifiedCount) {
        return next(new ErrorHandler("Internal server error", 500));
    }

    await noteAudits(req.user, "DELETE", "Roles", { documentId: role.id });

    return res.status(200).json({ success: true, message: "User role details removed" });
});

// Panel User Management

// @desc    Get list of panel users
// @route   GET /api/panel-users
export const getPanelUsers = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, sort = "fName", order = "asc", search = "" } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    order = order.toLowerCase() === "desc" ? "desc" : "asc";

    let searchQuery = { isDeleted: false, isCustomer: false };

    if (search.trim()) {
        searchQuery.$or = [
            { fName: { $regex: search, $options: "i" } },
            { lName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const allowedSortFields = ["fName", "lName", "email"];
    if (!allowedSortFields.includes(sort)) {
        sort = "fName";
    }

    const panelUsers = await User.find(searchQuery, { fName: 1, lName: 1, email: 1, role: 1 })
        .populate("role", "_id name")
        .sort({ [sort]: order })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const total = await User.countDocuments(searchQuery);
    let pages = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        data: {
            panelUsers,
            pages,
            total,
            page: page > pages ? 1 : page,
            limit,
        },
    });
});

// @desc    Get details of a specific panel user
// @route   GET /api/panel-users/:panelUserId
export const getPanelUserById = asyncHandler(async (req, res, next) => {
    let { panelUserId } = req.params;
    if (!panelUserId || !validateObjectId(panelUserId)) {
        return next(new ErrorHandler("Invalid Panel User ID format", 400));
    }

    let panelUser = await User.findOne({ _id: panelUserId, isDeleted: false, isCustomer: false })
        .populate({ path: "role", populate: { path: "permissions", select: "_id name" } })
        .select("fName lName email role");

    if (!panelUser) {
        return next(new ErrorHandler("Panel User details not found", 404));
    }

    return res.status(200).json({ success: true, data: { panelUser } });
});

// @desc    Create a new panel user
// @route   POST /api/panel-users
export const createPanelUser = asyncHandler(async (req, res, next) => {
    let validation = panelUserSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let { fName, lName, email, roleId } = req.body;

    if (!roleId || !validateObjectId(roleId)) {
        return next(new ErrorHandler("Invalid Role ID format", 400));
    }

    let userRole = await UserRole.findOne({ _id: roleId, isDeleted: false, name: { $ne: "Customer" } });
    if (!userRole) {
        return next(new ErrorHandler("User role details not found", 404));
    }

    let userExists = await User.findOne({ email, isDeleted: false, isCustomer: false });
    if (userExists) {
        return next(new ErrorHandler("User details exists", 400));
    }

    let hashedPassword = hashPassword(DEFAULT_PASSWORD);
    let newPanelUser = await User.create({ fName, lName, email, password: hashedPassword, role: userRole._id });

    await newPanelUser.populate("role", "_id name");

    await noteAudits(req.user, "POST", "Panel Users", { documentId: newPanelUser.id });

    return res.status(201).json({
        success: true,
        message: "Panel user details added",
        data: { panelUser: { _id: newPanelUser._id, fName, lName, email, role: newPanelUser.role } },
    });
});

// @desc    Update a panel user
// @route   PUT /api/panel-users/:panelUserId
export const updatePanelUser = asyncHandler(async (req, res, next) => {
    let { panelUserId } = req.params;
    if (!panelUserId || !validateObjectId(panelUserId)) {
        return next(new ErrorHandler("Invalid Panel User ID format", 400));
    }

    let validation = panelUserSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let { fName, lName, email, number, roleId } = req.body;

    let panelUserExists = await User.findOne({ _id: panelUserId, isDeleted: false });
    if (!panelUserExists) {
        return next(new ErrorHandler("Panel User details not found", 404));
    }

    let userRole = await UserRole.findOne({ _id: roleId, isDeleted: false, name: { $ne: "Customer" } });
    if (!userRole) {
        return next(new ErrorHandler("User role details not found", 404));
    }

    let anotherUserExists = await User.findOne({
        email,
        _id: { $ne: panelUserId },
        isDeleted: false,
        isCustomer: false,
    });
    if (anotherUserExists) {
        return next(new ErrorHandler("E-Mail is already in use with another panel user", 400));
    }

    let updatedData = await User.findOneAndUpdate(
        { _id: panelUserId, isDeleted: false },
        { $set: { fName, lName, email, number, role: userRole._id } },
        { returnDocument: "after" }
    ).populate("role", "_id name");

    await noteAudits(req.user, "PUT", "Panel Users", { documentId: updatedData.id });

    return res.status(200).json({
        success: true,
        message: "Panel user details updated",
        data: { panelUser: { _id: updatedData._id, fName, lName, email, role: updatedData.role } },
    });
});

// @desc    Delete a panel user
// @route   DELETE /api/panel-users/:panelUserId
export const deletePanelUser = asyncHandler(async (req, res, next) => {
    let { panelUserId } = req.params;
    if (!panelUserId || !validateObjectId(panelUserId)) {
        return next(new ErrorHandler("Invalid Panel User ID format", 400));
    }

    let panelUserExists = await User.findOne({ _id: panelUserId, isDeleted: false, isCustomer: false });
    if (!panelUserExists) {
        return next(new ErrorHandler("Panel User details not found", 404));
    }

    let updateResult = await User.updateOne(
        { _id: panelUserId, isDeleted: false, isCustomer: false },
        { $set: { isDeleted: true } }
    );

    if (!updateResult.modifiedCount) {
        return next(new ErrorHandler("Internal server error", 500));
    }

    await noteAudits(req.user, "DELETE", "Panel Users", { documentId: panelUserExists.id });

    return res.status(200).json({ success: true, message: "Panel user details removed" });
});

export const getOrderReports = asyncHandler(async (req, res, next) => {
    const { type = "month" } = req.query;
    const { matchStage, groupStage } = getAggregationStages(type, "paymentDateTime");
    matchStage.$match.paymentStatus = "Completed";

    const reports = await Order.aggregate([
        matchStage,
        { $group: { _id: groupStage._id, data: { $sum: 1 } } },
        { $sort: { "_id.sortId": 1 } },
        { $project: { id: "$_id.label", data: "$data", _id: 0 } },
    ]);

    return res.status(200).json({ success: true, data: { reports } });
});

export const getRevenueReports = asyncHandler(async (req, res, next) => {
    const { type = "month" } = req.query;
    const { matchStage, groupStage } = getAggregationStages(type, "paymentDateTime");
    matchStage.$match.paymentStatus = "Completed";

    const reports = await Order.aggregate([
        matchStage,
        { $group: { _id: groupStage._id, totalRevenue: { $sum: "$totalAmount" } } },
        { $sort: { "_id.sortId": 1 } },
        { $project: { id: "$_id.label", data: "$totalRevenue", _id: 0 } },
    ]);

    return res.status(200).json({ success: true, data: { reports } });
});

export const getCustomerReports = asyncHandler(async (req, res, next) => {
    const { type = "month" } = req.query;
    const { matchStage, groupStage } = getAggregationStages(type, "createdAt");
    matchStage.$match.isDeleted = false;
    matchStage.$match.isCustomer = true;

    const reports = await User.aggregate([
        matchStage,
        { $group: { _id: groupStage._id, totalCustomers: { $sum: 1 } } },
        { $sort: { "_id.sortId": 1 } },
        { $project: { id: "$_id.label", data: "$totalCustomers", _id: 0 } },
    ]);

    return res.status(200).json({ success: true, data: { reports } });
});

// Logout

// @desc    Log out a panel user
// @route   POST /api/panel/logout
export const logout = asyncHandler(async (req, res, next) => {
    let token = req.headers["authorization"]?.split(" ")[1];
    await User.updateOne({ _id: req.user._id, isDeleted: false, isCustomer: false }, { $pull: { loginTokens: token } });
    return res.status(200).json({ success: true, message: "User logged out" });
});

// Contact Us Queries

// @desc    Get list of user queries
// @route   GET /api/panel/contact-us
export const getContactUsQueries = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, sort = "name", order = "asc" } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    order = order.toLowerCase() === "desc" ? "desc" : "asc";

    const allowedSortFields = ["name", "createdAt", "email", "number"];
    if (!allowedSortFields.includes(sort)) {
        sort = "name";
    }

    const queries = await ContactUs.find()
        .sort({ [sort]: order })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const total = await ContactUs.countDocuments();

    let pages = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        data: {
            queries,
            pages,
            total,
            page: page > pages ? 1 : page,
            limit,
        },
    });
});
