/**
 * AI Agents Screen — Matrix AI
 * Quick-setup panel for major AI providers with API key entry.
 * Providers: OpenAI, Grok, Claude, DeepSeek, Gemini (Google AI Studio)
 */
import ThemedTextInput from '@components/input/ThemedTextInput'
import HeaderTitle from '@components/views/HeaderTitle'
import { APIManager } from '@lib/engine/API/APIManagerState'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

interface AgentConfig {
    id: string
    label: string
    description: string
    templateName: string
    models: string[]
    icon: string
    color: string
}

const AGENTS: AgentConfig[] = [
    {
        id: 'openai',
        label: 'OpenAI',
        description: 'GPT-4o, GPT-4 Turbo, GPT-3.5',
        templateName: 'OpenAI',
        models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o-mini'],
        icon: '[GPT]',
        color: '#10a37f',
    },
    {
        id: 'grok',
        label: 'Grok (xAI)',
        description: 'Grok-2, Grok-Vision',
        templateName: 'Grok',
        models: ['grok-2-latest', 'grok-2-vision-1212', 'grok-beta'],
        icon: '[GRK]',
        color: '#1d9bf0',
    },
    {
        id: 'claude',
        label: 'Claude (Anthropic)',
        description: 'Claude 3.5 Sonnet, Opus, Haiku',
        templateName: 'Claude',
        models: ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5-20251001'],
        icon: '[CLO]',
        color: '#cc785c',
    },
    {
        id: 'deepseek',
        label: 'DeepSeek',
        description: 'DeepSeek-V3, DeepSeek-R1',
        templateName: 'DeepSeek',
        models: ['deepseek-chat', 'deepseek-reasoner'],
        icon: '[DSK]',
        color: '#4e6ef2',
    },
    {
        id: 'gemini',
        label: 'Gemini (Google)',
        description: 'Gemini 2.0 Flash, 1.5 Pro, 1.5 Flash',
        templateName: 'Google AI Studio',
        models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
        icon: '[GMN]',
        color: '#4285f4',
    },
]

