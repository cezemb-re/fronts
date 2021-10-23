import { DateTime } from 'luxon';

export function formatRelativeDate(time: string | DateTime): string {
  const now = DateTime.local();
  let parsedTime: DateTime;

  if (typeof time === 'string') {
    parsedTime = DateTime.fromISO(time);
  } else {
    parsedTime = time;
  }

  let result = '';

  if (!parsedTime.hasSame(now, 'week')) {
    result = parsedTime.toFormat('cccc d');

    if (!parsedTime.hasSame(now, 'month')) {
      result += parsedTime.toFormat(' LLLL');

      if (!parsedTime.hasSame(now, 'year')) {
        result += parsedTime.toFormat(' yyyy');
      }
    }
  } else if (!parsedTime.hasSame(now, 'day')) {
    result = parsedTime.toFormat('cccc');
  } else {
    result = "Aujourd'hui";
  }

  return result;
}

export function formatRelativeDateTime(time: string | DateTime, exactTime = true): string {
  let parsedTime: DateTime;

  if (typeof time === 'string') {
    parsedTime = DateTime.fromISO(time);
  } else {
    parsedTime = time;
  }

  let result = formatRelativeDate(parsedTime);

  if (result.length) {
    result += ' ';
  }

  result += `${exactTime ? 'à' : 'vers'} ${parsedTime.toLocaleString(DateTime.TIME_24_SIMPLE)}`;

  return result;
}
