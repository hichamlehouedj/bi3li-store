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

export const UpdateMarketing = (props: Props) => {
    const { t } = useTranslation();
    
    const schema = z.object({
        name: z.enum(["Facebook & Instagram", "Api Conversion"], { message: t('modals.updateMarketing.schemaName') }),
        apiKey: z.string({required_error: t('modals.updateMarketing.schemaApiKey2')}).min(2, { message: t('modals.updateMarketing.schemaApiKey') }),
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

    useEffect(() => {
        if (props.opened && "data" in props && props.data !== null) {
            const delivery = props.data
            setValues({
                name: delivery?.name,
                apiKey: delivery?.apiKey,
                token: delivery?.token || ""
            })
        }
    }, [props.data, props.opened])

    const onSubmitForm = ({name, apiKey, token}: any) => {
        setLoading(true)
        
        client.put(`/pixels/${props.data._id}`, {
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
            notifications.show({ message: t('modals.updateMarketing.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.updateMarketing.alert02'), color: '#fff' });
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
                                label={t('modals.updateMarketing.label01')}
                                placeholder={t('modals.updateMarketing.placeholder01')}
                                withAsterisk
                                data={["Facebook & Instagram", "Api Conversion"]}
                                {...getInputProps("name")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12} >
                            <TextInput
                                label={t('modals.updateMarketing.label02')}
                                placeholder={t('modals.updateMarketing.placeholder02')}
                                withAsterisk
                                {...getInputProps("apiKey")}
                            />
                        </Grid.Col>
                        {values.name === "Api Conversion"
                            ? <Grid.Col span={12} >
                                <Textarea
                                    label={t('modals.updateMarketing.label03')}
                                    placeholder={t('modals.updateMarketing.placeholder03')}
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