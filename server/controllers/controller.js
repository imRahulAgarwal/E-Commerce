import User from "../models/user.js";
import Address from "../models/address.js";
import Cart from "../models/cart.js";
import UserWishlist from "../models/wishlist.js";
import Order from "../models/order.js";
import ProductColour from "../models/product-colour.js";
import ProductSize from "../models/product-size.js";
import registerSchema from "../schemas/register.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import UserRole from "../models/role.js";
import ErrorHandler from "../utils/errorHandler.js";
import loginSchema from "../schemas/login.js";
import { generateToken, verifyToken } from "../utils/token.js";
import { validateEmail } from "../schemas/validation.js";
import { changePasswordSchema, resetPasswordSchema } from "../schemas/password.js";
import sendEmail from "../utils/sendEmail.js";
import addressSchema from "../schemas/address.js";
import validateObjectId from "../schemas/object-id.js";
import returnObjectId from "../utils/return-object-id.js";
import ContactUs from "../models/contact-us.js";
import Razorpay from "razorpay";
import { createHmac } from "crypto";
import profileSchema from "../schemas/profile.js";
import Product from "../models/product.js";
import moment from "moment-timezone";
import contactUsSchema from "../schemas/contactUs.js";

const DOMAIN = process.env.DOMAIN;
const FRONTEND_USER_DOMAIN = process.env.FRONTEND_USER_DOMAIN;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

const currency = "INR";

// User Authentication and Profile
export const register = asyncHandler(async (req, res, next) => {
    // Validate the request body against the schema
    const validation = registerSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const { email, password, fName, lName, number } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email, isDeleted: false, isCustomer: true });
    if (existingUser) {
        return next(new ErrorHandler("User with this email already exists", 400));
    }

    const hashedPassword = hashPassword(password);

    const customerRole = await UserRole.findOne({ name: "Customer", isDynamic: false, isDeleted: false });

    // Create new user
    let newUser = await User.create({
        fName,
        lName,
        email,
        password: hashedPassword,
        role: customerRole?.id,
        number,
        isCustomer: true,
    });

    await Cart.create({ userId: newUser.id, products: [] });

    // Send response
    res.status(201).json({ success: true, message: "User registration successful" });
});

export const login = asyncHandler(async (req, res, next) => {
    const validation = loginSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, isCustomer: true, isDeleted: false });
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
        message: "User logged in",
        data: {
            token,
            user: {
                id: user._id,
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                number: user.number,
            },
        },
    });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const validation = validateEmail.validate(req.body.email);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const { email } = req.body;
    const user = await User.findOne({ email, isCustomer: true, isDeleted: false });
    if (!user) {
        return next(new ErrorHandler("No user found with this email", 404));
    }

    // Generate token for password reset
    const resetToken = generateToken({ id: user._id });

    // Save token to user profile for verification
    user.resetPasswordToken = resetToken;
    await user.save();

    // Send reset email
    const resetUrl = `${FRONTEND_USER_DOMAIN}${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetUrl}`,
    });

    res.status(200).json({ success: true, message: "Rest Password email sent" });
});

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

    const user = await User.findOne({ _id: decoded.id, resetPasswordToken: token, isDeleted: false, isCustomer: true });
    if (!user) {
        return next(new ErrorHandler("Invalid or expired token", 400));
    }

    user.password = hashPassword(newPassword);
    user.resetPasswordToken = undefined; // Clear token from user document
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
});

export const profile = asyncHandler(async (req, res, next) => {
    let { fName, lName, email, number } = req.user;
    return res.status(200).json({ success: true, data: { user: { fName, lName, email, number } } });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    let validation = profileSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let updatedData = await User.findOneAndUpdate(
        { _id: req.user._id, isCustomer: true, isDeleted: false },
        { $set: req.body },
        { new: true }
    );

    if (!updatedData) {
        return next(new ErrorHandler("Internal server error", 500));
    }

    let { fName, lName, email, number } = updatedData;

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { user: { fName, lName, number, email } },
    });
});

