import {Group, rem, Stack, Menu, UnstyledButton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
//@ts-ignore
import { IconBox, IconConfetti, IconHome, IconLogout, IconSettings, IconShoppingBag, IconTags, IconTruckDelivery, IconUser, IconUsers, } from '@tabler/icons-react';
import Avatar from 'react-avatar';
import classes from './../../styles/NavbarSimple.module.css';
import Cookies from 'universal-cookie';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const cookies = new Cookies(null, { path: '/' });

export function Sidebar ({opened}: any) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    let location = useLocation();
    const [role, setRole] = useState("");
    // const theme = useMantineTheme();

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])

    const onLogOut = () => {
        cookies.remove('token');
        cookies.remove('id');
        cookies.remove('name');
        cookies.remove('email');
        navigate("/");
    }
    
    return (
        <nav className={classes.navbar} hidden={opened}>
            {cookies.get('role') && cookies.get('role') !== ""
                ? <Stack gap={5}>
                    {["admin", "confirmed"].includes(role)
                        ? <Link to="/dashboard/" className={classes.link} data-active={location.pathname.split("/")[2] === "" ? true : undefined} >
                            <IconHome size={22} /> {t('sidebar.link01')}
                        </Link>
                        : null
                    }
                    
                    {["admin"].includes(role)
                        ? <Link to="/dashboard/products" className={classes.link} data-active={location.pathname.includes("/dashboard/products") || undefined}>
                            <IconBox size={22} /> {t('sidebar.link02')}
                        </Link>
                        : null
                    }
                    {["admin", "confirmed"].includes(role)
                        ? <Link to="/dashboard/orders" className={classes.link} data-active={location.pathname.includes("/dashboard/orders") || undefined}>
                            <IconShoppingBag size={22} /> {t('sidebar.link03')}
                        </Link>
                        : null
                    }
                    
                    {["admin"].includes(role)
                        ? <>
                            <Link to="/dashboard/categories" className={classes.link} data-active={location.pathname.includes("/dashboard/categories") || undefined}>
                                <IconTags size={22} /> {t('sidebar.link04')}
                            </Link>
                            <Link to="/dashboard/shipping" className={classes.link} data-active={location.pathname.includes("/dashboard/shipping") || undefined}>
                                <IconTruckDelivery size={22} /> {t('sidebar.link05')}
                            </Link>
                            <Link to="/dashboard/marketing" className={classes.link} data-active={location.pathname.includes("/dashboard/marketing") || undefined}>
                                <IconConfetti size={22} /> {t('sidebar.link06')}
                            </Link>
                            <Link to="/dashboard/landingPage" className={classes.link} data-active={location.pathname.includes("/dashboard/landingPage") || undefined}>
                                <IconBox size={22} /> {t('sidebar.link07')}
                            </Link>
                            <Link to="/dashboard/settings" className={classes.link} data-active={location.pathname.includes("/dashboard/settings") || undefined}>
                                <IconSettings size={22} /> {t('sidebar.link08')}
                            </Link>
                            <Link to="/dashboard/users" className={classes.link} data-active={location.pathname.includes("/dashboard/users") || undefined}>
                                <IconUsers size={22} /> {t('sidebar.link09')}
                            </Link>
                        </>
                        : null
                    }
                </Stack>
                : <Stack gap={5}></Stack>
            }
            

            <div className={classes.footer}>
                <Group>
                    <Menu shadow="md" width={150} position="left-end" offset={20} withArrow>
                        <Menu.Target>
                            <UnstyledButton className={classes.user}>
                                <Group gap={5}>
                                    <Avatar name={cookies.getAll()?.name} size="30" round={true} />
                                    <div style={{ flex: 1, gap: 5 }}>
                                        <Text size="13px" fw={500}>{cookies.getAll()?.name}</Text>
                                        <Text c="dimmed" size="11px">{cookies.getAll()?.email}</Text>
                                    </div>
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            {/* <Menu.Divider /> */}
                            <Menu.Item
                                color="red"
                                leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                                onClick={onLogOut}
                            >
                                {t('sidebar.logOut')}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </div>
        </nav>
    );
}