import React, { useEffect, useState } from 'react';
import { HeadPage } from '../../componants';
import { useDisclosure } from '@mantine/hooks';
import { AddGoogleSheets, AddHeader, AddTopBar, ShowQRStore, UpdateDesign, UpdatePasswordUser, UpdatePricesDelivery, UpdateSpreadsheet, UpdateStoreInfo, UpdateUser } from '../../componants/Modal';
import Cookies from 'universal-cookie';
import { Box, Button, Container, Grid, Group, Image, Stack, Text, Indicator } from '@mantine/core';
import { useAccount } from '../../api';
import { IconKey, IconLock, IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const cookies = new Cookies(null, { path: '/' });

export function Settings () {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<any>(null);
    const [openedAddModal, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [openedEditUserModal, { open: openEditUserModal, close: closeEditUserModal }] = useDisclosure(false);
    const [openedEditPasswordUserModal, { open: openEditPasswordUserModal, close: closeEditPasswordUserModal }] = useDisclosure(false);
    const [openedEditSpreadsheetModal, { open: openEditSpreadsheetModal, close: closeEditSpreadsheetModal }] = useDisclosure(false);
    const [openedEditPricesModal, { open: openEditPricesModal, close: closeEditPricesModal }] = useDisclosure(false);
    const [openedEditDesignModal, { open: openEditDesignModal, close: closeEditDesignModal }] = useDisclosure(false);
    const [openedEditTopBarModal, { open: openEditTopBarModal, close: closeEditTopBarModal }] = useDisclosure(false);
    const [openedEditHeadersModal, { open: openEditHeadersModal, close: closeEditHeadersModal }] = useDisclosure(false);
    const [openedShowQRModal, { open: openShowQRModal, close: closeShowQRModal }] = useDisclosure(false);
    const [openedEditStoreInfoModal, { open: openEditStoreInfoModal, close: closeEditStoreInfoModal }] = useDisclosure(false);
    const {loading, error, data: dataAccount, refetch} = useAccount({
        id: cookies.get('id')
    })
    const [role, setRole] = useState("");
    // const theme = useMantineTheme();

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])

    useEffect(() => {
        if (dataAccount) {
            setUserData(dataAccount)
        }
    }, [dataAccount])

    if (!["admin"].includes(role)) {
        return (
            <Container>
                <Stack align='center' justify='center' h={"calc(100vh - 130px)"}>
                    <IconLock size={45} strokeWidth={1.5} />
                    <Text>ليس لديك صلحيات للوصول لهذه الصفحة</Text>
                </Stack>
            </Container>
        )
    }
    return (
        <>
            <HeadPage
                page={t('settingsPage.name')}
                links={[
                    { title: t('settingsPage.links.link01'), href: '/dashboard' },
                    { title: t('settingsPage.links.link02'), href: '#' }
                ]}
                labelCreate=''
                labelExport=''
                onCreate={() => console.log()}
                onExport={() => console.log()}
                hiddenExport={true}
            />
            
            <Box bg={"#fff"} mt={20} style={{borderRadius: "5px", border: "1px solid #ced4da"}}>
                <Box p={10} py={15} style={{borderBottom: "1px solid #ced4da"}}>
                    <Text size='md'>{t('settingsPage.title01')}</Text>
                </Box>
                <Grid gutter={20} p={20} justify="flex-start" bg={"#eee"}>
                    <Grid.Col span={{base: 6, sm: 4}} >
                        <Box mih={140} bg={"#fff"} style={{borderRadius: "2px", cursor: 'pointer', boxShadow: "#eee 0px 0px 15px -5px", border: "1px solid #ced4da"}} p={20} onClick={openEditUserModal}>
                            <Stack justify='center' align='center' gap={5}>
                                <Image src={"/icons8-utilisateur-48.png"} h={35} w={35} />
                                <Text mt={15} size='md' ta={'center'}>{t('settingsPage.card01.title')}</Text>
                                <Text size='xs' c={"gray.6"} ta={'center'}>{t('settingsPage.card01.description')}</Text>
                            </Stack>
                        </Box>
                    </Grid.Col>
                    
                    <Grid.Col span={{base: 6, sm: 4}} >
                        <Box mih={140} bg={"#fff"} style={{borderRadius: "2px", cursor: 'pointer', boxShadow: "#eee 0px 0px 15px -5px", border: "1px solid #ced4da"}} p={20} onClick={openEditPasswordUserModal}>
                            <Stack justify='center' align='center' gap={5}>
                                <Image src={"/icons8-privé-2-48.png"} h={35} w={35} />
                                <Text mt={15} size='md' ta={'center'}>{t('settingsPage.card02.title')}</Text>
                                <Text size='xs' c={"gray.6"} ta={'center'}>{t('settingsPage.card02.description')}</Text>
                            </Stack>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>

            <Box bg={"#fff"} mt={20} style={{borderRadius: "5px", border: "1px solid #ced4da"}}>
                <Box p={10} py={15} style={{borderBottom: "1px solid #ced4da"}}>
                    <Text size='md'>{t('settingsPage.title02')}</Text>
                </Box>
                <Grid gutter={20} p={20} justify="flex-start" bg={"#eee"}>
                    <Grid.Col span={{base: 6, sm: 4}} >
                        <Box mih={140} bg={"#fff"} style={{borderRadius: "2px", cursor: 'pointer', boxShadow: "#eee 0px 0px 15px -5px", border: "1px solid #ced4da"}} p={20} onClick={openEditPricesModal}>
                            <Stack justify='center' align='center' gap={5}>
                                <Image src={"/icons8-commande-expédiée-48.png"} h={35} w={35} />
                                <Text mt={15} size='md' ta={'center'}>{t('settingsPage.card03.title')}</Text>
                                <Text size='xs' c={"gray.6"} ta={'center'}>{t('settingsPage.card03.description')}</Text>
                            </Stack>
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={{base: 6, sm: 4}} >
                        <Box mih={140} bg={"#fff"} style={{borderRadius: "2px", cursor: 'pointer', boxShadow: "#eee 0px 0px 15px -5px", border: "1px solid #ced4da"}} p={20} onClick={openEditSpreadsheetModal}>
                            <Stack justify='center' align='center' gap={5}>
                                <Image src={"/icons8-google-sheets-48.png"} h={35} w={35} fit='cover'/>
                                <Text mt={15} size='md' ta={'center'}>{t('settingsPage.card04.title')}</Text>
                                <Text size='xs' c={"gray.6"} ta={'center'}>{t('settingsPage.card04.description')}</Text>
                            </Stack>
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={{base: 6, sm: 4}} >
                        <Box mih={140} bg={"#fff"} style={{borderRadius: "2px", cursor: 'pointer', boxShadow: "#eee 0px 0px 15px -5px", border: "1px solid #ced4da"}} p={20} onClick={openEditDesignModal}>
                            <Stack justify='center' align='center' gap={5}>
                                <Image src={"/icons8-paintbrush-48.png"} h={35} w={35} fit='cover'/>
                                <Text mt={15} size='md' ta={'center'}>{t('settingsPage.card05.title')}</Text>
                                <Text size='xs' c={"gray.6"} ta={'center'}>{t('settingsPage.card05.description')}</Text>
                            </Stack>
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={{base: 6, sm: 4}} >
                        <Indicator miw={"100%"} color="red" inline label="قريبا" size={16}>
                            <Box 
                                mih={140} bg={"#fff"}
                                style={{borderRadius: "2px", cursor: 'pointer', boxShadow: "#eee 0px 0px 15px -5px", border: "1px solid #ced4da"}}
                                p={20} 
                                //onClick={openShowQRModal}
                            >
                                <Stack justify='center' align='center' gap={5}>
                                    <Image src={"/icons8-download-48.png"} h={35} w={35} fit='cover'/>
                                    <Text mt={15} size='md' ta={'center'}>{t('settingsPage.card06.title')}</Text>
                                    <Text size='xs' c={"gray.6"} ta={'center'}>{t('settingsPage.card06.description')}</Text>
                                </Stack>
                            </Box>
                        </Indicator>
                    </Grid.Col>
                </Grid>
            </Box>

            <Box bg={"#fff"} mt={20} style={{borderRadius: "5px", border: "1px solid #ced4da"}}>
                <Box p={10} py={15} style={{borderBottom: "1px solid #ced4da"}}>
                    <Text size='md'>الدعم الفني</Text>
                </Box>
                <Grid gutter={20} p={20} justify="flex-start" bg={"#eee"}>
                    <Grid.Col span={{base: 12, md: 6, lg: 4}} >
                        <Box bg={"#fff"} p={20} style={{borderRadius: "5px", boxShadow: "#eee 0px 0px 15px -5px"}}>
                            <Group justify='space-between' mb={10}>
                                <Image src={"/icons8-télégramme-app-48.png"} h={40} w={40} />
                                <Button variant='default'>إنظمام</Button>
                            </Group>
                            <Text size='sm' fw={700} mb={5}>مجموعة تليجرام</Text>
                            <Text size='xs'>مجموعة تليجرام بها نخبة من الخبراء في مجال التجارة الإلكترونية مستعدين للإجابة على كل تسائلاتكم</Text>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 6, lg: 4}} >
                        <Box bg={"#fff"} p={20} style={{borderRadius: "5px", boxShadow: "#eee 0px 0px 15px -5px"}}>
                            <Group justify='space-between' mb={10}>
                                <Image src={"/icons8-lecture-de-youtube-48.png"} h={40} miw={40} fit='contain'/>
                                <Button variant='default'>مشاهدة</Button>
                            </Group>
                            <Text size='sm' fw={700} mb={5}>قناة اليوتيوب</Text>
                            <Text size='xs'>مجموعة تليجرام بها نخبة من الخبراء في مجال التجارة الإلكترونية مستعدين للإجابة على كل تسائلاتكم</Text>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 6, lg: 4}} >
                        <Box bg={"#fff"} p={20} style={{borderRadius: "5px", boxShadow: "#eee 0px 0px 15px -5px"}}>
                            <Group justify='space-between' mb={10}>
                                <Image src={"/icons8-whatsapp-48.png"} h={40} w={40} />
                                <Button variant='default'>إنظمام</Button>
                            </Group>
                            <Text size='sm' fw={700} mb={5}>مجموعة تليجرام</Text>
                            <Text size='xs'>مجموعة تليجرام بها نخبة من الخبراء في مجال التجارة الإلكترونية مستعدين للإجابة على كل تسائلاتكم</Text>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>

            <UpdateUser title={t('settingsPage.updateUser')} opened={openedEditUserModal} data={userData} refetchData={refetch} onClose={closeEditUserModal} />
            <UpdatePasswordUser title={t('settingsPage.updatePasswordUser')} opened={openedEditPasswordUserModal} data={userData} onClose={closeEditPasswordUserModal} />
            <UpdateSpreadsheet title={t('settingsPage.updatePasswordUser')} opened={openedEditSpreadsheetModal} refetchData={refetch} data={userData} onClose={closeEditSpreadsheetModal} openAddModal={openAddModal} />
            <AddGoogleSheets opened={openedAddModal} refetchData={refetch} onClose={closeAddModal} />
            <UpdatePricesDelivery title={t('settingsPage.updatePricesDelivery')} opened={openedEditPricesModal} onClose={closeEditPricesModal} />
            
            <UpdateDesign
                title={t('settingsPage.updateDesign')}
                opened={openedEditDesignModal}
                onClose={closeEditDesignModal}
                openEditTopBarModal={openEditTopBarModal}
                openEditHeadersModal={openEditHeadersModal}
                openEditStoreInfoModal={openEditStoreInfoModal}
            />
            <AddHeader title={t('settingsPage.addHeader')} opened={openedEditHeadersModal} onClose={closeEditHeadersModal} />
            <AddTopBar title={t('settingsPage.addTopBar')} opened={openedEditTopBarModal} onClose={closeEditTopBarModal} />
            <ShowQRStore title={t('settingsPage.showQRStore')} opened={openedShowQRModal} onClose={closeShowQRModal} />
            <UpdateStoreInfo title={t('settingsPage.updateStoreInfo')} opened={openedEditStoreInfoModal} onClose={closeEditStoreInfoModal} />
        </>
    );
}