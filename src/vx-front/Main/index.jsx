import '@mantine/core/styles.css'
import { Text, Button, RingProgress, useMantineTheme } from '@mantine/core'

import { AppShell, Burger, Group, Skeleton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

const Main = () => {
    const theme = useMantineTheme()
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger
                        opened={mobileOpened}
                        onClick={toggleMobile}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Burger
                        opened={desktopOpened}
                        onClick={toggleDesktop}
                        visibleFrom="sm"
                        size="sm"
                    />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                Navbar
                {Array(15)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} h={28} mt="sm" animate={false} />
                    ))}
            </AppShell.Navbar>
            <AppShell.Main
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
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
            </AppShell.Main>
        </AppShell>
    )
}

export default Main
