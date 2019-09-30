import reduceRatio from '../../vendor/aspect-ratio/aspect-ratio';

export const getAspectRatioFromJson = ratioJson => {
  const defaultRatio = '1-1';
  if (!ratioJson) return defaultRatio;
  let final = defaultRatio;
  try {
    const parsedRatio = JSON.parse(ratioJson);
    if (
      typeof parsedRatio.w === 'number' ||
      typeof parsedRatio.h === 'number'
    ) {
      final = reduceRatio(parsedRatio.w, parsedRatio.h);
    }
  } catch (err) {
    console.error(
      "There was a problem parsing your image's aspect ratio:",
      err
    );
  }
  return final;
};
