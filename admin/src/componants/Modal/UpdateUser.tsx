import { Box, Button, Grid, Group, Select, TextInput } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import { IconCheck, IconX } from "@tabler/icons-react";

import Wilayas from './../../helper/wilayas.json';
import Cookies from "universal-cookie";
import { useAccount } from "../../api";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

const cookies = new Cookies(null, { path: '/' });


export const UpdateUser = (props: Props) => {
    const { t } = useTranslation();
    const schema = z.object({
        fullName: z.string({message: t('modals.updateUser.schemaFullName')}).min(2, { message: t('modals.updateUser.schemaFullName2') }),
        email: z.string({message: t('modals.updateUser.schemaEmail')}).email({message: t('modals.updateUser.schemaEmail2')}).min(2, { message: t('modals.updateUser.schemaEmail3') }),
        phone: z.string({message: t('modals.updateUser.schemaPhone')}).regex(/^(05|06|07)[0-9]{8}$/, { message: t('modals.updateUser.schemaPhone2') }),
    });
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, } = useForm({
        initialValues: {fullName: "", email: "", phone: "", wilaya: ""},
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });
    const [allWilayas, setAllWilayas] = useState<{label: string, value: string}[]>([])

    useEffect(() => {
        if (props.opened && props.data) {
            setUserData(props.data)
            setValues({
                fullName: props.data?.name,
                email: props.data?.email,
                phone: props.data?.phone,
                wilaya: props.data?.wilaya
            })
        }

        if (Wilayas.length > 0) {
            let newData: {label: string, value: string}[] = []
            Wilayas.map((item: any) => {
                newData.push({label: item.name, value: item.name})
            })
            setAllWilayas(newData)
        }
    }, [props.opened, props.data])

    const onSubmitForm = ({fullName, email, phone, wilaya}: any) => {
        setLoading(true)
        
        client.put(`/users/${userData._id}`, {
            "name": fullName,
            "email": email,
            "phone": phone,
            "wilaya": wilaya
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.updateUser.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.updateUser.alert02'), color: '#fff' });
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
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.updateUser.label01')}
                                placeholder={t('modals.updateUser.placeholder01')}
                                withAsterisk
                                {...getInputProps("fullName")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.updateUser.label02')}
                                placeholder={t('modals.updateUser.placeholder02')}
                                withAsterisk
                                {...getInputProps("phone")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.updateUser.label04')}
                                placeholder={t('modals.updateUser.placeholder04')}
                                withAsterisk
                                {...getInputProps("email")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <Select
                                data={allWilayas}
                                label={t('modals.updateUser.label03')}
                                placeholder={t('modals.updateUser.placeholder03')}
                                withAsterisk
                                {...getInputProps("wilaya")}
                            />
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};