export const formatViews = (qty: number) => {
  if (qty < 1000) return qty;
  else if (qty < 1000000)
    return Math.floor(qty / 1000) + '.' + Math.floor((qty % 1000) / 100) + 'К';
  else if (qty < 1000000000000000) return Math.floor(qty / 1000000) + 'М';
  else return 'error';
};
