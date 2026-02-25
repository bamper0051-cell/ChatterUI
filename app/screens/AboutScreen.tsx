import ThemedButton from '@components/buttons/ThemedButton'
import MatrixAIIcon from '@components/MatrixAIIcon'
import HeaderTitle from '@components/views/HeaderTitle'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'
import appConfig from 'app.config'
import React, { useState } from 'react'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

const AboutScreen = () => {
    const styles = useStyles()
    const { spacing } = Theme.useTheme()
    const [counter, setCounter] = useState<number>(0)
    const [devMode, setDevMode] = useMMKVBoolean(AppSettings.DevMode)

    const updateCounter = () => {
        if (devMode) return
        if (counter === 6) {
            Logger.infoToast(`Режим разработчика активирован.`)
            setDevMode(true)
        }
        setCounter(counter + 1)
    }

    const version = 'v' + appConfig.expo.version
    return (
        <View style={styles.container}>
            <HeaderTitle title="О программе" />
            <TouchableOpacity activeOpacity={0.8} onPress={updateCounter}>
                <MatrixAIIcon size={120} />
            </TouchableOpacity>

            <Text style={styles.titleText}>Matrix AI</Text>
            <Text style={styles.codeText}>{'// НЕЙРОСЕТЕВОЙ ИНТЕРФЕЙС'}</Text>
            <Text style={styles.subtitleText}>
                Версия {version} {devMode && '[DEV MODE]'}
            </Text>
            {devMode && (
                <ThemedButton
                    label="Отключить режим разработчика"
                    variant="critical"
                    buttonStyle={{
                        marginTop: spacing.xl,
                    }}
                    onPress={() => {
                        setCounter(0)
                        setDevMode(false)
                        Logger.info('Dev mode disabled')
                    }}
                />
            )}

            <Text style={styles.body}>
                Matrix AI — мобильный фронтенд для языковых моделей с поддержкой локального и удалённого вывода.
            </Text>
            <Text style={{ marginBottom: spacing.xl3, ...styles.body }}>
                Поддерживаемые агенты: OpenAI · Grok · Claude · DeepSeek · Gemini
            </Text>
            <Text style={{ ...styles.body, marginBottom: spacing.m }}>
                На основе ChatterUI (open-source):
            </Text>

            <ThemedButton
                buttonStyle={{ marginTop: spacing.m }}
                variant="secondary"
                label="Репозиторий GitHub"
                iconName="github"
                iconSize={20}
                onPress={() => {
                    Linking.openURL('https://github.com/Vali-98/ChatterUI')
                }}
            />
        </View>
    )
}

export default AboutScreen

const useStyles = () => {
    const { color, spacing } = Theme.useTheme()

    return StyleSheet.create({
        container: {
            paddingHorizontal: spacing.xl3,
            paddingBottom: spacing.xl2,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        titleText: {
            color: '#00ff00',
            fontSize: 32,
            marginTop: 16,
            fontFamily: 'monospace',
            textShadowColor: '#00ff00',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
        },
        codeText: {
            color: '#00aa00',
            fontFamily: 'monospace',
            fontSize: 12,
            letterSpacing: 1,
            marginTop: 4,
        },
        subtitleText: { color: color.text._400, fontFamily: 'monospace' },
        body: { color: color.text._100, marginTop: spacing.l, textAlign: 'center' },
    })
}
