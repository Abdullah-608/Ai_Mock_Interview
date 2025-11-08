import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { isAuthenticated } from '@/lib/actions/auth.action';
import LandingPageClient from './LandingPageClient';

export const metadata: Metadata = {
  title: 'Prepify | Home',
  description: 'Prepify helps you practice mock interviews with AI-driven feedback.',
};

export default async function LandingPage() {
  const isUserAuthenticated = await isAuthenticated();
  
  if (isUserAuthenticated) {
    redirect('/dashboard');
  }
  
  return <LandingPageClient />;
}