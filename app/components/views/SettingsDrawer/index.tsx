import Drawer from '@components/views/Drawer'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Theme } from '@lib/theme/ThemeManager'
import appConfig from 'app.config'
import { Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import AppModeToggle from './AppModeToggle'
import RouteList from './RouteList'
import UserInfo from './UserInfo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SettingsDrawer: React.FC<{ useInset?: boolean }> = ({ useInset = false }) => {
    const { spacing } = Theme.useTheme()
    const insets = useSafeAreaInsets()
    const [devMode, _] = useMMKVBoolean(AppSettings.DevMode)

    return (
        <Drawer.Body
            drawerID={Drawer.ID.SETTINGS}
            drawerStyle={{
                width: '60%',
                backgroundColor: '#000d00',
                borderRightWidth: 1,
                borderRightColor: '#003300',
                paddingBottom: spacing.xl + (useInset ? insets.bottom : 0),
            }}>
            <UserInfo />
            <AppModeToggle />
            <RouteList />
            <Text
                style={{
                    alignSelf: 'center',
                    color: '#006600',
                    fontFamily: 'monospace',
                    fontSize: 11,
                    marginTop: spacing.l,
                    marginBottom: spacing.xl2,
                    letterSpacing: 1,
                }}>
                {__DEV__ && 'DEV BUILD  '}
                {devMode && 'DEV MODE  '}
                {'Matrix AI v' + appConfig.expo.version}
            </Text>
        </Drawer.Body>
    )
}

export default SettingsDrawer
