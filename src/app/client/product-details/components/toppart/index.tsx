import React from 'react'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'
import DeliveryInfo from './DeliveryInfo'

interface TopPartProps {
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

export default function TopPart({ product, images }: TopPartProps) {
  const defaultProduct = {
    id: '1',
    slug: 'premium-wireless-headphones',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    oldPrice: 399.99,
    rating: 4.5,
    reviewsCount: 128,
    description: 'High-quality wireless headphones with noise cancellation, premium sound quality, and comfortable design perfect for all-day use.',
    category: 'Electronics',
    orderId: 'ORD-001',
    seller: 'TechStore',
    colors: ['Lemon', 'Red', 'Green', 'Yellow', 'Blue', 'Black', 'White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  };

  const defaultImages = [
    '/images/product1.jpg',
    '/images/product2.jpg',
    '/images/product3.jpg',
    '/images/product4.jpg',
  ];

  const productData = product || defaultProduct;
  const imageData = images || defaultImages;

  return (
    <div className="father w-full bg-white flex flex-col justify-start items-center py-8" role="main" data-layer="father">
      <div className="daughter w-full max-w-[1320px] mx-auto" data-layer="daughter">
        <div className="layer-1 inline-flex justify-start items-start gap-8" data-layer="1">
          <div className="h-[546px] flex justify-start items-start gap-8">
            <ProductGallery images={imageData} />
            <ProductInfo product={productData} />
          </div>
          <DeliveryInfo />
        </div>
      </div>
    </div>
  )
}


