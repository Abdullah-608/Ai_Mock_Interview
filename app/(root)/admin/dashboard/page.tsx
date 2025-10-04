import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminDashboard from './AdminDashboard';

export default async function AdminDashboardPage() {
  // Check admin authentication
  const cookieStore = cookies();
  const adminAuth = cookieStore.get('admin-auth');

  if (!adminAuth || adminAuth.value !== 'authenticated') {
    redirect('/admin');
  }

  return <AdminDashboard />;
}
