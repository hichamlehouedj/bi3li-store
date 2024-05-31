import {Group, Box, Burger, Image, ActionIcon, Indicator, useDirection, Menu, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Emitter from '../../lib/Emitter';
import { IconBell, IconLanguage } from '@tabler/icons-react';
import { useAudio } from 'react-use-audio';
//@ts-ignore
import notificationFile from "../../Notification.mp3";
import { useTranslation } from 'react-i18next';
import Cookies from 'universal-cookie';
const cookies = new Cookies(null, { path: '/' });

export function Navbar ({sideBarOpened, toggleSideBar}: {sideBarOpened: boolean; toggleSideBar: () => void}) {
    let location = useLocation();
    let them = useMantineTheme();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(false);
    const { play, stop, data } = useAudio(notificationFile);
    const { t, i18n, ready } = useTranslation();
    const { dir, setDirection } = useDirection();
    
    useEffect(() => {
        Emitter.on("newOrder", (data: any) => {
            play();
            setNotification(true)
        })
    }, [])
    
    const onChangeLang = (lang: string) => {
        setDirection(i18n.dir(lang));
        i18n.changeLanguage(lang);
        cookies.set('lang', lang);
    }

    return (
        <Box p={0} m={0} h={60} display={'flex'}>
            <Group justify="space-between" h="100%" w="100%" wrap='nowrap' gap={0}>
                {!sideBarOpened
                    ? <Group justify='center' align='center' h={60} miw={220} visibleFrom='md' style={{borderLeft: "1px solid #dee2e6", borderBottom: "1px solid #fff"}}>
                        <Image src={"/Bi3li_logo.png"} fit='contain' height={45} width={"auto"} />
                    </Group>
                    : null
                }

                <Group justify="space-between" align='center' h="100%" w="100%" px={{ base: "xs", sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }} >
                    <Burger opened={false} onClick={toggleSideBar} size={'sm'} />

                    <Image src={"/Bi3li_logo.png"} fit='contain' height={45} width={"auto"} hiddenFrom='md' />

                    <Group justify="flex-end" align='center' h="100%">
                        <Menu shadow="md" width={120}>
                            <Menu.Target>
                                <ActionIcon variant="transparent" color={them.colors.gray[7]}>
                                    <IconLanguage size={25} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item onClick={() => onChangeLang("en")}>{t('listLanguages.english')}</Menu.Item>
                                <Menu.Item onClick={() => onChangeLang("ar")}>{t('listLanguages.arabic')}</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                        <Indicator inline processing color="red" size={10} h={28} disabled={!notification}>
                            <ActionIcon
                                variant="transparent" color={them.colors.gray[7]}
                                onClick={() => {
                                    navigate("/dashboard/orders");
                                    setNotification(false)
                                }}
                            >
                                <IconBell size={25} stroke={1.5} />
                            </ActionIcon>
                        </Indicator>
                    </Group>
                </Group>
            </Group>
        </Box>
    );
}