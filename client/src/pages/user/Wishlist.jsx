import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import userService from "../../api/user/api";
import { setUserWishlist } from "../../store/auth/userAuthSlice";

const Wishlist = ({ isWishlistOpen, closeWishlist, navigateToShop }) => {
    const wishlist = useSelector((state) => state.userAuth.wishlist);
    const dispatch = useDispatch();

    // Function to remove an item from the wishlist
    const removeFromWishlist = (productId) => {
        userService.updateWishlist({ productSizeId: productId }).then((data) => {
            if (data.success) {
                userService.readWishlist().then(({ data }) => {
                    dispatch(setUserWishlist(data));
                });
            }
        });
    };

    const handleAddToFav = () => {
        closeWishlist();
        navigateToShop();
    };

    return (
        <div
            className={`fixed z-50 top-0 right-0 h-full bg-white shadow-lg p-4 w-64 transform transition-transform duration-300 ${
                isWishlistOpen ? "translate-x-0" : "translate-x-full"
            }`}>
            <button className="absolute top-4 right-4 text-gray-600" onClick={closeWishlist}>
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>

            <h2 className="text-xl font-bold mb-4">Your Wishlist</h2>

            {wishlist.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {wishlist.map((item) => (
                        <div key={item.id} className="border-b pb-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="aspect-square max-w-20 object-cover object-top"
                                />
                                <div className="flex-1 flex flex-col gap-2">
                                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                                    <span className="text-sm text-gray-500">Colour: {item.colour}</span>
                                    <span className="text-sm text-gray-500">Size: {item.size}</span>
                                </div>
                                <button
                                    className="p-1 bg-red-500 hover:bg-red-600 text-white rounded"
                                    onClick={() => removeFromWishlist(item.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600">Your wishlist is empty!</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleAddToFav}>
                        Start Adding Favorites
                    </button>
                </div>
            )}
        </div>
    );
};

export default React.memo(Wishlist);
