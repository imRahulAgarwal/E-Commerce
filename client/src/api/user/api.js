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

    async getOrders({ page, limit, search, sort, order }) {
        let url = `${apiUrl}/panel/orders?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getOrder(orderId) {}

    async createOrder() {}

    async getCategories() {
        let url = `${apiUrl}/panel/categories`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getCategory(categoryId) {
        let url = `${apiUrl}/panel/categories/${categoryId}`;

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
        let url = `${apiUrl}/panel/products?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getProduct(productId) {
        let url = `${apiUrl}/panel/products/${productId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }
}

const userService = new User();

export default userService;
