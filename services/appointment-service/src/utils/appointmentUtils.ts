export const getDateRangeForPeriod = (period: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getRelativeDate = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };

  const getStartOfWeek = () => {
    const date = new Date(today);
    date.setDate(date.getDate() - date.getDay());
    return date;
  };

  const dateRanges: Record<
    string,
    { start?: Date; end?: Date; sort?: boolean; limit?: number }
  > = {
    today: {
      start: today,
      end: getRelativeDate(1),
    },
    tomorrow: {
      start: getRelativeDate(1),
      end: getRelativeDate(2),
    },
    'this-week': {
      start: getStartOfWeek(),
      end: getRelativeDate(7 - today.getDay()),
    },
    'next-week': {
      start: getRelativeDate(7 - today.getDay()),
      end: getRelativeDate(14 - today.getDay()),
    },
    next: {
      start: today,
      sort: true,
      limit: 10,
    },
    all: {},
  };

  return dateRanges[period] || {};
};
