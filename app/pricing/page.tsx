import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Prepify mock interview practice.',
};

export default function PricingPage() {
  // Redirect to home page
  redirect('/');
}
