import express from "express";
import { rateLimit } from "express-rate-limit";
import * as controller from "../controllers/controller.js";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, // 100 Requests / 15 Minutes
    handler: (req, res, next, options) => {
        return res.status(options.statusCode).json({ success: false, message: options.message });
    },
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20, // 20 Requests / 60 Minutes
    handler: (req, res, next, options) => {
        return res.status(options.statusCode).json({ success: false, message: options.message });
    },
});

router.get("/products", controller.readProducts);
router.get("/products/:productId", controller.readProduct);

router.post("/contact-us", authLimiter, controller.contactUs);

router.post("/register", authLimiter, isNotLoggedIn, controller.register);
router.post("/login", authLimiter, isNotLoggedIn, controller.login);
router.post("/forgot-password", authLimiter, isNotLoggedIn, controller.forgotPassword);
router.post("/reset-password", authLimiter, isNotLoggedIn, controller.resetPassword);

router.use(limiter);
router.use(isLoggedIn);

router.get("/profile", controller.profile);
router.patch("/profile", controller.updateProfile);
router.post("/change-password", controller.changePassword);

router.get("/address", controller.readAddresses);
router.get("/address/:addressId", controller.readAddress);
router.post("/address", controller.createAddress);
router.patch("/address/:addressId", controller.updateAddress);
router.delete("/address/:addressId", controller.deleteAddress);

router.get("/cart", controller.readCartItems);
router.post("/cart", controller.updateCartItems);

router.get("/wishlist", controller.readWishlist);
router.post("/wishlist", controller.updateWishlist);

router.get("/orders", controller.readOrders);
router.get("/orders/:orderId", controller.readOrder);
router.post("/orders", controller.createOrder);
router.post("/verify-payment", controller.verifyPayment);

router.post("/logout", controller.logout);

export default router;