export const changePassword = asyncHandler(async (req, res, next) => {
    const validation = changePasswordSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    // Check if the old password is correct
    const isMatch = comparePassword(oldPassword, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    user.password = hashPassword(newPassword);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
});

// User Addresses
export const readAddresses = asyncHandler(async (req, res, next) => {
    const addresses = await Address.find({ userId: req.user._id, isDeleted: false });
    res.status(200).json({ success: true, data: { addresses } });
});

export const readAddress = asyncHandler(async (req, res, next) => {
    const { addressId } = req.params;
    if (!addressId || !validateObjectId(addressId)) {
        return next(new ErrorHandler("Invalid Address ID format", 400));
    }

    const address = await Address.findOne({ _id: addressId, user: req.user._id, isDeleted: false });

    if (!address) {
        return next(new ErrorHandler("Address not found", 404));
    }

    res.status(200).json({ success: true, data: { address } });
});

export const createAddress = asyncHandler(async (req, res, next) => {
    const validation = addressSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const { addressLine1, addressLine2, city, state, country, pincode } = req.body;

    const newAddress = await Address.create({
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        pincode,
        userId: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Address added successfully",
        data: { address: { addressLine1, addressLine2, city, state, pincode, country, _id: newAddress._id } },
    });
});

export const updateAddress = asyncHandler(async (req, res, next) => {
    const { addressId } = req.params;
    if (!addressId || !validateObjectId(addressId)) {
        return next(new ErrorHandler("Invalid Address ID format", 400));
    }

    const validation = addressSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const { addressLine1, addressLine2, city, state, country, pincode } = req.body;

    const updatedAddress = await Address.findOneAndUpdate(
        { _id: addressId, userId: req.user._id, isDeleted: false },
        { $set: { addressLine1, addressLine2, city, state, country, pincode } }
    );

    if (!updatedAddress) {
        return next(new ErrorHandler("Address not found or deleted", 404));
    }

    res.status(200).json({
        success: true,
        message: "Address updated successfully",
        data: { address: { addressLine1, addressLine2, city, state, country, pincode } },
    });
});

export const deleteAddress = asyncHandler(async (req, res, next) => {
    const { addressId } = req.params;
    if (!addressId || !validateObjectId(addressId)) {
        return next(new ErrorHandler("Invalid Address ID format", 400));
    }

    const address = await Address.findOneAndUpdate(
        { _id: addressId, userId: req.user._id },
        { $set: { isDeleted: true } }
    );

    if (!address) {
        return next(new ErrorHandler("Address not found", 404));
    }

    res.status(200).json({ success: true, message: "Address deleted successfully" });
});

// Cart
export const readCartItems = asyncHandler(async (req, res, next) => {
    let user = req.user;
    let cart = await Cart.aggregate([
        { $match: { userId: user._id } },
        { $unwind: "$products" }, // Unwind products array for processing each product

        // Lookup product size info
        {
            $lookup: {
                from: "product_sizes",
                localField: "products.productSizeId",
                foreignField: "_id",
                as: "productInfo",
            },
        },
        { $unwind: "$productInfo" },
        { $match: { "productInfo.isActive": true } },

        // Lookup product colour info
        {
            $lookup: {
                from: "product_colours",
                localField: "productInfo.productColourId",
                foreignField: "_id",
                as: "productColour",
            },
        },
        { $unwind: "$productColour" },
        { $match: { "productColour.isDeleted": false } },

        // // Lookup product details
        {
            $lookup: {
                from: "products",
                localField: "productColour.productId",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        { $match: { "product.isDeleted": false, "product.isActive": true } },

        // Project fields as per requirements
        {
            $project: {
                name: "$product.name",
                quantity: "$products.quantity",
                price: "$product.price",
                image: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$productColour.images",
                                        as: "image",
                                        cond: { $eq: ["$$image.isDefault", true] },
                                    },
                                },
                                as: "image",
                                in: { $concat: [DOMAIN, "$$image.url"] },
                            },
                        },
                        0,
                    ],
                },
                id: "$productInfo._id",
                colour: "$productColour.colour",
                size: "$productInfo.size",
                isAvailable: {
                    $cond: {
                        if: {
                            /* Add your custom logic here for availability */
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        },
    ]);

    return res.status(200).json({ success: true, data: cart });
});

export const updateCartItems = asyncHandler(async (req, res, next) => {
    let { productSizeId, quantity = 1 } = req.body;
    if (!productSizeId || !validateObjectId(productSizeId)) {
        return next(new ErrorHandler("Invalid Product Size ID format"));
    }

    let userCart = await Cart.findOne({ userId: req.user._id });

    // Quantity to increase provided by a user.
    quantity = parseInt(quantity, 10) || 1;

    let productInCart = userCart?.products.find((product) => product.productSizeId.toString() === productSizeId);
    let cartQuantity = productInCart ? parseInt(productInCart.quantity, 10) : 0;

    // Fetch productSize details with sold quantity
    let productSize = await ProductSize.findById(productSizeId);

    if (!productSize || !productSize.isActive) {
        return next(new ErrorHandler("Product Size not found or inactive", 404));
    }

    // Calculate the available stock
    let availableStock = productSize.quantity - productSize.sold;

    // Validate the requested quantity
    if (quantity + cartQuantity > availableStock) {
        return next(new ErrorHandler(`Item out of stock`, 400));
    }

    let updateResult = await Cart.updateOne(
        { userId: req.user._id, "products.productSizeId": productSizeId },
        { $inc: { "products.$.quantity": quantity } }
    );

    if (!updateResult.modifiedCount) {
        await Cart.updateOne({ userId: req.user._id }, { $push: { products: { productSizeId, quantity } } });
    }

    // Remove products with zero quantity
    await Cart.updateOne({ userId: req.user._id }, { $pull: { products: { quantity: { $lte: 0 } } } });

    return res.status(200).json({ success: true, message: "Cart updated successfully" });
});

// Wishlist
export const readWishlist = asyncHandler(async (req, res, next) => {
    let wishlist = await UserWishlist.aggregate([
        { $match: { userId: req.user._id } },
        {
            $lookup: {
                from: "product_sizes",
                foreignField: "_id",
                localField: "products",
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

        // Add a filter to exclude deleted products
        {
            $match: {
                "product.isDeleted": false,
            },
        },

        {
            $project: {
                name: "$product.name",
                colour: "$productColour.colour",
                size: "$productSize.size",
                image: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$productColour.images",
                                        as: "image",
                                        cond: { $eq: ["$$image.isDefault", true] },
                                    },
                                },
                                as: "image",
                                in: { $concat: [DOMAIN, "$$image.url"] },
                            },
                        },
                        0,
                    ],
                },
                isAvailable: {
                    $cond: {
                        if: {
                            $and: [
                                { $gt: [{ $subtract: ["$productSize.quantity", "$productSize.sold"] }, 0] }, // Available quantity > 0
                                { $eq: ["$productSize.isActive", true] }, // Product size is active
                                { $eq: ["$productColour.isDeleted", false] }, // Product color is not deleted
                                { $eq: ["$product.isActive", true] }, // Product is active
                            ],
                        },
                        then: true,
                        else: false,
                    },
                },
                id: "$productSize._id",
                _id: 0,
            },
        },
    ]);

    return res.status(200).json({ success: true, data: wishlist });
});

