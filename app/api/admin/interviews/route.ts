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

    // Fetch all interviews and users
    const [interviewsSnapshot, usersSnapshot] = await Promise.all([
      db.collection('interviews').orderBy('createdAt', 'desc').get(),
      db.collection('users').get(),
    ]);

    // Create a map of userId to userName
    const userMap: { [key: string]: string } = {};
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      userMap[doc.id] = userData.name || userData.email || 'Unknown User';
    });

    const interviews = interviewsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
        userId: data.userId,
        userName: data.userName || userMap[data.userId] || 'Unknown User',
        finalized: data.finalized || false,
      };
    });

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}
