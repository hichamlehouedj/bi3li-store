import {Alert, Autocomplete, Box, Button, CheckIcon, Grid, Group, Image, List, NumberInput, Radio, Select, Stack, Stepper, Switch, Text, TextInput} from "@mantine/core";
import {IconCheck, IconX} from "@tabler/icons-react";
import Modal, { Props as ModalProps } from "./Modal";
import { client } from "../../lib/axiosClient";
import { Notyf } from "notyf";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
// import {Notyf} from "notyf";

import Cookies from "universal-cookie";
import { useShipping } from "../../api";
import { useForm } from "@mantine/form";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import Wilayas from './../../helper/wilayas.json';
import Communes from './../../helper/communes.json';
import axios from "axios";
import { useTranslation } from "react-i18next";

const cookies = new Cookies(null, { path: '/' });
const {Col} = Grid

type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;


export const ChangeStatusOrder = ({data, ...props}: Props) => {
    const { t } = useTranslation();
    const schema = z.object({
        name: z.string({message: t('modals.changeStatusOrder.schemaName')}).min(3, { message: t('modals.changeStatusOrder.schemaName2') }),
        phone: z.string({message: t('modals.changeStatusOrder.schemaPhone')}).regex(/^(05|06|07)[0-9]{8}$/, { message: t('modals.changeStatusOrder.schemaPhone2') }),
        
        quantity: z.number({message: t('modals.changeStatusOrder.schemaQuantity')}).gt(0, { message: t('modals.changeStatusOrder.schemaQuantity2') }),
        
        typeFee: z.enum(["desk_fee", "home_fee"], { message: t('modals.changeStatusOrder.schemaTypeFee') }),
        address: z.string({message: t('modals.changeStatusOrder.schemaAddress')}).min(2, { message: t('modals.changeStatusOrder.schemaAddress') }),
        state: z.string({message: t('modals.changeStatusOrder.schemaState')}).min(1, { message: t('modals.changeStatusOrder.schemaState') }),
        city: z.string({message: t('modals.changeStatusOrder.schemaCity')}).min(1, { message: t('modals.changeStatusOrder.schemaCity') })
    });

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
    const [hasDeliveryCompany, setHasDeliveryCompany] = useState(false);
    const [allDeliveryCompany, setAllDeliveryCompany] = useState<any[]>([]);
    const [deliveryCompany, setDeliveryCompany] = useState<any>("");
    const [loading, setLoading] = useState(false);
    const [stap, setStap] = useState(0);
    const {loading: loadingShipping, error, data: dataShipping, refetch} = useShipping()
    const [addToDeliveryCompany, setAddToDeliveryCompany] = useState(false);
    const [delivery, setDelivery] = useState<any>(null)

    const nextStep = () => setStap((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setStap((current) => (current > 0 ? current - 1 : current));

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
        if (props.opened && data !== null) {
            const order = data

            const stateName = allWilayas.filter(item => item.label === order?.state)
            const cityName = allCommunes.filter(item => item.label === order?.city)

            if (Communes?.length > 0) {
                const filterdCommunes = Communes?.filter((item: any) => item.wilaya === parseInt(stateName[0]?.value))
                
                let newData: {label: string, value: string}[] = []
                filterdCommunes.map((item: any) => {
                    newData.push({label: item?.name, value: item?.id?.toString()})
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
    }, [props.opened, data])

    useEffect(() => {
        if (dataShipping.length >= 0) {
            let newData: {label: string, value: string}[] = []
            dataShipping.map((item: any) => {
                newData.push({label: item.name, value: item._id.toString()})
            })
            setAllDeliveryCompany(newData)
        }
    }, [dataShipping])

    useEffect(() => {
        if (values.state && values.state !== "") {
            if (Communes?.length > 0) {
                const filterdCommunes = Communes?.filter((item: any) => item.wilaya === parseInt(values.state))
                let newData: {label: string, value: string}[] = []
                filterdCommunes.map((item: any) => {
                    newData.push({label: item?.name, value: item?.id?.toString()})
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
            const cityName = allCommunes.filter(item => item.label === data?.city)

            setValues({
                city: cityName[0]?.value
            })
        }
    }, [allCommunes])

    const onFormSubmit = () => {
        setLoading(true)

        client.put(`/orders/${data?.id}`, {
            addToDeliveryCompany: deliveryCompany && deliveryCompany !== "",
            "status": data?.status
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.changeStatusOrder.alert01'), color: '#fff' });
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.changeStatusOrder.alert02'), color: '#fff' });
            setLoading(false)
            closeModal()
        });
    };

    const onSubmitForm2 = ({name, phone, state, city, quantity, typeFee, address}: any) => {
        setLoading(true)
        const stateName = allWilayas.filter(item => item.value === state)
        const cityName = allCommunes.filter(item => item.value === city)
        
        client.put(`/orders/${data?.id}`, {
            addToDeliveryCompany: deliveryCompany && deliveryCompany !== "",
            "fullName": name,
            "phone": phone,
            "state": stateName[0]?.label,
            "city": cityName[0]?.label,
            
            "typeFee": typeFee,
            "address": address,
            "deliveryPrice": (values.typeFee === "desk_fee" ? delivery?.desk_fee : delivery?.home_fee) || 0,

            "quantity": quantity,

            deliveryCompany,
            "status": data?.status,
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.changeStatusOrder.alert01'), color: '#fff' });
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.changeStatusOrder.alert02'), color: '#fff' });
            setLoading(false)
            closeModal()
        });
    };

    const closeModal = () => {
        props.onClose();
        setLoading(false)
        setStap(0)
        setAddToDeliveryCompany(false)
        setDelivery(null)
    };

    return (
        <Modal
            {...props} onClose={closeModal} loading={loading} size="lg"
            footer={
                <Box py={16} px={20} bg="slate.0">
                    {stap === 0 && data?.status === "confirmed" && deliveryCompany && deliveryCompany !== ""
                        ? <Group justify={"flex-end"} gap={"xs"}>
                            <Button color={'gray'} variant="outline" rightSection={<IconX size={15} />} bg="white" onClick={closeModal}>{t('modals.cancelling')}</Button>
                            <Button disabled={!(deliveryCompany && deliveryCompany !== "")} onClick={nextStep}>{t('modals.changeStatusOrder.nextButton')}</Button>
                        </Group>
                        : <Group justify={"flex-end"} gap={"xs"}>
                            <Button color={'gray'} variant="outline" rightSection={<IconX size={15} />} bg="white" onClick={closeModal}>{t('modals.cancelling')}</Button>
                            {stap === 1 && data?.status === "confirmed" && addToDeliveryCompany ? <Button variant="default" onClick={prevStep}>{t('modals.changeStatusOrder.prevButton')}</Button> : null }
                            <Button 
                                rightSection={<IconCheck size={15} />}
                                onClick={!addToDeliveryCompany ? onFormSubmit : () => {}}
                                type={addToDeliveryCompany ? "submit" : "button"}
                                form={addToDeliveryCompany ? "submit_form" : ""}
                            >{data?.status === "confirmed" ? t('modals.changeStatusOrder.labelButton01') : t('modals.changeStatusOrder.labelButton02')}</Button>
                        </Group>
                    }
                </Box>
            }
            title={data?.status === "confirmed" ? t('modals.changeStatusOrder.title01') : t('modals.changeStatusOrder.title02')}
        >
            <Box style={({ colors }) => ({padding: 20})}>
                {stap === 0
                    ? <Grid gutter={20}>
                        <Col span={12} >
                            <Alert color={data?.status === "confirmed" ? "blue" : "red"}>
                                {t('modals.changeStatusOrder.text01')} {data?.status === "confirmed" ? t('modals.changeStatusOrder.labelButton01') : t('modals.changeStatusOrder.labelButton02')} {t('modals.changeStatusOrder.text02')}
                            </Alert>
                        </Col>
                        {data?.status === "confirmed"
                            ? <Grid.Col span={{ base: 12 }}>
                                {allDeliveryCompany.length > 0
                                    ? <Autocomplete
                                        label={t('modals.changeStatusOrder.label00')}
                                        placeholder={t('modals.changeStatusOrder.placeholder00')}
                                        data={allDeliveryCompany}
                                        renderOption={({ option }) => (
                                            <Group gap="sm">
                                                <Image src={`${process.env.REACT_APP_API_URL_IMAGES}/${dataShipping.filter(((item: any) => item?._id === option.value))?.[0]?.logo}`} h={30} />
                                                <Text size="sm">{
                                                    //@ts-ignore
                                                    option?.label
                                                }</Text>
                                            </Group>
                                        )}
                                        value={deliveryCompany}
                                        onChange={setDeliveryCompany}
                                    />
                                    : <Select
                                        label={t('modals.changeStatusOrder.label00')}
                                        placeholder={t('modals.changeStatusOrder.placeholder00')}
                                        data={[]}
                                        value={deliveryCompany}
                                        onChange={setDeliveryCompany}
                                    />
                                }
                            </Grid.Col>
                            : null
                        }
                    </Grid>
                    : null
                }

                {stap === 1
                    ? <form onSubmit={onSubmit(onSubmitForm2)} id="submit_form">
                        <Grid gutter={20} justify="flex-start">
                            {!schema.safeParse(values).success
                                ? <Grid.Col span={{ base: 12 }}>
                                    <Alert color={"red"} title={t('modals.changeStatusOrder.text03')}>
                                        <List size='xs'>
                                            {schema.safeParse(values)?.error?.errors?.map((item: any, index) => (
                                                <List.Item key={index} c='red'>{item?.message}</List.Item>
                                            ))}
                                        </List>
                                    </Alert>
                                </Grid.Col>
                                : null
                            }
                            
                            <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                                <TextInput
                                    label={t('modals.changeStatusOrder.label01')}
                                    placeholder={t('modals.changeStatusOrder.placeholder01')}
                                    withAsterisk
                                    {...getInputProps("name")}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                                <TextInput
                                    label={t('modals.changeStatusOrder.label02')}
                                    placeholder={t('modals.changeStatusOrder.placeholder02')}
                                    withAsterisk
                                    {...getInputProps('phone')}
                                />
                            </Grid.Col>
                            
                            <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                                <Select
                                    label={t('modals.changeStatusOrder.label03')}
                                    placeholder={t('modals.changeStatusOrder.placeholder03')}
                                    data={allWilayas}
                                    {...getInputProps('state')}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                                <Select
                                    label={t('modals.changeStatusOrder.label04')}
                                    placeholder={t('modals.changeStatusOrder.placeholder04')}
                                    data={allCommunes}
                                    {...getInputProps('city')}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                                <TextInput
                                    label={t('modals.changeStatusOrder.label05')}
                                    placeholder={t('modals.changeStatusOrder.placeholder05')}
                                    {...getInputProps('address')}
                                />
                            </Grid.Col>
                            {hasDeliveryCompany
                                ? <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                                    <Select
                                    label={t('modals.changeStatusOrder.label06')}
                                    placeholder={t('modals.changeStatusOrder.placeholder06')}
                                        data={[
                                            {label: t('modals.changeStatusOrder.labelSelect01'), value: "desk_fee"},
                                            {label: t('modals.changeStatusOrder.labelSelect02'), value: "home_fee"}
                                        ]}
                                        {...getInputProps('typeFee')}
                                    />
                                </Grid.Col>
                                : null
                            }

                            <Grid.Col span={{ base: 12, sm: 12, md: 6  }} >
                                <NumberInput
                                    label={t('modals.changeStatusOrder.label07')}
                                    placeholder={t('modals.changeStatusOrder.placeholder07')}
                                    withAsterisk
                                    min={1}
                                    {...getInputProps('quantity')}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 12, md: 6  }}>
                                {allDeliveryCompany.length > 0
                                    ? <Autocomplete
                                        label={t('modals.changeStatusOrder.label00')}
                                        placeholder={t('modals.changeStatusOrder.placeholder00')}
                                        data={allDeliveryCompany}
                                        renderOption={({ option }) => (
                                            <Group gap="sm">
                                                <Image src={`${process.env.REACT_APP_API_URL_IMAGES}/${dataShipping.filter(((item: any) => item?._id === option.value))?.[0]?.logo}`} h={30} />
                                                <Text size="sm">{
                                                    //@ts-ignore
                                                    option?.label
                                                }</Text>
                                            </Group>
                                        )}
                                        value={deliveryCompany}
                                        onChange={setDeliveryCompany}
                                    />
                                    : <Select
                                        label={t('modals.changeStatusOrder.label00')}
                                        placeholder={t('modals.changeStatusOrder.placeholder00')}
                                        data={[]}
                                        value={deliveryCompany}
                                        onChange={setDeliveryCompany}
                                    />
                                }
                            </Grid.Col>
                        </Grid>
                    </form>
                    : null
                }
            </Box>
        </Modal>
    );
};