export const updateWishlist = asyncHandler(async (req, res, next) => {
    const { productSizeId } = req.body;

    if (!productSizeId || !validateObjectId(productSizeId)) {
        return next(new ErrorHandler("Invalid Product Size ID format"));
    }

    // Validate product existence and its status
    const productExists = await ProductSize.aggregate([
        { $match: { _id: returnObjectId(productSizeId), isActive: true } },
        {
            $lookup: {
                from: "product_colours",
                localField: "productColourId",
                foreignField: "_id",
                as: "productColour",
            },
        },
        { $unwind: "$productColour" },
        { $match: { "productColour.isDeleted": false } },
        {
            $lookup: {
                from: "products",
                localField: "productColour.productId",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        { $match: { "product.isDeleted": false, "product.isActive": true } },
    ]);

    if (!productExists.length) {
        return next(new ErrorHandler("Product details do not exist or are inactive", 404));
    }

    // Find or create the user's wishlist
    let wishlist = await UserWishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
        wishlist = await UserWishlist.create({ userId: req.user._id, products: [] });
    }

    // Check if the product is already in the wishlist
    const productExistsInWishlist = wishlist.products.some((item) => item.toString() === productSizeId);

    if (productExistsInWishlist) {
        // Remove the product if it already exists in the wishlist
        await UserWishlist.updateOne({ userId: req.user._id }, { $pull: { products: productSizeId } });
        return res.status(200).json({ success: true, message: "Product removed from wishlist" });
    } else {
        // Add the product to the wishlist if it doesn't exist
        await UserWishlist.updateOne(
            { userId: req.user._id },
            { $addToSet: { products: returnObjectId(productSizeId) } }
        );
        return res.status(200).json({ success: true, message: "Product added to wishlist" });
    }
});

// Orders
export const readOrders = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const { page = 1, limit = 10, sort = "date", order = "asc" } = req.query;

    // Convert page and limit to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Define the sorting logic
    const sortOptions = {
        date: "createdAt",
        amount: "totalAmount",
    };
    const sortField = sortOptions[sort] || sortOptions.date; // Default to sorting by date
    const sortOrder = order === "desc" ? -1 : 1;

    // Query to fetch the orders
    const orders = await Order.find({ userId: user._id })
        .sort({ [sortField]: sortOrder })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

    // Fetch the total number of orders for pagination details
    const totalOrders = await Order.countDocuments({ userId: user._id });

    res.status(200).json({
        orders,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalOrders / limitNum),
            totalOrders,
        },
    });
});

