export const isCancelValid = (createdTime) => {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const currentTime = Date.now();
  const timeDifference = currentTime - createdTime;
  return timeDifference > oneDayInMilliseconds;
};
