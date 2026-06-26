import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { getScores, addScore, updateScore, deleteScore } from '../services/scoreService';
import ScoreModal from '../components/scores/ScoreModal';
import DeleteConfirmModal from '../components/scores/DeleteConfirmModal';

export default function Scores() {
  const queryClient = useQueryClient();
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [deletingScoreId, setDeletingScoreId] = useState(null);

  // Fetch scores
  const { data: scores = [], isLoading, isError } = useQuery({
    queryKey: ['scores'],
    queryFn: getScores,
  });

  // Add score mutation
  const addMutation = useMutation({
    mutationFn: addScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
      toast.success('Score added successfully');
      setIsScoreModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add score');
    },
  });

  // Update score mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateScore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
      toast.success('Score updated successfully');
      setIsScoreModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update score');
    },
  });

  // Delete score mutation
  const deleteMutation = useMutation({
    mutationFn: deleteScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
      toast.success('Score deleted successfully');
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete score');
    },
  });

  const handleAddClick = () => {
    setEditingScore(null);
    setIsScoreModalOpen(true);
  };

  const handleEditClick = (score) => {
    setEditingScore(score);
    setIsScoreModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingScoreId(id);
    setIsDeleteModalOpen(true);
  };

  const handleModalSubmit = (data) => {
    if (editingScore) {
      updateMutation.mutate({ id: editingScore.id, data });
    } else {
      addMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingScoreId) {
      deleteMutation.mutate(deletingScoreId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold" />
            Your Scores
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your Stableford scores. (Max 5 recent scores)
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-accent hover:bg-accent-light text-white px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 self-start md:self-auto shadow-lg shadow-accent/20"
        >
          <Plus className="w-5 h-5" />
          Add Score
        </button>
      </motion.div>

      {/* Scores Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card rounded-[2rem] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-bg-secondary/20 text-text-muted text-sm font-medium">
                <th className="p-5 font-semibold text-white">Date Played</th>
                <th className="p-5 font-semibold text-white">Course</th>
                <th className="p-5 font-semibold text-white">Stableford Score</th>
                <th className="p-5 font-semibold text-white">Recorded On</th>
                <th className="p-5 font-semibold text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-secondary">
                    <span className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2"></span>
                    <p>Loading scores...</p>
                  </td>
                </tr>
              )}
              {!isLoading && scores.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-text-muted">
                    <Trophy className="w-12 h-12 text-text-muted/50 mx-auto mb-4" />
                    <p className="text-lg text-white mb-1">No scores yet</p>
                    <p>Click "Add Score" to record your first round.</p>
                  </td>
                </tr>
              )}
              {!isLoading && scores.map((score, index) => (
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={score.id}
                  className="border-b border-border/50 hover:bg-white/5 transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-medium text-white">
                        {new Date(score.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="font-medium text-white">{score.course}</span>
                  </td>
                  <td className="p-5">
                    <span className="text-xl font-bold gradient-text">{score.score}</span>
                  </td>
                  <td className="p-5 text-sm text-text-secondary">
                    {new Date(score.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(score)}
                        className="p-2 rounded-lg bg-bg-secondary text-text-secondary hover:text-white transition-colors"
                        title="Edit Score"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(score.id)}
                        className="p-2 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-colors"
                        title="Delete Score"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modals */}
      <ScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingScore}
        isLoading={addMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
