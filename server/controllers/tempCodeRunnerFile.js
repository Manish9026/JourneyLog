const getFormattedTravelCountPerDay = (data) => {
  const travelByCount = {};

  data.forEach(record => {
      record.travel.forEach(travelEntry => {
          const date = new Date(travelEntry.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short'
          }); // Format date as "15 Aug"
          const travelBy = travelEntry.travelBy.toLowerCase();

          // Initialize if date is not in the object yet
          if (!travelByCount[date]) {
              travelByCount[date] = { metro: 0, rapido: 0, auto: 0, other: 0, date: date };
          }

          // Increment counts for specific travel methods or count as 'other' if it doesn't match known methods
          if (travelByCount[date][travelBy] !== undefined) {
              travelByCount[date][travelBy]++;
          } else {
              travelByCount[date].other++;
          }
      });
  });

  // Convert the object into an array format
  return Object.values(travelByCount);
};