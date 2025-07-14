// src/utils/dateUtils.js
export const categorizeDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const isLastWeek = (today - date) < 7 * 24 * 60 * 60 * 1000;

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  if (isLastWeek) return 'Last 7 Days';
  return 'Older';
};

export const formatDate = (dateString) => {
  const options = { hour: 'numeric', minute: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};