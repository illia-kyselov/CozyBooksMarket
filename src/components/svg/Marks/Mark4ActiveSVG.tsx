import * as React from "react"
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg"
const Mark4ActiveSVG = () => (
  <Svg
    width={80}
    height={130}
    fill="none"
  >
    <Rect width={79} height={129} x={0.5} y={0.5} fill="#FF78E4" rx={29.5} />
    <Rect width={79} height={129} x={0.5} y={0.5} stroke="#FF78E4" rx={29.5} />
    <G clipPath="url(#a)">
      <Path
        fill="#F1F1F1"
        d="M40 43a22 22 0 1 0 0 44 22 22 0 0 0 0-44Zm-8.921 12.556c2.098-3.915 11.055-.33 2.618 9.444-12.364-4.389-6.463-11.82-2.618-9.444ZM49.116 70.54a1.375 1.375 0 0 1 1.507 2.023 12.369 12.369 0 0 1-10.72 6.188 12.37 12.37 0 0 1-10.719-6.188 1.375 1.375 0 0 1 1.507-2.023h.014l.047.013.184.041.693.152c.591.126 1.416.297 2.357.465 1.906.34 4.185.665 5.918.665 1.732 0 4.015-.325 5.918-.665 1.02-.184 2.037-.39 3.05-.616l.184-.042.047-.01.013-.006v.002Zm-.192-14.983c3.842-2.375 9.743 5.055-2.621 9.444-8.434-9.773.525-13.36 2.62-9.444Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M18 43h44v44H18z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Mark4ActiveSVG