export const readOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, userId: req.user._id })
        .populate("userId")
        .populate({
            path: "products.productSizeId",
            populate: { path: "productColourId", populate: { path: "productId" } },
        });

    if (!order) {
        return next(new ErrorHandler("Order details not found", 404));
    }

    return res.status(200).json({ success: true, data: order });
});

export const createOrder = asyncHandler(async (req, res, next) => {
    const user = req.user;
    let taxableAmount = 0;
    let taxAmount = 0;
    let roundOffAmount = 0;
    let totalAmount = 0;
    let products = [];
    let isAnyOutOfStock = false;

    let { addressId, isBuyNow } = req.body;
    if (typeof isBuyNow !== "boolean") {
        return res.status(400).json({ success: false, message: "Invalid purchase type" });
    }

    if (isBuyNow) {
        let { productSizeId } = req.body;
        if (!validateObjectId(productSizeId)) {
            return next(new ErrorHandler("Invalid Product Size ID format", 400));
        }

        let productExists = await ProductSize.aggregate([
            { $match: { _id: returnObjectId(productSizeId), isActive: true, quantity: { $gte: 1 } } },
            {
                $lookup: {
                    from: "product_colours",
                    foreignField: "_id",
                    localField: "productColourId",
                    as: "productColours",
                },
            },
            { $unwind: "$productColours" },
            { $match: { "productColours.isDeleted": false } },
            {
                $lookup: {
                    from: "products",
                    foreignField: "_id",
                    localField: "productColours.productId",
                    as: "productInfo",
                },
            },
            { $unwind: "$productInfo" },
            { $match: { "productInfo.isDeleted": false } },
            {
                $project: {
                    _id: 1,
                    "productInfo.price": 1,
                },
            },
        ]);

        if (!productExists || !productExists.length) {
            return next(new ErrorHandler("Product is out of stock", 404));
        }

        products = productExists.map((productExist) => {
            taxableAmount += productExist.productInfo.price;
            return {
                productSizeId: productExist._id,
                price: productExist.productInfo.price,
                quantity: 1,
            };
        });
    } else {
        let cart = await Cart.findOne({ userId: user._id });
        if (!cart.products.length) {
            return next(new ErrorHandler("Cart is empty", 400));
        }

        for (const cartItem of cart.products) {
            let productExists = await ProductSize.aggregate([
                {
                    $match: {
                        _id: returnObjectId(cartItem.productSizeId),
                        isActive: true,
                        quantity: { $gte: cartItem.quantity },
                    },
                },
                {
                    $lookup: {
                        from: "product_colours",
                        foreignField: "_id",
                        localField: "productColourId",
                        as: "productColours",
                    },
                },
                { $unwind: "$productColours" },
                { $match: { "productColours.isDeleted": false } },
                {
                    $lookup: {
                        from: "products",
                        foreignField: "_id",
                        localField: "productColours.productId",
                        as: "productInfo",
                    },
                },
                { $unwind: "$productInfo" },
                { $match: { "productInfo.isDeleted": false } },
                {
                    $project: {
                        _id: 1,
                        "productInfo.price": 1,
                    },
                },
            ]);

            if (productExists.length) {
                let newProducts = productExists.map((productExist) => {
                    taxableAmount += Number(productExist.productInfo.price * cartItem.quantity);
                    return {
                        productSizeId: productExist._id,
                        price: productExist.productInfo.price,
                        quantity: cartItem.quantity,
                    };
                });

                products = [...products, ...newProducts];
            } else {
                isAnyOutOfStock = true;
            }
        }
    }

    taxableAmount = Number(taxableAmount);
    taxAmount = Number((taxableAmount * 0.05).toFixed(2));
    totalAmount = Math.round(Number(taxableAmount + taxAmount));
    roundOffAmount = Number((totalAmount - (taxableAmount + taxAmount)).toFixed(2));

    let address = await Address.findOne({ _id: addressId, userId: user._id, isDeleted: false });
    if (!address) {
        return next(new ErrorHandler("Address not found", 404));
    }

    razorpay.orders.create({ amount: totalAmount * 100, currency }, async (error, order) => {
        if (error) {
            console.log(error);
            return next(new ErrorHandler(error, 500));
        }
        await Order.create({
            userId: user._id,
            paymentStatus: "Pending",
            products,
            totalAmount,
            razorpay_order_id: order.id,
            address,
            taxableAmount,
            taxAmount,
            roundOffAmount,
            isBuyNow: isBuyNow ? true : false,
        });

        return res.status(201).json({
            success: true,
            data: {
                order,
                key: RAZORPAY_KEY_ID,
                message: isAnyOutOfStock ? "Some products are out of stock" : undefined,
                customer: {
                    name: user.fName + " " + user.lName,
                    email: user.email,
                    number: user.number,
                },
            },
        });
    });
});

