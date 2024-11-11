import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin";

const Order = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        adminPanelService.getOrder(orderId).then((data) => {});
    }, [orderId]);

    if (!order) {
        return <p>Loading...</p>;
    }

    return <div>Order</div>;
};

export default Order;
