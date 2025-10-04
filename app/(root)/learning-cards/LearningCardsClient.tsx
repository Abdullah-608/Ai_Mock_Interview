'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Brain, 
  Sparkles, 
  Loader2, 
  Play,
  Trash2,
  Clock,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

interface LearningCard {
  id: string;
  title: string;
  content: string;
  notes: string;
  explanation: string;
  createdAt: string;
  userId: string;
  userName?: string;
  coverImage?: string;
}

interface CreateCardData {
  title: string;
  content: string;
}

interface LearningCardsClientProps {
  user: {
    id: string;
    name?: string;
    email?: string;
  } | null;
  allCards: LearningCard[];
}

function LearningCardsClient({ user, allCards }: LearningCardsClientProps) {
  const [cards, setCards] = useState<LearningCard[]>(allCards);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateCardData>({ title: '', content: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Update cards when props change
  useEffect(() => {
    setCards(allCards);
  }, [allCards]);

  const handleCreateCard = useCallback(async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsCreating(true);
    
    try {
      // Generate AI notes and explanation
      const response = await fetch('/api/learning-cards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          userId: user?.id,
          userName: user?.name
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 504) {
          throw new Error('AI generation is taking longer than expected. Please try with shorter content or try again later.');
        }
        throw new Error(errorData.error || 'Failed to generate learning content');
      }

      const { cardId, notes, explanation } = await response.json();

      const newCard: LearningCard = {
        id: cardId,
        title: formData.title,
        content: formData.content,
        notes,
        explanation,
        createdAt: new Date().toISOString(),
        userId: user?.id || 'current-user',
        userName: user?.name || 'User',
        coverImage: '/ai-avatar.png'
      };

      setCards(prev => [newCard, ...prev]);
      setFormData({ title: '', content: '' });
      setShowCreateForm(false);
      toast.success('Learning card created successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create learning card';
      toast.error(message);
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  }, [formData, user]);

  const handleDeleteCard = useCallback(async (cardId: string) => {
    try {
      const response = await fetch(`/api/learning-cards/${cardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      if (!response.ok) throw new Error('Failed to delete learning card');

      setCards(prev => prev.filter(card => card.id !== cardId));
      setShowDeleteConfirm(null);
      toast.success('Learning card deleted');
    } catch (error) {
      toast.error('Failed to delete learning card');
      console.error(error);
    }
  }, [user, cards]);

  const confirmDelete = useCallback((cardId: string) => {
    setShowDeleteConfirm(cardId);
  }, []);

  const cancelDelete = useCallback(() => {
    setShowDeleteConfirm(null);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm backdrop-blur-sm mb-6">
            <Brain className="w-4 h-4" />
            AI-Powered Learning Cards
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Master New Concepts with
            <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Smart Learning Cards
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Create personalized learning cards with AI-generated notes and voice explanations to accelerate your understanding.
          </p>

          {/* Create Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Learning Card
          </motion.button>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-75"></div>
                      <Image
                        src={card.coverImage || '/ai-avatar.png'}
                        alt="Learning card"
                        width={48}
                        height={48}
                        className="relative rounded-full object-cover size-12 border-2 border-white/20"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{card.title}</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <User className="w-3 h-3" />
                        <span>{card.userName}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => confirmDelete(card.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Content */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{card.content}</p>

                {/* Card Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <Link href={`/learning-cards/${card.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      <Play className="w-4 h-4" />
                      Start Learning
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cards.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16 text-gray-400"
            >
              <Brain className="w-16 h-16 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-4">No Learning Cards Yet</h3>
              <p className="text-lg mb-8">Create your first AI-powered learning card to get started!</p>
              
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Card Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create Learning Card</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Card Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., React Hooks Fundamentals"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Learning Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Describe what you want to learn about. The more detailed, the better the AI notes will be..."
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateCard}
                    disabled={isCreating}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate AI Notes
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/5 backdrop-blur-sm transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 rounded-2xl p-6 border border-white/10 shadow-2xl max-w-md w-full"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 mb-4">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Delete Learning Card</h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete this learning card? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteCard(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(LearningCardsClient);
