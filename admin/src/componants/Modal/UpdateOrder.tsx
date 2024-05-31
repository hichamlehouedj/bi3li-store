import { Accordion, ActionIcon, Box, Button, Checkbox, CloseButton, Divider, Grid, Group, Image, MultiSelect, NumberInput, Select, Stack, Switch, Tabs, TagsInput, Text, TextInput, Textarea, rem, useMantineTheme } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import FormData from "form-data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconCheck, IconCloudCheck, IconMinus, IconPhoto, IconPlus, IconShoppingCartFilled, IconTrash, IconUpload, IconX, IconXboxX } from "@tabler/icons-react";
import classes from "../../styles/AddProduct.module.css"

import Wilayas from './../../helper/wilayas.json';
import Communes from './../../helper/communes.json';
import axios from "axios";
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

export const UpdateOrder = (props: Props) => {
    const { t } = useTranslation();
    const schema = z.object({
        name: z.string({message: t('modals.updateOrder.schemaName')}).min(3, { message: t('modals.updateOrder.schemaName2') }),
        phone: z.string({message: t('modals.updateOrder.schemaPhone')}).regex(/^(05|06|07)[0-9]{8}$/, { message: t('modals.updateOrder.schemaPhone2') }),
        
        quantity: z.number({message: t('modals.updateOrder.schemaQuantity')}).gt(0, { message: t('modals.updateOrder.schemaQuantity2') }),
        
        typeFee: z.enum(["desk_fee", "home_fee"], { message: t('modals.updateOrder.schemaTypeFee') }),
        address: z.string({message: t('modals.updateOrder.schemaAddress')}).min(2, { message: t('modals.updateOrder.schemaAddress') }),
        state: z.string({message: t('modals.updateOrder.schemaState')}).min(1, { message: t('modals.updateOrder.schemaState') }),
        city: z.string({message: t('modals.updateOrder.schemaCity')}).min(1, { message: t('modals.updateOrder.schemaCity') })
    });
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values, errors} = useForm({
        initialValues: {
            name: '',
            phone: "",
            state: "",
            city: "",
            quantity: 1,
            typeFee: "desk_fee",
            address: ""
        },
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });
    const [allWilayas, setAllWilayas] = useState<{label: string, value: string}[]>([])
    const [allCommunes, setAllCommunes] = useState<{label: string, value: string}[]>([])
    const [delivery, setDelivery] = useState<any>(null)
    const [hasDeliveryCompany, setHasDeliveryCompany] = useState(false);

    useEffect(() => {
        if (Wilayas.length > 0) {
            let newData: {label: string, value: string}[] = []
            Wilayas.map((item: any) => {
                newData.push({label: item.name, value: item.id.toString()})
            })
            setAllWilayas(newData)
        }

        
        axios.get(`${process.env.REACT_APP_API_URL}/has-delivery-company/`)
        .then(({data}) => {
            setHasDeliveryCompany(data.status)
        })
        .catch((error) => console.log(error));
    }, [])

    useEffect(() => {
        if (props.opened && props.data !== null) {
            const order = props.data

            const stateName = allWilayas.filter(item => item.label === order?.state)
            const cityName = allCommunes.filter(item => item.label === order?.city)

            if (Communes?.length > 0) {
                const filterdCommunes = Communes?.filter((item: any) => item.wilaya === parseInt(stateName[0]?.value))
                
                let newData: {label: string, value: string}[] = []
                filterdCommunes.map((item: any) => {
                    newData.push({label: item?.name, value: item?.pk?.toString()})
                })
                
                setAllCommunes(newData)
            }

            setValues({
                name: order?.fullName,
                phone: order?.phone,
                state: stateName[0]?.value,
                city: cityName[0]?.value,
                quantity: order?.quantity,
                typeFee: "desk_fee",
                address: order?.address,
            })
        }
    }, [props.opened, props?.data])

    useEffect(() => {
        if (values.state && values.state !== "") {
            if (Communes?.length > 0) {
                const filterdCommunes = Communes?.filter((item: any) => item.wilaya === parseInt(values.state))
                let newData: {label: string, value: string}[] = []
                filterdCommunes.map((item: any) => {
                    newData.push({label: item?.name, value: item?.pk?.toString()})
                })
                
                setAllCommunes(newData)
            }

            axios.get(`${process.env.REACT_APP_API_URL}/deliveryfees/${values.state}`)
            .then(({data}) => {
                setDelivery(data)
            })
            .catch((error) => console.log(error));
        }
    }, [values.state])

    useEffect(() => {
        if (allCommunes.length > 0) {
            const cityName = allCommunes.filter(item => item.label === props?.data?.city)

            setValues({
                city: cityName[0]?.value
            })
        }
    }, [allCommunes])

    const onSubmitForm = ({name, price, phone, state, city, quantity, typeFee, address}: any) => {
        setLoading(true)
        const stateName = allWilayas.filter(item => item.value === state)
        const cityName = allCommunes.filter(item => item.value === city)
        
        client.put(`/orders/${props.data._id}`, {
            "fullName": name,
            "phone": phone,
            "state": stateName[0].label,
            "city": cityName[0].label,
            
            "typeFee": typeFee,
            "address": address,
            "deliveryPrice": (values.typeFee === "desk_fee" ? delivery?.desk_fee : delivery?.home_fee) || 0,

            "price": price,
            "quantity": quantity
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.updateOrder.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.updateOrder.alert02'), color: '#fff' });
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
            <Box style={{padding: 20}} >
                <form onSubmit={onSubmit(onSubmitForm)} id="submit_form">
                    <Grid gutter={20} justify="flex-start">
                        <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                            <TextInput
                                label={t('modals.updateOrder.label01')}
                                placeholder={t('modals.updateOrder.placeholder01')}
                                withAsterisk
                                {...getInputProps("name")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                            <TextInput
                                label={t('modals.updateOrder.label02')}
                                placeholder={t('modals.updateOrder.placeholder02')}
                                withAsterisk
                                {...getInputProps('phone')}
                            />
                        </Grid.Col>
                        
                        <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                            <Select
                                label={t('modals.updateOrder.label03')}
                                placeholder={t('modals.updateOrder.placeholder03')}
                                data={allWilayas}
                                {...getInputProps('state')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                            <Select
                                label={t('modals.updateOrder.label04')}
                                placeholder={t('modals.updateOrder.placeholder04')}
                                data={allCommunes}
                                {...getInputProps('city')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                            <TextInput
                                label={t('modals.updateOrder.label05')}
                                placeholder={t('modals.updateOrder.placeholder05')}
                                {...getInputProps('address')}
                            />
                        </Grid.Col>
                        {hasDeliveryCompany
                            ? <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                                <Select
                                label={t('modals.updateOrder.label06')}
                                placeholder={t('modals.updateOrder.placeholder06')}
                                    data={[
                                        {label: t('modals.updateOrder.labelSelect01'), value: "desk_fee"},
                                        {label: t('modals.updateOrder.labelSelect02'), value: "home_fee"}
                                    ]}
                                    {...getInputProps('typeFee')}
                                />
                            </Grid.Col>
                            : null
                        }

                        <Grid.Col span={6} >
                            <NumberInput
                                label={t('modals.updateOrder.label07')}
                                placeholder={t('modals.updateOrder.placeholder07')}
                                withAsterisk
                                min={1}
                                {...getInputProps('quantity')}
                            />
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};