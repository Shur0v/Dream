'use client';

import React from 'react';
import ProductGallery from '../toppart/ProductGallery';
import ProductInfo from '../toppart/ProductInfo';
import DeliveryInfo from '../toppart/DeliveryInfo';

interface ProductDetailsContainerProps {
  product?: {
    id: string;
    slug: string;
    name: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviewsCount: number;
    description: string;
    category: string;
    orderId: string;
    seller: string;
    colors: string[];
    sizes: string[];
    inStock: boolean;
  };
  images?: string[];
}

const ProductDetailsContainer: React.FC<ProductDetailsContainerProps> = ({ 
  product,
  images 
}) => {
  // Default sample data if no props provided
  const defaultProduct = {
    id: '1',
    slug: 'premium-wireless-headphones',
    name: 'Premium Wireless Headphones',
    price: 89.99,
    oldPrice: 129.99,
    rating: 4.5,
    reviewsCount: 150,
    description: 'Experience crystal-clear sound with our premium wireless headphones. Featuring noise cancellation, 30-hour battery life, and comfortable over-ear design perfect for music lovers and professionals.',
    category: 'Electronics',
    orderId: 'ORD-2024-001',
    seller: 'TechStore BD',
    colors: ['Lemon', 'Red', 'Green', 'Yellow', 'Blue', 'Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  };

  const defaultImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=471&h=384&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=471&h=384&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=471&h=384&fit=crop',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=471&h=384&fit=crop',
  ];

  const productData = product || defaultProduct;
  const imageData = images || defaultImages;

  return (
    <section className="w-full bg-white flex flex-col items-center py-6 sm:py-8" role="main">
      <div className="w-full max-w-[1320px] mx-auto px-2">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-6 lg:flex-row lg:flex-[1.1]">
            <ProductGallery images={imageData} className="lg:flex-1" />
            <ProductInfo product={productData} className="lg:flex-1" />
          </div>
          <div className="lg:flex-[0.45] w-full">
            <DeliveryInfo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsContainer;
