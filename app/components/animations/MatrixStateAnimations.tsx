/**
 * MatrixStateAnimations
 * Three distinct animated states in Matrix hacker aesthetic:
 *   - Downloading  : scrolling [>---] → [===>] progress bar + phase text cycling
 *   - Loading      : spinning |/-\ spinner + scrolling >-->-->-->
 *   - Installing   : pseudo-unpacking file lines appearing one by one
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
    withDelay,
    FadeIn,
} from 'react-native-reanimated'

const GREEN = '#00ff00'
const DIM_GREEN = '#007a00'
const WHITE = '#ccffcc'

// ─── DOWNLOADING ────────────────────────────────────────────────────────────

const DOWNLOAD_PHASES = [
    'ИНИЦИАЛИЗАЦИЯ...',
    'ПОДКЛЮЧЕНИЕ К СЕРВЕРУ...',
    'АВТОРИЗАЦИЯ АГЕНТА...',
    'ПОЛУЧЕНИЕ ПАКЕТОВ...',
    'ЗАГРУЗКА ДАННЫХ',
    'ПРОВЕРКА ЦЕЛОСТНОСТИ...',
    'ЗАВЕРШЕНИЕ...',
]

export const DownloadAnimation: React.FC<{
    progress?: number // 0-100
    style?: ViewStyle
}> = ({ progress = 0, style }) => {
    const [phaseIdx, setPhaseIdx] = useState(0)
    const scrollX = useSharedValue(0)

    // Cycle through phase labels
    useEffect(() => {
        const id = setInterval(() => {
            setPhaseIdx((p) => (p + 1) % DOWNLOAD_PHASES.length)
        }, 1200)
        return () => clearInterval(id)
    }, [])

    // Animate the scrolling >--- symbol
    useEffect(() => {
        scrollX.value = withRepeat(
            withTiming(1, { duration: 600, easing: Easing.linear }),
            -1,
            false
        )
    }, [])

    const barWidth = Math.max(0, Math.min(100, progress))
    const filledCount = Math.floor((barWidth / 100) * 20)
    const emptyCount = 20 - filledCount
    const barStr = '='.repeat(filledCount) + '>'.padEnd(emptyCount, '-')

    const scrollStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: interpolate(scrollX.value, [0, 1], [-80, 0]) }],
    }))

    const phase = DOWNLOAD_PHASES[phaseIdx]

    return (
        <View style={[styles.container, style]}>
            {/* Phase label */}
            <Text style={styles.phaseText}>{phase}</Text>

            {/* Progress bar */}
            <View style={styles.barRow}>
                <Text style={styles.barBracket}>[</Text>
                <Text style={styles.barFill}>{barStr}</Text>
                <Text style={styles.barBracket}>]</Text>
                <Text style={styles.percentText}>{Math.round(barWidth)}%</Text>
            </View>

            {/* Scrolling symbol strip */}
            <View style={styles.scrollRow}>
                <Animated.Text style={[styles.scrollSymbols, scrollStyle]}>
                    {'>>-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->'}{' '}
                </Animated.Text>
            </View>
        </View>
    )
}

// ─── LOADING ────────────────────────────────────────────────────────────────

const SPINNER_FRAMES = ['|', '/', '-', '\\']

export const LoadingAnimation: React.FC<{ label?: string; style?: ViewStyle }> = ({
    label = 'ЗАГРУЗКА...',
    style,
}) => {
    const [frame, setFrame] = useState(0)
    const ripple = useSharedValue(0)

    useEffect(() => {
        const id = setInterval(() => setFrame((f) => (f + 1) % SPINNER_FRAMES.length), 120)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        ripple.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }),
                withTiming(0, { duration: 0 })
            ),
            -1,
            false
        )
    }, [])

    const rippleStyle = useAnimatedStyle(() => ({
        opacity: interpolate(ripple.value, [0, 0.5, 1], [0.8, 0.2, 0]),
        transform: [{ scaleX: interpolate(ripple.value, [0, 1], [1, 6]) }],
    }))

    return (
        <View style={[styles.container, style]}>
            <View style={styles.spinnerRow}>
                <Text style={styles.spinnerChar}>{SPINNER_FRAMES[frame]}</Text>
                <Text style={styles.phaseText}>{label}</Text>
                <Text style={styles.spinnerChar}>{SPINNER_FRAMES[frame]}</Text>
            </View>
            {/* Scrolling stream */}
            <ScrollingStream />
            {/* Ripple underline */}
            <Animated.View style={[styles.ripple, rippleStyle]} />
        </View>
    )
}

const ScrollingStream: React.FC = () => {
    const scrollX = useSharedValue(0)
    useEffect(() => {
        scrollX.value = withRepeat(
            withTiming(-120, { duration: 1000, easing: Easing.linear }),
            -1,
            false
        )
    }, [])
    const style = useAnimatedStyle(() => ({ transform: [{ translateX: scrollX.value }] }))
    return (
        <View style={{ overflow: 'hidden', width: '100%', marginTop: 8 }}>
            <Animated.Text style={[styles.streamText, style]}>
                {'>-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->-->'}
            </Animated.Text>
        </View>
    )
}

