import { AppShell, Burger } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Sidebar } from '../../componants';
import Cookies from 'universal-cookie';
import SocketClient from '../../lib/socket';

const cookies = new Cookies(null, { path: '/' });

export function Layout () {
    const [opened, { toggle }] = useDisclosure();
    const [sideBarOpened, { toggle: toggleSideBar }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();
    const matches = useMediaQuery('(max-width: 48em)');

    useEffect(() => {
        if (!cookies.get('token') || cookies.get('token') === "") {
            navigate("/");
        }
    }, [cookies.get('token')])

    useEffect(() => {
        let socketIo = new SocketClient({
            idUser: cookies.get('id')
        })
        socketIo.connect();

        return () => {
            if (socketIo != null) {
                socketIo.disconnect();
            }
        };
    }, [])

    
    useEffect(() => {
        if (matches) {
            toggleSideBar()
        }
    }, [location])
    
    return (
        <AppShell
            header={{ height: 60 }}
            padding={{ base: "xs", sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}
            navbar={{ 
                width: {base: "100%", xs: "100%", sm: 220, md: 220, lg: 220, xl: 220},
                breakpoint: 'xs',
                collapsed: { mobile: !sideBarOpened, desktop: sideBarOpened }
            }}
        >
            <AppShell.Header>
                <Navbar toggleSideBar={toggleSideBar} sideBarOpened={sideBarOpened} />
            </AppShell.Header>
    
            <AppShell.Navbar >
                <Sidebar/>
            </AppShell.Navbar>

            <AppShell.Main bg={"gray.1"} pt={90}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}