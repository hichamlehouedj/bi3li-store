import { ActionIcon, Box, Button, Divider, Grid, Group, Image, List, Overlay, Text, TextInput, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { client } from "../../lib/axiosClient";
import FormData from "form-data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconCheck, IconExternalLink, IconPhoto, IconPlus, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import axios from "axios";
import Cookies from "universal-cookie";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

const cookies = new Cookies(null, { path: '/' });

export const AddGoogleSheets = (props: Props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values} = useForm({
        initialValues: { authorizationCode: "" }
    });


    const onSubmitForm = ({authorizationCode}: any) => {
        setLoading(true)
        
        client.post(`/authorization-sheets`, {
            id: cookies.get('id'),
            authorizationCode
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.addGoogleSheets.alert02'), color: '#fff' });
            console.log(data);
            closeModal()
            typeof props?.refetchData == "function" && props?.refetchData()
            setLoading(false)
        })
        .catch((error) => {
            notifications.show({ message: t('modals.addGoogleSheets.alert02'), color: '#fff' });
            console.log(error)
            setLoading(false)
        });
    }


    const closeModal = () => {
        reset();
        props.onClose();
        setLoading(false)
    };
    
    return (
        <Modal
            {...props} size="lg" onClose={closeModal} loading={loading}
            footer={
                <Box py={16} px={20} bg="slate.0">
                    <Group justify={"flex-end"} gap={"xs"}>
                        <Button color={'gray'} variant="outline" rightSection={<IconX size={15} />} bg="white" onClick={closeModal}>{t('modals.cancelling')}</Button>
                        <Button color={'#323232'} rightSection={<IconCheck size={15} />} type="submit" form="AddGoogleSheets_form">ربط</Button>
                    </Group>
                </Box>
            }
        >
            <Box p={20} pt={10}>
                <form onSubmit={onSubmit(onSubmitForm)} id="AddGoogleSheets_form">
                    <Grid gutter={20} justify="center">
                        <Grid.Col span={12} >
                            <List type="ordered">
                                <List.Item>
                                    <Text size="sm" >
                                        {t('modals.addGoogleSheets.list.item01')}
                                        <Text c={'#323232'} mx={5} span component='a' target="_blank" href={`${process.env.REACT_APP_API_URL}/authorization-sheets`} ><IconExternalLink size={14} style={{marginLeft: 2}} /> {t('modals.addGoogleSheets.list.item01_1')} </Text>
                                        {t('modals.addGoogleSheets.list.item01_2')}
                                    </Text>
                                </List.Item>
                                <List.Item>
                                    <Text size="sm" >{t('modals.addGoogleSheets.list.item02')}</Text>
                                </List.Item>
                                <List.Item>
                                    <Text size="sm" >{t('modals.addGoogleSheets.list.item03')}</Text>
                                </List.Item>
                                <List.Item>
                                    <Text size="sm" >{t('modals.addGoogleSheets.list.item04')}</Text>
                                </List.Item>
                                <List.Item>
                                    <Text size="sm" >{t('modals.addGoogleSheets.list.item05')}</Text>
                                </List.Item>
                            </List>
                        </Grid.Col>

                        <Grid.Col span={12} >
                            <TextInput
                                label={t('modals.addGoogleSheets.label01')}
                                placeholder={t('modals.addGoogleSheets.placeholder01')}
                                withAsterisk
                                {...getInputProps("authorizationCode")}
                            />
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};