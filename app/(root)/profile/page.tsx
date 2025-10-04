import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getUserStats } from '@/lib/actions/user.action';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  const stats = await getUserStats(user.id);
  
  return (
    <ProfileClient 
      user={user} 
      stats={stats}
    />
  );
}