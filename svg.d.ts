// Type declaration so `.svg` files can be imported as React components
// (handled at build time by react-native-svg-transformer).
declare module '*.svg' {
  import type React from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}
