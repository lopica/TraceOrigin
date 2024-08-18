export function getEpochFromDate (dateValue) {
    const dateObject = new Date(dateValue);
    
    // Get the epoch time in milliseconds
    const epochMilliseconds = dateObject.getTime();
    
    // Convert to epoch time in seconds if needed
    return Math.floor(epochMilliseconds / 1000);
}