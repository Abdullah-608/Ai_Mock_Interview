import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/firebase/admin';

export async function GET() {
  try {
    // Check admin authentication
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin-auth');

    if (!adminAuth || adminAuth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users with their interview count
    const usersSnapshot = await db.collection('users').get();
    const interviewsSnapshot = await db.collection('interviews').get();

    // Count interviews per user
    const interviewsCount: { [key: string]: number } = {};
    interviewsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.userId) {
        interviewsCount[data.userId] = (interviewsCount[data.userId] || 0) + 1;
      }
    });

    const users = usersSnapshot.docs.map(doc => {
      const userData = doc.data();
      return {
        id: doc.id,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt || userData.timestamp || new Date().toISOString(),
        interviewsCount: interviewsCount[doc.id] || 0,
      };
    });

    // Sort by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
