export const formatDate = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = date.toLocaleString("en-GB", { weekday: "short" });
  const dayNum = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const time = date.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} ${dayNum} ${month} - ${time.toLowerCase()}`;
};

export const formatSaleDate = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};