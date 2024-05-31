import { Box, Button, Checkbox, CloseButton, ColorInput, Divider, Grid, Group, Image, NumberInput, PasswordInput, Select, Switch, Tabs, Text, TextInput, Textarea, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import { IconCheck, IconPhoto, IconUpload, IconX, IconXboxX } from "@tabler/icons-react";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { notifications } from "@mantine/notifications";

import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";
import Wilayas from '../../helper/wilayas.json';
import { useStore } from "../../api";

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

export const AddTopBar = (props: Props) => {
    const { t } = useTranslation();
    
    const schema = z.object({
        content: z.string({message: t('modals.addTopBar.schemaContent')}).min(2, { message: t('modals.addTopBar.schemaContent2') }),
        background: z.string({message: t('modals.addTopBar.schemaBackground')}).min(2, { message: t('modals.addTopBar.schemaBackground2') }),
        color: z.string({message: t('modals.addTopBar.schemaColor')}).min(2, { message: t('modals.addTopBar.schemaColor2') }),
    });
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values} = useForm({
        initialValues: { color: "", background: "", content: "", show: true},
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });
    const {loading: loadingStore, error, data: dataStore, refetch} = useStore()

    useEffect(() => {
        if (dataStore && "topBar" in dataStore && dataStore.topBar !== null) {
            setValues({
                color: dataStore.topBar.color,
                background: dataStore.topBar.background,
                content: dataStore.topBar.content,
                show: dataStore.topBar.show || false
            })
        }
    }, [dataStore])

    const onSubmitForm = ({color, background, content, show}: any) => {
        setLoading(true)
        
        client.post(`/store/topBar`, {color, background, content, show}, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.addTopBar.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            refetch()
            closeModal()
        })
        .catch(({response}) => {
            notifications.show({ message: t('modals.addTopBar.alert02'), color: '#fff' });
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
            {...props} onClose={closeModal} loading={loading}
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
                    <Grid gutter={20} justify="center">
                        <Grid.Col span={12} >
                            <TextInput
                                label={t('modals.addTopBar.label01')}
                                placeholder={t('modals.addTopBar.placeholder01')}
                                withAsterisk
                                {...getInputProps("content")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <ColorInput
                                label={t('modals.addTopBar.label02')}
                                placeholder={t('modals.addTopBar.placeholder02')}
                                withAsterisk
                                {...getInputProps("color")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <ColorInput
                                label={t('modals.addTopBar.label03')}
                                placeholder={t('modals.addTopBar.placeholder03')}
                                withAsterisk
                                {...getInputProps("background")}
                            />
                        </Grid.Col>
                        
                        <Grid.Col span={12} >
                            <Switch
                                labelPosition="left"
                                label={t('modals.addTopBar.label04')}
                                color={'#323232'}
                                styles={()=>({
                                    root: {
                                        background: "#fff",
                                        border: "1px solid #ced4da",
                                        borderRadius: 3,
                                        padding: "7px 10px"
                                    },
                                    body: { justifyContent: "space-between" },
                                    label: { paddingInlineStart: 0 }
                                })}
                                {...getInputProps("show", {type: "checkbox"})}
                            />
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};