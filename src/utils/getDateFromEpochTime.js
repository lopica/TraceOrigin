import BigNumber from 'bignumber.js';
import { format } from 'date-fns';

export function getDateFromEpochTime(epoch) {
  const epochBigNum = new BigNumber(epoch);

  // Check if the epoch time is in milliseconds or seconds
  const isMilliseconds = epochBigNum.toString().length === 13;
  const multiplier = isMilliseconds ? 1 : 1000;
  const epochMillis = epochBigNum.multipliedBy(multiplier).toNumber();

  // Create a new Date object using the correct epoch time
  const date = new Date(epochMillis);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid epoch time");
  }

  // Format the date in 'dd/MM/yyyy' format
  return format(date, 'dd/MM/yyyy');
}


