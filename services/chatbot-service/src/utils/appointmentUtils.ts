const extractAppointmentDetails = (response: string) => {
  const lines = response
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (!lines.some((line) => line.startsWith('Book Appointment'))) {
    return {
      error:
        'The response does not indicate a booking. Please ensure the appointment details are provided correctly.',
    };
  }

  const details: Record<string, string> = {};
  for (const line of lines) {
    if (line.startsWith('- Appointment with:')) {
      details.participant = line.replace('- Appointment with:', '').trim();
    } else if (line.startsWith('- Purpose:')) {
      details.purpose = line.replace('- Purpose:', '').trim();
    } else if (line.startsWith('- Date:')) {
      details.date = line.replace('- Date:', '').trim();
    } else if (line.startsWith('- Time:')) {
      details.time = line.replace('- Time:', '').trim();
    } else if (
      line.startsWith('- Contact Number:') ||
      line.startsWith("- Attendee's Phone Number:")
    ) {
      details.contactNumber = line.split(':')[1].trim();
    }
  }

  if (!details.purpose) {
    return { error: 'Please specify the purpose of the appointment.' };
  }
  if (!details.participant) {
    return { error: 'Please provide the participant for the appointment.' };
  }
  if (!details.date || !details.time) {
    return {
      error:
        'Please specify both the date and the time of the appointment in the correct format.',
    };
  }
  if (!details.contactNumber || details.contactNumber.length !== 10) {
    return { error: 'Phone number must have 10 digits.' };
  }

  const date = mergeDateTime(details.date, details.time);
  if (!date) {
    return {
      error:
        'Invalid date format. Please specify a precise date (DD/MM/YYYY) and time (HH:MM AM/PM).',
    };
  }

  return {
    title: details.purpose,
    participant: details.participant,
    participantPhoneNumber: parseInt(details.contactNumber, 10),
    date,
  };
};

function mergeDateTime(dateStr: string, timeStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);

  const dateTimeStr = `${month}/${day}/${year} ${timeStr}`;

  const date = new Date(dateTimeStr);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date or time format');
  }

  return date;
}

export { extractAppointmentDetails };
