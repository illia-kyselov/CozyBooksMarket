import * as React from "react"
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg"
const Mark2SVG = () => (
  <Svg
    width={80}
    height={130}
    fill="none"
  >
    <Rect width={79} height={129} x={0.5} y={0.5} stroke="#FF78E4" rx={29.5} />
    <G clipPath="url(#a)">
      <Path
        fill="#FF78E4"
        d="M40 87a22 22 0 1 0 0-44 22 22 0 0 0 0 44Zm-2.75-26.125c0 2.277-1.232 4.125-2.75 4.125s-2.75-1.848-2.75-4.125 1.232-4.125 2.75-4.125 2.75 1.848 2.75 4.125Zm-8.25 11a1.375 1.375 0 0 1 1.375-1.375h19.25a1.375 1.375 0 0 1 0 2.75h-19.25A1.375 1.375 0 0 1 29 71.875ZM45.5 65c-1.518 0-2.75-1.848-2.75-4.125s1.232-4.125 2.75-4.125 2.75 1.848 2.75 4.125S47.018 65 45.5 65Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M18 43h44v44H18z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Mark2SVG
