import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";

const Home = () => {
    const images = [
        "https://fastly.picsum.photos/id/297/1920/1080.jpg?hmac=GLadsqgmogEfvn81iBWN-0FF519qTyHTZK7DDCYdICA",
        "https://fastly.picsum.photos/id/109/1920/1080.jpg?hmac=57ynZckscQl_8eKNv3QfKjKoGVCM4IqDUaM921uWwpQ",
        "https://fastly.picsum.photos/id/110/1920/1080.jpg?hmac=iK7v9di6IQ0YMzcnkQ1aX7oXYb88N3QM017gbIJ4poM",
        "https://fastly.picsum.photos/id/111/1920/1080.jpg?hmac=Am4tE7hXj7jd_-ukxXCGJCPy0RpOhezIxyEkLviMfP4",
    ];

    const products = [
        {
            id: 1,
            title: "Product 1",
            price: "$50",
            image: "https://fastly.picsum.photos/id/297/200/200.jpg?hmac=elahxndleNOPlIfCfcZuJFmS-MkvvkXnQozwsyqF-FU",
        },
        {
            id: 2,
            title: "Product 2",
            price: "$75",
            image: "https://fastly.picsum.photos/id/297/200/200.jpg?hmac=elahxndleNOPlIfCfcZuJFmS-MkvvkXnQozwsyqF-FU",
        },
        {
            id: 3,
            title: "Product 3",
            price: "$120",
            image: "https://fastly.picsum.photos/id/297/200/200.jpg?hmac=elahxndleNOPlIfCfcZuJFmS-MkvvkXnQozwsyqF-FU",
        },
        {
            id: 4,
            title: "Product 4",
            price: "$200",
            image: "https://fastly.picsum.photos/id/297/200/200.jpg?hmac=elahxndleNOPlIfCfcZuJFmS-MkvvkXnQozwsyqF-FU",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-gray-100">
                <Swiper
                    navigation={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    modules={[Navigation, Autoplay]}
                    className="w-full h-80 md:h-[500px]">
                    {images.map((src, index) => (
                        <SwiperSlide key={index}>
                            <img src={src} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Product Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition p-4">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-48 object-cover rounded-t-md"
                                />
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                                    <p className="text-blue-600 font-medium mt-2">{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
