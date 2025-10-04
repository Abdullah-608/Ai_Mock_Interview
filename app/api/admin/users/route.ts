import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/firebase/admin';

export async function GET() {
  try {
    // Check admin authentication
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('admin-auth');

    if (!adminAuth || adminAuth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users with their learning cards count
    const usersSnapshot = await db.collection('users').get();
    const learningCardsSnapshot = await db.collection('learningCards').get();
    const interviewsSnapshot = await db.collection('interviews').get();

    // Count learning cards per user
    const learningCardsCount: { [key: string]: number } = {};
    learningCardsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.userId) {
        learningCardsCount[data.userId] = (learningCardsCount[data.userId] || 0) + 1;
      }
    });

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
        learningCardsCount: learningCardsCount[doc.id] || 0,
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
