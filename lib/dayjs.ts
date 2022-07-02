import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const formatDate = (date) =>
  dayjs.utc(date).format("YYYY-MM-DDTHH:mm:ss");

export const formatTime = (date) => dayjs.utc(date).format("HH:mm:ss");

export const getToday = () =>
  dayjs().startOf("day").format("YYYY-MM-DDTHH:mm:ssZ");

export const getTomorrow = () =>
  dayjs().startOf("day").add(1, "day").format("YYYY-MM-DDTHH:mm:ssZ");

export const getStartOfMonth = () =>
  dayjs().startOf("month").format("YYYY-MM-DDTHH:mm:ssZ");

export const getStartOfNextMonth = () =>
  dayjs().startOf("month").add(1, "month").format("YYYY-MM-DDTHH:mm:ssZ");

export const getTimeToNow = (date) => dayjs(date).toNow();

export default dayjs;
