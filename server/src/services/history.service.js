import Interview from '../models/Interview.models.js';
import { isDatabaseConnected } from '../config/db.config.js';
import { demoStore } from '../utils/demoStore.js';

export const getUserHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  if (!isDatabaseConnected()) {
    const allEntries = Array.from(demoStore.interviews.values())
      .filter((entry) => String(entry.userId) === String(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const entries = allEntries.slice(skip, skip + limit).map((entry) => ({
      _id: entry._id,
      role: entry.role,
      status: entry.status,
      overallScore: entry.overallScore,
      totalQuestions: entry.totalQuestions,
      createdAt: entry.createdAt,
    }));

    return {
      entries,
      totalEntries: allEntries.length,
      totalPages: Math.max(1, Math.ceil(allEntries.length / limit)),
      currentPage: page,
    };
  }

  const [entries, totalEntries] = await Promise.all([
    Interview.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('role status overallScore totalQuestions createdAt'),

    Interview.countDocuments({ userId }),
  ]);

  return {
    entries,
    totalEntries,
    totalPages: Math.ceil(totalEntries / limit),
    currentPage: page,
  };
};

export const getHistoryEntry = async (entryId, userId) => {
  if (!isDatabaseConnected()) {
    const entry = demoStore.interviews.get(String(entryId));
    if (!entry || String(entry.userId) !== String(userId)) throw new Error('Interview not found');
    return entry;
  }

  const entry = await Interview.findOne({ _id: entryId, userId }).select('-__v');
  if (!entry) throw new Error('Interview not found');
  return entry;
};

export const deleteHistoryEntry = async (entryId, userId) => {
  if (!isDatabaseConnected()) {
    const entry = demoStore.interviews.get(String(entryId));
    if (!entry || String(entry.userId) !== String(userId)) throw new Error('Interview not found');
    demoStore.interviews.delete(String(entryId));
    return entry;
  }

  const entry = await Interview.findOneAndDelete({ _id: entryId, userId });
  if (!entry) throw new Error('Interview not found');
  return entry;
};

export const clearUserHistory = async (userId) => {
  if (!isDatabaseConnected()) {
    let deletedCount = 0;
    for (const [id, entry] of demoStore.interviews.entries()) {
      if (String(entry.userId) === String(userId)) {
        demoStore.interviews.delete(id);
        deletedCount += 1;
      }
    }
    return { deletedCount };
  }

  const result = await Interview.deleteMany({ userId });
  return { deletedCount: result.deletedCount };
};