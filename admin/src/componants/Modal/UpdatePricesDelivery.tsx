import { Box, Button, Grid, Group, Text, TextInput } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import Cookies from "universal-cookie";

import Wilayas from './../../helper/wilayas.json';
import { useDeliveryPrices } from "../../api";
import { useTranslation } from "react-i18next";
const cookies = new Cookies(null, { path: '/' });

type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

export const UpdatePricesDelivery = (props: Props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values, insertListItem} = useForm({
        initialValues: {wilayas: []}
    });
    const {loading: loadingDeliveryPrices, error, data: dataDeliveryPrices, refetch} = useDeliveryPrices()
    
    useEffect(() => {
        if (props.opened) {
            
            if (dataDeliveryPrices.length > 0) {
                let newData: any = []
                dataDeliveryPrices?.map((item: any) => {
                    newData.push({_id: item._id, name: item.name, code: item.code, desk_fee: item.desk_fee, home_fee: item.home_fee})
                })

                if (dataDeliveryPrices.length < Wilayas.length) {
                    for (let i = 0; i < Wilayas.length; i++) {
                        const wilaya = Wilayas[i];
                        const index = dataDeliveryPrices.findIndex((item: any) => item.code == wilaya.code)
                        if (index < 0) {
                            newData.push({_id: "", name: wilaya.name, code: wilaya.code, desk_fee: 0, home_fee: 0})
                        }
                    }
                }
    
                setValues({
                    wilayas: newData
                })
            } else {
                if (Wilayas.length > 0) {
                    
                    let newData: any = []
                    Wilayas.map((item: any) => {
                        newData.push({_id: "", name: item.name, code: item.code, desk_fee: 0, home_fee: 0})
                    })
        
                    setValues({
                        wilayas: newData
                    })
                }
            }
        }
    }, [props.opened, dataDeliveryPrices])

    const onSubmitForm = ({wilayas}: any) => {
        setLoading(true)

        console.log(wilayas);
        
        
        client.post(`/delivery-price`, wilayas, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.updatePricesDelivery.label01'), color: '#fff' });
            setLoading(false)
            refetch()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.updatePricesDelivery.label02'), color: '#fff' });
            console.log(error)
            setLoading(false)
        });
    }

    const closeModal = () => {
        reset();
        props.onClose();
        setLoading(false)
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
                    {values?.wilayas.map((item: any, index) => (
                        <Grid gutter={20} justify="flex-start">
                            <Grid.Col span={{base: 12, md: 4}} style={{alignSelf: "flex-end"}}>
                                <TextInput
                                    placeholder={t('modals.updatePricesDelivery.label01')}
                                    label={t('modals.updatePricesDelivery.placeholder01')}
                                    readOnly={true}
                                    
                                    {...getInputProps(`wilayas.${index}.name`)}
                                />
                            </Grid.Col>
                            <Grid.Col span={{base: 12, md: 4}} >
                                <TextInput
                                    placeholder={t('modals.updatePricesDelivery.label02')}
                                    label={t('modals.updatePricesDelivery.placeholder02')}
                                    
                                    {...getInputProps(`wilayas.${index}.desk_fee`)}
                                />
                            </Grid.Col>
                            <Grid.Col span={{base: 12, md: 4}} >
                                <TextInput
                                    placeholder={t('modals.updatePricesDelivery.label03')}
                                    label={t('modals.updatePricesDelivery.placeholder03')}
                                    
                                    {...getInputProps(`wilayas.${index}.home_fee`)}
                                />
                            </Grid.Col>
                        </Grid>
                    ))}
                </form>
            </Box>
        </Modal>
    );
};