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
const DOMAIN = process.env.DOMAIN;
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD;

// SORT all the read records by below attributes
// page, limit, sort, order and search

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
    const user = await User.findOne({ email });
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
        token,
        data: {
            id: user._id,
            fName: user.fName,
            lName: user.lName,
            email: user.email,
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

    let customerRole = await UserRole.findOne({ name: "Customer", isDeleted: false, isDynamic: false });

    const { email } = req.body;
    const user = await User.findOne({ email, role: { $ne: customerRole._id }, isDeleted: false });
    if (!user) {
        return next(new ErrorHandler("No user found with this email", 404));
    }

    // Generate token for password reset
    const resetToken = generateToken({ id: user._id });

    // Save token to user profile for verification
    user.resetPasswordToken = resetToken;
    await user.save();

    // Send reset email
    const resetUrl = `${DOMAIN}${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetUrl}`,
    });

    res.status(200).json({ success: true, data: "Password reset email sent" });
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

    const user = await User.findOne({ _id: decoded.id, resetPasswordToken: token });
    if (!user) {
        return next(new ErrorHandler("Invalid or expired token", 400));
    }

    user.password = hashPassword(newPassword);
    user.resetPasswordToken = undefined; // Clear token from user document
    user.loginTokens = [];
    await user.save();

    res.status(200).json({ success: true, data: "Password reset successful" });
});

// Profile and Password Management

// @desc    Get logged-in panel user profile
// @route   GET /api/panel/profile
export const getProfile = asyncHandler(async (req, res, next) => {
    let { fName, lName, email, number, role } = req.user;
    return res.status(200).json({ success: true, profile: { fName, lName, email, number, role: role.name } });
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

    res.status(200).json({ success: true, data: "Password updated successfully" });
});

// Dashboard

// @desc    Get dashboard data for panel user
// @route   GET /api/panel/dashboard
export const getDashboard = asyncHandler(async (req, res, next) => {});

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

    return res.status(200).json({
        success: true,
        data: {
            customers,
            pages: Math.ceil(total / limit),
            total,
            page,
            limit,
        },
    });
});

// @desc    Get details of a specific customer
// @route   GET /api/panel/customers/:customerId
export const getCustomerById = asyncHandler(async (req, res, next) => {
    let { customerId } = req.params;
    if (!customerId) {
        return next(new ErrorHandler("Provide a customer ID", 400));
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
        data: { fName, lName, email, number, _id: newCustomer._id },
    });
});

// Order Management

// @desc    Get list of orders
// @route   GET /api/panel/orders
export const getOrders = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, sort = "createdAt", order = "asc", search } = req.query;
    let searchQuery = {};

    if (search) {
        // Here we have used exact case matching to get the same order details
        searchQuery.razorpay_order_id = search;
    }

    if (order !== "asc" && order !== "desc") {
        order = "asc";
    }

    let orders = await Order.find(searchQuery, { totalAmount: 1, paymentStatus: 1, createdAt: 1, isBuyNow: 1 })
        .sort({ [sort]: order })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    let total = await Order.countDocuments(searchQuery);

    return res.status(200).json({
        success: true,
        data: {
            orders,
            pages: Math.ceil(total / limit),
            total,
            page: parseInt(page),
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

    let order = await Order.findOne({ _id: orderId })
        .populate({
            path: "products.productSizeId",
            populate: {
                path: "productColourId",
                populate: {
                    path: "productId",
                },
            },
        })
        .populate({ path: "userId" })
        .populate({ path: "address" });

    if (!order) {
        return next(new ErrorHandler("Order details not found", 404));
    }

    return res.status(200).json({ success: true, data: order });
});

// Product Management

// @desc    Get list of products
// @route   GET /api/panel/products
export const getProducts = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, sortBy = "name", order = "asc", isActive, minPrice, maxPrice } = req.query;

    const filter = { isDeleted: false };
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    if (order !== "asc" && order !== "desc") {
        order = "asc";
    }

    const products = await Product.find(filter)
        .sort({ [sortBy]: order })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
        success: true,
        data: products,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
    });
});

