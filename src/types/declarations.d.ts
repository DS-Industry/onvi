declare module '*.svg' {
  import React from 'react';
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}

// react-native-reanimated-carousel.d.ts
declare module 'react-native-reanimated-carousel/src/Carousel.tsx' {
  const Carousel: any;
  export default Carousel;
}
