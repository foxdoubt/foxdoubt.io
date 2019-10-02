const ACCEPTED_ASPECT_RATIOS = ['1:1', '4:3'];

export const getAspectRatio = ratioStr => {
  const defaultRatio = '1-1';
  if (!ratioStr) return defaultRatio;
  if (ACCEPTED_ASPECT_RATIOS.indexOf(ratioStr) > -1) {
    return ratioStr.replace(':', '-');
  }
  return defaultRatio;
};
