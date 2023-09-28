export const SEXES = {
  boy: 0,
  girl: 1,
};

export function calculateBusiestMonth(dates) {
  const months = {};
  const busiest = { count: 0, month: null };

  for (const date of dates) {
    const monthStr = date.substring(0, 7);
    months[monthStr] = months[monthStr] + 1 || 1;

    if (months[monthStr] > busiest.count) {
      busiest.count = months[monthStr];
      busiest.month = monthStr;
    }
  }

  return busiest;
}

export function calculateGreatestDailyAggregate(dates) {
  const dateCounts = {};
  const greatest = { count: 0, date: null };

  for (const isoDate of dates) {
    const datePart = isoDate.split("T")[0];
    dateCounts[datePart] = dateCounts[datePart] + 1 || 1;

    if (dateCounts[datePart] > greatest.count) {
      greatest.count = dateCounts[datePart];
      greatest.date = datePart;
    }
  }

  return greatest;
}

export function calculateLatestStreak(dates) {
  let streak = 0;
  if (dates.length === 0) return streak;

  const uniqueDates = [...new Set(dates)];
  const today = new Date();
  const latestDate = new Date(uniqueDates[uniqueDates.length - 1]);

  const timeDifference = Math.abs(today - latestDate);
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  if (daysDifference <= 1) {
    streak++;
  } else {
    return streak;
  }

  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const previousDate = new Date(uniqueDates[i - 1]);

    const timeDifference = Math.abs(currentDate - previousDate);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference <= 0) {
      streak++;
    } else {
      return streak;
    }
  }

  return streak;
}

export function aggregateCountsForPast7Days(dates) {
  const currentDate = new Date(); // Get the current date
  const past7Days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const formattedDate = date.toISOString().split("T")[0];
    past7Days.push(formattedDate);
  }

  const counts = {};
  for (const day of past7Days) {
    counts[day] = 0;
  }

  for (const item of dates) {
    const itemDate = item.timestamp?.split("T")[0];
    if (counts[itemDate] !== undefined) {
      counts[itemDate]++;
    }
  }

  const result = [];
  for (const day of past7Days) {
    result.push({ date: day, count: counts[day] });
  }

  return result;
}
