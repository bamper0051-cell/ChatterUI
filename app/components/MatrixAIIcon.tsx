/**
 * MatrixAIIcon
 * SVG icon for Matrix AI: a chip with circuit-board traces and [ AI ] text.
 * Color scheme: black background (#000000), bright green (#00FF00).
 */
import React from 'react'
import Svg, {
    Circle,
    Defs,
    Line,
    LinearGradient,
    Path,
    Rect,
    Stop,
    Text as SvgText,
} from 'react-native-svg'

interface MatrixAIIconProps {
    size?: number
}

const MatrixAIIcon: React.FC<MatrixAIIconProps> = ({ size = 120 }) => {
    const s = size
    const cx = s / 2
    const cy = s / 2

    return (
        <Svg width={s} height={s} viewBox="0 0 120 120">
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#001a00" />
                    <Stop offset="1" stopColor="#003300" />
                </LinearGradient>
            </Defs>

            {/* Background */}
            <Rect x="0" y="0" width="120" height="120" rx="22" ry="22" fill="#000000" />
            <Rect x="2" y="2" width="116" height="116" rx="20" ry="20" fill="url(#grad)" />

            {/* Outer border glow */}
            <Rect
                x="3"
                y="3"
                width="114"
                height="114"
                rx="19"
                ry="19"
                fill="none"
                stroke="#00ff00"
                strokeWidth="1.5"
                opacity="0.8"
            />

            {/* Chip body */}
            <Rect
                x="28"
                y="28"
                width="64"
                height="64"
                rx="8"
                ry="8"
                fill="#000d00"
                stroke="#00cc00"
                strokeWidth="2"
            />

            {/* Circuit traces - left side */}
            <Line x1="10" y1="42" x2="28" y2="42" stroke="#00ff00" strokeWidth="1.5" />
            <Line x1="10" y1="56" x2="28" y2="56" stroke="#00cc00" strokeWidth="1.5" />
            <Line x1="10" y1="70" x2="28" y2="70" stroke="#00ff00" strokeWidth="1.5" />
            <Line x1="10" y1="84" x2="28" y2="84" stroke="#00cc00" strokeWidth="1.5" />

            {/* Dots left */}
            <Circle cx="10" cy="42" r="2.5" fill="#00ff00" />
            <Circle cx="10" cy="56" r="2.5" fill="#00cc00" />
            <Circle cx="10" cy="70" r="2.5" fill="#00ff00" />
            <Circle cx="10" cy="84" r="2.5" fill="#00cc00" />

            {/* Circuit traces - right side */}
            <Line x1="92" y1="42" x2="110" y2="42" stroke="#00ff00" strokeWidth="1.5" />
            <Line x1="92" y1="56" x2="110" y2="56" stroke="#00cc00" strokeWidth="1.5" />
            <Line x1="92" y1="70" x2="110" y2="70" stroke="#00ff00" strokeWidth="1.5" />
            <Line x1="92" y1="84" x2="110" y2="84" stroke="#00cc00" strokeWidth="1.5" />

            {/* Dots right */}
            <Circle cx="110" cy="42" r="2.5" fill="#00ff00" />
            <Circle cx="110" cy="56" r="2.5" fill="#00cc00" />
            <Circle cx="110" cy="70" r="2.5" fill="#00ff00" />
            <Circle cx="110" cy="84" r="2.5" fill="#00cc00" />

            {/* Circuit traces - top */}
            <Line x1="42" y1="10" x2="42" y2="28" stroke="#00cc00" strokeWidth="1.5" />
            <Line x1="60" y1="10" x2="60" y2="28" stroke="#00ff00" strokeWidth="1.5" />
            <Line x1="78" y1="10" x2="78" y2="28" stroke="#00cc00" strokeWidth="1.5" />

            {/* Dots top */}
            <Circle cx="42" cy="10" r="2.5" fill="#00cc00" />
            <Circle cx="60" cy="10" r="2.5" fill="#00ff00" />
            <Circle cx="78" cy="10" r="2.5" fill="#00cc00" />

            {/* Circuit traces - bottom */}
            <Line x1="42" y1="92" x2="42" y2="110" stroke="#00cc00" strokeWidth="1.5" />
            <Line x1="60" y1="92" x2="60" y2="110" stroke="#00ff00" strokeWidth="1.5" />
            <Line x1="78" y1="92" x2="78" y2="110" stroke="#00cc00" strokeWidth="1.5" />

            {/* Dots bottom */}
            <Circle cx="42" cy="110" r="2.5" fill="#00cc00" />
            <Circle cx="60" cy="110" r="2.5" fill="#00ff00" />
            <Circle cx="78" cy="110" r="2.5" fill="#00cc00" />

            {/* Inner chip decoration lines */}
            <Line x1="36" y1="36" x2="84" y2="36" stroke="#004400" strokeWidth="1" />
            <Line x1="36" y1="90" x2="84" y2="90" stroke="#004400" strokeWidth="1" />
            <Line x1="36" y1="36" x2="36" y2="90" stroke="#004400" strokeWidth="1" />
            <Line x1="84" y1="36" x2="84" y2="90" stroke="#004400" strokeWidth="1" />

            {/* Corner accent squares */}
            <Rect x="30" y="30" width="6" height="6" fill="#00ff00" opacity="0.4" />
            <Rect x="84" y="30" width="6" height="6" fill="#00ff00" opacity="0.4" />
            <Rect x="30" y="84" width="6" height="6" fill="#00ff00" opacity="0.4" />
            <Rect x="84" y="84" width="6" height="6" fill="#00ff00" opacity="0.4" />

            {/* [ AI ] text at center */}
            <SvgText
                x="60"
                y="56"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
                fill="#006600"
                letterSpacing="1">
                {'[ AI ]'}
            </SvgText>
            <SvgText
                x="60"
                y="56"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
                fill="#00ff00"
                letterSpacing="1">
                {'[ AI ]'}
            </SvgText>

            {/* MATRIX text */}
            <SvgText
                x="60"
                y="72"
                textAnchor="middle"
                fontSize="7"
                fontFamily="monospace"
                fill="#00aa00"
                letterSpacing="3">
                {'MATRIX'}
            </SvgText>

            {/* Pulsing center dot */}
            <Circle cx="60" cy="60" r="3" fill="#00ff00" opacity="0.15" />
        </Svg>
    )
}

export default MatrixAIIcon
