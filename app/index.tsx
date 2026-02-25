import MatrixRainBackground from '@components/animations/MatrixRainBackground'
import MatrixAIIcon from '@components/MatrixAIIcon'
import ThemedButton from '@components/buttons/ThemedButton'
import HeaderTitle from '@components/views/HeaderTitle'
import { db } from '@db'
import { AntDesign } from '@expo/vector-icons'
import useLocalAuth from '@lib/hooks/LocalAuth'
import { useNotificationObserver } from '@lib/notifications/Notifications'
import { Theme } from '@lib/theme/ThemeManager'
import { loadChatOnInit, startupApp } from '@lib/utils/Startup'
import CharacterList from '@screens/CharacterListScreen'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { SplashScreen } from 'expo-router'
import { useEffect, useState } from 'react'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import migrations from '../db/migrations/migrations'

const Home = () => {
    const { color } = Theme.useTheme()
    const styles = useStyles()
    const { success, error } = useMigrations(db, migrations)
    const { authorized, retry } = useLocalAuth()

    const [firstRender, setFirstRender] = useState<boolean>(true)

    useNotificationObserver()

    useEffect(() => {
        if (authorized && success) {
            loadChatOnInit()
        }
    }, [authorized])

    useEffect(() => {
        /**
         * Startup Routine:
         * - wait for useMigration success
         * - startupApp() - creates defaults
         */
        if (success) {
            startupApp()
            setFirstRender(false)
            SplashScreen.hideAsync()
        }
        if (error) SplashScreen.hideAsync()
    }, [success, error])

    if (error)
        return (
            <View style={styles.centeredContainer}>
                <MatrixRainBackground opacity={0.2} density={0.4} />
                <HeaderTitle />
                <MatrixAIIcon size={80} />
                <Text style={styles.title}>// ОШИБКА БАЗЫ ДАННЫХ</Text>
                <Text style={styles.errorLog}>{error.message}</Text>
                <Text style={styles.subtitle}>
                    Произошла критическая ошибка. Сообщите об этом в репозиторий.
                </Text>
                <Text style={styles.subtitle}></Text>
                <ThemedButton
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

    if (!authorized)
        return (
            <View style={[styles.centeredContainer, { rowGap: 60 }]}>
                <MatrixRainBackground opacity={0.25} density={0.5} />
                <HeaderTitle />
                <MatrixAIIcon size={100} />
                <Text style={styles.matrixTitle}>MATRIX AI</Text>
                <AntDesign
                    name="lock"
                    size={80}
                    style={{ marginBottom: 12 }}
                    color="#00ff00"
                />
                <Text style={styles.title}>// АУТЕНТИФИКАЦИЯ ТРЕБУЕТСЯ</Text>
                <TouchableOpacity onPress={retry} style={styles.button}>
                    <Text style={styles.buttonText}>&gt;&gt; ПОВТОРИТЬ</Text>
                </TouchableOpacity>
            </View>
        )
    if (!firstRender && success) return <CharacterList />
    return (
        <View style={[styles.centeredContainer]}>
            <MatrixRainBackground opacity={0.3} density={0.6} />
            <MatrixAIIcon size={100} />
            <Text style={styles.matrixTitle}>MATRIX AI</Text>
            <Text style={styles.bootText}>// ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...</Text>
        </View>
    )
}

export default Home

const useStyles = () => {
    const { color, spacing, fontSize, borderWidth } = Theme.useTheme()
    return StyleSheet.create({
        centeredContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000',
        },

        matrixTitle: {
            color: '#00ff00',
            fontSize: 28,
            fontFamily: 'monospace',
            letterSpacing: 6,
            marginTop: 12,
            textShadowColor: '#00ff00',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 12,
        },

        bootText: {
            color: '#00aa00',
            fontFamily: 'monospace',
            fontSize: 13,
            marginTop: 8,
            letterSpacing: 1,
        },

        title: {
            color: '#00ff00',
            fontSize: fontSize.xl,
            fontFamily: 'monospace',
            textAlign: 'center',
            paddingHorizontal: spacing.xl,
        },

        subtitle: {
            color: '#00aa00',
            marginHorizontal: 32,
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: fontSize.s,
        },

        errorLog: {
            color: '#00ff00',
            fontSize: fontSize.s,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.l,
            borderRadius: 4,
            margin: spacing.xl2,
            backgroundColor: '#000d00',
            borderWidth: 1,
            borderColor: '#003300',
            fontFamily: 'monospace',
        },

        buttonText: {
            color: '#00ff00',
            fontFamily: 'monospace',
            letterSpacing: 2,
        },

        button: {
            paddingVertical: spacing.l,
            paddingHorizontal: spacing.xl2,
            columnGap: spacing.m,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#00ff00',
            backgroundColor: '#000d00',
        },
    })
}
