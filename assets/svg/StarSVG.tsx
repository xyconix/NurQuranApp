import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface StarSVGProps {
  width?: number | string;
  height?: number | string;
}

const StarSVG = ({ width = "15", height = "16" }: StarSVGProps) => (
  <Svg width={width} height={height} viewBox="0 0 15 16" fill="none">
    <Path
      d="M7.10001 0C7.10001 0 6.6 7 0 7.6C6.6 8.3 7.10001 15.2 7.10001 15.2C7.10001 15.2 7.6 8.2 14.2 7.6C7.6 7 7.10001 0 7.10001 0Z"
      fill="#FFD08A"
    />
  </Svg>
);

export default StarSVG;
