import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
} from '../../services/historyService.js';
import InterviewCard from '../../components/InterviewCard';
import { MdDeleteSweep } from 'react-icons/md';
import { BsClipboardData } from 'react-icons/bs';
import toast from 'react-hot-toast';
import './index.css';

function HistoryPage() {
  const navigate = useNavigate();
  const [allInterviews, setAllInterviews] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const allData = await getHistory(1, 100);
        const entries = allData.entries || [];
        setAllInterviews(entries);
        setRecentInterviews(entries.slice(0, 3));
      } catch (error) {
        console.error('Failed to load history:', error.message);
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      setAllInterviews((prev) => {
        const updated = prev.filter((item) => item._id !== id);
        setRecentInterviews(updated.slice(0, 3));
        return updated;
      });
      toast.success('Interview deleted');
    } catch (error) {
      toast.error('Failed to delete interview');
    }
  };

  const handleCardClick = (interview) => {
    if (interview.status === 'completed') {
      navigate(`/feedback/${interview._id}`);
    } else {
      navigate(`/interview/${interview._id}`);
    }
  };

  const completedCount = allInterviews.filter((i) => i.status === 'completed').length;
  const avgScore = allInterviews.length
    ? Math.round(
        allInterviews
          .filter((i) => i.overallScore)
          .reduce((sum, i) => sum + i.overallScore, 0) /
          (allInterviews.filter((i) => i.overallScore).length || 1)
      )
    : 0;

  return (
    <div className="history-page">
      <header className="history-header">
        <h1>History</h1>
        <p>{allInterviews.length} interviews</p>
      </header>

      {/* UI for summary and cards */}

      <div className="history-grid">
        {loading ? (
          <p>Loading history...</p>
        ) : allInterviews.length === 0 ? (
          <p>No history found.</p>
        ) : (
          allInterviews.map((interview) => (
            <InterviewCard
              key={interview._id}
              interview={interview}
              onClick={() => handleCardClick(interview)}
              onDelete={() => handleDelete(interview._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