export const verifyPayment = asyncHandler(async (req, res, next) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    if (!razorpay_payment_id.startsWith("pay") || !razorpay_order_id.startsWith("order")) {
        req.flash("error", "Invalid payment id");
        return res.status(400).json({ success: false, message: "Invalid payment id" });
    }

    let expectedSignature = createHmac("sha-256", RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        req.flash("error", "Invalid payment source");
        return res.status(400).json({ success: false, message: "Invalid payment source" });
    }

    let orderInfo = await Order.findOne({ razorpay_order_id, paymentStatus: "Pending", userId: req.user._id });

    if (!orderInfo) {
        return next(new ErrorHandler("Order details not found", 404));
    }

    orderInfo = await Order.findOneAndUpdate(
        { razorpay_order_id, paymentStatus: "Pending", userId: req.user._id },
        { $set: { paymentStatus: "Completed", razorpay_payment_id, razorpay_signature } },
        { returnDocument: "after" }
    ).populate({ path: "userId" });

    for (const item of orderInfo.products) {
        await ProductSize.findOneAndUpdate(
            { _id: item.productSizeId },
            { $inc: { quantity: -item.quantity, sold: item.quantity } }
        );
    }

    if (!orderInfo.isBuyNow) {
        await Cart.updateOne({ userId: orderInfo.userId }, { $set: { products: [] } });
    }

    return res.status(200).json({ success: true, message: "Order placed successfully" });
});

// Logout
export const logout = asyncHandler(async (req, res, next) => {
    let token = req.headers["authorization"]?.split(" ")[1];
    await User.updateOne({ _id: req.user._id, isDeleted: false, isCustomer: true }, { $pull: { loginTokens: token } });
    return res.status(200).json({ success: true, message: "User logged out" });
});

// Products
export const readProducts = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, sort = "price", order = "asc", search = "Red" } = req.query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    order = order.toLowerCase() === "asc" ? 1 : -1;
    search = search.trim();

    if (!["price,createdAt"].includes(sort)) {
        sort = "price";
    }

    sort = { [sort]: order };
    let searchQuery = {};

    if (search) {
        searchQuery.$or = [
            { name: { $regex: search, $options: "i" } },
            { "category.name": { $regex: search, $options: "i" } },
            { "colors.colour": { $regex: search, $options: "i" } },
        ];
    }

    const products = await Product.aggregate([
        { $match: { isActive: true, isDeleted: false } },
        { $lookup: { from: "categories", foreignField: "_id", localField: "category", as: "category" } },
        { $unwind: "$category" },
        {
            $lookup: {
                from: "product_colours",
                localField: "_id",
                foreignField: "productId",
                as: "colors",
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: "$colors" },
        { $match: searchQuery },
        { $sort: sort },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
            $project: {
                name: 1,
                price: 1,
                category: "$category.name",
                color: "$colors.colour",
                image: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$colors.images",
                                as: "image",
                                cond: { $eq: ["$$image.isDefault", true] },
                            },
                        },
                        0,
                    ],
                },
                colorId: "$colors._id",
            },
        },
        { $addFields: { image: "$image.url" } },
    ]);

    products.map((product) => (product.image = DOMAIN + product.image));

    const total = await Product.aggregate([
        {
            $match: { isActive: true, isDeleted: false },
        },
        { $lookup: { from: "categories", foreignField: "_id", localField: "category", as: "category" } },
        { $unwind: "$category" },
        {
            $lookup: {
                from: "product_colours",
                localField: "_id",
                foreignField: "productId",
                as: "colors",
                pipeline: [{ $match: { isDeleted: false } }],
            },
        },
        { $unwind: "$colors" },
        { $match: searchQuery },
        { $count: "count" },
    ]);

    const totalProducts = total.length > 0 ? total[0].count : 0;
    const pages = Math.ceil(totalProducts / limit);

    res.status(200).json({
        success: true,
        data: {
            page: page > pages ? 1 : page,
            limit,
            products,
            pages,
            total: totalProducts,
        },
    });
});

