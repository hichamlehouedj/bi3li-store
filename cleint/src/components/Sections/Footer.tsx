import { Text, Container, Group, Image, useMantineTheme, Title, SimpleGrid, Box, ActionIcon, rem } from '@mantine/core';
import { IconMapPinFilled, IconPhoneFilled, IconMailFilled, IconBrandTiktok, IconBrandInstagram, IconBrandFacebook, IconPhone, IconMapPin, IconMail } from '@tabler/icons-react';
import classes from './../../styles/Footer.module.css';
import Cookies from 'universal-cookie';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import useStore from '../../store/useStore';

export function Footer() {
    const theme = useMantineTheme();
    const matches = useMediaQuery('(max-width: 36em)');
    const dataStore = useStore((state: any) => state.store);


    return (
        <footer className={classes.footer}>
            <Container className={classes.inner}>
                <Image src={dataStore?.logo && dataStore?.logo !== "" ? `${process.env.REACT_APP_API_URL_IMAGES}/${dataStore?.logo}` : "/Bi3li_logo.png"} h={60} mah={matches ? 50 : 60} w={"auto"} fit='contain'/>
                <Text size="md" c="gray.8" mt={10} className={classes.description}>
                    {dataStore?.information?.shortDescription}
                </Text>
                <Group my={10} gap={5} className={classes.social} justify="flex-end" wrap="nowrap">
                    {dataStore?.information?.facebook && dataStore?.information?.facebook != ""
                        ? <ActionIcon 
                            size="md" color="gray" variant="transparent" radius={20}
                            component='a' target='_blank' href={dataStore?.information?.facebook}
                        >
                            <IconBrandFacebook size={20} stroke={1.5} />
                        </ActionIcon>
                        : null
                    }
                    {dataStore?.information?.instagram && dataStore?.information?.instagram != ""
                        ? <ActionIcon 
                            size="md" color="gray" variant="transparent" radius={20}
                            component='a' target='_blank' href={dataStore?.information?.instagram}
                        >
                            <IconBrandInstagram size={20} stroke={1.5} />
                        </ActionIcon>
                        : null
                    }
                    {dataStore?.information?.tiktok && dataStore?.information?.tiktok != ""
                        ? <ActionIcon 
                            size="md" color="gray" variant="transparent" radius={20}
                            component='a' target='_blank' href={dataStore?.information?.tiktok}
                        >
                            <IconBrandTiktok size={20} stroke={1.5} />
                        </ActionIcon>
                        : null
                    }
                </Group>
                
                <Text c="dimmed" size="sm" mt={10}>
                    جميع الحقوق محفوظة © 2024
                </Text>

            </Container>
            <Box py={10} bg={"#fff"} mt={30}>
                <Container className={classes.inner}>
                    <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing={0} style={{columnGap: 30, rowGap: 2}}>
                        {dataStore?.information?.phone && dataStore?.information?.phone != ""
                            ? <Group gap={5}>
                                <IconPhone size={20} style={{ color: "#aaa" }} stroke={1.5} />
                                <Text component="a" href={`tel:${dataStore?.information?.phone}`} className={classes.link} c={"#aaa"}>
                                    {dataStore?.information?.phone}
                                </Text>
                            </Group>
                            : null
                        }
                        {dataStore?.information?.address && dataStore?.information?.address != ""
                            ? <Group gap={5}>
                                <IconMapPin size={20} style={{ color: "#aaa" }} stroke={1.5} />
                                <Text size='sm' c={"#aaa"}>{dataStore?.information?.address}</Text>
                            </Group>
                            : null
                        }
                        {dataStore?.information?.email && dataStore?.information?.email != ""
                            ? <Group gap={5} wrap='nowrap'>
                                <IconMail size={20} style={{ color: "#aaa" }} stroke={1.5} />
                                <Text component="a" href={`mail:${dataStore?.information?.email}`} className={classes.link} c={"#aaa"}>
                                    {dataStore?.information?.email}
                                </Text>
                            </Group>
                            : null
                        }
                    </SimpleGrid>
                </Container>
            </Box>
        </footer>
    );
}