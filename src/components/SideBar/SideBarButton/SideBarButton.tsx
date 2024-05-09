import {Center, Group, Popover, rem, Stack, Text, Title, Tooltip, Transition, UnstyledButton} from "@mantine/core";
import classes from './SideBarButton.module.css';
import {SideBarLink} from "@/types/SideBarLink";
import {useContext, useState} from "react";
import {SideBarLinkContext} from "@/components/SideBar/SideBar";
import {IconChevronRight, IconCloudLockOpen, IconLogin} from "@tabler/icons-react";
import useRipple from "use-ripple-hook";
import {useUser} from "@clerk/nextjs";
import NProgress from "nprogress";
import {usePathname, useRouter} from "next/navigation";

export default function SideBarButton({ link, order }: { link: SideBarLink, order: number }) {
    const { user } = useUser();
    const [ripple, event] = useRipple();
    const { active, setActive, opened } = useContext(SideBarLinkContext)
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isActive = active === order
    const isPopover = link.content !== undefined
    const envType = process.env.NODE_ENV
    const hostURL =
        envType === 'production'
            ? 'https://animeth.vercel.app'
            : envType === 'development' ? 'http://localhost:3000' : 'https://animeth.vercel.app'

    let content

    switch (link.content) {
        case "account":
            content = (
                <Stack p={rem(8)} gap={0}>
                    <Title c="white" pb={rem(8)} order={2}>Аккаунт</Title>
                    <UnstyledButton
                        onClick={() => {
                            const signInRoute = "/sign-in"
                            const signInURL = `/sign-in?redirect_url=${hostURL}${pathname}`

                            setExpanded(!expanded)
                            NProgress.start()
                            router.push(signInURL)

                            if (signInRoute === pathname) {
                                return NProgress.done()
                            }
                        }}
                        pt={rem(8)}
                        pb={rem(8)}
                    >
                        <Group align="center">
                            <IconLogin color="white" stroke={1.5}/>
                            <Text c="white">Войти</Text>
                        </Group>
                    </UnstyledButton>
                    <UnstyledButton
                        onClick={() => {
                            const signUpRoute = "/sign-up"
                            const signUpURL = `/sign-up?redirect_url=${hostURL}${pathname}`

                            setExpanded(!expanded)
                            NProgress.start()
                            router.push(signUpURL)

                            if (signUpRoute === pathname) {
                                return NProgress.done()
                            }
                        }}
                        pt={rem(8)}
                    >
                        <Group align="center">
                            <IconCloudLockOpen color="white" stroke={1.5} />
                            <Text c="white">Зарегистрироваться</Text>
                        </Group>
                    </UnstyledButton>
                </Stack>
            )
            break;
        default:
            content = null
            break;
    }

    const button = (
        <UnstyledButton
            ref={ripple}
            onPointerDown={event}
            className={
                `
                    ${classes.button} 
                    ${isActive && classes.activeButton}
                    ${opened && classes.expandedButton}
                `
            }
            onClick={() => {
                setExpanded(!expanded)
                setActive(order)
            }}
        >
            <Center className={classes.iconWrapper} w={64} h={64}>
                {
                    isActive
                        ? link.activeIcon
                        : link.icon
                }
            </Center>
            <Transition
                mounted={opened}
                transition="fade-right"
                duration={150}
                timingFunction="ease"
            >
                {
                    (styles) =>
                        <Group pr={rem(16)} wrap="nowrap" w="100%" justify="space-between" align="center">
                            <Text fw={500} size="lg" style={styles}>
                                {link.label}
                            </Text>
                            {
                                isPopover && (
                                    <IconChevronRight
                                        className={
                                            `${classes.chevron} ${expanded && classes.chevronRotated}`
                                        }
                                        size={24}
                                        stroke={1.5}
                                        style={styles}
                                    />
                                )
                            }
                        </Group>
                }
            </Transition>
        </UnstyledButton>
    )

    return isPopover ? (
        <>
            <Popover
                classNames={{
                    dropdown: classes.dropdown,
                }}
                opened={expanded}
                onChange={setExpanded}
                position="right"
                transitionProps={{ transition: 'fade-right', duration: 150 }}
            >
                <Popover.Target>
                    {button}
                </Popover.Target>
                <Popover.Dropdown>
                    {content}
                </Popover.Dropdown>
            </Popover>
        </>
    ) : (
        <>
            <Tooltip
                color="gray"
                position="right"
                label={link.label}
                transitionProps={{ transition: 'fade-right' }}
            >
                {button}
            </Tooltip>
        </>
    )
}