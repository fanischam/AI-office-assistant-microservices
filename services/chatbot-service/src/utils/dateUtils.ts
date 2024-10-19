export const parseRelativeDate = (
  dateString: string,
  timeString: string
): Date | null => {
  try {
    const months: { [key: string]: number } = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const cleanedDateString = dateString.replace(/(\w+),?/, '').trim();
    const dateParts = cleanedDateString.split(' ');

    if (dateParts.length < 3) {
      console.error('Invalid date format:', dateString);
      return null;
    }

    const [dayPart, , monthName] = dateParts;
    const day = parseInt(dayPart.replace(/\D/g, ''), 10);
    const month = months[monthName];
    const year = new Date().getFullYear();

    if (month === undefined || isNaN(day)) {
      console.error('Invalid date format:', dateString);
      return null;
    }

    const targetDate = new Date(year, month, day);

    if (targetDate < new Date()) {
      targetDate.setFullYear(year + 1);
    }

    const [hours, minutes] = normalizeTimeString(timeString)
      .split(':')
      .map(Number);
    targetDate.setHours(hours, minutes, 0, 0);

    console.log('Parsed date:', targetDate);
    return targetDate;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

const normalizeTimeString = (timeString: string): string => {
  const amPmMatch = timeString.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);

  if (amPmMatch) {
    let [_, hours, minutes = '00', period] = amPmMatch;
    hours = parseInt(hours, 10).toString();
    minutes = minutes || '00';

    if (period.toUpperCase() === 'PM' && hours !== '12') {
      hours = (parseInt(hours, 10) + 12).toString();
    } else if (period.toUpperCase() === 'AM' && hours === '12') {
      hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes.padEnd(2, '0')}`;
  }

  if (/^\d{1,2}(\.\d{1,2})?$/.test(timeString)) {
    const [hours, minutes = '00'] = timeString.split('.');
    return `${hours.padStart(2, '0')}:${minutes.padEnd(2, '0')}`;
  }

  if (/^\d{1,2}:\d{2}$/.test(timeString)) {
    return timeString;
  }

  throw new Error('Invalid time format');
};
