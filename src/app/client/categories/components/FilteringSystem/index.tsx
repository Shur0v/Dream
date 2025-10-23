'use client';

import React, { useState } from 'react';
import Image from 'next/image';

/**
 * Complete Filtering System Component
 * Displays sidebar with search, category, brand, and size filters on the left
 * and product grid on the right with 3 products per row
 */
export default function FilteringSystem() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandingOpen, setIsBrandingOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);

  const categories = [
    { name: 'Hoodies', count: 20 },
    { name: 'Jackets', count: 20 },
    { name: 'Joggers', count: 20 },
    { name: 'Pants', count: 20 },
    { name: 'Shoes', count: 20 },
  ];

  const brands = [
    'Viede',
    'Chanel', 
    'Hermes',
    'Gucci'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL'];

  // Define product type
  type Product = {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    currency: string;
    image: string;
    rating: number;
    reviews: number;
    isVerifiedSeller: boolean;
  };

  const products: Product[] = [
    {
      id: 1,
      name: 'MacBook Pro 16-inch M3',
      price: 809.99,
      originalPrice: 1000,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 7,
      isVerifiedSeller: true,
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      price: 1299.99,
      originalPrice: 1500,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 4,
      reviews: 23,
      isVerifiedSeller: true,
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5',
      price: 399.99,
      originalPrice: 499,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 156,
      isVerifiedSeller: true,
    },
    {
      id: 4,
      name: 'iPhone 15 Pro Max',
      price: 1199.99,
      originalPrice: 1399,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 89,
      isVerifiedSeller: true,
    },
    {
      id: 5,
      name: 'Dell XPS 13',
      price: 999.99,
      originalPrice: 1199,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 4,
      reviews: 45,
      isVerifiedSeller: true,
    },
    {
      id: 6,
      name: 'AirPods Pro 2',
      price: 249.99,
      originalPrice: 299,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 234,
      isVerifiedSeller: true,
    },
    {
      id: 7,
      name: 'iPad Pro 12.9',
      price: 1099.99,
      originalPrice: 1299,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 67,
      isVerifiedSeller: true,
    },
    {
      id: 8,
      name: 'Surface Laptop 5',
      price: 899.99,
      originalPrice: 1099,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 4,
      reviews: 34,
      isVerifiedSeller: true,
    },
    {
      id: 9,
      name: 'MacBook Air M2',
      price: 999.99,
      originalPrice: 1199,
      currency: '৳',
      image: '/card/image/img1.jpg',
      rating: 5,
      reviews: 123,
      isVerifiedSeller: true,
    },
  ];

  // Function to chunk products into rows of 3
  const chunkProducts = (products: Product[], size: number) => {
    const chunks: Product[][] = [];
    for (let i = 0; i < products.length; i += size) {
      chunks.push(products.slice(i, i + size));
    }
    return chunks;
  };

  const productRows = chunkProducts(products, 3);

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1 w-full max-w-[280px]">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute right-3 top-2.5">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
              >
                Category
                <svg 
                  className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoryOpen && (
                <div className="mt-2 space-y-2">
                  {categories.map((category, index) => (
                    <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-gray-500 text-sm">({category.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Branding Filter */}
            <div className="mb-6">
              <button
                onClick={() => setIsBrandingOpen(!isBrandingOpen)}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
              >
                Branding
                <svg 
                  className={`w-5 h-5 transition-transform ${isBrandingOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isBrandingOpen && (
                <div className="mt-2 space-y-2">
                  {brands.map((brand, index) => (
                    <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <button
                onClick={() => setIsSizeOpen(!isSizeOpen)}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
              >
                Size
                <svg 
                  className={`w-5 h-5 transition-transform ${isSizeOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSizeOpen && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {sizes.map((size, index) => (
                    <button
                      key={index}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-purple-50 hover:border-purple-500 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Product Display */}
        <div className="lg:col-span-3">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Now</h1>
            <nav className="text-sm text-gray-600">
              <span>Home</span>
              <span className="mx-2">&gt;</span>
              <span>Product</span>
            </nav>
          </div>

          {/* Results and Sorting */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Showing 1-12 of 100 results</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by Price:</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Low to High</option>
                <option>High to Low</option>
                <option>Newest</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          {/* Products Grid - Multiple Rows */}
          <div className="flex flex-col justify-start items-center gap-0">
            {/* Products Grid Container */}
            
            {productRows.map((rowProducts, rowIndex) => (
              <div key={rowIndex} className="w-full flex justify-center items-center gap-6 h-[582px]">
                {/* Individual Product Row */}
                
                {rowProducts.map((product, productIndex) => {
                  const globalIndex = rowIndex * 3 + productIndex;
                  return (
                    <div
                      key={product.id}
                      className="w-[312px] p-4 bg-sky-50 rounded-xl border border-black/10 inline-flex flex-col justify-start items-start group hover:shadow-md hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0 select-none"
                      onMouseEnter={() => setHoveredCard(globalIndex)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                      role="article"
                      aria-labelledby={`product-title-${product.id}`}
                    >
                      {/* Individual Product Card */}
                      
                      {/* Card Header */}
                      <div className="self-stretch inline-flex justify-between items-center mb-2">
                        {/* Card Header Container */}
                        
                        <div className="flex justify-start items-center gap-2">
                          {/* Verified Seller Indicator */}
                          
                          <div className="w-6 h-6 relative transform group-hover:scale-110 transition-transform duration-300">
                            {/* Verified Icon Container */}
                            <Image
                              src="/card/icon/tick.svg"
                              alt="Verified seller"
                              width={24}
                              height={24}
                              loading="lazy"
                            />
                          </div>
                          
                          <div className="justify-start text-neutral-600 text-sm font-semibold font-['PolySans_Trial'] leading-relaxed">
                            {/* Verified Seller Text */}
                            Verified Seller
                          </div>
                        </div>
                        
                        <div className="transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                          {/* Wishlist Button Container */}
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
                      <div className="self-stretch h-72 relative mb-4 overflow-hidden rounded-lg">
                        {/* Product Image Container */}
                        
                        <Image
                          src={product.image}
                          alt={`${product.name} product image`}
                          fill
                          className="object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out select-none pointer-events-none"
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                          style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                          loading="lazy"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="self-stretch flex flex-col justify-start items-start">
                        {/* Product Info Container */}
                        
                        <div className="self-stretch pt-4 pb-5 flex flex-col justify-center items-start gap-3">
                          {/* Product Details Wrapper */}
                          
                          {/* Product Name and Price */}
                          <div className="self-stretch flex flex-col justify-start items-start gap-1">
                            {/* Product Name and Price Container */}
                            
                            <div 
                              className="justify-start text-slate-950 text-lg font-semibold font-['Poppins'] leading-loose group-hover:text-fuchsia-600 transition-colors duration-300 truncate max-w-full" 
                              title={product.name}
                              id={`product-title-${product.id}`}
                              role="heading"
                              aria-level={3}
                            >
                              {/* Product Name */}
                              {product.name.length > 24 ? `${product.name.substring(0, 24)}...` : product.name}
                            </div>
                            
                            <div className="inline-flex justify-start items-center gap-1.5">
                              {/* Price Container */}
                              
                              <div className="flex justify-start items-center">
                                {/* Current Price */}
                                <div className="justify-start text-black text-2xl font-semibold font-['Poppins'] leading-9">
                                  {/* Current Price Display */}
                                  {product.currency}{product.price}
                                </div>
                              </div>
                              
                              <div className="justify-start">
                                {/* Original Price */}
                                <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">(</span>
                                <span className="text-red-500 text-base font-normal font-['Poppins'] line-through leading-normal">
                                  ${product.originalPrice}
                                </span>
                                <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">)</span>
                              </div>
                            </div>
                          </div>

                          {/* Rating and Reviews */}
                          <div className="inline-flex justify-start items-center gap-1.5">
                            {/* Rating and Reviews Container */}
                            
                            <div className="flex justify-start items-center" role="img" aria-label={`${product.rating} out of 5 stars`}>
                              {/* Star Rating */}
                              
                              {[...Array(product.rating)].map((_, i) => (
                                <svg
                                  key={i}
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="#FFC107"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="transform group-hover:scale-110 transition-transform duration-300"
                                  style={{ transitionDelay: `${i * 50}ms` }}
                                  aria-hidden="true"
                                >
                                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                              ))}
                            </div>
                            
                            <div className="text-center justify-start text-neutral-400 text-sm font-normal font-['Poppins'] leading-relaxed">
                              {/* Reviews Count */}
                              ( {product.reviews} Reviews)
                            </div>
                          </div>
                        </div>

                        {/* Add to Cart Button - Hidden by default, shown on hover */}
                        <div className="self-stretch overflow-hidden h-0 group-hover:h-14 transition-all duration-500 ease-out">
                          {/* Add to Cart Button Container */}
                          
                          <button 
                            className="w-full h-0 opacity-0 px-7 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5 group-hover:h-14 group-hover:py-3 group-hover:opacity-100 hover:bg-fuchsia-600 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            {/* Add to Cart Button */}
                            
                            <div className="w-5 h-5 relative">
                              {/* Cart Icon Container */}
                              <Image
                                src="/card/icon/cart.svg"
                                alt="Cart icon"
                                width={20}
                                height={20}
                                loading="lazy"
                              />
                            </div>
                            
                            <div className="justify-start text-white text-base font-semibold font-['Poppins'] leading-none whitespace-nowrap">
                              {/* Button Text */}
                              Add to Cart
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="h-2 flex justify-center items-center gap-2 mt-8" role="tablist" aria-label="Product pagination">
            {/* Pagination Dots Container */}
            
            {productRows.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-[10px] transition-all duration-300 ease-in-out transform origin-center ${
                  hoveredCard !== null && Math.floor(hoveredCard / 3) === index
                    ? 'w-12 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500'
                    : 'w-5 bg-neutral-200'
                }`}
                style={{
                  transformOrigin: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                role="tab"
                aria-selected={hoveredCard !== null && Math.floor(hoveredCard / 3) === index}
                aria-label={`Go to row ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
