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

    const { id: interviewId } = await params;

    if (!interviewId) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    // Delete the interview
    await db.collection('interviews').doc(interviewId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json(
      { error: 'Failed to delete interview' },
      { status: 500 }
    );
  }
}
