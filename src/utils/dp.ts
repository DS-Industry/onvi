// import { Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');
// const referenceWidth = 375; // Your reference width
// const referenceHeight = 667; // Your reference height
// const widthScale = width / referenceWidth;
// const heightScale = height / referenceHeight;

// const dp = (px: number) => Math.min(widthScale, heightScale) * px;

// export { dp };

import {Dimensions} from 'react-native';

// Define a reference screen size (you can adjust this as needed)
const BASE_WIDTH = 375; // iPhone 6/7/8 width in points

// Function to scale a value based on the screen size and density
const dp = (size: any) => {
  const {width} = Dimensions.get('window');
  const scale = width / BASE_WIDTH;
  const scaledSize = size * scale;
  return scaledSize;
};

export {dp};

// table News {
//     id
//     verticalImage
//     horizontalImage
//     fullImage
//     text <- HTML
// }

// 1) NextAuth - авторизация (авторизирован - админ)
// 2) Не авторизирован - смотришь новость
