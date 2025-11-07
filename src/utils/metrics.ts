import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const horizontalScale = (size: number) =>
  (shortDimension / guidelineBaseWidth) * size;
const verticalScale = (size: number) =>
  (longDimension / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;
const moderateVerticalScale = (size: number, factor = 0.5) =>
  size + (verticalScale(size) - size) * factor;

export {horizontalScale, verticalScale, moderateScale, moderateVerticalScale};
