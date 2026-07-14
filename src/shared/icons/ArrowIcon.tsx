import React from "react";
import Svg, { Rect, Path } from "react-native-svg";

interface Props {
   size: number;
   color: string;
   onPress?: () => void;
}

export const ArrowLeftIcon = ({ size = 32, color = "#0C5347", onPress }: Props) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      onPress={onPress}
    >
      <Rect width={32} height={32} rx={10} fill="#E4F3EA" />
      <Path
        d="M15.4581 21.4205L9.94673 15.9091L15.4581 10.3977L16.6286 11.5568L13.1229 15.0625H21.6399V16.7557H13.1229L16.6286 20.2557L15.4581 21.4205Z"
        fill={color}
      />
    </Svg>
  );
};

{/* 
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="10" fill="#E4F3EA"/>
    <path d="M15.4581 21.4205L9.94673 15.9091L15.4581 10.3977L16.6286 11.5568L13.1229 15.0625H21.6399V16.7557H13.1229L16.6286 20.2557L15.4581 21.4205Z" fill="#0C5347"/>
    </svg> 
*/}
