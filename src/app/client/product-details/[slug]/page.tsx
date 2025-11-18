import React from "react";
import TopPart from "../components/toppart";
import Reviews from "../components/Reviews";
import RelatedProduct from "../components/RelatedProduct";
import ShopInstagram from "../components/ShopInstagram";
import ForYou from "../../home/components/ForYou";
import DeliveryInfo from "../components/toppart/DeliveryInfo";
import { getProductById } from "@backend/lib/db";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch product data directly from database using the slug (which is the product ID)
  // Try exact match first, then try without any trailing suffix (e.g., "-0", "-1")
  let product = await getProductById(slug);
  
  // If not found, try removing trailing suffix pattern (e.g., "product-123-0" -> "product-123")
  if (!product && slug.includes('-')) {
    const baseId = slug.replace(/-\d+$/, ''); // Remove trailing "-number" pattern
    if (baseId !== slug) {
      product = await getProductById(baseId);
    }
  }

  // If product not found, show error or redirect
  if (!product) {
    console.error(`Product not found. Searched for ID: "${slug}"`);
    return (
      <div className="w-full bg-white flex flex-col justify-center items-center py-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <p className="text-sm text-gray-500 mb-4">Product ID: {slug}</p>
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
    id: product.id,
    slug: slug,
    name: product.name,
    price: product.price,
    oldPrice: product.originalPrice,
    rating: 4.5, // Default rating, can be enhanced later
    reviewsCount: 0, // Default reviews count, can be enhanced later
    images: product.images && product.images.length > 0 ? product.images : ['/placeholder-image.png'],
    description: product.description || "No description available.",
    category: product.category,
    orderId: `#${product.id.slice(-8).padStart(8, '0')}A`,
    seller: product.sellerId || "Verified Seller",
    colors: product.colors || [],
    sizes: product.size || [],
    inStock: product.isActive !== false && (product.stock ?? 0) > 0,
  };

  return (
    <div className="w-full bg-white flex flex-col justify-start items-center gap-10 py-6 sm:py-8">
      {/* Top Part - Contains ProductGallery, ProductInfo, and DeliveryInfo */}
      <TopPart product={productData} images={productData.images} />

      {/* Reviews Section */}
      <section className="w-full max-w-[1320px] mx-auto px-2">
        <Reviews rating={productData.rating} reviewsCount={productData.reviewsCount} />
      </section>

      {/* Related Product Section */}
      <RelatedProduct />

      {/* Shop Instagram Section */}
      <ShopInstagram />

      {/* For You Section */}
      <ForYou />

      {/* Mobile Delivery Info */}
      <section className="lg:hidden w-full max-w-[1320px] mx-auto px-2">
        <DeliveryInfo />
      </section>
    </div>
  );
}