const AIAgentsScreen = () => {
    const { color, spacing, fontSize, borderRadius } = Theme.useTheme()
    const router = useRouter()

    const { addValue, getTemplates, values } = APIManager.useConnectionsStore(
        useShallow((s) => ({
            addValue: s.addValue,
            getTemplates: s.getTemplates,
            values: s.values,
        }))
    )

    const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
    const [selectedModels, setSelectedModels] = useState<Record<string, string>>({})
    const [connected, setConnected] = useState<Record<string, boolean>>({})

    const handleConnect = (agent: AgentConfig) => {
        const key = apiKeys[agent.id] ?? ''
        if (!key.trim()) {
            Logger.errorToast(`Введите API ключ для ${agent.label}`)
            return
        }
        const templates = getTemplates()
        const template = templates.find((t) => t.name === agent.templateName)
        if (!template) {
            Logger.errorToast(`Шаблон ${agent.templateName} не найден`)
            return
        }
        const modelId = selectedModels[agent.id] ?? agent.models[0]
        const modelObj = modelId ? { id: modelId } : undefined

        addValue({
            ...template.defaultValues,
            configName: template.name,
            friendlyName: agent.label,
            active: values.length === 0,
            key,
            model: modelObj,
        })
        setConnected((prev) => ({ ...prev, [agent.id]: true }))
        Logger.infoToast(`${agent.label} подключён!`)
    }

    const styles = makeStyles(color, spacing, fontSize, borderRadius)

    return (
        <SafeAreaView edges={['bottom']} style={styles.root}>
            <HeaderTitle title="AI Агенты" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: spacing.xl, rowGap: spacing.xl }}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.pageTitle}>// МАТРИЦА АГЕНТОВ</Text>
                <Text style={styles.pageSubtitle}>
                    Выберите агентов, введите API ключ и подключитесь
                </Text>

                {AGENTS.map((agent) => (
                    <AgentCard
                        key={agent.id}
                        agent={agent}
                        apiKey={apiKeys[agent.id] ?? ''}
                        selectedModel={selectedModels[agent.id] ?? agent.models[0]}
                        isConnected={connected[agent.id] ?? false}
                        onKeyChange={(k) => setApiKeys((prev) => ({ ...prev, [agent.id]: k }))}
                        onModelChange={(m) =>
                            setSelectedModels((prev) => ({ ...prev, [agent.id]: m }))
                        }
                        onConnect={() => handleConnect(agent)}
                        styles={styles}
                        color={color}
                        spacing={spacing}
                        fontSize={fontSize}
                        borderRadius={borderRadius}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

interface AgentCardProps {
    agent: AgentConfig
    apiKey: string
    selectedModel: string
    isConnected: boolean
    onKeyChange: (k: string) => void
    onModelChange: (m: string) => void
    onConnect: () => void
    styles: ReturnType<typeof makeStyles>
    color: any
    spacing: any
    fontSize: any
    borderRadius: any
}

const AgentCard: React.FC<AgentCardProps> = ({
    agent,
    apiKey,
    selectedModel,
    isConnected,
    onKeyChange,
    onModelChange,
    onConnect,
    styles,
    color,
    spacing,
    fontSize,
    borderRadius,
}) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <View
            style={[
                styles.card,
                {
                    borderColor: isConnected ? '#00ff00' : agent.color + '66',
                    shadowColor: isConnected ? '#00ff00' : agent.color,
                },
            ]}>
            {/* Header row */}
            <Pressable
                style={styles.cardHeader}
                onPress={() => setExpanded((e) => !e)}>
                <Text style={[styles.agentIcon, { color: agent.color }]}>{agent.icon}</Text>
                <View style={{ flex: 1 }}>
                    <Text style={styles.agentLabel}>{agent.label}</Text>
                    <Text style={styles.agentDesc}>{agent.description}</Text>
                </View>
                <Text style={[styles.statusBadge, { color: isConnected ? '#00ff00' : '#555' }]}>
                    {isConnected ? '[ACTIVE]' : '[OFFLINE]'}
                </Text>
                <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
            </Pressable>

            {/* Expanded config */}
            {expanded && (
                <View style={styles.cardBody}>
                    {/* Model selector */}
                    <Text style={styles.fieldLabel}>// МОДЕЛЬ</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: spacing.m }}>
                        {agent.models.map((m) => (
                            <Pressable
                                key={m}
                                style={[
                                    styles.modelChip,
                                    selectedModel === m && styles.modelChipSelected,
                                ]}
                                onPress={() => onModelChange(m)}>
                                <Text
                                    style={[
                                        styles.modelChipText,
                                        selectedModel === m && { color: '#000000' },
                                    ]}>
                                    {m}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* API key input */}
                    <Text style={styles.fieldLabel}>// API КЛЮЧ</Text>
                    <ThemedTextInput
                        label=""
                        value={apiKey}
                        onChangeText={onKeyChange}
                        secureTextEntry
                        placeholder="sk-..."
                    />

                    {/* Connect button */}
                    <Pressable
                        style={[
                            styles.connectBtn,
                            isConnected && { borderColor: '#00ff00', backgroundColor: '#001a00' },
                        ]}
                        onPress={onConnect}>
                        <Text style={[styles.connectBtnText, isConnected && { color: '#00ff00' }]}>
                            {isConnected ? '>> ПОДКЛЮЧЕНО <<' : '>> ПОДКЛЮЧИТЬ'}
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    )
}

export default AIAgentsScreen

const makeStyles = (color: any, spacing: any, fontSize: any, borderRadius: any) =>
    StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: '#000000',
        },
        pageTitle: {
            color: '#00ff00',
            fontSize: fontSize.xl2,
            fontFamily: 'monospace',
            letterSpacing: 2,
        },
        pageSubtitle: {
            color: '#00aa00',
            fontSize: fontSize.s,
            fontFamily: 'monospace',
            marginTop: spacing.s,
        },
        card: {
            backgroundColor: '#050f05',
            borderWidth: 1,
            borderRadius: borderRadius.m,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 4,
            overflow: 'hidden',
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.l,
            columnGap: spacing.m,
        },
        agentIcon: {
            fontFamily: 'monospace',
            fontSize: fontSize.xl,
            width: 50,
            textAlign: 'center',
        },
        agentLabel: {
            color: '#00ff00',
            fontFamily: 'monospace',
            fontSize: fontSize.l,
        },
        agentDesc: {
            color: '#005500',
            fontFamily: 'monospace',
            fontSize: fontSize.s,
            marginTop: 2,
        },
        statusBadge: {
            fontFamily: 'monospace',
            fontSize: 10,
            letterSpacing: 1,
        },
        chevron: {
            color: '#00aa00',
            fontFamily: 'monospace',
            fontSize: fontSize.m,
            marginLeft: spacing.s,
        },
        cardBody: {
            paddingHorizontal: spacing.l,
            paddingBottom: spacing.l,
            borderTopWidth: 1,
            borderTopColor: '#001a00',
        },
        fieldLabel: {
            color: '#00aa00',
            fontFamily: 'monospace',
            fontSize: fontSize.s,
            letterSpacing: 1,
            marginTop: spacing.m,
            marginBottom: spacing.s,
        },
        modelChip: {
            paddingHorizontal: spacing.m,
            paddingVertical: spacing.s,
            borderWidth: 1,
            borderColor: '#003300',
            borderRadius: borderRadius.s,
            marginRight: spacing.s,
            backgroundColor: '#000d00',
        },
        modelChipSelected: {
            backgroundColor: '#00ff00',
            borderColor: '#00ff00',
        },
        modelChipText: {
            color: '#00aa00',
            fontFamily: 'monospace',
            fontSize: 11,
        },
        connectBtn: {
            marginTop: spacing.l,
            paddingVertical: spacing.m,
            borderWidth: 1,
            borderColor: '#005500',
            borderRadius: borderRadius.s,
            alignItems: 'center',
            backgroundColor: '#000d00',
        },
        connectBtnText: {
            color: '#009900',
            fontFamily: 'monospace',
            fontSize: fontSize.m,
            letterSpacing: 2,
        },
    })
