import '@mantine/core/styles.css'
import {
    Text,
    Title,
    Button,
    RingProgress,
    useMantineTheme,
} from '@mantine/core'

import { Feature, Icon, SysIcon, ImageFile, SysTray } from '../../__lib'

const Main = () => {
    const state = Feature.Use.State()
    const theme = useMantineTheme()

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                height: '100%',
                overflow: 'scroll',
                padding: '16px',
            }}
        >
            <Title order={2}>Hello !!!</Title>
            <Text size="sm">This is the Main Feature</Text>
            <Button
                variant="light"
                onClick={() => {
                    if (state.getItem('vx_ui_icons') === 'regular') {
                        state.setItem('vx_ui_icons', 'thin')
                    } else {
                        state.setItem('vx_ui_icons', 'regular')
                    }
                }}
            >
                Toggle Ui Icons
            </Button>
            <Button
                variant="light"
                onClick={() => {
                    if (state.getItem('vx_ui_scale') === '1.0') {
                        state.setItem('vx_ui_scale', '0.85')
                    } else {
                        state.setItem('vx_ui_scale', '1.0')
                    }
                }}
            >
                Toggle Ui Scale
            </Button>
            <Button
                variant="light"
                onClick={() => {
                    if (state.getItem('vx_ui_color') === 'teal') {
                        state.setItem('vx_ui_color', 'orange')
                    } else {
                        state.setItem('vx_ui_color', 'teal')
                    }
                }}
            >
                Toggle Ui Color
            </Button>
            <Button
                variant="light"
                onClick={() => {
                    state.save()
                }}
            >
                Save Vixen State
            </Button>
            <div>
                <RingProgress
                    size={32}
                    thickness={3}
                    roundCaps
                    sections={[{ value: 40, color: theme.primaryColor }]}
                />
            </div>
            <Icon iconName="image" color={theme.primaryColor} size={64} />
            <SysIcon iconName="firefox" size={64} />
            <div style={{ display: 'flex', gap: '10px' }}>
                <ImageFile
                    filePath="/home/noha/Images/Wallpapers/cat-background_(1).jpg"
                    radius={16}
                    width={200}
                    height={200}
                    fit="cover"
                />
                <ImageFile
                    filePath="/home/noha/Images/Wallpapers/cat-background_(2).jpg"
                    radius={16}
                    width={200}
                    height={200}
                    fit="cover"
                />
                <ImageFile
                    filePath="/home/noha/Images/Wallpapers/cat-background_(3).jpg"
                    radius={16}
                    width={200}
                    height={200}
                    fit="cover"
                />
            </div>
            <SysTray iconSize={24} />
        </div>
    )
}

export default Main
