import React from "react";
import { Metadata } from "next";
import TopPart from "../components/toppart";
import Reviews from "../components/Reviews";
import RelatedProduct from "../components/RelatedProduct";
import ShopInstagram from "../components/ShopInstagram";
import ForYou from "../../home/components/ForYou";
import DeliveryInfo from "../components/toppart/DeliveryInfo";
import StructuredData from "@/components/SEO/StructuredData";
import { getColors, getProductById, getProducts, getReviewsByProduct } from '@backend/lib/db';

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamshopltd.com';

async function findProduct(identifier: string): Promise<any | null> {
  const exact = await getProductById(identifier);
  if (exact) return exact;

  const withoutTrailingIndex = identifier.replace(/-\d+$/, '');
  if (withoutTrailingIndex !== identifier) {
    const baseProduct = await getProductById(withoutTrailingIndex);
    if (baseProduct) return baseProduct;
  }

  const products = await getProducts();
  return products.find((item: any) => item.slug === identifier || item.sku === identifier) || null;
}

// Generate metadata for product pages
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const product = await findProduct(slug);
    if (product) {
        const productName = product.name || 'Product';
        const productDescription = product.description || `Buy ${productName} online in Bangladesh from Dreamshop. Fast delivery, fair price, secure shopping.`;
        const productImage = product.images && product.images.length > 0 
          ? product.images[0] 
          : `${baseUrl}/placeholder-image.png`;
        const productPrice = product.price || 0;
        
        return {
          title: `${productName} | Dreamshop`,
          description: productDescription,
          keywords: [
            productName.toLowerCase(),
            'dreamshop',
            'dreamshop bd',
            'dream shop bangladesh',
            'bangladesh online shopping',
            'online shopping bd',
            'দাম',
            'অনলাইন শপিং',
            'বাংলাদেশ অনলাইন শপিং',
            'ঢাকা অনলাইন শপিং',
            'ক্যাশ অন ডেলিভারি',
            'হোম ডেলিভারি বাংলাদেশ',
            'buy online',
            'online shopping',
            product.category?.toLowerCase() || '',
          ].filter(Boolean),
          openGraph: {
            title: `${productName} | Dreamshop`,
            description: productDescription,
            url: `${baseUrl}/client/product-details/${slug}`,
            siteName: 'Dreamshop',
            images: [
              {
                url: productImage,
                width: 1200,
                height: 630,
                alt: productName,
              },
            ],
            type: 'website', // Use 'website' instead of 'product' (product is not a valid OpenGraph type)
          },
          twitter: {
            card: 'summary_large_image',
            title: `${productName} | Dreamshop`,
            description: productDescription,
            images: [productImage],
          },
          alternates: {
            canonical: `${baseUrl}/client/product-details/${slug}`,
          },
          other: {
            'product:price:amount': productPrice.toString(),
            'product:price:currency': 'BDT',
          },
        };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  // Fallback metadata
  return {
    title: 'Product | Dreamshop',
    description: 'View product details at Dreamshop. Best prices, fast delivery, secure shopping.',
  };
}

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  let product = null;
  let lastError: string | null = null;

  try {
    product = await findProduct(slug);
  } catch (error) {
    lastError = error instanceof Error ? error.message : 'Unknown error';
  }

  // If product not found, show error or redirect
  if (!product) {
    console.error(`Product not found. Searched for ID: "${slug}"`);
    if (lastError) {
      console.error('Last fetch error:', lastError);
    }
    return (
      <div className="w-full bg-white flex flex-col justify-center items-center py-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or couldn't be loaded.</p>
        <p className="text-sm text-gray-500 mb-4">Product ID: {slug}</p>
        {lastError && (
          <p className="text-xs text-red-500 mb-4">Error: {lastError}</p>
        )}
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
    const allColors: Array<{ id: string; name: string; hexCode: string }> = await getColors();
    
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

  // Generate structured data for product
  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.name,
    description: productData.description,
    image: productData.images,
    brand: {
      '@type': 'Brand',
      name: 'Dreamshop',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/client/product-details/${slug}`,
      priceCurrency: 'BDT',
      price: productData.price.toString(),
      availability: productData.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Dreamshop',
      },
    },
    ...(productData.reviewsCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: productData.rating.toString(),
        reviewCount: productData.reviewsCount.toString(),
      },
    }),
  };

  return (
    <>
      <StructuredData type="Product" data={productStructuredData} />
      <div className="w-full bg-white flex flex-col justify-start items-center gap-10 py-6 sm:py-8">
      {/* Top Part - Contains ProductGallery, ProductInfo, and DeliveryInfo */}
      <TopPart product={productData} images={productData.images} />

      {/* Reviews Section */}
      <section className="w-full max-w-[1320px] mx-auto px-2">
        <Reviews 
          productId={product.id} 
          productName={product.name}
          productDescription={product.description}
          productSpecifications={product.specifications}
          initialReviews={productReviews} 
        />
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
    </>
  );
}


