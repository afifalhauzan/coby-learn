export const openGoogleCalendar = (title: string, description: string, date: string) => {
  const cleanDate = date.replace(/-/g, '');
  
  const dates = `${cleanDate}/${cleanDate}`; 

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', title);
  url.searchParams.append('details', description || '');
  url.searchParams.append('dates', dates);

  window.open(url.toString(), '_blank');
};