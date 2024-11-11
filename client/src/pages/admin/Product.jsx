import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin";

const Product = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        adminPanelService.getProduct(productId).then((data) => {});
    }, [productId]);

    if (!product) {
        return <p>Loading...</p>;
    }

    return <div>Product</div>;
};

export default Product;
