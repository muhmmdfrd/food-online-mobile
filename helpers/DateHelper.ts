const locale = "en-EN";

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTime = (date: string): string => {
  const d = formatDate(date);
  const t = formatTime(date);
  return `${d} ${t}`;
};

const getInitialMonth = (date: string): string => {
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
  });
};

const DateHelper = {
  formatDate,
  formatTime,
  formatDateTime,
  getInitialMonth,
};

export default DateHelper;
