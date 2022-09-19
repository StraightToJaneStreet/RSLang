export const calculatePercentage = (partCount: number, totalCount: number): string => {
  const percentage = totalCount !== 0 ? (partCount / totalCount) * 100 : 0;
  const prettyPercentage = percentage.toPrecision(2);

  return `${prettyPercentage}%`;
};
