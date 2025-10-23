'use client';

import React from 'react';
import TopPart from './components/TopPart';
import FilteringSystem from './components/FilteringSystem';

/**
 * Categories page component
 * 
 * @description Displays:
 * - All available product categories
 * - Category navigation and filtering
 * - Category-specific content
 * 
 * @returns JSX categories page element
 */
export default function Categories() {
  return (
    <>
      {/* Top Banner Section */}
      <TopPart />
      
      {/* Complete Filtering System */}
      <FilteringSystem />
    </>
  );
}
