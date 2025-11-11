'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products, Product } from '@/lib/productData';

/**
 * Complete Filtering System Component
 * Displays sidebar with search, category, brand, and size filters on the left
 * and product grid on the right with 3 products per row
 */
export default function FilteringSystem() {
  const router = useRouter();
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandingOpen, setIsBrandingOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // drawer for <1320px

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [visibleProducts, setVisibleProducts] = useState(18);
  const [headerHeight, setHeaderHeight] = useState(0);

  const brands = [
    'Apple',
    'Samsung', 
    'Sony',
    'Nike',
    'Adidas',
    'Samsung'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL'];

  // Calculate dynamic category counts based on current filters
  const getCategoryCounts = () => {
    return [
      { name: 'Electronics', count: products.filter(p => p.category === 'Electronics' && 
        (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        (selectedSizes.length === 0 || selectedSizes.some(size => p.sizes.includes(size)))
      ).length },
      { name: 'Fashion', count: products.filter(p => p.category === 'Fashion' && 
        (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        (selectedSizes.length === 0 || selectedSizes.some(size => p.sizes.includes(size)))
      ).length },
      { name: 'Home & Garden', count: products.filter(p => p.category === 'Home & Garden' && 
        (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        (selectedSizes.length === 0 || selectedSizes.some(size => p.sizes.includes(size)))
      ).length },
      { name: 'Sports', count: products.filter(p => p.category === 'Sports' && 
        (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        (selectedSizes.length === 0 || selectedSizes.some(size => p.sizes.includes(size)))
      ).length },
      { name: 'Books', count: products.filter(p => p.category === 'Books' && 
        (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        (selectedSizes.length === 0 || selectedSizes.some(size => p.sizes.includes(size)))
      ).length },
    ];
  };

  const categories = getCategoryCounts();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0 && !selectedSizes.some(size => product.sizes.includes(size))) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategories, selectedBrands, selectedSizes, sortBy]);

  // Function to chunk products into rows of 3
  const chunkProducts = (products: Product[], size: number) => {
    const chunks: Product[][] = [];
    for (let i = 0; i < products.length; i += size) {
      chunks.push(products.slice(i, i + size));
    }
    return chunks;
  };

  // Create infinite scroll effect by repeating products
  const createInfiniteProducts = (products: Product[], count: number) => {
    const infiniteProducts: Product[] = [];
    let currentIndex = 0;
    
    for (let i = 0; i < count; i++) {
      if (products.length === 0) break;
      
      // Create a copy of the product with unique ID for infinite scroll
      const product = products[currentIndex % products.length];
      infiniteProducts.push({
        ...product,
        id: product.id + (Math.floor(i / products.length) * 1000) // Unique ID for each cycle
      });
      
      currentIndex++;
    }
    
    return infiniteProducts;
  };

  // Get products to display with infinite scroll effect
  const displayedProducts = createInfiniteProducts(filteredAndSortedProducts, visibleProducts);
  const productRows = chunkProducts(displayedProducts, 3);
  
  // Always show "Load More" button for infinite scroll effect
  const hasMoreProducts = true;

  // Filter handler functions
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSortBy('default');
  };

  // Show more products function
  const showMoreProducts = () => {
    setVisibleProducts(prev => prev + 18);
  };

  // Handle product card click
  const handleProductClick = (productId: number) => {
    router.push(`/client/product-details/${productId}`);
  };

  // Reset visible products when filters change
  React.useEffect(() => {
    setVisibleProducts(18);
  }, [searchTerm, selectedCategories, selectedBrands, selectedSizes, sortBy]);

  useEffect(() => {
    if (isFilterOpen) {
      const headerEl = document.querySelector('header');
      setHeaderHeight(headerEl ? headerEl.getBoundingClientRect().height : 0);
    }
  }, [isFilterOpen]);

  useEffect(() => {
    if (!isFilterOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterOpen]);

  const overlayTop = headerHeight || 0;
  const overlayHeight = overlayTop ? `calc(100vh - ${overlayTop}px)` : '100vh';
  const drawerStyle = { top: overlayTop, height: overlayHeight };

  const renderFilterPanel = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Search Bar */}
      <div className="mb-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="absolute right-3 top-2.5">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Clear All */}
      {(searchTerm || selectedCategories.length > 0 || selectedBrands.length > 0 || selectedSizes.length > 0) && (
        <div className="my-4">
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-0">
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
          <div className=" space-y-2">
            {categories.map((category, index) => (
              <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-3"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryToggle(category.name)}
                  />
                <span className="text-gray-700">{category.name}</span>
                </div>
                <span className="text-gray-500 text-sm">({category.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Branding Filter */}
      <div className="mb-0">
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
          <div className=" space-y-2">
            {brands.map((brand, index) => (
              <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input 
                  type="checkbox" 
                  className="mr-3"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                <span className="text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="mb-0">
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
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                  selectedSizes.includes(size)
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'border-gray-300 hover:bg-purple-50 hover:border-purple-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderModalPanel = () => (
    <div className="w-full">
      {/* Search */}
      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="absolute right-3 top-2.5">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Clear all */}
      {(searchTerm || selectedCategories.length > 0 || selectedBrands.length > 0 || selectedSizes.length > 0) && (
        <div className="mb-4">
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Two-column on md: Category + Branding */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="border rounded-lg p-3">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
          >
            Category
            <svg className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isCategoryOpen && (
            <div className="space-y-2">
              {categories.map((category, index) => (
                <label key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-3"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryToggle(category.name)}
                    />
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({category.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Branding */}
        <div className="border rounded-lg p-3">
          <button
            onClick={() => setIsBrandingOpen(!isBrandingOpen)}
            className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
          >
            Branding
            <svg className={`w-5 h-5 transition-transform ${isBrandingOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isBrandingOpen && (
            <div className="space-y-2">
              {brands.map((brand, index) => (
                <label key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span className="text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Size below */}
      <div className="border rounded-lg p-3 mt-4">
        <button
          onClick={() => setIsSizeOpen(!isSizeOpen)}
          className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-800"
        >
          Size
          <svg className={`w-5 h-5 transition-transform ${isSizeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isSizeOpen && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                  selectedSizes.includes(size) ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-300 hover:bg-purple-50 hover:border-purple-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 py-6">

      {/* Modal for filters on <1320px - rendered via portal to escape zoom/scale */}
      {isFilterOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1000] min-[1320px]:hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsFilterOpen(false)} />
            <div
              className="relative w-[80vw] md:w-[720px] max-w-[720px] bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <div className="text-lg font-semibold">Filters</div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {renderModalPanel()}
              </div>
            </div>
          </div>,
          document.body
        )
      }

      <div className="grid grid-cols-1 min-[1320px]:grid-cols-4 gap-6">
        
        {/* Left Sidebar - Filters */}
        <div className="min-[1320px]:block hidden">
          <div className="w-full max-w-[280px] sticky top-4">
            {renderFilterPanel()}
          </div>
        </div>

        {/* Right Side - Product Display */}
        <div className="min-[1320px]:col-span-3">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <h1 className="text-4xl font-semibold text-gray-900 ">Shop Now</h1>

          </div>

          {/* Results, Filter trigger (<1320px), and Sorting */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6 border-b border-gray-200 pb-4">
            <p className="text-gray-600">
              Showing {displayedProducts.length} products (infinite scroll)
            </p>
            <div className="flex items-center gap-2">
              {/* Filter button appears before Sort By on widths below 1320px */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-4 py-2 rounded-md bg-fuchsia-500 text-white font-medium min-[1320px]:hidden"
                aria-label="Open filters"
              >
                Filter
              </button>
              <span className="text-gray-600 whitespace-nowrap">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>

          {/* Products Rows - maintain large-screen ratio (3 cards per row) using fluid scale for >=768px */}
          <div className="hidden md:flex md:flex-col md:justify-start md:items-center md:gap-0">
            {/* Products Grid Container */}
            
            {displayedProducts.length === 0 ? (
              <div className="w-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No products found</div>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              productRows.map((rowProducts, rowIndex) => (
              <div key={rowIndex} className="w-full flex justify-center items-center gap-6 h-[582px]">
                {/* Individual Product Row */}
                
                {rowProducts.map((product, productIndex) => {
                  return (
                    <Link key={product.id} href={`/client/product-details/${product.id}`} className="flex h-full items-center">
                      <div
                        className="w-[312px] p-4 bg-sky-50 rounded-xl border border-black/10 inline-flex flex-col justify-start items-start group md:hover:shadow-md md:hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0 select-none"
                        style={{ transformOrigin: 'center', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                        role="article"
                        aria-labelledby={`product-title-${product.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.id);
                        }}
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
                        
                        <div 
                          className="transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                          className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out select-none pointer-events-none"
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
                          <div className="flex flex-col md:flex-row md:inline-flex justify-start items-start md:items-center gap-1.5">
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
                            
                            {/* Review count - hidden on mobile, shown on desktop next to stars */}
                            <div className="hidden md:block text-center justify-start text-neutral-400 text-sm font-normal font-['Poppins'] leading-relaxed">
                              {/* Reviews Count */}
                              ( {product.reviews} Reviews )
                            </div>
                            
                            {/* Review count box - shown on mobile below stars */}
                            <div className="md:hidden self-stretch px-2 py-1 bg-neutral-100 rounded-md text-center justify-start text-neutral-400 text-xs font-normal font-['Poppins'] leading-snug">
                              {/* Reviews Count Box for Mobile */}
                              ( {product.reviews} Reviews )
                            </div>
                          </div>
                        </div>

                        {/* Add to Cart Button - Hidden by default, shown on hover */}
                        <div className="self-stretch overflow-hidden h-0 group-hover:h-14 transition-all duration-500 ease-out">
                          {/* Add to Cart Button Container */}
                          
                          <button 
                            className="w-full h-0 opacity-0 px-7 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5 group-hover:h-14 group-hover:py-3 group-hover:opacity-100 hover:bg-fuchsia-600 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0"
                            aria-label={`Add ${product.name} to cart`}
                            onClick={(e) => e.stopPropagation()}
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
                    </Link>
                  );
                })}
              </div>
            ))
            )}
            
            {/* Load More Button - Infinite Scroll */}
            {hasMoreProducts && filteredAndSortedProducts.length > 0 && (
              <div className="w-full flex justify-center mt-8">
                <button
                  onClick={showMoreProducts}
                  className="px-6 py-3 border-2 border-fuchsia-500 text-fuchsia-500 rounded-lg hover:bg-fuchsia-50 transition-colors font-medium font-['Poppins']"
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>

          {/* Products Grid - Mobile only (2 per row) */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {displayedProducts.map((product) => (
              <Link key={product.id} href={`/client/product-details/${product.id}`}>
                <div
                  className="p-3 bg-sky-50 rounded-xl border border-black/10 flex flex-col justify-start items-start group transition-all duration-300 ease-in-out cursor-pointer select-none"
                  role="article"
                  aria-labelledby={`product-title-${product.id}`}
                >
                  {/* Card Header */}
                  <div className="self-stretch inline-flex justify-between items-center mb-2">
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-6 h-6 relative">
                        <Image src="/card/icon/tick.svg" alt="Verified seller" width={24} height={24} loading="lazy" />
                      </div>
                      <div className="text-neutral-600 text-xs font-semibold font-['PolySans_Trial'] leading-snug whitespace-nowrap">
                        Verified Seller
                      </div>
                    </div>
                    <div className="cursor-pointer">
                      <Image src="/card/icon/butterfly.svg" alt="Add to wishlist" width={24} height={24} loading="lazy" />
                    </div>
                  </div>
                  {/* Product Image */}
                  <div className="self-stretch h-40 relative mb-3 overflow-hidden rounded-lg">
                    <Image
                      src={product.image}
                      alt={`${product.name} product image`}
                      fill
                      className="object-cover select-none pointer-events-none"
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                  {/* Info */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div 
                      className="justify-start text-slate-950 text-sm font-semibold font-['Poppins'] leading-tight truncate max-w-full"
                      id={`product-title-${product.id}`}
                      role="heading"
                      aria-level={3}
                    >
                      {product.name.length > 24 ? `${product.name.substring(0, 24)}...` : product.name}
                    </div>
                    <div className="inline-flex justify-start items-center gap-1.5">
                      <div className="justify-start text-black text-lg font-semibold font-['Poppins'] leading-6">
                        {product.currency}{product.price}
                      </div>
                      <div className="justify-start">
                        <span className="text-red-500 text-xs font-normal font-['Poppins'] leading-normal">(</span>
                        <span className="text-red-500 text-xs font-normal font-['Poppins'] line-through leading-normal">
                          ${product.originalPrice}
                        </span>
                        <span className="text-red-500 text-xs font-normal font-['Poppins'] leading-normal">)</span>
                      </div>
                    </div>
                    {/* Stars */}
                    <div className="flex justify-start items-center">
                      {[...Array(product.rating)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

