import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Prepify and our mission to improve interview prep.',
};

export default function AboutPage() {
  // Redirect to home page
  redirect('/');
}
