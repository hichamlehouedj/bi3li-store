import { Box, Button, Checkbox, CloseButton, Divider, Grid, Group, Image, NumberInput, Switch, Tabs, Text, TextInput, Textarea, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import FormData from "form-data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
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

const schema = z.object({
    oldPassword: z.string({required_error: "حقل كلمة المرور القديمة اجباري"}).min(2, { message: ' كلمة المرور القديمة يجب ان لا تقل عن حرفين' }),
    newPassword: z.string({required_error: "حقل كلمة المرور الجديدة اجباري"}).min(2, { message: ' كلمة المرور الجديدة يجب ان لا تقل عن حرفين' }),
    confirmPassword: z.string({required_error: "حقل تاكيد كلمة المرور الجديدة اجباري"}).min(2, { message: ' تاكيد كلمة المرور الجديدة يجب ان لا تقل عن حرفين' }),
});

export const UpdatePasswordUser = (props: Props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, } = useForm({
        initialValues: {oldPassword: "", newPassword: "", confirmPassword: ""},
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });

    const onSubmitForm = ({oldPassword, newPassword, confirmPassword}: any) => {
        setLoading(true)
        
        client.put(`/users/update-password/${props.data._id}`, {
            "oldPassword": oldPassword,
            "password": newPassword,
            "confirmPassword": confirmPassword,
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.updatePasswordUser.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.updatePasswordUser.alert02'), color: '#fff' });
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
                    <Grid gutter={20} justify="flex-start">
                        <Grid.Col span={6} >
                            <TextInput
                                placeholder={t('modals.updatePasswordUser.label01')}
                                label={t('modals.updatePasswordUser.placeholder01')}
                                withAsterisk
                                {...getInputProps("oldPassword")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                placeholder={t('modals.updatePasswordUser.label02')}
                                label={t('modals.updatePasswordUser.placeholder02')}
                                withAsterisk
                                {...getInputProps("newPassword")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                placeholder={t('modals.updatePasswordUser.label03')}
                                label={t('modals.updatePasswordUser.placeholder03')}
                                withAsterisk
                                {...getInputProps("confirmPassword")}
                            />
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};