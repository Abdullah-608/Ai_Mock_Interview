import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/firebase/admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin-auth');

    if (!adminAuth || adminAuth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete user and all their associated data
    const batch = db.batch();

    // Delete user document
    const userRef = db.collection('users').doc(userId);
    batch.delete(userRef);

    // Delete user's learning cards
    const learningCardsSnapshot = await db
      .collection('learningCards')
      .where('userId', '==', userId)
      .get();

    learningCardsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user's interviews
    const interviewsSnapshot = await db
      .collection('interviews')
      .where('userId', '==', userId)
      .get();

    interviewsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Commit the batch
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
