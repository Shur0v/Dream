import ClientLandingPage from './client/page';

/**
 * Main domain landing page
 * Uses the client landing page component to avoid code duplication
 * 
 * @description Displays:
 * - Hero section with call-to-action
 * - Featured products grid
 * - Service highlights
 * - Company benefits
 * 
 * @returns JSX landing page element
 */
export default function LandingPage() {
  return <ClientLandingPage />;
}