export function getEpochFromDate (dateValue) {
    const dateObject = new Date(dateValue);
    
     // Set the hours, minutes, seconds, and milliseconds to 0 (i.e., 00:00:00)
    //  dateObject.setHours(0, 0, 0, 0);

     // Get the epoch time in milliseconds
     const epochMilliseconds = dateObject.getTime();
 
     // Convert to epoch time in seconds and return
    //  return Math.floor(epochMilliseconds / 1000);
     return epochMilliseconds;
}