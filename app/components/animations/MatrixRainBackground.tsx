/**
 * MatrixRainBackground
 * Animated falling green characters inspired by The Matrix.
 * Uses React Native Reanimated for smooth, performant animation.
 */
import React, { useEffect, useMemo, useRef } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated'

// Matrix-style character set (katakana + latin + digits)
const MATRIX_CHARS =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const COLUMN_WIDTH = 18
const CHAR_HEIGHT = 20
const NUM_COLUMNS = Math.floor(SCREEN_WIDTH / COLUMN_WIDTH)
const NUM_ROWS = Math.ceil(SCREEN_HEIGHT / CHAR_HEIGHT) + 4

function randomChar() {
    return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
}

function randomGreen(intensity: number): string {
    // intensity: 0 (dark) to 1 (bright)
    const base = Math.floor(intensity * 200)
    return `rgb(0, ${base + 55}, 0)`
}

interface ColumnProps {
    x: number
    columnIndex: number
}

const MatrixColumn: React.FC<ColumnProps> = ({ x, columnIndex }) => {
    const translateY = useSharedValue(-SCREEN_HEIGHT - NUM_ROWS * CHAR_HEIGHT)
    const speed = useMemo(() => 3000 + Math.random() * 5000, [])
    const delay = useMemo(() => Math.random() * 4000, [])

    // Generate static chars for this column (they'll scroll via translateY)
    const chars = useMemo(() => {
        return Array.from({ length: NUM_ROWS * 2 }, () => ({
            char: randomChar(),
            intensity: Math.random(),
        }))
    }, [])

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(SCREEN_HEIGHT + NUM_ROWS * CHAR_HEIGHT, {
                    duration: speed,
                    easing: Easing.linear,
                }),
                -1,
                false
            )
        )
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }))

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: x,
                    top: -NUM_ROWS * CHAR_HEIGHT,
                    width: COLUMN_WIDTH,
                    flexDirection: 'column',
                },
                animatedStyle,
            ]}>
            {chars.map((item, i) => {
                const isTip = i === chars.length - 1
                const color = isTip ? '#ffffff' : randomGreen(item.intensity)
                return (
                    <Text
                        key={i}
                        style={{
                            color,
                            fontSize: 14,
                            fontFamily: 'monospace',
                            height: CHAR_HEIGHT,
                            lineHeight: CHAR_HEIGHT,
                            textAlign: 'center',
                            opacity: item.intensity * 0.85 + 0.15,
                            textShadowColor: '#00ff00',
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: isTip ? 8 : 2,
                        }}>
                        {item.char}
                    </Text>
                )
            })}
        </Animated.View>
    )
}

interface MatrixRainBackgroundProps {
    opacity?: number
    density?: number // 0-1, fraction of columns to render
}

const MatrixRainBackground: React.FC<MatrixRainBackgroundProps> = ({
    opacity = 0.35,
    density = 0.7,
}) => {
    const columns = useMemo(() => {
        return Array.from({ length: NUM_COLUMNS }, (_, i) => i).filter(
            () => Math.random() < density
        )
    }, [density])

    return (
        <View
            pointerEvents="none"
            style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: '#000000', overflow: 'hidden', opacity },
            ]}>
            {columns.map((colIdx) => (
                <MatrixColumn
                    key={colIdx}
                    x={colIdx * COLUMN_WIDTH}
                    columnIndex={colIdx}
                />
            ))}
        </View>
    )
}

export default MatrixRainBackground
