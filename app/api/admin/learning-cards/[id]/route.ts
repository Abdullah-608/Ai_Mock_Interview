import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/firebase/admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('admin-auth');

    if (!adminAuth || adminAuth.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cardId = params.id;

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    // Delete the learning card
    await db.collection('learningCards').doc(cardId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting learning card:', error);
    return NextResponse.json(
      { error: 'Failed to delete learning card' },
      { status: 500 }
    );
  }
}
