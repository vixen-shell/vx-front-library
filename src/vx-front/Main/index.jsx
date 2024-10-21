import '@mantine/core/styles.css'
import {
    Text,
    Title,
    Button,
    RingProgress,
    useMantineTheme,
} from '@mantine/core'

import { Feature, Icon, SysIcon, ImageFile, SysTray } from '../../__lib'
import { useEffect } from 'react'

const Main = () => {
    const params = Feature.Use.Params([
        'autostart',
        'frames.main.name',
        'frames.main.route',
    ])
    const task = Feature.Use.Task()
    const frames = Feature.Use.Frames()
    const data = Feature.Use.Data()
    const state = Feature.Use.State()
    const menu = Feature.Use.Menu()
    const theme = useMantineTheme()

    useEffect(() => {
        task.afterRun((data, error) => {
            if (data) console.log(data)
            if (error) console.error(error)
        })
    }, [])

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
            <div>
                <RingProgress
                    size={32}
                    thickness={3}
                    roundCaps
                    sections={[
                        {
                            value: data.stream('cpu_usage'),
                            color:
                                data.stream('cpu_usage') < 50
                                    ? theme.primaryColor
                                    : 'orange',
                        },
                    ]}
                />
                <RingProgress
                    size={32}
                    thickness={3}
                    roundCaps
                    sections={[
                        {
                            value: data.stream('ram_usage'),
                            color:
                                data.stream('ram_usage') < 50
                                    ? theme.primaryColor
                                    : 'orange',
                        },
                    ]}
                />
            </div>
            <p>{data.get('hello', ['Noha'])}</p>
            <p>{data.get('good_bye')}</p>
            <p>autostart: {JSON.stringify(params.get('autostart'))}</p>
            <p>frames.main.name: {params.get('frames.main.name')}</p>
            <p>frames.main.route: {params.get('frames.main.route')}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                    variant="light"
                    onClick={() => {
                        if (params.get('autostart') === true) {
                            params.set('autostart', false)
                        } else {
                            params.set('autostart', true)
                        }
                    }}
                >
                    Set Params
                </Button>
                <Button
                    variant="light"
                    onClick={() => {
                        params.save()
                    }}
                >
                    Save Params
                </Button>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                    variant="light"
                    onClick={() => {
                        frames.toggle('main')
                    }}
                >
                    Toggle Frame
                </Button>
                <Button
                    variant="light"
                    onClick={() => {
                        menu.popup('menu_test')
                    }}
                >
                    Popup menu
                </Button>
                <Button
                    variant="light"
                    onClick={() => {
                        task.run('print_hello', ['Noha'])
                    }}
                >
                    Run Task
                </Button>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
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
            </div>
            <Icon
                iconName="image"
                color={theme.primaryColor}
                size={64}
                title="Phosphore Icon"
            />
            <SysIcon iconName="firefox" size={64} title="System Icon" />
            <div style={{ display: 'flex', gap: '10px' }}>
                <ImageFile
                    title="Image de chat"
                    style={{
                        border: '1px solid red',
                    }}
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
            <SysTray iconSize={20} gap={4} tooltip />
        </div>
    )
}

export default Main
