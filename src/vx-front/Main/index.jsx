import '@mantine/core/styles.css'
import { Text, Button, RingProgress, useMantineTheme } from '@mantine/core'

import { ui } from '../../__lib'

const Content = () => {
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
            <h1>Hello !!!</h1>
            <p>This is the Main Feature.</p>
            <Text size="xs">Text xs</Text>
            <Text size="sm">Text sm</Text>
            <Text size="md">Text md</Text>
            <Text size="lg">Text lg</Text>
            <Text size="xl">Text xl</Text>
            <Button variant="light">OK</Button>
            <div>
                <RingProgress
                    size={32}
                    thickness={3}
                    roundCaps
                    sections={[{ value: 40, color: theme.primaryColor }]}
                />
            </div>
            <ui.Icon iconName="image" color={theme.primaryColor} size={64} />
            <ui.SysIcon iconName="firefox" size={64} />
            <div style={{ display: 'flex', gap: '10px' }}>
                <ui.ImageFile
                    filePath="/home/noha/Images/Wallpapers/cat-background_(1).jpg"
                    radius={16}
                    width={200}
                    height={200}
                    fit="cover"
                />
                <ui.ImageFile
                    filePath="/home/noha/Images/Wallpapers/cat-background_(2).jpg"
                    radius={16}
                    width={200}
                    height={200}
                    fit="cover"
                />
                <ui.ImageFile
                    filePath="/home/noha/Images/Wallpapers/cat-background_(3).jpg"
                    radius={16}
                    width={200}
                    height={200}
                    fit="cover"
                />
            </div>
        </div>
    )
}

const Main = () => {
    return (
        <ui.AppShell>
            <Content />
        </ui.AppShell>
    )
}

export default Main
