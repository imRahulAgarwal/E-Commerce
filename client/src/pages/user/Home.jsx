import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
    const images = ["hero-image-clothes.jpg", "hero-image-shirts.jpg", "hero-image-tshirts.jpg"];

    const newProducts = useSelector((state) => state.products.newProducts);
    const featuredProducts = useSelector((state) => state.products.featuredProducts);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <Swiper
                style={{ height: "500px" }} // Inline style for Swiper
                navigation={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={true}
                modules={[Navigation, Autoplay]}
                className="w-full relative">
                {images.map((src, index) => (
                    <SwiperSlide key={index} className="h-full">
                        <img src={src} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                    </SwiperSlide>
                ))}
                <div className="absolute bg-black opacity-50 inset-0 z-10"></div>
            </Swiper>

            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Featured Products</h2>
                    <div
                        className={`grid grid-cols-1 ${
                            featuredProducts.length ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : ""
                        }`}>
                        {featuredProducts.length ? (
                            featuredProducts.map((product) => (
                                <Link
                                    to={`/product/${product.productColourId}`}
                                    key={product.productColourId}
                                    className="bg-gray-100 border rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] p-4">
                                    <img
                                        src={product.image}
                                        alt={`${product.name} - ${product.colour}`}
                                        className="w-full aspect-square max-h-[300px] max-w-[300px] object-contain mx-auto rounded-t-lg"
                                    />
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-gray-900">
                                            {product.name} - {product.colour}
                                        </h3>
                                        <span className="text-sm text-gray-500">{product.category}</span>
                                        <p className="font-bold mt-2 text-gray-700">₹ {product.price}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="border bg-gray-100 w-full py-3 text-center text-lg rounded shadow">
                                <p>Inventory is updating, Stay Tuned!</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-8">
                        <a
                            href="/shop"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                            Show More
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">New Arrivals</h2>
                    <div
                        className={`grid grid-cols-1 ${
                            newProducts.length ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : ""
                        }`}>
                        {newProducts.length ? (
                            newProducts.map((product) => (
                                <Link
                                    to={`/product/${product.productColourId}`}
                                    key={product.productColourId}
                                    className="bg-gray-100 border rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] p-4">
                                    <img
                                        src={product.image}
                                        alt={`${product.name} - ${product.colour}`}
                                        className="w-full aspect-square max-h-[300px] max-w-[300px] object-contain mx-auto rounded-t-lg"
                                    />
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-gray-900">
                                            {product.name} - {product.colour}
                                        </h3>
                                        <span className="text-sm text-gray-500">{product.category}</span>
                                        <p className="font-bold mt-2 text-gray-700">₹ {product.price}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="border bg-gray-100 w-full py-3 text-center text-lg rounded shadow">
                                <p>Inventory is updating, Stay Tuned!</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-8">
                        <a
                            href="/shop"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                            Show More
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
