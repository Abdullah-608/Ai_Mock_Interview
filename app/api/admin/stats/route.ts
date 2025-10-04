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

    // Get today's date range
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Fetch all data in parallel
    const [usersSnapshot, learningCardsSnapshot, interviewsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('learningCards').get(),
      db.collection('interviews').get(),
    ]);

    // Calculate total counts
    const totalUsers = usersSnapshot.size;
    const totalLearningCards = learningCardsSnapshot.size;
    const totalInterviews = interviewsSnapshot.size;

    // Calculate today's activity
    let cardsCreatedToday = 0;
    let usersJoinedToday = 0;

    learningCardsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const createdAt = new Date(data.createdAt);
      if (createdAt >= startOfToday && createdAt < endOfToday) {
        cardsCreatedToday++;
      }
    });

    usersSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const createdAt = new Date(data.createdAt || data.timestamp || 0);
      if (createdAt >= startOfToday && createdAt < endOfToday) {
        usersJoinedToday++;
      }
    });

    const stats = {
      totalUsers,
      totalLearningCards,
      totalInterviews,
      recentActivity: cardsCreatedToday + usersJoinedToday,
      cardsCreatedToday,
      usersJoinedToday,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
