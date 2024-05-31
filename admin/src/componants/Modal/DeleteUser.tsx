import {Alert, Box, Button, Grid, Group, Text} from "@mantine/core";
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
} & ModalProps;

export const DeleteUser = ({data, ...props}: Props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const onFormSubmit = () => {
        setLoading(true)

        client.delete(`/users/${data?._id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.deleteUser.alert01'), color: '#fff' });
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.deleteUser.alert02'), color: '#fff' });
            setLoading(false)
            closeModal()
        });
    };
    
    const closeModal = () => {
        props.onClose();
        setLoading(false)
    };

    return (
        <Modal
            {...props} onClose={closeModal} loading={loading} size="lg"
            footer={
                <Box py={16} px={20} bg="slate.0">
                    <Group justify={"flex-end"} gap={"xs"}>
                        <Button variant="outline" color="gray" rightSection={<IconX size={15} />} bg="white" onClick={closeModal}>{t('modals.cancelling')}</Button>
                        <Button color={'red'} rightSection={<IconCheck size={15} />} onClick={onFormSubmit}>حذف</Button>
                    </Group>
                </Box>
            }
        >
            <Box style={({ colors }) => ({padding: 20})}>
                <Grid gutter={20}>
                    <Col span={12} >
                        <Alert variant="" color="red">
                            {t('modals.deleteUser.message')}
                        </Alert>
                    </Col>
                </Grid>
            </Box>
        </Modal>
    );
};