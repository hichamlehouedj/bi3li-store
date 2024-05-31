import { Box, Button, Checkbox, CloseButton, Divider, Grid, Group, Image, NumberInput, PasswordInput, Select, Switch, Tabs, Text, TextInput, Textarea, rem } from "@mantine/core";
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

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

export const AddUser = (props: Props) => {
    const { t } = useTranslation();
    
    const schema = z.object({
        fullName: z.string({message: t('modals.addUsers.schemaFullName')}).min(2, { message: t('modals.addUsers.schemaFullName2') }),
        email: z.string({message: t('modals.addUsers.schemaEmail')}).email({message: t('modals.addUsers.schemaEmail2')}).min(2, { message: t('modals.addUsers.schemaEmail3') }),
        phone: z.string({message: t('modals.addUsers.schemaPhone')}).regex(/^(05|06|07)[0-9]{8}$/, { message: t('modals.addUsers.schemaPhone2') }),
        password: z.string({message: t('modals.addUsers.schemaPassword')}).min(2, { message: t('modals.addUsers.schemaPassword2') }),
    });
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values} = useForm({
        initialValues: {fullName: "", email: "", phone: "", wilaya: "", password: "", role: ""},
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });
    const [allWilayas, setAllWilayas] = useState<{label: string, value: string}[]>([])
    const [error, setError] = useState<boolean |string>(false);

    useEffect(() => {
        if (Wilayas.length > 0) {
            let newData: {label: string, value: string}[] = []
            Wilayas.map((item: any) => {
                newData.push({label: item.name, value: item.name})
            })
            setAllWilayas(newData)
        }
    }, [props.opened])

    const onSubmitForm = ({fullName, email, phone, wilaya, password, role}: any) => {
        setLoading(true)
        
        client.post(`/users/sign-up`, {
            "name": fullName,
            "email": email,
            "phone": phone,
            "wilaya": wilaya,
            "password": password,
            "role": role
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            if (data.code === "ACCOUNT_ALREADY_EXIST") {
                notifications.show({ message: t('modals.addUsers.alert03'), color: '#fff' });
            } else if (data.code === "EMAIL_ALREADY_EXIST") {
                notifications.show({ message: t('modals.addUsers.alert04'), color: '#fff' });
            } else if (data.code === "PHONE_ALREADY_EXIST") {
                notifications.show({ message: t('modals.addUsers.alert05'), color: '#fff' });
            } else {
                notifications.show({ message: t('modals.addUsers.alert01'), color: '#fff' });
                console.log(data);
                setLoading(false)
                typeof props?.refetchData == "function" && props?.refetchData()
                closeModal()
            }
        })
        .catch(({response}) => {
            notifications.show({ message: t('modals.addUsers.alert02'), color: '#fff' });
            
            console.log(response)
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
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.addUsers.label01')}
                                placeholder={t('modals.addUsers.placeholder01')}
                                withAsterisk
                                {...getInputProps("fullName")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.addUsers.label02')}
                                placeholder={t('modals.addUsers.placeholder02')}
                                withAsterisk
                                {...getInputProps("phone")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.addUsers.label04')}
                                placeholder={t('modals.addUsers.placeholder04')}
                                withAsterisk
                                {...getInputProps("email")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <Select
                                data={allWilayas}
                                label={t('modals.addUsers.label03')}
                                placeholder={t('modals.addUsers.placeholder03')}
                                withAsterisk
                                {...getInputProps("wilaya")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <Select
                                label={t('modals.addUsers.label05')}
                                placeholder={t('modals.addUsers.placeholder05')}
                                data={[
                                    {label: t('modals.addUsers.labelSelect01'), value: "admin"},
                                    {label: t('modals.addUsers.labelSelect02'), value: "confirmed"}
                                ]}
                                withAsterisk
                                {...getInputProps("role")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <PasswordInput
                                label={t('modals.addUsers.label06')}
                                placeholder={t('********')}
                                {...getInputProps("password")}
                            />
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};