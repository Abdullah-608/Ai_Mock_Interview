import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore Prepify features for AI-powered mock interviews and feedback.',
};

export default function FeaturesPage() {
  // Redirect to home page with features section
  redirect('/#features');
}
