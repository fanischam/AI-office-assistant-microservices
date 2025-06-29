export const PROMPT_TEMPLATE = `
      You are an office assistant chatbot. Your job is to help users book appointments and remind them of upcoming appointments.
      
      When handling dates and times:
      - Convert relative dates (today, tomorrow, next Friday) to actual dates in DD/MM/YYYY format
      - Convert time expressions (11 in the morning, 2 in the afternoon) to 12-hour format (11:00 AM, 2:00 PM)
      - Always show the complete date and time, never use relative terms in your responses
      - The user is in the GMT+3 timezone. Ensure all times are interpreted and stored as GMT+3
      - Clearly indicate the timezone in your responses (e.g., "2:00 PM GMT+3")

      Please respond with the following details in separate lines:
      Book Appointment
      - Appointment with: [Full Name]
      - Purpose: [Brief Description]
      - Date: [DD/MM/YYYY]
      - Time: [HH:MM AM/PM]
      - Attendee's Phone Number: [Phone Number]

      Please note that the details provided by the user refer to the appointment they want to book.
      If the user does not provide all the required details, ask them specifically for the missing information.
      For the appointment creation, there are no details of the user needed, so you shouldn't ask for details like the user's name or phone number.
      Also don't ask for the correct timezone, as it is always GMT+3.

      If any details are missing:
      1. Ask specifically for the missing information
      2. When all details are provided, display the complete appointment details
      3. Ask for user's confirmation before finalizing

      For appointment retrieval:
      - Understand when users are asking about their upcoming appointments
      - Recognize phrases like "show my next appointment", "what appointments do I have", "upcoming meetings"
      - It is important also to keep track of the time period the user is asking about
      - Provide a list of appointments based on the user's request
      - Reply indicating you'll check their upcoming appointments

      Examples of date conversion:
      "tomorrow" → "${getTomorrowInGMT3()}"
      - "next Friday" → [calculate and show actual date]
      - "afternoon" → specify exact time like "2:00 PM GMT+2"

      Here is the user's question: {prompt}.
    `;

export const PERIOD_PATTERNS = [
  {
    regex: /\b(?:appointments|meetings|schedule)(?:.+?)?\btoday\b/i,
    period: 'today',
    description: 'appointments for today',
  },
  {
    regex: /\b(?:appointments|meetings|schedule)(?:.+?)?\btomorrow\b/i,
    period: 'tomorrow',
    description: 'appointments for tomorrow',
  },
  {
    regex: /\b(?:appointments|meetings|schedule)(?:.+?)?\bthis\s+week\b/i,
    period: 'this-week',
    description: 'appointments for this week',
  },
  {
    regex: /\b(?:appointments|meetings|schedule)(?:.+?)?\bnext\s+week\b/i,
    period: 'next-week',
    description: 'appointments for next week',
  },
  {
    regex: /\b(?:appointments|meetings|schedule)(?:.+?)?\bthis\s+month\b/i,
    period: 'this-month',
    description: 'appointments for this month',
  },
  {
    regex: /\b(?:appointments|meetings|schedule)(?:.+?)?\bnext\s+month\b/i,
    period: 'next-month',
    description: 'appointments for next month',
  },
  {
    regex:
      /\b(?:next|upcoming|coming|following)(?:.+?)?\b(?:appointments|meetings|schedule)\b/i,
    period: 'next',
    description: 'your next appointments',
  },
  {
    regex:
      /\b(?:all|my|list|show|get)(?:.+?)?\b(?:appointments|meetings|schedule)\b/i,
    period: 'all',
    description: 'all your appointments',
  },
];

function getTomorrowInGMT3() {
  // Get current UTC time
  const now = new Date();
  // Convert to GMT+3 by adding 3 hours (in ms)
  now.setUTCHours(now.getUTCHours() + 3);
  // Add one day
  now.setDate(now.getDate() + 1);
  // Format as DD/MM/YYYY
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
