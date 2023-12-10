import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pl";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const formatDateOfCreation = (dateOfCreation: string) => {
  const utcDateTime = dayjs.utc(dateOfCreation);
  const localDateTime = utcDateTime.local();
  const timeElapsed = localDateTime.fromNow();

  return timeElapsed;
};
