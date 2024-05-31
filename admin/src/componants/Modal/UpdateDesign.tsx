import {Alert, Box, Button, Grid, Group, Image, Indicator, Stack, Text} from "@mantine/core";
import {IconCheck, IconX} from "@tabler/icons-react";
import Modal, { Props as ModalProps } from "./Modal";
import { client } from "../../lib/axiosClient";
import {Notyf} from "notyf";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";

const cookies = new Cookies(null, { path: '/' });
const {Col} = Grid

type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
    openEditTopBarModal: () => void;
    openEditHeadersModal: () => void;
    openEditStoreInfoModal: () => void;
} & ModalProps;

export const UpdateDesign = ({data, openEditTopBarModal, openEditHeadersModal, openEditStoreInfoModal, ...props}: Props) => {
    const { t } = useTranslation();

    
    const closeModal = () => {
        props.onClose();
    };

    return (
        <Modal
            {...props} onClose={closeModal} size="xl"
            footer={<></>}
        >
            <Box style={({ colors }) => ({padding: 20})}>
                <Grid gutter={20}>
                    <Grid.Col span={{base: 12, md: 4}} >
                        <Box miw={"100%"} mih={140} bg={"#fff"} p={20} style={{borderRadius: "2px", cursor: 'pointer', boxShadow: "#eee 0px 0px 15px -5px", border: "1px solid #ced4da"}} onClick={openEditStoreInfoModal} >
                            <Stack justify='center' align='center' gap={5}>
                                <Image src={"/icons8-info-48.png"} h={35} w={35} fit='cover'/>
                                <Text mt={15} size='md' ta={'center'}>{t('modals.updateDesign.card03.title')}</Text>
                                <Text size='xs' c={"gray.6"} ta={'center'}>{t('modals.updateDesign.card03.description')}</Text>
                            </Stack>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 4}} >
                        <Box mih={140} bg={"#fff"} style={{borderRadius: "2px", cursor: 'pointer', boxShadow: "#eee 0px 0px 15px -5px", border: "1px solid #ced4da"}} p={20} onClick={openEditTopBarModal} >
                            <Stack justify='center' align='center' gap={5}>
                                <Image src={"/icons8-paintbrush-48.png"} h={35} w={35} fit='cover'/>
                                <Text mt={15} size='md' ta={'center'}>{t('modals.updateDesign.card01.title')}</Text>
                                <Text size='xs' c={"gray.6"} ta={'center'}>{t('modals.updateDesign.card01.description')}</Text>
                            </Stack>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 4}} >
                        <Box miw={"100%"} mih={140} bg={"#fff"} style={{borderRadius: "2px", cursor: 'pointer', boxShadow: "#eee 0px 0px 15px -5px", border: "1px solid #ced4da"}} p={20} onClick={openEditHeadersModal} >
                            <Stack justify='center' align='center' gap={5}>
                                <Image src={"/icons8-web-design-48.png"} h={35} w={35} fit='cover'/>
                                <Text mt={15} size='md' ta={'center'}>{t('modals.updateDesign.card02.title')}</Text>
                                <Text size='xs' c={"gray.6"} ta={'center'}>{t('modals.updateDesign.card02.description')}</Text>
                            </Stack>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </Modal>
    );
};