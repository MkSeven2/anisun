import {IconMenu2} from "@tabler/icons-react";
import {ActionIcon, Drawer} from "@mantine/core";
import classes from "@/components/MobileModal/MobileModal.module.css";
import {useDisclosure} from "@mantine/hooks";

export default function MobileModalMenu() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Drawer
                position="bottom"
                size="100%"
                opened={opened}
                onClose={close}
                className={classes.drawer}
            >
                MobileModalMenu
            </Drawer>
            <ActionIcon onClick={open}>
                <IconMenu2/>
            </ActionIcon>
        </>
    )
}