// @desc    Get details of a specific product
// @route   GET /api/panel/products/:productId
export const getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.productId, isDeleted: false });

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({ success: true, data: product });
});

// @desc    Create a new product
// @route   POST /api/panel/products
export const createProduct = asyncHandler(async (req, res, next) => {
    const validation = productSchema.create.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }
    const product = new Product(req.body);
    await product.save();

    await noteAudits(req.user._id, "POST", "Product", { documentId: product.id });

    return res.status(201).json({ success: true, data: product });
});

// @desc    Update a product
// @route   PUT /api/panel/products/:productId
export const updateProduct = asyncHandler(async (req, res, next) => {
    const validation = productSchema.update.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    const product = await Product.findOneAndUpdate(
        { _id: req.params.productId, isDeleted: false },
        { $set: req.body },
        { returnDocument: "after" }
    );

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await noteAudits(req.user._id, "PUT", "Product", { documentId: product.id });

    return res.status(200).json({ success: true, data: product });
});

// @desc    Delete a product
// @route   DELETE /api/panel/products/:productId
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findOneAndUpdate(
        { _id: req.params.productId, isDeleted: false },
        { isDeleted: true },
        { returnDocument: "after" }
    );

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await noteAudits(req.user._id, "DELETE", "Product", { documentId: product.id });

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
});

// @desc    Toggle product isActive status
// @route   PATCH /api/panel/products/:productId/toggle-active
export const toggleProductActiveStatus = asyncHandler(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.productId, isDeleted: false });
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product.isActive = !product.isActive;
    await product.save();

    await noteAudits(req.user._id, "PATCH", "Product", {
        documentId: product.id,
        message: `Product active status -> ${product.isActive}`,
    });

    res.status(200).json({ success: true, data: product });
});

// Product Colour Management

// @desc    Get list of product colours
// @route   GET /api/panel/product/colours
export const getProductColours = asyncHandler(async (req, res, next) => {
    let { productId } = req.query;
    if (!validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format"));
    }
    let productExists = await Product.findOne({ _id: productId, isDeleted: false });
    if (!productExists) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const colours = await ProductColour.find({ isDeleted: false });
    return res.status(200).json({ success: true, data: colours });
});

