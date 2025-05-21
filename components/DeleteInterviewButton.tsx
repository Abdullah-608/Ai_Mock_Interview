"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { deleteInterview } from "@/lib/actions/general.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react"; // Import Trash2 icon from lucide-react

interface DeleteInterviewButtonProps {
  interviewId: string;
  userId: string;
}

const DeleteInterviewButton = ({ interviewId, userId }: DeleteInterviewButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteInterview({ interviewId, userId });
      
      if (result.success) {
        toast.success("Interview deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete interview");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full h-9 w-9 p-0 transform transition-all duration-300 hover:bg-red-100 hover:text-red-600 hover:scale-105 active:scale-95"
          aria-label="Delete interview"
          title="Delete interview"
        >
          <Trash2 size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg border-0 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-red-600">
            Delete Interview?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            This action cannot be undone. This will permanently delete the interview
            and all its associated feedback data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-full border-0 hover:bg-gray-100 transition-all duration-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 size={16} />
                Delete
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInterviewButton;