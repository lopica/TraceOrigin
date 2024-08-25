export function getFullTimeFromEpoch(epoch) {
  if (epoch.toString().length > 10) {
    epoch = Math.floor(epoch / 1000);
  }

  const date = new Date(epoch * 1000);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hour = String(date.getHours())
  const minute = String(date.getMinutes())
  const second = String(date.getSeconds())

  return `${day}/${month}/${year} lúc ${hour} giờ ${minute} phút ${second} giây`;
}
