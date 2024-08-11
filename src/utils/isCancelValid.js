export const checkCancelValid = (createdTime) => {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const currentTime = Date.now();
  const timeDifference = currentTime - createdTime;
  console.log(timeDifference)
  console.log(currentTime)
  console.log(createdTime)
  return timeDifference > oneDayInMilliseconds;
};
