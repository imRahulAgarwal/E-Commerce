import apiUrl from "../../config/config";
import { toast } from "react-toastify";
import toastCss from "../../config/toast";

const getToken = () => window.localStorage.getItem("token");

class User {
    async register({ fName, lName, email, number, password, confirmPassword }) {
        const url = `${apiUrl}/register`;
        const body = JSON.stringify({ fName, lName, email, number, password, confirmPassword });
        const token = getToken();

        let response = await fetch(url, {
            method: "POST",
            body,
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async login({ email, password }) {
        const url = `${apiUrl}/login`;
        const body = JSON.stringify({ email, password });
        const token = getToken();

        let response = await fetch(url, {
            method: "POST",
            body,
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async changePassword({ oldPassword, newPassword, confirmPassword }) {
        const url = `${apiUrl}/change-password`;
        const body = JSON.stringify({ oldPassword, newPassword, confirmPassword });
        const token = getToken();

        const response = await fetch(url, {
            method: "POST",
            body,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async forgotPassword({ email }) {
        const url = `${apiUrl}/forgot-password`;
        const body = JSON.stringify({ email });
        const token = getToken();

        const response = await fetch(url, {
            method: "POST",
            body,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const jsonData = await response.json();

        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async resetPassword({ newPassword, confirmPassword, token }) {
        const url = `${apiUrl}/reset-password/${token}`;
        const body = JSON.stringify({ newPassword, confirmPassword });

        const response = await fetch(url, {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async profile() {
        const url = `${apiUrl}/profile`;
        const token = getToken();

        const resposne = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const jsonData = await resposne.json();

        if (jsonData.success) {
            return jsonData;
        }

        return false;
    }

    async updateProfile({ fName, lName, email, number }) {
        const url = `${apiUrl}/profile`;
        const body = JSON.stringify({ fName, lName, email, number });
        const token = getToken();

        const response = await fetch(url, {
            method: "PATCH",
            body,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getOrders({ page, limit, sort, order }) {
        let url = `${apiUrl}/orders?page=${page}&limit=${limit}&sort=${sort}&order=${order}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getOrder(orderId) {
        let url = `${apiUrl}/orders/${orderId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async logout() {
        const url = `${apiUrl}/logout`;
        const token = getToken();

        const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        const jsonData = await response.json();
        if (jsonData.success) {
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getProducts({ page, limit, search, sort, order }) {
        let url = `${apiUrl}/products?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getProduct(productId) {
        let url = `${apiUrl}/products/${productId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async newProducts() {
        let url = `${apiUrl}/products/new`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async featuredProducts() {
        let url = `${apiUrl}/products/featured`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async readCartItems() {
        let url = `${apiUrl}/cart`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });

        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async updateCartItems({ quantity, productSizeId }) {
        if (!productSizeId) {
            toast.error("Select a size to proceed", toastCss);
            return false;
        }
        let url = `${apiUrl}/cart`;

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ productSizeId, quantity }),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });

        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async readWishlist() {
        let url = `${apiUrl}/wishlist`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });

        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async updateWishlist({ productSizeId }) {
        if (!productSizeId) {
            toast.error("Select a size to proceed", toastCss);
            return false;
        }

        let url = `${apiUrl}/wishlist`;

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ productSizeId }),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });

        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async readAddresses() {
        let url = `${apiUrl}/address`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });

        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async addAddress({ addressLine1, addressLine2, city, state, country, pincode }) {
        let url = `${apiUrl}/address`;
        let body = JSON.stringify({ addressLine1, addressLine2, city, state, country, pincode });
        let response = await fetch(url, {
            method: "POST",
            body,
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });

        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async deleteAddress(addressId) {
        let url = `${apiUrl}/address/${addressId}`;
        let response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });

        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async submitContactForm({ name, number, email, message }) {
        let url = `${apiUrl}/contact-us`;
        let body = JSON.stringify({ name, number, email, message });

        let response = await fetch(url, {
            method: "POST",
            body,
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });

        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async createOrder({ isBuyNow, addressId, productSizeId }) {
        let url = `${apiUrl}/orders`;
        let body = JSON.stringify({ isBuyNow, addressId, productSizeId });

        let response = await fetch(url, {
            method: "POST",
            body,
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });

        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async verifyPayment(razorpayResponse) {
        let url = `${apiUrl}/verify-payment`;

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(razorpayResponse),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });

        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }
}

const userService = new User();

export default userService;
