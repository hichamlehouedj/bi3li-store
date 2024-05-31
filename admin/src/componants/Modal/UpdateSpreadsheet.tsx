import { Alert, Box, Button, Checkbox, CloseButton, Divider, Grid, Group, Image, NumberInput, Switch, Tabs, Text, TextInput, Textarea, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import FormData from "form-data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconCheck, IconCircleCheck, IconInfoCircle, IconPhoto, IconUpload, IconX, IconXboxX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
    openAddModal: any
} & ModalProps;

export const UpdateSpreadsheet = (props: Props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values} = useForm({
        initialValues: {spreadsheetId: ""}
    });

    useEffect(() => {
        if (props.opened && props.data) {
            setValues({
                spreadsheetId: props.data?.sheetsCredentials?.spreadsheetId
            })
        }
    }, [props.opened, props.data])

    const onSubmitForm = ({spreadsheetId}: any) => {
        setLoading(true)
        
        client.post(`/add-spreadsheet-id`, {
            "id": props.data._id,
            "spreadsheetId": spreadsheetId
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: 'تم تعديل معرف جدول البيانات', color: '#fff' });
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: 'فشل تعديل معرف جدول البيانات', color: '#fff' });
            console.log(error)
            setLoading(false)
        });
    }

    
    const onClearAuthorizationSheets = () => {
        setLoading(true)
        client.put(`/users/${props.data._id}`, {
            "sheetsCredentials": {
                "spreadsheetId": props.data?.sheetsCredentials?.spreadsheetId,
                "access_token": "",
                "refresh_token": "",
                "expiry_date": 0
            }
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.updateSpreadsheet.alert01'), color: '#fff' });
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.updateSpreadsheet.alert02'), color: '#fff' });
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
            {...props} onClose={closeModal} loading={loading} size="lg"
            footer={
                <Box py={16} px={20} bg="slate.0">
                    <Group justify={"flex-end"} gap={"xs"}>
                        <Button color={'gray'} variant="outline" rightSection={<IconX size={15} />} bg="white" onClick={closeModal}>{t('modals.cancelling')}</Button>
                        <Button color={'#323232'} rightSection={<IconCheck size={15} />} type="submit" form="submit_form">{t('modals.confirmation')}</Button>
                    </Group>
                </Box>
            }
        >
            <Box style={{padding: 20}}>
                <form onSubmit={onSubmit(onSubmitForm)} id="submit_form">
                    <Grid gutter={20} justify="flex-start">
                        <Grid.Col span={12} >
                            {props.data?.sheetsCredentials && props.data?.sheetsCredentials?.refresh_token !== ""
                                ? <>
                                    <Alert color='#323232' icon={<IconCircleCheck color='#323232' size={20} />}>
                                        <Text size='sm' >{t('modals.updateSpreadsheet.text01')}</Text>
                                    </Alert>
                                    <Alert mt={20} color="yellow" icon={<IconInfoCircle size={20} />} styles={{wrapper: {alignItems: "center"}}}>
                                        <Group gap={3}>
                                            <Text size='sm' c='gray.7'>{t('modals.updateSpreadsheet.text02')}</Text>
                                            <Button variant='default' size="sm" onClick={onClearAuthorizationSheets}>{t('modals.updateSpreadsheet.button01')}</Button>
                                            <Text size='sm' c='gray.7'>؟</Text>
                                        </Group>
                                    </Alert>
                                </>
                                : <Alert color="yellow" icon={<IconInfoCircle size={20} />} styles={{wrapper: {alignItems: "center"}}}>
                                    <Group gap={3}>
                                        <Text size='sm' c='gray.7'>{t('modals.updateSpreadsheet.text03')}</Text>
                                        <Button variant='default' size="sm" onClick={props.openAddModal}>{t('modals.updateSpreadsheet.button02')}</Button>
                                    </Group>
                                </Alert>
                            }
                        </Grid.Col>

                        {props.data?.sheetsCredentials && props.data?.sheetsCredentials?.refresh_token !== ""
                            ? <Grid.Col span={12} >
                                <TextInput
                                    label={t('modals.updateSpreadsheet.label01')}
                                    placeholder={t('modals.updateSpreadsheet.placeholder01')}
                                    withAsterisk
                                    {...getInputProps("spreadsheetId")}
                                    readOnly={!(props.data?.sheetsCredentials && props.data?.sheetsCredentials?.refresh_token !== "")}
                                />
                            </Grid.Col>
                            : null
                        }
                        
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};