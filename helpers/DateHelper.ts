const locale = "en-EN";

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitialMonth = (date: string): string => {
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
  });
};

const DateHelper = {
  formatDate,
  formatDateTime,
  getInitialMonth,
};

export default DateHelper;
