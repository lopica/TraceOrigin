export function getDateFromEpochTime(epoch) {
    // Create a new Date object using the epoch time
    const date = new Date(epoch * 1000); // Convert seconds to milliseconds

    // Get the day, month, and year from the date object
    const day = date.getDate();  // Get the day as a number (1-31)
    const month = date.getMonth() + 1;  // Get the month as a number (0-11), add 1 for 1-12
    const year = date.getFullYear();  // Get the full year (e.g., 2024)

    // Format the day and month to ensure they are always two digits
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Construct the date string in 'dd/mm/yyyy' format
    return `${formattedDay}/${formattedMonth}/${year}`;
}
