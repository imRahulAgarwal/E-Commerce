# 🛒 E-Commerce Website (MERN Stack)

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack and Libraries](#tech-stack-and-libraries)
    - [Frontend](#frontend)
    - [Backend](#backend)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Live Demo](#live-demo)
6. [Application Features](#application-features)
    - [Frontend Features](#frontend-features)
    - [Backend Features](#backend-features)
7. [Payments Disclaimer](#payments-disclaimer)
8. [Contact](#contact)

---

## 📝 Overview

A fully functional e-commerce website developed using the **MERN Stack** (MongoDB, Express, React, Node.js). This project combines a dynamic **frontend** with a robust **backend** to deliver an optimized and feature-rich user experience.

---

## 🛠️ Tech Stack and Libraries

### **Frontend**

| **Technology/Library**   | **Description**               |
| ------------------------ | ----------------------------- |
| **React**                | Frontend UI Library           |
| **Redux Toolkit**        | State Management              |
| **React Router DOM**     | Client-Side Routing           |
| **Tailwind CSS**         | Utility-First CSS Framework   |
| **Chart.js**             | Data Visualization and Graphs |
| **TanStack React Table** | Advanced Table Management     |
| **FontAwesome Icons**    | Icon Library for Enhanced UI  |
| **Moment.js**            | Date Formatting               |

### **Backend**

| **Technology/Library** | **Description**                    |
| ---------------------- | ---------------------------------- |
| **Node.js**            | JavaScript Runtime Environment     |
| **Express.js**         | Backend Framework                  |
| **MongoDB**            | NoSQL Database                     |
| **Mongoose**           | MongoDB ODM (Object Data Modeling) |
| **JWT (JsonWebToken)** | Authentication and Authorization   |
| **Joi**                | Data Validation                    |
| **Express Rate Limit** | API Rate Limiting                  |
| **Winston**            | Logging and Error Tracking         |
| **Multer**             | File Uploads                       |
| **Nodemailer**         | Email Notifications                |
| **Bcrypt**             | Password Hashing and Security      |
| **Razorpay SDK**       | Payment Gateway Integration        |

---

## 🛠️ Installation

### 🔹 Prerequisites

Ensure the following are installed on your system:

-   **Node.js**: [Download Node.js](https://nodejs.org/)
-   **MongoDB**: [Download MongoDB](https://www.mongodb.com/try/download/community)

### 🔹 Project Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/imRahulAgarwal/E-Commerce.git
    ```

---

### Backend Setup:

1. **Navigate to the _server_ (backend) folder:**

    ```bash
    cd ./server
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set environment variables:**

    Create a `.env` file in the `server` folder with the following example values:

    ```env
    # Server Configuration
    PORT=5000
    MONGO_URL=mongodb://localhost:27017/ecommerce
    JWT_SECRET=your_jwt_secret
    DOMAIN=http://localhost:5000/
    NODE_ENV=DEVELOPMENT
    DEFAULT_PASSWORD=ecommerce123456
    ALLOWED_ORIGINS=http://localhost:5173,

    # Default Admin Credentials
    ADMIN_EMAIL=admin@example.com
    ADMIN_FNAME=Admin
    ADMIN_LNAME=User
    ADMIN_PASSWORD=Admin@123

    # Payment Gateway (Razorpay)
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret

    # Frontend Reset Password URLs
    ADMIN_PANEL_RESET_PASSWORD_URL=http://localhost:5173/panel/reset-password/
    USER_RESET_PASSWORD_URL=http://localhost:5173/reset-password/
    ```

4. **Run the backend server:**

    ```bash
    npm start
    ```

---

### Frontend Setup:

1. **Navigate to the _client_ (frontend) folder:**

    ```bash
    cd ../client
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set environment variables:**

    Create a `.env` file in the `client` folder with the following example value:

    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

4. **Run the frontend server:**

    ```bash
    npm run dev
    ```

---

### 🔹 Access the Application:

-   **Frontend:** `http://localhost:5173`
-   **Backend:** `http://localhost:5000`

---

## 🌐 Live Demo

Check out the live version of the application:

-   **Frontend Live Demo:** [https://ecommerce.rahulcoder.in](https://ecommerce.rahulcoder.in)
-   **Admin Panel Live Demo (Video Recording):** [Watch Video](https://link-to-your-video.com)

---

## ⚙️ Application Features

### **Frontend Features**

-   **Responsive Design:**  
    The application is mobile-first and adapts seamlessly across various screen sizes for an optimal user experience.

-   **User-Friendly Navigation:**  
    Implemented with **React Router DOM**, ensuring smooth transitions between pages.

-   **Interactive UI Components:**  
    Designed with **Tailwind CSS** for a clean and visually appealing layout, including intuitive forms, modals, and tables.

-   **Graphical Reports and Analytics: (Admin Panel)**  
    Integrated **Chart.js** for visualizing sales performance and user engagement metrics.

-   **Advanced Table Functionality: (Admin Panel)**  
    Powered by **TanStack React Table**, offering pagination, sorting, and filtering for managing large datasets.

---

### **Backend Features**

-   **Error Handling:**  
    All endpoints include robust error handling using middleware. Custom error class ensure proper status codes and clear error messages are sent to the client.

-   **File Uploads:**  
    Secure and scalable file uploads managed with **Multer**, including file type validation.

-   **Error Logging:**  
    Server-side errors are logged using **Winston** for debugging and ensuring system reliability.

-   **Data Validation:**  
    Inputs are validated using **Joi** to maintain data integrity and security.

-   **Rate Limiting:**  
    API rate limiting is implemented via **Express Rate Limit** to protect against abuse.

-   **Authentication and Authorization:**  
    Secure authentication mechanisms with **JWT** for token-based access control.

-   **Payment Gateway Integration:**  
    Razorpay is integrated for secure and test-ready payment handling.

---

## ⚠️ Payments Disclaimer

The payment system in this application is configured in **test mode** using Razorpay. Transactions are simulated for development and testing purposes and are not processed in a live environment.

**📌 Note:** You can switch to live mode by updating the Razorpay API keys in the `.env` file. Ensure compliance with Razorpay’s policies.

---

## 📬 Contact

-   **Email:** [imagarwal05@gmail.com](mailto:imagarwal05@gmail.com)
-   **GitHub:** [imRahulAgarwal](https://github.com/imRahulAgarwal)
-   **Instagram:** [rahul.coder](https://instagram.com/rahul.coder)
-   **YouTube:** [rahul.coder12](https://www.youtube.com/@rahul.coder12)

---
