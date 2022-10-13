export const getTimePL = () => {
  const newDate = new Date();
  const hrs = newDate.toLocaleTimeString("pl-PL").substring(0, 5);
  const min = newDate.getMinutes();
  const date = newDate.toISOString().substring(0, 11);
  const result = String(date) + String(hrs) + ":" + String(min);
  return result;
};
export const parseTimePL = (inputDate) => {
  let input = new Date(inputDate)
  const hrs = input.toLocaleTimeString("pl-PL").substring(0, 5);
  const min = input.getMinutes();
  const dates = input.toISOString().substring(0, 11);
  const result = String(dates) + String(hrs) + ":" + String(min);

  return result;
};
