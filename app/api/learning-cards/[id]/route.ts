import { deleteLearningCard } from "@/lib/actions/general.action";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { success, error } = await deleteLearningCard({
      cardId: id,
      userId
    });

    if (!success) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting learning card:", error);
    return Response.json({ 
      success: false, 
      error: 'Failed to delete learning card' 
    }, { status: 500 });
  }
}
