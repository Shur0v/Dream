'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/productData';

interface AdminSectionProps {
  title: string;
  products: Product[];
  onAddClick: () => void;
}

export default function AdminSection({ title, products, onAddClick }: AdminSectionProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('Man');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filters = ['Man', 'Woman', 'Kids'];
  const filterData = {
    Man: ['T-Shirts', 'Shirts', 'Jeans', 'Shoes', 'Watches', 'Accessories'],
    Woman: ['Dresses', 'Tops', 'Skirts', 'Handbags', 'Jewelry', 'Shoes'],
    Kids: ['Clothing', 'Toys', 'Books', 'Shoes', 'Accessories', 'Games']
  };

  return (
    <section className="father w-full pb-7 bg-white flex flex-col justify-start items-center gap-8" role="region" aria-labelledby={`${title}-heading`} data-layer="father">
      <div className="daughter w-full max-w-[1320px] mx-auto" data-layer="daughter">
        <div className="layer-1 self-stretch flex flex-col justify-start items-start gap-4" data-layer="1">
          <div className="layer-2 self-stretch inline-flex justify-between items-start gap-8" data-layer="2">
            <div className="layer-3 flex justify-start items-center gap-8" data-layer="3">
              <div 
                className="layer-4 justify-start text-slate-950 text-5xl font-medium font-['Poppins'] leading-[57.60px]"
                id={`${title}-heading`}
                role="heading"
                aria-level={2}
                data-layer="4"
              >
                {title}
              </div>
            </div>
            <button onClick={onAddClick} className="h-10 px-4 rounded-lg bg-fuchsia-500 text-white hover:bg-fuchsia-600">Add New Product</button>
          </div>

          <div className="layer-5 inline-flex justify-start items-center gap-6" ref={dropdownRef} role="group" aria-label="Product category filters" data-layer="5">
            {filters.map((filter) => (
              <div key={filter} className="layer-6 relative" data-layer="6">
                <button
                  onClick={() => {
                    setActiveFilter(filter);
                    setShowDropdown(showDropdown === filter ? null : filter);
                  }}
                  className="layer-7 p-2.5 rounded border border-stone-300 flex justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                  aria-expanded={showDropdown === filter}
                  aria-haspopup="true"
                  aria-label={`Filter by ${filter} category`}
                  data-layer="7"
                >
                  <div className="layer-8 justify-start text-neutral-400 text-base font-normal font-['PolySans_Trial'] leading-tight" data-layer="8">
                    {filter}
                  </div>
                  <div className="layer-9 w-6 h-6 relative overflow-hidden" data-layer="9">
                    <svg
                      className={`absolute left-[6.25px] top-[9.25px] transition-transform duration-200 ${
                        showDropdown === filter ? 'rotate-180' : ''
                      }`}
                      width="12"
                      height="6"
                      viewBox="0 0 12 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M1 1L6 5L11 1" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
                {showDropdown === filter && (
                  <div className="layer-10 absolute top-full left-0 mt-1 w-48 bg-white border border-stone-300 rounded-lg shadow-lg z-10" role="menu" aria-label={`${filter} subcategories`} data-layer="10">
                    <div className="layer-11 py-2" data-layer="11">
                      {filterData[filter as keyof typeof filterData].map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveFilter(filter);
                            setShowDropdown(null);
                          }}
                          className="layer-12 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                          role="menuitem"
                          data-layer="12"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="layer-13 self-stretch h-[532px] flex justify-between items-center my-12" data-layer="13">
          {products.map((product, index) => (
            <Link key={product.id} href={`/client/product-details/${product.id}`} className="block">
              <div
                className="layer-14 w-[312px] p-4 bg-sky-50 rounded-xl border border-black/10 inline-flex flex-col justify-start items-start group hover:shadow-md hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer flex-shrink-0 select-none"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                role="article"
                aria-labelledby={`product-title-${product.id}`}
                data-layer="14"
              >
                <div className="layer-15 self-stretch inline-flex justify-between items-center mb-2" data-layer="15">
                  <div className="layer-16 flex justify-start items-center gap-2" data-layer="16">
                    <div className="layer-17 w-6 h-6 relative transform group-hover:scale-110 transition-transform duration-300" data-layer="17">
                      <Image src="/card/icon/tick.svg" alt="Verified seller" width={24} height={24} loading="lazy" />
                    </div>
                    <div className="layer-18 justify-start text-neutral-600 text-sm font-semibold font-['PolySans_Trial'] leading-relaxed" data-layer="18">Verified Seller</div>
                  </div>
                  <div className="layer-19 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 cursor-pointer" data-layer="19">
                    <Image src="/card/icon/butterfly.svg" alt="Add to wishlist" width={24} height={24} className="cursor-pointer" loading="lazy" />
                  </div>
                </div>
                <div className="layer-20 self-stretch h-72 relative mb-4 overflow-hidden rounded-lg" data-layer="20">
                  <Image src={product.image} alt={`${product.name} product image`} fill className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out select-none pointer-events-none" draggable={false} onDragStart={(e) => e.preventDefault()} style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }} loading="lazy" />
                </div>
                <div className="layer-21 self-stretch flex flex-col justify-start items-start" data-layer="21">
                  <div className="layer-22 self-stretch pt-4 pb-5 flex flex-col justify-center items-start gap-3" data-layer="22">
                    <div className="layer-23 self-stretch flex flex-col justify-start items-start gap-1" data-layer="23">
                      <div className="layer-24 justify-start text-slate-950 text-lg font-semibold font-['Poppins'] leading-loose group-hover:text-fuchsia-600 transition-colors duration-300 truncate max-w-full" title={product.name} id={`product-title-${product.id}`} role="heading" aria-level={3} data-layer="24">
                        {product.name.length > 24 ? `${product.name.substring(0, 24)}...` : product.name}
                      </div>
                      <div className="layer-25 inline-flex justify-start items-center gap-1.5" data-layer="25">
                        <div className="layer-26 flex justify-start items-center" data-layer="26">
                          <div className="layer-27 justify-start text-black text-2xl font-semibold font-['Poppins'] leading-9" data-layer="27">{product.currency}{product.price}</div>
                        </div>
                        <div className="layer-28 justify-start" data-layer="28">
                          <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">(</span>
                          <span className="text-red-500 text-base font-normal font-['Poppins'] line-through leading-normal">${product.originalPrice}</span>
                          <span className="text-red-500 text-base font-normal font-['Poppins'] leading-normal">)</span>
                        </div>
                      </div>
                    </div>
                    <div className="layer-29 inline-flex justify-start items-center gap-1.5" data-layer="29">
                      <div className="layer-30 flex justify-start items-center" role="img" aria-label={`${product.rating} out of 5 stars`} data-layer="30">
                        {[...Array(product.rating)].map((_, i) => (
                          <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} aria-hidden="true">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                        ))}
                      </div>
                      <div className="layer-31 text-center justify-start text-neutral-400 text-sm font-normal font-['Poppins'] leading-relaxed" data-layer="31">( {product.reviews} Reviews)</div>
                    </div>
                  </div>
                  <div className="layer-32 self-stretch overflow-hidden h-0 group-hover:h-14 transition-all duration-500 ease-out" data-layer="32">
                    <button className="layer-33 w-full h-0 opacity-0 px-7 bg-fuchsia-500 rounded-xl inline-flex justify-center items-center gap-1.5 group-hover:h-14 group-hover:py-3 group-hover:opacity-100 hover:bg-fuchsia-600 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0" aria-label={`Add ${product.name} to cart`} data-layer="33">
                      <div className="layer-34 w-5 h-5 relative" data-layer="34">
                        <Image src="/card/icon/cart.svg" alt="Cart icon" width={20} height={20} loading="lazy" />
                      </div>
                      <div className="layer-35 justify-start text-white text-base font-semibold font-['Poppins'] leading-none whitespace-nowrap" data-layer="35">Add to Cart</div>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="layer-36 h-2 flex justify-center items-center gap-2 mt-8" role="tablist" aria-label="Product pagination" data-layer="36">
          {[1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className={`layer-37 h-2 rounded-[10px] transition-all duration-300 ease-in-out transform origin-center ${
                hoveredCard === index ? 'w-12 bg-gradient-to-r from-fuchsia-500 to-fuchsia-500' : 'w-5 bg-neutral-200'
              }`}
              style={{ transformOrigin: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              role="tab"
              aria-selected={hoveredCard === index}
              aria-label={`Go to product ${index + 1}`}
              data-layer="37"
            />
          ))}
        </div>
      </div>
    </section>
  );
}