// ─── INSTALLING ─────────────────────────────────────────────────────────────

const INSTALL_FILES = [
    'matrix.core',
    'agent.protocol',
    'neural.net',
    'cipher.sys',
    'quantum.dat',
    'shadow.lib',
    'override.bin',
    'system32.exe',
    'ai.engine',
    'reboot.init',
]

function randomFile() {
    return INSTALL_FILES[Math.floor(Math.random() * INSTALL_FILES.length)]
}

interface InstallLine {
    id: number
    text: string
    status: 'РАСПАКОВКА...' | '[OK]' | '[ОШИБКА]'
    ok: boolean
}

export const InstallAnimation: React.FC<{ style?: ViewStyle }> = ({ style }) => {
    const [lines, setLines] = useState<InstallLine[]>([])
    const counterRef = useRef(0)

    const addLine = useCallback(() => {
        const id = counterRef.current++
        const file = `распаковка ${randomFile()}... `
        // Small chance of "error" then retry
        const hasError = Math.random() < 0.07
        setLines((prev) => {
            const next = [
                ...prev.slice(-8), // keep last 8 lines
                { id, text: file, status: 'РАСПАКОВКА...' as const, ok: false },
            ]
            return next
        })
        setTimeout(() => {
            setLines((prev) =>
                prev.map((l) =>
                    l.id === id
                        ? { ...l, status: hasError ? ('[ОШИБКА]' as const) : ('[OK]' as const), ok: !hasError }
                        : l
                )
            )
            if (hasError) {
                // Retry the same file
                setTimeout(() => {
                    const retryId = counterRef.current++
                    setLines((prev) => [
                        ...prev.slice(-8),
                        { id: retryId, text: `повтор   ${file}`, status: 'РАСПАКОВКА...' as const, ok: false },
                    ])
                    setTimeout(() => {
                        setLines((prev) =>
                            prev.map((l) =>
                                l.id === retryId
                                    ? { ...l, status: '[OK]' as const, ok: true }
                                    : l
                            )
                        )
                    }, 400)
                }, 300)
            }
        }, 600 + Math.random() * 400)
    }, [])

    useEffect(() => {
        addLine()
        const id = setInterval(addLine, 900)
        return () => clearInterval(id)
    }, [])

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.installHeader}>▓ УСТАНОВКА МАТРИЦЫ ▓</Text>
            {lines.map((line) => (
                <Animated.View
                    key={line.id}
                    entering={FadeIn.duration(200)}
                    style={styles.installLine}>
                    <Text style={styles.installText}>{line.text}</Text>
                    <Text
                        style={[
                            styles.installStatus,
                            {
                                color:
                                    line.status === '[OK]'
                                        ? GREEN
                                        : line.status === '[ОШИБКА]'
                                          ? '#ff4444'
                                          : DIM_GREEN,
                            },
                        ]}>
                        {line.status}
                    </Text>
                </Animated.View>
            ))}
        </View>
    )
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        borderColor: '#00ff00',
        borderWidth: 1,
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
    },
    phaseText: {
        color: GREEN,
        fontFamily: 'monospace',
        fontSize: 13,
        letterSpacing: 1,
        marginBottom: 10,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    barBracket: {
        color: DIM_GREEN,
        fontFamily: 'monospace',
        fontSize: 16,
    },
    barFill: {
        color: GREEN,
        fontFamily: 'monospace',
        fontSize: 14,
        letterSpacing: 0,
    },
    percentText: {
        color: WHITE,
        fontFamily: 'monospace',
        fontSize: 13,
        marginLeft: 8,
    },
    scrollRow: {
        width: '100%',
        overflow: 'hidden',
        height: 20,
    },
    scrollSymbols: {
        color: DIM_GREEN,
        fontFamily: 'monospace',
        fontSize: 13,
    },
    spinnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
        marginBottom: 8,
    },
    spinnerChar: {
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: 24,
        textShadowColor: '#00ff00',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    streamText: {
        color: DIM_GREEN,
        fontFamily: 'monospace',
        fontSize: 13,
        width: 600,
    },
    ripple: {
        height: 2,
        width: 60,
        backgroundColor: GREEN,
        borderRadius: 1,
        marginTop: 8,
    },
    installHeader: {
        color: GREEN,
        fontFamily: 'monospace',
        fontSize: 14,
        letterSpacing: 2,
        marginBottom: 12,
        textShadowColor: '#00ff00',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },
    installLine: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        width: '100%',
    },
    installText: {
        color: DIM_GREEN,
        fontFamily: 'monospace',
        fontSize: 12,
        flex: 1,
    },
    installStatus: {
        fontFamily: 'monospace',
        fontSize: 12,
        marginLeft: 4,
    },
})
