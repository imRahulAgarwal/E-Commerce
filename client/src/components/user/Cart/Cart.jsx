import { faMinus, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import userService from "../../../api/user/api";
import { setUserCart } from "../../../store/auth/userAuthSlice";

const Cart = ({ isCartOpen, closeCart, handleProceedToCheckout, navigateToShop }) => {
    const cart = useSelector((state) => state.userAuth.cart);
    const dispatch = useDispatch();

    const updateCartProductQuantity = (quantity, productId) => {
        userService.updateCartItems({ quantity, productSizeId: productId }).then((data) => {
            if (data.success) {
                userService.readCartItems().then(({ data }) => {
                    dispatch(setUserCart(data));
                });
            }
        });
    };

    const handleStartShopping = () => {
        closeCart();
        navigateToShop();
    };

    return (
        <div
            className={`flex flex-col fixed z-50 top-0 right-0 bottom-0 bg-white shadow-lg p-4 w-64 transform transition-transform duration-300 ${
                isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}>
            <button className="absolute top-4 right-4 text-gray-600" onClick={closeCart}>
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>

            <h2 className="text-xl font-bold mb-4">Your Cart</h2>

            {cart.length > 0 ? (
                <>
                    <div className="flex flex-col gap-4 overflow-auto">
                        {cart.map((item) => (
                            <div key={item.id} className="border-b pb-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="aspect-square max-w-20 object-cover object-top"
                                    />
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex flex-col">
                                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                                            <span className="text-sm text-gray-500">Colour: {item.colour}</span>
                                            <span className="text-sm text-gray-500">Size: {item.size}</span>
                                            <p className="text-gray-700">₹ {item.price}</p>
                                        </div>
                                        <div className="flex justify-between items-center gap-2 w-full">
                                            <button
                                                className="p-1 bg-gray-200 hover:bg-gray-300 rounded px-2"
                                                onClick={() => updateCartProductQuantity(-1, item.id)}>
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="p-1 bg-gray-200 hover:bg-gray-300 rounded px-2"
                                                onClick={() => updateCartProductQuantity(1, item.id)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md w-full mt-auto hover:bg-blue-600 transition"
                        onClick={handleProceedToCheckout}>
                        Proceed to Checkout
                    </button>
                </>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600">Your cart is empty!</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleStartShopping}>
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default React.memo(Cart);
