import { useEffect, useState } from 'react';
import { Container, Group, Burger, Image, ActionIcon, rem, TextInput, CloseButton, Box, Text, Drawer, Transition } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import classes from './../../styles/HeaderSimple.module.css';
import { IconBrandFacebook, IconBrandInstagram, IconBrandTiktok, IconBrandYoutube, IconSearch } from '@tabler/icons-react';
import classesFooter from './../../styles/Footer.module.css';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import useStore from '../../store/useStore';


export function HeaderSimple() {
    let location = useLocation();
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const [opened, { toggle, close }] = useDisclosure();
    const [openedSearch, setOpenedSearch] = useState(false);
    const matches = useMediaQuery('(max-width: 36em)');
    let [topBar, setTopBar] = useState<any>(null);
    let [allCategories, setAllCategories] = useState<any[]>([]);
    const dataStore = useStore((state: any) => state.store);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/category`)
        .then(({data}) => {
            setAllCategories(data)
        })
        .catch((error) => console.log(error));
    }, [])

    return (
        <>
            <header className={classes.header} style={{minHeight: 80, paddingTop: dataStore?.topBar && dataStore?.topBar?.show && dataStore?.topBar?.content ? 0 : 10 }} >
                {dataStore?.topBar && dataStore?.topBar?.show && dataStore?.topBar?.content
                    ? <Box bg={dataStore?.topBar?.background} h={35} mb={10} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Text size='md' ta={'center'} fw={"bold"} c={dataStore?.topBar?.color}>{dataStore?.topBar?.content}</Text>
                    </Box>
                    : null
                }
            
                <Container size="xl" h={60} display={"flex"} style={{justifyContent: "space-between", alignItems: "center", gap: 10}} >
                    <Group w={"100%"} justify='space-between' align='center' gap={0} >
                        <Burger size="md" opened={opened} onClick={toggle} color='dark' aria-label="Toggle navigation" />
                        <Image src={dataStore?.logo && dataStore?.logo !== "" ? `${process.env.REACT_APP_API_URL_IMAGES}/${dataStore?.logo}` : "/Bi3li_logo.png"} h={matches ? 45 : 55} w={"100%"} style={{cursor: "pointer"}} onClick={() => navigate("/")} />
                        <ActionIcon size="md" color="dark" variant="transparent" radius={20} onClick={() => setOpenedSearch(true)} >
                            <IconSearch size={20} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </Container>
            </header>
            <Drawer 
                position='left' offset={0} right={0} size="sm"
                opened={opened} onClose={close}
                title={<Text c={'gray.7'} fw={'bold'}>القائمة الرئيسية</Text>}
                styles={{
                    header: {
                        borderBottom: "1px solid #dedede"
                    }
                }}
                transitionProps={{ transition: 'fade-left', duration: 150, timingFunction: 'linear' }}
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            >
                {/* <Text mt={100} c={'gray.8'} fw={'bold'} mx={15}>عرض الكل</Text> */}
                {allCategories.map((item: any, index) => (
                    <Text 
                        mt={30} c={'gray.8'} fw={'bold'} mx={15} display={'block'}
                        component={Link} to={`/products/${item.name}`} onClick={() => close()}
                    >{item.name}</Text>
                ))}
            </Drawer>
        
            

            <Transition
                mounted={openedSearch}
                transition="fade-down"
                duration={300}
                timingFunction="ease"
            >
                {(styles) => (
                    <Box bg={'#fff'} w={"100%"} pos={'fixed'} top={0} right={0} left={0} h={80} style={{zIndex: 100, ...styles}}>
                        <Container size={'lg'} h={"100%"} display={'flex'} style={{justifyContent: "space-between", alignItems: "center", gap: 20}}>
                            <TextInput
                                variant="filled" radius="xs" placeholder="اسم المنتج"
                                value={searchParams.get("search") || ""} w={"100%"}
                                onChange={(event) => setSearchParams({search: event.currentTarget.value})}
                                leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} />}
                                rightSection={<CloseButton aria-label="Clear input" onClick={() => setSearchParams()} style={{ display: searchParams.get("search") ? undefined : 'none' }} />}
                                className={classes.inputSearch}
                                styles={{
                                    input: {height: 50}
                                }}
                            />
                            <CloseButton onClick={() => setOpenedSearch(false)} />
                        </Container>
                    </Box>
                )}
            </Transition>
        </>
    );
}