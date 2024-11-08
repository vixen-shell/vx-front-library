import '@mantine/core/styles.css'
import {
    Title,
    Text,
    Button,
    RingProgress,
    useMantineTheme,
} from '@mantine/core'

import { Feature, Icon, SysIcon, ImageFile, SysTray } from '../../__lib'
import { useEffect, useRef, useState } from 'react'

const Main = () => {
    const popup = Feature.Use.PopupFrame()
    const params = Feature.Use.Params([
        'autostart',
        'frames.main.name',
        'frames.main.route',
    ])
    const task = Feature.Use.Task()
    const frames = Feature.Use.Frames()
    const data = Feature.Use.Data({ UseStream: true, interval: 2.5 })
    const state = Feature.Use.State()
    const menu = Feature.Use.Menu()
    const theme = useMantineTheme()

    const popupSize = useRef({
        width: 400,
        height: 400,
    })

    useEffect(() => {
        popup.onClosing((lastPosition, lastSize) => {
            popupSize.current = lastSize
        })
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
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '16px',
                height: '100%',
                overflow: 'scroll',
                padding: '16px',
            }}
        >
            <Title order={2}>
                {data.get('title', { name: 'feature_title' })}
            </Title>
            <div style={{ display: 'flex' }}>
                <RingProgress
                    title="CPU Usage"
                    size={32}
                    thickness={3}
                    roundCaps
                    sections={[
                        {
                            value: data.stream('cpu_usage', {
                                name: 'cpu_usage',
                            }),
                            color:
                                data.stream('cpu_usage') > 75
                                    ? 'red'
                                    : data.stream('cpu_usage') > 50
                                    ? 'orange'
                                    : theme.primaryColor,
                        },
                    ]}
                />
                <RingProgress
                    title="RAM Usage"
                    size={32}
                    thickness={3}
                    roundCaps
                    sections={[
                        {
                            value: data.stream('ram_usage', {
                                name: 'ram_usage',
                            }),
                            color:
                                data.stream('ram_usage') > 75
                                    ? 'red'
                                    : data.stream('ram_usage') > 50
                                    ? 'orange'
                                    : theme.primaryColor,
                        },
                    ]}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '32px',
                    padding: '32px',
                    flexWrap: 'wrap',
                }}
            >
                <Text>{data.get('hello_a', { name: 'hello' })}</Text>
                <p>{data.get('hello_b', { name: 'hello', args: ['Noha'] })}</p>
                <p>{data.get('good_bye', { name: 'good_bye' })}</p>
                <p>{data.get('hello_b')}</p>
                <p>
                    <b>autostart</b>: {JSON.stringify(params.get('autostart'))}
                </p>
                <p>
                    <b>frames.main.name</b>: {params.get('frames.main.name')}
                </p>
                <p>
                    <b>frames.main.route</b>: {params.get('frames.main.route')}
                </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                    variant="light"
                    onClick={() =>
                        popup.show({
                            route: 'main',
                            monitorId: 1,
                            position: { x: 450, y: 280 },
                            size: popupSize.current,
                            resizable: true,
                            exitOnMouseLeave: true,
                        })
                    }
                >
                    Show Popup Frame
                </Button>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                    variant="light"
                    onClick={() => {
                        params.set('autostart', (prevValue) => !prevValue)
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
                        state.set('vx_ui_icons', (prevValue) =>
                            prevValue === 'regular' ? 'thin' : 'regular'
                        )
                    }}
                >
                    Toggle Ui Icons
                </Button>
                <Button
                    variant="light"
                    onClick={() => {
                        state.set('vx_ui_scale', (prevValue) =>
                            prevValue === 1.0 ? 0.85 : 1.0
                        )
                    }}
                >
                    Toggle Ui Scale
                </Button>
                <Button
                    variant="light"
                    onClick={() => {
                        state.set('vx_ui_color', (prevValue) =>
                            prevValue === 'teal' ? 'orange' : 'teal'
                        )
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
