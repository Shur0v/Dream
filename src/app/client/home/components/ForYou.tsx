'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CachedImage from '@/components/ui/CachedImage';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { addToCart, addToWishlist, isInWishlist, removeFromWishlist, CartItem, WishlistItem } from '@/lib/userStorage';
import { fetchWithCache, getCachedResponse, peekCachedResponse } from '@/lib/indexeddb/apiCache';

interface ForYouProps {
  currentProduct?: {
    id: string;
    tags?: string[];
  };
}

/**
 * For You Component
 * Dynamic component that shows:
 * - On product details page: Related tagged products in reverse order
 * - On other pages: 4 different tech products
 */
export default function ForYou({ currentProduct }: ForYouProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const homeCacheKey = '/api/for-you-products?limit=4';
  const fallbackHomeCacheKey = '/api/products?limit=50&inStock=true';
  const initialCached = !currentProduct ? peekCachedResponse(homeCacheKey) : null;
  const initialProducts: Product[] = !currentProduct
    ? ((initialCached?.data || []).filter((p: Product) => p.isActive).slice(0, 4))
    : [];
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  // Fetch products based on context - Always ensure 4 products are shown
  useEffect(() => {
    let active = true;
    
    const fetchProducts = async () => {
      try {
        let fetchedProducts: Product[] = [];

        if (currentProduct?.tags && currentProduct.tags.length > 0) {
          // On product details page: Fetch related products and reverse the order
          const cacheKey = '/api/products?limit=100&inStock=true';
          
          // Check cache first
          const cachedData = await getCachedResponse(cacheKey);
          if (cachedData && active) {
            const result = cachedData;
            if (result.success && result.data) {
              const relatedProducts = result.data.filter((p: Product) =>
                p.id !== currentProduct.id &&
                p.isActive &&
                p.tags &&
                p.tags.length > 0 &&
                p.tags.some(tag => currentProduct.tags!.includes(tag))
              );
              fetchedProducts = relatedProducts.reverse();
              
              if (fetchedProducts.length < 4) {
                const relatedProductIds = new Set(fetchedProducts.map(p => p.id));
                const randomProducts = result.data
                  .filter((p: Product) => 
                    p.id !== currentProduct.id &&
                    p.isActive &&
                    !relatedProductIds.has(p.id)
                  )
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 4 - fetchedProducts.length);
                fetchedProducts = [...fetchedProducts, ...randomProducts].slice(0, 4);
              } else {
                fetchedProducts = fetchedProducts.slice(0, 4);
              }
              setProducts(fetchedProducts);
              setLoading(false);
            }
          } else if (active && initialProducts.length === 0) {
            setLoading(true);
          }

          // Fetch from network (update cache in background)
          const response = await fetchWithCache(cacheKey, {}, 60 * 60 * 1000);
          const result = await response.json();

          if (active && result.success && result.data) {
            // Filter products with matching tags and exclude current product
            const relatedProducts = result.data.filter((p: Product) =>
              p.id !== currentProduct.id &&
              p.isActive &&
              p.tags &&
              p.tags.length > 0 &&
              p.tags.some(tag => currentProduct.tags!.includes(tag))
            );

            // Reverse the order (show from last)
            fetchedProducts = relatedProducts.reverse();
            
            // If we have less than 4, fill with random products
            if (fetchedProducts.length < 4) {
              const relatedProductIds = new Set(fetchedProducts.map(p => p.id));
              const randomProducts = result.data
                .filter((p: Product) => 
                  p.id !== currentProduct.id &&
                  p.isActive &&
                  !relatedProductIds.has(p.id)
                )
                .sort(() => Math.random() - 0.5) // Shuffle randomly
                .slice(0, 4 - fetchedProducts.length);
              
              fetchedProducts = [...fetchedProducts, ...randomProducts].slice(0, 4);
            } else {
              fetchedProducts = fetchedProducts.slice(0, 4);
            }
            
            setProducts(fetchedProducts.slice(0, 4));
          }
        } else {
          // On other pages: Fetch 4 different tech products
          const selectedCached = await getCachedResponse(homeCacheKey);
          if (selectedCached && active) {
            const selectedProducts = (selectedCached.data || []).filter((p: Product) => p.isActive).slice(0, 4);
            if (selectedProducts.length > 0) {
              setProducts(selectedProducts);
              setLoading(false);
              fetchedProducts = selectedProducts;
            }
          } else if (active && initialProducts.length === 0) {
            setLoading(true);
          }

          const selectedResponse = await fetchWithCache(homeCacheKey, {}, 60 * 60 * 1000);
          const selectedResult = await selectedResponse.json();
          const selectedProducts = (selectedResult.data || []).filter((p: Product) => p.isActive).slice(0, 4);
          if (active && selectedResult.success && selectedProducts.length > 0) {
            setProducts(selectedProducts);
            fetchedProducts = selectedProducts;
            return;
          }

          const cacheKey = fallbackHomeCacheKey;
          
          // Check cache first
          const cachedData = await getCachedResponse(cacheKey);
          if (cachedData && active) {
            const result = cachedData;
            if (result.success && result.data) {
              const techProducts = result.data
                .filter((p: Product) => 
                  p.isActive &&
                  (p.category?.toLowerCase().includes('electronic') ||
                   p.category?.toLowerCase().includes('tech') ||
                   p.tags?.some(tag => 
                     tag.toLowerCase().includes('tech') ||
                     tag.toLowerCase().includes('electronic') ||
                     tag.toLowerCase().includes('gadget')
                   ))
                )
                .sort(() => Math.random() - 0.5)
                .slice(0, 4);

              fetchedProducts = techProducts.length >= 4 
                ? techProducts 
                : result.data
                    .filter((p: Product) => p.isActive)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 4);
              setProducts(fetchedProducts.slice(0, 4));
              setLoading(false);
            }
          } else if (active && initialProducts.length === 0) {
            setLoading(true);
          }

          // Fetch from network (update cache in background)
          const response = await fetchWithCache(cacheKey, {}, 60 * 60 * 1000);
          const result = await response.json();

          if (active && result.success && result.data) {
            // Filter for tech/electronics products and get 4 different ones
            const techProducts = result.data
              .filter((p: Product) => 
                p.isActive &&
                (p.category?.toLowerCase().includes('electronic') ||
                 p.category?.toLowerCase().includes('tech') ||
                 p.tags?.some(tag => 
                   tag.toLowerCase().includes('tech') ||
                   tag.toLowerCase().includes('electronic') ||
                   tag.toLowerCase().includes('gadget')
                 ))
              )
              .sort(() => Math.random() - 0.5) // Shuffle randomly
              .slice(0, 4);

            // If we don't have enough tech products, just take any 4 active products
            fetchedProducts = techProducts.length >= 4 
              ? techProducts 
              : result.data
                  .filter((p: Product) => p.isActive)
                  .sort(() => Math.random() - 0.5) // Shuffle randomly
                  .slice(0, 4);
            
            setProducts(fetchedProducts.slice(0, 4));
          }
        }
        
        // Final fallback: Ensure we always have 4 products
        if (active && fetchedProducts.length < 4) {
          const fallbackCacheKey = '/api/products?limit=50&inStock=true';
          const fallbackCached = await getCachedResponse(fallbackCacheKey);
          
          if (fallbackCached && fallbackCached.success && fallbackCached.data) {
            const existingIds = new Set(fetchedProducts.map(p => p.id));
            const additionalProducts = fallbackCached.data
              .filter((p: Product) => 
                p.isActive &&
                !existingIds.has(p.id) &&
                (!currentProduct || p.id !== currentProduct.id)
              )
              .sort(() => Math.random() - 0.5)
              .slice(0, 4 - fetchedProducts.length);
            
            fetchedProducts = [...fetchedProducts, ...additionalProducts].slice(0, 4);
          } else {
            const fallbackResponse = await fetchWithCache(fallbackCacheKey, {}, 60 * 60 * 1000);
            const fallbackResult = await fallbackResponse.json();
            
            if (active && fallbackResult.success && fallbackResult.data) {
              const existingIds = new Set(fetchedProducts.map(p => p.id));
              const additionalProducts = fallbackResult.data
                .filter((p: Product) => 
                  p.isActive &&
                  !existingIds.has(p.id) &&
                  (!currentProduct || p.id !== currentProduct.id)
                )
                .sort(() => Math.random() - 0.5)
                .slice(0, 4 - fetchedProducts.length);
              
              fetchedProducts = [...fetchedProducts, ...additionalProducts].slice(0, 4);
            }
          }
        }

        // Ensure we always have exactly 4 products
        if (active) {
          setProducts(fetchedProducts.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching For You products:', error);
        // Even on error, try to get some products from cache
        if (active) {
          try {
            const fallbackCacheKey = '/api/products?limit=4&inStock=true';
            const fallbackCached = await getCachedResponse(fallbackCacheKey);
            
            if (fallbackCached && fallbackCached.success && fallbackCached.data) {
              setProducts(fallbackCached.data.filter((p: Product) => p.isActive).slice(0, 4));
            } else {
              const fallbackResponse = await fetchWithCache(fallbackCacheKey, {}, 60 * 60 * 1000);
              const fallbackResult = await fallbackResponse.json();
              if (fallbackResult.success && fallbackResult.data) {
                setProducts(fallbackResult.data.filter((p: Product) => p.isActive).slice(0, 4));
              }
            }
          } catch (fallbackError) {
            console.error('Fallback fetch also failed:', fallbackError);
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      active = false;
    };
  }, [currentProduct]);

  return (
    <section className="father w-full py-6 sm:py-10 md:py-14 lg:py-20 bg-white flex flex-col justify-start items-center gap-2.5 sm:gap-5 md:gap-6 lg:gap-8" role="region" aria-labelledby="for-you-heading" data-layer="father">
      {/* father = full width for you section */}
      
      <div className="daughter w-full max-w-[1320px] mx-auto px-2" data-layer="daughter">
        {/* daughter = design holder for entire for you section */}
        
        {/* Header Section */}
        <div className="layer-1 self-stretch flex flex-col justify-start items-start gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4" data-layer="1">
          {/* layer-1 = header section container */}
          
          <div className="layer-2 self-stretch inline-flex justify-start items-start gap-8" data-layer="2">
            {/* layer-2 = header content wrapper */}
            
            <div className="layer-3 flex justify-start items-center gap-8" data-layer="3">
              {/* layer-3 = title container */}
              
              <div 
                className="layer-4 justify-start text-slate-950 text-2xl md:text-3xl lg:text-5xl font-medium font-['Poppins'] leading-tight md:leading-normal lg:leading-[57.60px]"
                id="for-you-heading"
                role="heading"
                aria-level={2}
                data-layer="4"
              >
                {/* layer-4 = section heading */}
                For You
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid - 2x2 on mobile, slider on desktop */}
        <div className="layer-5 self-stretch grid grid-cols-2 md:flex md:justify-center md:items-center md:h-[582px] gap-4 md:gap-6 my-6 md:my-2" data-layer="5">
          {/* layer-5 = products grid container */}
          
          {loading ? (
            <div className="col-span-2 md:col-span-1 flex items-center justify-center py-12">
              <div className="text-neutral-500">Loading products...</div>
            </div>
          ) : (
            products.map((product, index) => {
              // Ensure consistent product ID format
              const productId = (product as any).productId || product.id;
              return (
             <Link 
               key={`${product.id}-${index}`} 
               href={`/client/product-details/${productId}`}
               className="block h-full md:flex md:items-center"
               scroll={true}
               prefetch={true}
             >
               <div
                 className="layer-6 w-full md:w-[312px] h-full md:h-auto p-3 md:p-4 bg-sky-50 rounded-xl border border-black/10 flex flex-col justify-start items-start group md:hover:shadow-md md:hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0 select-none"
                 style={{ transformOrigin: 'center', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                 onMouseEnter={() => setHoveredCard(index)}
                 onMouseLeave={() => setHoveredCard(null)}
                 role="article"
                 aria-labelledby={`product-title-${product.id}`}
                 data-layer="6"
               >
              {/* layer-6 = individual product card */}
              
              {/* Card Header */}
              <div className="layer-7 self-stretch inline-flex justify-between items-center mb-2" data-layer="7">
                {/* layer-7 = card header container */}
                
                <div className="layer-8 flex justify-start items-center gap-2" data-layer="8">
                  {/* layer-8 = verified seller indicator */}
                  
                  <div className="layer-9 w-6 h-6 relative transform md:group-hover:scale-110 transition-transform duration-300" data-layer="9">
                    {/* layer-9 = verified icon container */}
                    <Image
                      src="/card/icon/tick.svg"
                      alt="Verified seller"
                      width={24}
                      height={24}
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="layer-10 justify-start text-neutral-600 text-xs md:text-sm font-semibold font-['PolySans_Trial'] leading-snug md:leading-relaxed whitespace-nowrap" data-layer="10">
                    {/* layer-10 = verified seller text */}
                    Verified Seller
                  </div>
                </div>
                
                <div 
                  className="layer-11 transform md:group-hover:scale-110 md:group-hover:rotate-12 transition-all duration-300 cursor-pointer" 
                  data-layer="11"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const isWishlisted = isInWishlist(productId);
                    if (isWishlisted) {
                      await removeFromWishlist(productId);
                      toast.success('Removed from favourite');
                    } else {
                      const wishlistItem: WishlistItem = {
                        id: `wishlist-${productId}-${Date.now()}`,
                        productId: productId,
                        name: product.name,
                        price: product.price,
                        image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png',
                      };
                      await addToWishlist(wishlistItem);
                      toast.success('Added to favourite');
                    }
                  }}
                >
                  {/* layer-11 = wishlist button container */}
                  <Image
                    src="/card/icon/butterfly.svg"
                    alt="Add to wishlist"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Product Image */}
              <div className="layer-12 self-stretch h-48 md:h-72 relative mb-4 overflow-hidden rounded-lg" data-layer="12">
                {/* layer-12 = product image container */}
                
                <CachedImage
                  src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.png'}
                  alt={`${product.name} product image`}
                  fill
                  className="object-cover transform md:group-hover:scale-105 transition-transform duration-500 ease-out select-none pointer-events-none"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="layer-13 self-stretch flex flex-col justify-start items-start" data-layer="13">
                {/* layer-13 = product info container */}
                
                <div className="layer-14 self-stretch pt-2 md:pt-4 pb-3 md:pb-5 flex flex-col justify-center items-start gap-2 md:gap-3" data-layer="14">
                  {/* layer-14 = product details wrapper */}
                  
                  {/* Product Name and Price */}
                  <div className="layer-15 self-stretch flex flex-col justify-start items-start gap-1" data-layer="15">
                    {/* layer-15 = product name and price container */}
                    
                    <div 
                      className="layer-16 justify-start text-slate-950 text-sm md:text-lg font-semibold font-['Poppins'] leading-tight md:leading-loose md:group-hover:text-fuchsia-600 transition-colors duration-300 truncate max-w-full" 
                      title={product.name}
                      id={`product-title-${product.id}`}
                      role="heading"
                      aria-level={3}
                      data-layer="16"
                    >
                      {/* layer-16 = product name */}
                      {product.name.length > 24 ? `${product.name.substring(0, 24)}...` : product.name}
                    </div>
                    
                    <div className="layer-17 inline-flex justify-start items-center gap-1 md:gap-1.5" data-layer="17">
                      {/* layer-17 = price container */}
                      
                      <div className="layer-18 flex justify-start items-center" data-layer="18">
                        {/* layer-18 = current price */}
                        <div className="layer-19 justify-start text-black text-lg md:text-2xl font-semibold font-['Poppins'] leading-6 md:leading-9" data-layer="19">
                          {/* layer-19 = current price display */}
                          ৳{product.price.toFixed(2)}
                        </div>
                      </div>
                      
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="layer-20 justify-start" data-layer="20">
                          {/* layer-20 = original price */}
                          <span className="text-red-500 text-xs md:text-base font-normal font-['Poppins'] leading-normal">(</span>
                          <span className="text-red-500 text-xs md:text-base font-normal font-['Poppins'] line-through leading-normal">
                            ৳{product.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-red-500 text-xs md:text-base font-normal font-['Poppins'] leading-normal">)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="layer-21 flex flex-col md:flex-row md:inline-flex justify-start items-start md:items-center gap-1 md:gap-1.5" data-layer="21">
                    {/* layer-21 = rating and reviews container */}
                    
                    <div className="layer-22 flex justify-start items-center gap-0.5 md:gap-0" role="img" aria-label="Product rating" data-layer="22">
                      {/* layer-22 = star rating */}
                      
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="#FFC107"
                          xmlns="http://www.w3.org/2000/svg"
                          className="md:w-6 md:h-6 transform md:group-hover:scale-110 transition-transform duration-300"
                          style={{ transitionDelay: `${i * 50}ms` }}
                          aria-hidden="true"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    
                    {/* Review count - hidden on mobile, shown on desktop next to stars */}
                    <div className="layer-23 hidden md:block text-center justify-start text-neutral-400 text-xs md:text-sm font-normal font-['Poppins'] leading-snug md:leading-relaxed whitespace-nowrap" data-layer="23">
                      {/* layer-23 = reviews count */}
                      ( Reviews )
                    </div>
                    
                    {/* Review count box - shown on mobile below stars */}
                    <div className="layer-23-mobile md:hidden self-stretch px-2 py-1 bg-neutral-100 rounded-md text-center justify-start text-neutral-400 text-xs font-normal font-['Poppins'] leading-snug" data-layer="23-mobile">
                      {/* layer-23-mobile = reviews count box for mobile */}
                      ( Reviews )
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button - Hidden by default, shown on hover */}
                <div className="layer-24 self-stretch overflow-hidden h-0 md:group-hover:h-14 transition-all duration-500 ease-out" data-layer="24">
                  {/* layer-24 = add to cart button container */}
                  
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const cartItem: CartItem = {
                        id: `cart-${productId}-${Date.now()}`,
                        productId: productId,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png',
                      };
                      await addToCart(cartItem);
                      toast.success('Added to cart');
                    }}
                    className="layer-25 w-full h-0 opacity-0 px-7 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5 md:group-hover:h-14 md:group-hover:py-3 md:group-hover:opacity-100 hover:bg-fuchsia-600 transition-all duration-500 ease-out transform translate-y-2 md:group-hover:translate-y-0 cursor-pointer"
                    aria-label={`Add ${product.name} to cart`}
                    data-layer="25"
                  >
                    {/* layer-25 = add to cart button */}
                    
                    <div className="layer-26 w-5 h-5 relative" data-layer="26">
                      {/* layer-26 = cart icon container */}
                      <Image
                        src="/card/icon/cart.svg"
                        alt="Cart icon"
                        width={20}
                        height={20}
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="layer-27 justify-start text-white text-base font-semibold font-['Poppins'] leading-none whitespace-nowrap" data-layer="27">
                      {/* layer-27 = button text */}
                      Add to Cart
                    </div>
                  </button>
                </div>
              </div>
               </div>
             </Link>
            );
            })
          )}
        </div>

        {/* Pagination Dots - Hidden on mobile */}
        {products.length > 0 && (
          <div className="layer-28 h-2 hidden md:flex justify-center items-center gap-2 mt-8" role="tablist" aria-label="Product pagination" data-layer="28">
            {/* layer-28 = pagination dots container */}
            
            {products.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className={`layer-29 h-2 rounded-[10px] transition-all duration-300 ease-in-out transform origin-center ${
                hoveredCard === index
                  ? 'w-12 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500'
                  : 'w-5 bg-neutral-200'
              }`}
              style={{
                transformOrigin: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              role="tab"
              aria-selected={hoveredCard === index}
              aria-label={`Go to product ${index + 1}`}
              data-layer="29"
            />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}