export const readProduct = asyncHandler(async (req, res, next) => {
    let { productId } = req.params;
    if (!productId || !validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format", 400));
    }

    const product = await ProductColour.aggregate([
        { $match: { _id: returnObjectId(productId), isDeleted: false } },
        {
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "productId",
                as: "product",
                pipeline: [{ $match: { isDeleted: false, isActive: true } }],
            },
        },
        { $match: { product: { $ne: [] } } },
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
        {
            $lookup: {
                from: "product_colours",
                foreignField: "productId",
                localField: "product._id",
                as: "colours",
            },
        },
        {
            $lookup: {
                from: "product_sizes",
                foreignField: "productColourId",
                localField: "_id",
                as: "sizes",
                pipeline: [{ $match: { isActive: true } }],
            },
        },
        {
            $project: {
                name: "$product.name",
                description: "$product.description",
                productId: "$product._id",
                category: "$category.name",
                price: "$product.price",
                sizes: {
                    $map: {
                        input: "$sizes",
                        as: "size",
                        in: {
                            _id: "$$size._id",
                            size: "$$size.size",
                            description: "$$size.description",
                            isAvailable: {
                                $cond: {
                                    if: { $gt: [{ $subtract: ["$$size.quantity", "$$size.sold"] }, 0] }, // quantity - sold > 0
                                    then: true,
                                    else: false,
                                },
                            },
                        },
                    },
                },
                colour: "$colour",
                images: {
                    $map: {
                        input: "$images",
                        as: "image",
                        in: { $concat: [DOMAIN, "$$image.url"] },
                    },
                },
                colours: {
                    $map: {
                        input: "$colours",
                        as: "colour",
                        in: {
                            _id: "$$colour._id",
                            colour: "$$colour.colour",
                        },
                    },
                },
            },
        },
    ]);

    return res.status(200).json({ success: true, data: { product: product[0] } });
});

// Contact Us
export const contactUs = asyncHandler(async (req, res, next) => {
    let validation = contactUsSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let { name, email, number, message } = validation.value;
    let createData = { message, name, email, number };

    if (req.user) {
        createData.name = req.user.fName + " " + req.user.lName;
        createData.email = req.user.email;
        createData.number = req.user.number;
        createData.userId = req.user._id;
    }

    await ContactUs.create(createData);

    return res.status(200).json({ success: true, message: "We will contact you shortly" });
});

export const featuredProducts = asyncHandler(async (req, res, next) => {});

export const newProducts = asyncHandler(async (req, res, next) => {
    const recentThreshold = moment().subtract(7, "days").toDate();

    const products = await ProductColour.aggregate([
        {
            $facet: {
                recentProducts: [{ $match: { isDeleted: false, createdAt: { $gte: recentThreshold } } }, { $limit: 4 }],
                allProducts: [
                    { $match: { isDeleted: false, createdAt: { $lt: recentThreshold } } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 4 },
                ],
            },
        },
        { $project: { products: { $concatArrays: ["$recentProducts", "$allProducts"] } } },
        { $project: { products: { $slice: ["$products", 4] } } },
        { $unwind: "$products" },
        {
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "products.productId",
                as: "parentProduct",
                pipeline: [
                    { $match: { isDeleted: false, isActive: true } },
                    { $lookup: { from: "categories", foreignField: "_id", localField: "category", as: "category" } },
                    { $unwind: "$category" },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            price: 1,
                            category: "$category.name",
                        },
                    },
                ],
            },
        },
        { $unwind: "$parentProduct" },
        {
            $project: {
                image: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$products.images",
                                        as: "image",
                                        cond: { $eq: ["$$image.isDefault", true] },
                                    },
                                },
                                as: "image",
                                in: { $concat: [DOMAIN, "$$image.url"] },
                            },
                        },
                        0,
                    ],
                },
                colour: "$products.colour",
                productColourId: "$products._id",
                parentProductId: "$parentProduct._id",
                name: "$parentProduct.name",
                price: "$parentProduct.price",
                category: "$parentProduct.category",
            },
        },
    ]);

    return res.status(200).json({ success: true, data: { products: products || [] } });
});
