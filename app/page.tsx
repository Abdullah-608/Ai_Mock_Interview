import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/actions/auth.action';
import LandingPageClient from './LandingPageClient';

export default async function LandingPage() {
  const isUserAuthenticated = await isAuthenticated();
  
  if (isUserAuthenticated) {
    redirect('/dashboard');
  }
  
  return <LandingPageClient />;
}