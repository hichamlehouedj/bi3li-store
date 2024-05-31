import { Box, Button, Checkbox, CloseButton, Divider, Grid, Group, Image, NumberInput, Select, Switch, Tabs, Text, TextInput, Textarea, rem } from "@mantine/core";
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

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

export const AddMarketing = (props: Props) => {
    const { t } = useTranslation();
    
    const schema = z.object({
        name: z.enum(["Facebook & Instagram", "Api Conversion"], { message: t('modals.addMarketing.schemaName') }),
        apiKey: z.string({required_error: t('modals.addMarketing.schemaApiKey2')}).min(2, { message: t('modals.addMarketing.schemaApiKey') }),
    });
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values} = useForm({
        initialValues: {
            name: "", apiKey: "", token: ""
        },
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });

    const onSubmitForm = ({name, apiKey, token}: any) => {
        setLoading(true)
        
        client.post(`/pixels`, {
            "name": name,
            "apiKey": apiKey,
            "token": token
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.addMarketing.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.addMarketing.alert02'), color: '#fff' });
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
                            <Select
                                label={t('modals.addMarketing.label01')}
                                placeholder={t('modals.addMarketing.placeholder01')}
                                withAsterisk
                                data={["Facebook & Instagram", "Api Conversion"]}
                                {...getInputProps("name")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12} >
                            <TextInput
                                label={t('modals.addMarketing.label02')}
                                placeholder={t('modals.addMarketing.placeholder02')}
                                withAsterisk
                                {...getInputProps("apiKey")}
                            />
                        </Grid.Col>
                        {values.name === "Api Conversion"
                            ? <Grid.Col span={12} >
                                <Textarea
                                    label={t('modals.addMarketing.label03')}
                                    placeholder={t('modals.addMarketing.placeholder03')}
                                    withAsterisk
                                    {...getInputProps("token")}
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