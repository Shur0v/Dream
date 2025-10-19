import { redirect } from 'next/navigation';

/**
 * Client home page redirects to main domain
 * This avoids confusion between /client/home and main domain
 */
export default function ClientHomePage() {
  redirect('/');
}
