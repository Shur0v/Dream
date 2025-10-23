"use client";

import React from "react";
import TopPart from "../components/toppart/page";
import Reviews from "../components/Reviews";
import RelatedProduct from "../components/RelatedProduct";
import ShopInstagram from "../components/ShopInstagram";
import ForYou from "../../home/components/ForYou";

interface PageProps {
  params: { slug: string };
}

export default function ProductDetailsPage({ params }: PageProps) {
  const { slug } = params;

  // Placeholder product data; replace with real fetch later
  const product = {
    id: "p-1",
    slug,
    name: "One Life Graphic T-shirt",
    price: 192.00,
    oldPrice: undefined,
    rating: 4,
    reviewsCount: 150,
    images: [
      "/common/cart/image1.png",
      "/common/cart/image2.jpg",
      "/common/cart/image3.png",
    ],
    description: "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    category: "Electric",
    orderId: "#12345678A",
    seller: "Daily Shipping",
    colors: ["Lemon", "Red", "Green", "Yellow", "Blue", "Black", "White"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
  };

  return (
    <div className="father w-full bg-white flex flex-col justify-start items-center py-8" role="main" data-layer="father">
      {/* father = full width product details section */}
      
      <div className="daughter w-full mx-auto px-4" data-layer="daughter">
        {/* daughter = design holder for entire product details section */}
        
        {/* Top Part - Contains ProductGallery, ProductInfo, and DeliveryInfo */}
        <TopPart product={product} images={product.images} />

        {/* Reviews Section */}
        <div className="mt-12">
          <Reviews rating={product.rating} reviewsCount={product.reviewsCount} />
        </div>

        {/* Related Product Section */}
        <RelatedProduct />

        {/* Shop Instagram Section */}
        <ShopInstagram />

        {/* For You Section */}
        <ForYou />
      </div>
    </div>
  );
}


