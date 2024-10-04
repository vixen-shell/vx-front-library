import { AppShell as MtnAppShell, Burger, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

interface AppShellProps {
    children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

    return (
        <MtnAppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
        >
            <MtnAppShell.Header>
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
            </MtnAppShell.Header>
            <MtnAppShell.Navbar p="md">Navbar</MtnAppShell.Navbar>
            <MtnAppShell.Main h={0}>{children}</MtnAppShell.Main>
        </MtnAppShell>
    )
}
