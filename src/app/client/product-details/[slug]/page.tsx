import React from "react";
import TopPart from "../components/toppart";
import Reviews from "../components/Reviews";
import RelatedProduct from "../components/RelatedProduct";
import ShopInstagram from "../components/ShopInstagram";
import ForYou from "../../home/components/ForYou";
import { getProductById } from "@/lib/productData";

export default function ProductDetailsPage({ params }: any) {
  const { slug } = params;
  
  // Convert slug to product ID and fetch product data
  const productId = parseInt(slug);
  const product = getProductById(productId);

  // If product not found, show error or redirect
  if (!product) {
    return (
      <div className="w-full bg-white flex flex-col justify-center items-center py-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <a 
          href="/client/categories" 
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Back to Categories
        </a>
      </div>
    );
  }

  // Transform product data to match the expected format
  const productData = {
    id: product.id.toString(),
    slug: slug,
    name: product.name,
    price: product.price,
    oldPrice: product.originalPrice,
    rating: product.rating,
    reviewsCount: product.reviews,
    images: [product.image], // Using single image for now
    description: product.description || "No description available.",
    category: product.category,
    orderId: `#${product.id.toString().padStart(8, '0')}A`,
    seller: product.seller || "Verified Seller",
    colors: product.colors || ["Default"],
    sizes: product.sizes,
    inStock: product.inStock !== false,
  };

  return (
    <div className="father w-full bg-white flex flex-col justify-start items-center py-8" role="main" data-layer="father">
      {/* father = full width product details section */}
      
      <div className="daughter w-full mx-auto px-4" data-layer="daughter">
        {/* daughter = design holder for entire product details section */}
        
        {/* Top Part - Contains ProductGallery, ProductInfo, and DeliveryInfo */}
        <TopPart product={productData} images={productData.images} />

        {/* Reviews Section */}
        <div className="mt-12">
          <Reviews rating={productData.rating} reviewsCount={productData.reviewsCount} />
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