// @desc    Get details of a specific product colour
// @route   GET /api/panel/product/colours/:colourId
export const getProductColourById = asyncHandler(async (req, res, next) => {
    let { colourId } = req.params;
    if (!validateObjectId(colourId)) {
        return next(new ErrorHandler("Invalid Colour ID format", 400));
    }

    let { productId } = req.query;
    if (!validateObjectId(productId)) {
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

    return res.status(200).json({ success: true, data: colour });
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
        if (!validateObjectId(productId)) {
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

        await noteAudits(req.user._id, "POST", "Product Colour", { documentId: newColour.id });

        res.status(201).json({ success: true, data: newColour });
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
        if (!validateObjectId(productId)) {
            return next(new ErrorHandler("Invalid Product ID format"));
        }

        let { colourId } = req.params;
        if (!validateObjectId(colourId)) {
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

        if (removeImages.includes(mainImage.id)) {
            if (!allImages["main-image"] || !allImages["main-image"].length) {
                return next(new ErrorHandler("Main Image is required", 400));
            } else {
                removeImage(mainImage.url);
                mainImage = saveImage(colour.productId.toString(), colour.id, allImages["main-image"][0]);
                images.push({ url: mainImage, isDefault: true });
            }
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

        await noteAudits(req.user._id, "PUT", "Product Colour", { documentId: colour.id });

        res.status(200).json({ success: true, data: colour });
    }),
];

// @desc    Delete a product colour
// @route   DELETE /api/panel/product/colours/:colourId
export const deleteProductColour = asyncHandler(async (req, res, next) => {
    const colour = await ProductColour.findOneAndUpdate(
        { _id: req.params.colourId, isDeleted: false },
        { isDeleted: true },
        { returnDocument: "after" }
    );

    if (!colour) {
        return next(new ErrorHandler("Colour not found", 404));
    }

    await noteAudits(req.user._id, "DELETE", "Product Colour", { documentId: colour.id });

    return res.status(200).json({ success: true, message: "Colour removed successfully" });
});

// @desc    Get list of product sizes
// @route   GET /api/panel/product/sizes
export const getProductSizes = asyncHandler(async (req, res, next) => {
    const { productId, productColourId } = req.query;

    // Validate product and color existence
    await validateExistence(productId, productColourId, next);

    const sizes = await ProductSize.find({ productColourId });
    res.status(200).json({ success: true, data: sizes });
});

// @desc    Get details of a specific product size
// @route   GET /api/panel/product/sizes/:sizeId
export const getProductSizeById = asyncHandler(async (req, res, next) => {
    const { productId, productColourId } = req.query;
    const { sizeId } = req.params;

    if (!validateObjectId(sizeId)) {
        return next(new ErrorHandler("Invalid Product Size ID format", 400));
    }

    await validateExistence(productId, productColourId, next);

    const size = await ProductSize.findById(sizeId);
    if (!size) {
        return next(new ErrorHandler("Product size not found", 404));
    }
    res.status(200).json({ success: true, data: size });
});

// @desc    Create a new product size
// @route   POST /api/panel/products/sizes
export const createProductSize = asyncHandler(async (req, res, next) => {
    const { productId, productColourId } = req.query;
    const validation = productSizeSchema.validate(req.body);

    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    await validateExistence(productId, productColourId, next);

    const newSize = new ProductSize({ ...req.body, productColourId });
    await newSize.save();

    await noteAudits(req.user._id, "POST", "Product Size", { documentId: newSize.id });

    res.status(201).json({ success: true, data: newSize });
});

// @desc    Update a product size
// @route   PUT /api/panel/product/sizes/:sizeId
export const updateProductSize = asyncHandler(async (req, res, next) => {
    const { productId, productColourId } = req.query;
    const { sizeId } = req.params;

    if (!validateObjectId(sizeId)) {
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

    await noteAudits(req.user._id, "PUT", "Product Size", { documentId: updatedSize.id });

    res.status(200).json({ success: true, data: updatedSize });
});

// @desc    Update active status of a product size
// @route   PATCH /api/panel/product/sizes/:sizeId
export const toggleProductSizeActiveStatus = asyncHandler(async (req, res, next) => {
    const { productId, productColourId } = req.query;
    const { sizeId } = req.params;

    if (!validateObjectId(sizeId)) {
        return next(new ErrorHandler("Invalid Product Size ID format", 400));
    }

    await validateExistence(productId, productColourId, next);

    const productSize = await ProductSize.findOne({ _id: sizeId });
    if (!productSize) {
        return next(new ErrorHandler("Product size not found", 404));
    }

    productSize.isActive = !productSize.isActive;
    await productSize.save();

    await noteAudits(req.user._id, "PATCH", "Product Size", {
        documentId: updatedSize.id,
        message: `Product size active status -> ${productSize.isActive}`,
    });

    res.status(200).json({ success: true, message: "Product size active status updated" });
});

// Function to validate existence of product and color
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

    const color = await ProductColour.findOne({ _id: productColourId, isDeleted: false });
    if (!color) {
        throw new ErrorHandler("Product color not found", 404);
    }
};

// Product Inventory Management

// @desc    Update the stock of a product
// @route   PATCH /api/panel/product/stock
export const updateProductStock = asyncHandler(async (req, res, next) => {
    let { sizeId } = req.params;
    if (!validateObjectId(sizeId)) {
        return next(new ErrorHandler("Invalid Product Size ID format", 400));
    }

    let productSize = await ProductSize.findOne({ _id: sizeId });
    if (!productSize) {
        return next(new ErrorHandler("Product Size details not found", 404));
    }

    let quantity = req.body.quantity;
    quantity = Number(quantity) ? Number(quantity) : productSize.quantity;
    productSize.quantity = productSize.quantity + quantity;

    await productSize.save();

    await noteAudits(req.user._id, "PATCH", "Product Size", {
        documentId: productSize.id,
        data: {
            update: `${quantity} units updated for the product size`,
            before: productSize.quantity - quantity,
            after: productSize.quantity,
        },
    });

    return res.status(200).json({ success: true, message: "Product stock quantity updated" });
});

// @desc    Update the price of a product
// @route   PATCH /api/panel/product/price
export const updateProductPrice = asyncHandler(async (req, res, next) => {
    let { productId } = req.params;
    if (!validateObjectId(productId)) {
        return next(new ErrorHandler("Invalid Product ID format", 400));
    }

    let productExists = await Product.findOne({ _id: productId, isDeleted: false });
    if (!productExists) {
        return next(new ErrorHandler("Product details not found", 404));
    }

    let price = req.body.price;
    price = Number(price) ? Number(price) : productExists.price;

    productExists.set("price", price);
    await productExists.save();

    await noteAudits(req.user._id, "PATCH", "Product", {
        documentId: productExists.id,
        data: {
            update: `${price} amount updated for the product`,
            before: productExists.price - price,
            after: productExists.price,
        },
    });

    return res.status(200).json({ success: true, message: "Product price updated" });
});

// Audit Management

// @desc    Get list of audit records
// @route   GET /api/panel/audits
export const getAudits = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, order = "asc", sort = "createdAt", search } = req.query;
    let searchQuery = {};
    if (search) {
        searchQuery.targetModule = { $regex: search, $options: "i" };
    }

    if (order !== "asc" && order !== "desc") {
        order = "asc";
    }

    let audits = await AuditLogs.find(searchQuery)
        .sort({ [sort]: order })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "userId", select: "fName lName email role", populate: { path: "role", select: "name" } })
        .lean();

    let total = await AuditLogs.countDocuments(searchQuery);

    return res.status(200).json({
        success: true,
        data: {
            audits,
            page: parseInt(page),
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

// @desc    Get details of a specific audit record
// @route   GET /api/panel/audits/:auditId
export const getAuditById = asyncHandler(async (req, res, next) => {
    let { auditId } = req.params;
    if (!auditId) {
        return next(new ErrorHandler("Provide an audit ID", 400));
    }

    let audit = await AuditLogs.findOne({ _id: auditId }).populate({
        path: "userId",
        select: "fName lName email role",
        populate: { path: "role", select: "name" },
    });

    if (!audit) {
        return next(new ErrorHandler("Audit details not found", 404));
    }

    return res.status(200).json({ success: true, data: audit });
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
    let roles = await UserRole.find({ isDeleted: false }).populate("permissions", "_id name").select("-isDeleted");
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
        await UserPermission.findOne({ _id: permission }).then((data) => permissionIds.push(data._id));
    }

    let newRole = await UserRole.create({ name, description, permissions: permissionIds });

    await noteAudits(req.user._id, "POST", "Roles", { documentId: newRole.id });

    return res.status(201).json({
        success: true,
        message: "User role details added",
        data: {
            role: {
                _id: newRole._id,
                name,
                createdAt: newRole.createdAt,
                isDynamic: newRole.isDynamic,
            },
        },
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
        await UserPermission.findOne({ _id: permission }).then((data) => permissionIds.push(data._id));
    }

    let updatedData = await UserRole.findOneAndUpdate(
        { _id: roleId, isDeleted: false },
        { $set: { name, description, permissions: permissionIds } },
        { returnDocument: "after" }
    );

    await noteAudits(req.user._id, "PUT", "Roles", { documentId: updatedData.id });

    return res.status(201).json({
        success: true,
        message: "User role details updated",
        data: {
            role: {
                _id: updatedData._id,
                name,
                createdAt: updatedData.createdAt,
                isDynamic: updatedData.isDynamic,
            },
        },
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

    await noteAudits(req.user._id, "DELETE", "Roles", { documentId: role.id });

    return res.status(200).json({ success: true, message: "User role details removed" });
});

// Panel User Management

// @desc    Get list of panel users
// @route   GET /api/panel-users
export const getPanelUsers = asyncHandler(async (req, res, next) => {
    let { page = 1, limit = 10, sort = "fName", order = "asc", search } = req.query;
    let searchQuery = { isCustomer: false, isDeleted: false };
    if (search) {
        searchQuery.$or = [{ fName: { $regex: search, $options: "i" } }, { lName: { $regex: search, $options: "i" } }];
    }

    if (order !== "asc" && order !== "desc") {
        order = "asc";
    }

    let panelUsers = await User.find(searchQuery, { fName: 1, role: 1, lName: 1, email: 1, number: 1 })
        .sort({ [sort]: order })
        .populate("role", "_id name")
        .skip((page - 1) * limit)
        .limit(limit);

    let total = await User.countDocuments(searchQuery);
    return res.status(200).json({
        success: true,
        data: {
            panelUsers,
            page: parseInt(page),
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

// @desc    Get details of a specific panel user
// @route   GET /api/panel-users/:panelUserId
export const getPanelUserById = asyncHandler(async (req, res, next) => {
    let { panelUserId } = req.params;
    if (!validateObjectId(panelUserId)) {
        return next(new ErrorHandler("Invalid Panel User ID format", 400));
    }

    let panelUser = await User.findOne(
        { _id: panelUserId, isDeleted: false, isCustomer: false },
        { fName: 1, role: 1, lName: 1, email: 1, number: 1 }
    ).populate({ path: "role", populate: { path: "permissions", select: "_id name" } });
    if (!panelUser) {
        return next(new ErrorHandler("Panel User details not found", 404));
    }

    return res.status(200).json({ success: true, data: panelUser });
});

// @desc    Create a new panel user
// @route   POST /api/panel-users
export const createPanelUser = asyncHandler(async (req, res, next) => {
    let validation = panelUserSchema.validate(req.body);
    if (validation.error) {
        return next(new ErrorHandler(validation.error.details[0].message, 400));
    }

    let { fName, lName, email, number, roleId } = req.body;

    if (!validateObjectId(roleId)) {
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
    let newPanelUser = await User.create({ fName, lName, email, number, password: hashedPassword, role: userRole._id });

    await newPanelUser.populate("role", "_id name");

    await noteAudits(req.user._id, "POST", "Panel Users", { documentId: newPanelUser.id });

    return res.status(200).json({
        success: true,
        message: "Panel user details added",
        data: { fName, lName, email, number, role: newPanelUser.role },
    });
});

// @desc    Update a panel user
// @route   PUT /api/panel-users/:panelUserId
export const updatePanelUser = asyncHandler(async (req, res, next) => {
    let { panelUserId } = req.params;
    if (!validateObjectId(panelUserId)) {
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

    await noteAudits(req.user._id, "PUT", "Panel Users", { documentId: updatedData.id });

    return res.status(200).json({
        success: true,
        message: "Panel user details updated",
        data: { fName, lName, email, number, role: updatedData.role },
    });
});

// @desc    Delete a panel user
// @route   DELETE /api/panel-users/:panelUserId
export const deletePanelUser = asyncHandler(async (req, res, next) => {
    let { panelUserId } = req.params;
    if (!validateObjectId(panelUserId)) {
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

    await noteAudits(req.user._id, "DELETE", "Panel Users", { documentId: panelUserExists.id });

    return res.status(200).json({ success: true, message: "Panel user details removed" });
});

// Logout

// @desc    Log out a panel user
// @route   POST /api/panel/logout
export const logout = asyncHandler(async (req, res, next) => {
    let token = req.headers["authorization"]?.split(" ")[1];
    await User.updateOne({ _id: req.user._id, isDeleted: false, isCustomer: false }, { $pull: { loginTokens: token } });
    return res.status(200).json({ success: true, message: "User logged out" });
});
