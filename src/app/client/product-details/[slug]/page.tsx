import React from "react";
import TopPart from "../components/toppart";
import Reviews from "../components/Reviews";
import RelatedProduct from "../components/RelatedProduct";
import ShopInstagram from "../components/ShopInstagram";
import ForYou from "../../home/components/ForYou";
import DeliveryInfo from "../components/toppart/DeliveryInfo";
import { getReviewsByProduct } from '@backend/lib/db';

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch product data from Express backend API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  // Try exact match first
  let productResponse = await fetch(`${apiUrl}/products/${slug}`, {
    cache: 'no-store',
  }).catch(() => null);
  
  let product = null;
  
  if (productResponse && productResponse.ok) {
    const result = await productResponse.json();
    if (result.success && result.data) {
      product = result.data;
    }
  }
  
  // If not found, try removing trailing suffix pattern (e.g., "product-123-0" -> "product-123")
  if (!product && slug.includes('-')) {
    const baseId = slug.replace(/-\d+$/, ''); // Remove trailing "-number" pattern
    if (baseId !== slug) {
      const baseResponse = await fetch(`${apiUrl}/products/${baseId}`, {
        cache: 'no-store',
      }).catch(() => null);
      
      if (baseResponse && baseResponse.ok) {
        const baseResult = await baseResponse.json();
        if (baseResult.success && baseResult.data) {
          product = baseResult.data;
        }
      }
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

  // Fetch color details from database if product has color IDs
  let colorNames: string[] = [];
  let colorDetailsMap: Record<string, { name: string; hexCode: string }> = {};
  
  // Check if product has colors field (it might be undefined or missing)
  const productColors = product.colors || [];
  
  // Debug: Log product colors for troubleshooting
  if (process.env.NODE_ENV === 'development') {
    console.log('[Product Details] Product ID:', product.id);
    console.log('[Product Details] Product colors field:', product.colors);
    console.log('[Product Details] Product colors array:', productColors);
  }
  
  if (productColors.length > 0) {
    // Fetch all colors from Express backend API
    const colorsResponse = await fetch(`${apiUrl}/colors`, {
      cache: 'no-store',
    }).catch(() => null);
    
    let allColors: Array<{ id: string; name: string; hexCode: string }> = [];
    if (colorsResponse && colorsResponse.ok) {
      const colorsResult = await colorsResponse.json();
      if (colorsResult.success && colorsResult.data) {
        allColors = colorsResult.data;
      }
    }
    
    const colorMap = new Map(allColors.map(c => [c.id, c]));
    
    // Map color IDs to color names and hexCodes
    colorNames = productColors
      .map((colorId: string) => {
        // Handle both color IDs (like "color-1") and direct color names (like "Black")
        let color = colorMap.get(colorId);
        
        // If not found by ID, check if it's already a color name
        if (!color) {
          color = allColors.find((c: { id: string; name: string; hexCode: string }) => c.name === colorId);
        }
        
        if (color) {
          colorDetailsMap[color.name] = { name: color.name, hexCode: color.hexCode };
          return color.name;
        }
        
        // If still not found, treat it as a direct color name (for backward compatibility)
        if (typeof colorId === 'string' && !colorId.startsWith('color-')) {
          colorDetailsMap[colorId] = { name: colorId, hexCode: '#B0B0B0' };
          return colorId;
        }
        
        return null;
      })
      .filter((name: string | null): name is string => name !== null);
    
    // Debug: Log mapped colors
    if (process.env.NODE_ENV === 'development') {
      console.log('[Product Details] Mapped color names:', colorNames);
      console.log('[Product Details] Color details map:', colorDetailsMap);
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Product Details] Product has no colors. Product ID:', product.id);
    }
  }

  const productReviews = await getReviewsByProduct(product.id, product.name);
  const reviewsCount = productReviews.length;
  const averageRating = reviewsCount
    ? Number(
        (
          productReviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewsCount
        ).toFixed(1)
      )
    : 0;

  // Transform product data to match the expected format
  const productData = {
    id: product.id,
    slug: slug,
    name: product.name,
    price: product.price,
    oldPrice: product.originalPrice,
    rating: averageRating || 0,
    reviewsCount: reviewsCount,
    images: product.images && product.images.length > 0 ? product.images : ['/placeholder-image.png'],
    description: product.description || "No description available.",
    category: product.category,
    orderId: `#${product.id.slice(-8).padStart(8, '0')}A`,
    seller: product.sellerId || "Verified Seller",
    colors: colorNames.length > 0 ? colorNames : [], // Always use array, never undefined
    colorDetailsMap: colorDetailsMap, // Pass color details for hexCode lookup
    sizes: product.size || [],
    inStock: product.isActive !== false && (product.stock ?? 0) > 0,
  };
  
  // Debug: Log final product data
  if (process.env.NODE_ENV === 'development') {
    console.log('[Product Details] Final product data colors:', productData.colors);
    console.log('[Product Details] Final color details map:', productData.colorDetailsMap);
  }

  return (
    <div className="w-full bg-white flex flex-col justify-start items-center gap-10 py-6 sm:py-8">
      {/* Top Part - Contains ProductGallery, ProductInfo, and DeliveryInfo */}
      <TopPart product={productData} images={productData.images} />

      {/* Reviews Section */}
      <section className="w-full max-w-[1320px] mx-auto px-2">
        <Reviews productId={product.id} productName={product.name} initialReviews={productReviews} />
      </section>

      {/* Related Product Section */}
      <RelatedProduct currentProduct={{ id: product.id, tags: product.tags }} />

      {/* Shop Instagram Section */}
      <ShopInstagram />

      {/* For You Section */}
      <ForYou currentProduct={{ id: product.id, tags: product.tags }} />

      {/* Mobile Delivery Info */}
      <section className="lg:hidden w-full max-w-[1320px] mx-auto px-2">
        <DeliveryInfo />
      </section>
    </div>
  );
}


