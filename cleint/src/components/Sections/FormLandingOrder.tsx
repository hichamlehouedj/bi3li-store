import { IconBrandWhatsapp, IconCheck, IconInfoCircle, IconMinus, IconPlus, IconShoppingCartFilled, IconX } from '@tabler/icons-react';
import { Card, Text, Group, Button, ActionIcon, useMantineTheme, Grid, TextInput, Select, NumberInput, NumberInputHandlers, Accordion, Stack, Box, Radio, Notification, rem, Alert, Chip, Checkbox, CheckIcon } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import axios from 'axios';
import Wilayas from './../../helper/wilayas.json';
import Communes from './../../helper/communes.json';
import { useNavigate } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';
import Cookies from 'universal-cookie';
import useStore from '../../store/useStore';
const cookies = new Cookies(null, { path: '/' });

interface Props {
    data: any;
    targetRef: any;
}

export function FormLandingOrder({data, targetRef}: Props) {
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const handlersRef = useRef<NumberInputHandlers>(null);
    const {onSubmit, reset, values, getInputProps, errors} = useForm({
        initialValues: {
            name: '', phone: "", state: "", city: "",
            quantity: 1, typeFee: "desk_fee", address: "", sizes: [], colors: []
        },
        validate: {
            name: (value) => (value?.length < 2 ? 'الاسم غير صالح' : null),
            phone: (value: string) => (/^(05|06|07)[0-9]{8}$/.test(value) ? null : 'رقم الهاتف غير صالح'),
            state: (value) => (parseInt(value) <= 0 ? 'لم تختار ولاية بعد' : null),
            city: (value) => (parseInt(value) <= 0 ? 'لم تختار بلدية بعد' : null),
            quantity: (value) => (value < 1 ? 'الكمية يجب ان تكون 1 او اكثر' : null),
            typeFee: (value) => (value?.length < 2 ? 'لم تختار نوع التوصيل بعد' : null),
            address: (value) => (value?.length < 2 ? 'العنوان غير صالح' : null),
        },
        validateInputOnBlur: true,
        validateInputOnChange: true
    });
    const [allWilayas, setAllWilayas] = useState<{label: string, value: string}[]>([])
    const [allCommunes, setAllCommunes] = useState<{label: string, value: string}[]>([])
    const [delivery, setDelivery] = useState<any>(null)
    const [tealAlert, setTealAlert] = useState(false);
    const [redAlert, setRedAlert] = useState(false);
    const [hasDeliveryCompany, setHasDeliveryCompany] = useState(false);
    const [offerSelected, setOfferSelected] = useState("none");
    const [price, setPrice] = useState(0);
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const dataStore = useStore((state: any) => state.store);


    useEffect(() => {
        if (Wilayas?.length > 0) {
            let newData: {label: string, value: string}[] = []
            Wilayas?.map((item: any) => {
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
        if (values.state && values.state !== "") {
            if (Communes?.length > 0) {
                const filterdCommunes = Communes?.filter((item: any) => item?.wilaya == values?.state)
                let newData: {label: string, value: string}[] = []
                filterdCommunes.map((item: any) => {
                    newData.push({label: item.name, value: item.id.toString()})
                })
                setAllCommunes(newData)
            }

            axios.get(`${process.env.REACT_APP_API_URL}/deliveryfees/${values.state}`)
            .then(({data}) => {
                setDelivery(data)
                setDeliveryPrice((values.typeFee === "desk_fee" ? data?.desk_fee : data?.home_fee) || 0)
            })
            .catch((error) => console.log(error));
        }
    }, [values.state])

    useEffect(() => {
        if (data) {
            setPrice(data?.priceAfterDiscount > 0 ? data?.priceAfterDiscount : data?.price)
            setDeliveryPrice(0)
        }
    }, [data])

    useEffect(() => {
        setDeliveryPrice((values.typeFee === "desk_fee" ? delivery?.desk_fee : delivery?.home_fee) || 0)
    }, [values.typeFee])

    useEffect(() => {
        setQuantity(values.quantity)
    }, [values.quantity])

    useEffect(() => {
        if (offerSelected !== "none") {
            const offerFiltered = data?.offers?.filter((item: any) => item?.name === offerSelected)
            if (offerFiltered?.length > 0) {
                const offer = offerFiltered[0]
                setPrice(parseFloat((offer?.price / offer?.quantity)?.toFixed(2)))
                setDeliveryPrice(offer?.freeShipping ? 0 : ((values.typeFee === "desk_fee" ? delivery?.desk_fee : delivery?.home_fee) || 0))
                setQuantity(offer?.quantity)
            }
        } else {
            setPrice(data?.priceAfterDiscount > 0 ? data?.priceAfterDiscount : data?.price)
            setDeliveryPrice((values.typeFee === "desk_fee" ? delivery?.desk_fee : delivery?.home_fee) || 0)
            setQuantity(values.quantity)
        }
    }, [offerSelected])

    const onSubmitForm = ({name, phone, state, city, quantity, typeFee, address, sizes, colors}: any) => {
        const {_id, price, link} = data

        const stateName = allWilayas.filter(item => item.value === state)
        const cityName = allCommunes.filter(item => item.value === city)

        axios.post(`${process.env.REACT_APP_API_URL}/orders`, {
            "fullName": name,
            "phone": phone,
            "state": stateName[0].label,
            "city": cityName[0].label,
            
            "typeFee": typeFee,
            "address": address,
            "deliveryPrice": (values.typeFee === "desk_fee" ? delivery?.desk_fee : delivery?.home_fee) || 0,

            "sizes": sizes,
            "colors": colors,

            "price": price,
            "quantity": quantity,
            "idLandingProduct": _id
        })
        .then(({data}) => {
            console.log(data);
            navigate(`/order/confirmed/landing/${link}`)
            // setTealAlert(true)
            // setRedAlert(false)
            onReset()
        })
        .catch((error) => {
            console.log(error)
            navigate(`/order/failed/landing/${link}`)
            // setTealAlert(false)
            // setRedAlert(true)
        });
    }

    const onSubmitAbandoned = () => {
        const {_id, price, priceAfterDiscount} = data

        if (/^(05|06|07)[0-9]{8}$/.test(values?.phone)) {
            axios.post(`${process.env.REACT_APP_API_URL}/cart-abandoned`, {
                "fullName": values?.name || "",
                "phone": values?.phone,
                "state": "",
                "city": "",
                
                "typeFee": "desk_fee",
                "address": values?.address || "",
                "deliveryPrice": delivery?.desk_fee || 0,
    
                "price": priceAfterDiscount > 0 ? priceAfterDiscount : price,
                "quantity": 1,
                "idLandingProduct": _id
            })
            .then(({data}) => console.log(data))
            .catch((error) => console.log(error));
        }
    }

    const onReset = () => {
        reset()
        setDelivery(null)
        setPrice(data?.priceAfterDiscount > 0 ? data?.priceAfterDiscount : data?.price)
        setDeliveryPrice(0)
        setQuantity(0)
    }
    
    return (
        <Card id='CardForm' ref={targetRef} withBorder radius="md" p={30} style={{border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}`}}>
            <Text ta={'center'} fw={700} >أضف معلوماتك في الأسفل لطلب هذا المنتج</Text>

            <form onSubmit={onSubmit(onSubmitForm)}>
                <Grid mt={30}>
                    <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                        <TextInput
                            placeholder="الاسم الكامل"
                            size='lg'
                            styles={{
                                input: {
                                    border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`
                                },
                            }}
                            {...getInputProps('name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                        <TextInput
                            placeholder="رقم الهاتف"
                            size='lg'
                            styles={{
                                input: {
                                    border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`
                                },
                            }}
                            {...getInputProps('phone')}
                            onBlur={onSubmitAbandoned}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                        <Select
                            placeholder="الولاية"
                            data={allWilayas}
                            size='lg'
                            styles={{
                                input: {
                                    border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`
                                },
                                dropdown: {
                                    boxShadow: "0px 1px 11px 2px rgb(0 0 0/15%)"
                                }
                            }}
                            {...getInputProps('state')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                        <Select
                            placeholder="البلدية"
                            data={allCommunes}
                            size='lg'
                            styles={{
                                input: {
                                    border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`
                                },
                                dropdown: {
                                    boxShadow: "0px 1px 11px 2px rgb(0 0 0/15%)"
                                }
                            }}
                            {...getInputProps('city')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                        <TextInput
                            placeholder="العنوان"
                            size='lg'
                            styles={{
                                input: {
                                    border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`
                                },
                            }}
                            {...getInputProps('address')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                        <Select
                            placeholder="نوع التوصيل"
                            data={[
                                {label: "توصيل للمكتب", value: "desk_fee"},
                                {label: "توصيل للبيت", value: "home_fee"}
                            ]}
                            size='lg'
                            styles={{
                                input: {
                                    border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`
                                },
                                dropdown: {
                                    boxShadow: "0px 1px 11px 2px rgb(0 0 0/15%)"
                                }
                            }}
                            {...getInputProps('typeFee')}
                            allowDeselect={false}
                        />
                    </Grid.Col>
                    {data?.sizes && data?.sizes?.length > 0
                        ? <Grid.Col span={{ base: 12 }}>
                            {/* //"اختر الحجم او الاحجام"  */}
                            <Chip.Group multiple={true} {...getInputProps("sizes")} >
                                <Group mt="xs">
                                    {data?.sizes.map((item: any, index: number) => (
                                        <Chip
                                            key={index} color={dataStore?.information?.backgroundColor || "#645cbb"} value={item} radius="sm"
                                            disabled={values.sizes.length >= quantity && !values.sizes.includes(item as never)}
                                        >{item}</Chip>
                                    ))}
                                </Group>
                            </Chip.Group>
                        </Grid.Col>
                        : null
                    }

                    {data?.colors && data?.colors?.length > 0
                        ? <Grid.Col span={{ base: 12 }}>
                            <Checkbox.Group label="اختر اللون او الالوان" {...getInputProps("colors")}>
                                <Group mt="xs">
                                    {data?.colors.map((item: any, index: number) => (
                                        <Checkbox
                                            key={index} color={item} value={item} label=""
                                            disabled={values.colors.length >= quantity && !values.colors.includes(item as never)}
                                            
                                            styles={{
                                                input: {
                                                    backgroundColor: item
                                                }
                                            }}
                                            icon={({ indeterminate, ...others }) =>
                                                indeterminate ? <IconMinus {...others} /> : <IconCheck stroke={2} color={index === 0 ?  "#000" : "#fff"} {...others} />
                                            }
                                        />
                                    ))}
                                </Group>
                            </Checkbox.Group>
                        </Grid.Col>
                        : null
                    }

                    {data?.offers && data?.offers?.length > 0
                        ? <Grid.Col span={{ base: 12 }}>
                            <Radio.Group name="favoriteFramework" withAsterisk value={offerSelected} onChange={setOfferSelected} >
                                <Stack mt="xs">
                                    <Radio
                                        icon={CheckIcon} value="none" color={dataStore?.information?.backgroundColor || "#645cbb"}
                                        label={
                                            <Group justify='space-between'>
                                                <Text fw={700} c={"gray.7"} >{"بدون عرض"}</Text>
                                                <Text fw={700} c={dataStore?.information?.backgroundColor || "#645cbb"} ></Text>
                                            </Group>
                                        }
                                        styles={()=>({
                                            root: {
                                                background: "#fff",
                                                border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`,
                                                borderRadius: 3,
                                                padding: "12px 10px"
                                            },
                                            body: { justifyContent: "flex-start" },
                                            labelWrapper: { width: "100%" },
                                            label: { width: "100%" }
                                        })}
                                    />
                                    {data?.offers.map((item: any, index: number) => (
                                        <Radio
                                            key={index} icon={CheckIcon}
                                            value={item?.name} color={dataStore?.information?.backgroundColor || "#645cbb"}
                                            label={
                                                <Group justify='space-between'>
                                                    <Text fw={700} c={"gray.7"} >{item?.name}</Text>
                                                    <Text fw={700} c={dataStore?.information?.backgroundColor || "#645cbb"} >
                                                        {item?.price} د.ج
                                                    </Text>
                                                </Group>
                                            }
                                            styles={()=>({
                                                root: {
                                                    background: "#fff",
                                                    border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`,
                                                    borderRadius: 3,
                                                    padding: "12px 10px"
                                                },
                                                body: { justifyContent: "flex-start" },
                                                labelWrapper: { width: "100%" },
                                                label: { width: "100%" }
                                            })}
                                        />
                                    ))}
                                </Stack>
                            </Radio.Group>
                        </Grid.Col>
                        : null
                    }
                    {offerSelected === "none"
                        ? <Grid.Col span={{ base: 12, sm: 12, md: 3 }}>
                            <NumberInput
                                handlersRef={handlersRef}
                                {...getInputProps('quantity')}
                                min={1}
                                size='lg'
                                styles={{
                                    input: {
                                        border: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`,
                                        color: theme.colors.dark[3],
                                        fontWeight: 600,
                                        paddingInlineStart: 40,
                                        paddingInlineEnd: 40,
                                        textAlign: 'center'
                                    }
                                }}
                                rightSection ={
                                    <ActionIcon
                                        variant="transparent" h={"100%"} w={40} radius={0} 
                                        style={{borderRight: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`}}
                                        onClick={() => handlersRef.current?.decrement()}
                                    >
                                        <IconMinus size={18} color={theme.colors.dark[2]} stroke={2} />
                                    </ActionIcon>
                                }
                                rightSectionWidth={40}
                                leftSection={
                                    <ActionIcon 
                                        variant="transparent" h={"100%"} w={40} radius={0} 
                                        style={{borderLeft: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`}}
                                        onClick={() => handlersRef.current?.increment()}
                                    >
                                        <IconPlus size={18} color={theme.colors.dark[2]} stroke={2} />
                                    </ActionIcon>
                                }
                                leftSectionWidth={40}
                            />
                        </Grid.Col>
                        : null
                    }
                    <Grid.Col span={{ base: 12, sm: 12, md: offerSelected === "none" ? 9 : 12 }}>
                        <Button
                            type='submit' fullWidth variant="filled"  c={dataStore?.information?.textColor || "#fff"}
                            size='lg' color={dataStore?.information?.backgroundColor || "#645cbb"} disabled={Object.keys(errors)?.length > 0}
                        >انقر هنا لتأكيد الطلب</Button>
                    </Grid.Col>
                </Grid>
            </form>

            {dataStore?.information?.phone
                ? <Group justify='center' mt={20}>
                    <Button
                        variant="filled" radius={'lg'} color={'green'}
                        leftSection={<IconBrandWhatsapp size={18} />}
                        component='a'
                        href={`https://wa.me/${dataStore?.information?.phone}`}
                    >أنقر هنا للطلب عبر الواتساب</Button>
                </Group>
                : null
            }
            {tealAlert ? <Alert variant="light" my="md" color="teal" title="تم اخذ استلام طلبك سيتم الاتصال بك لتأكيد طلبك" icon={<IconInfoCircle />} /> : null}
            {redAlert ? <Alert variant="light" my="md" color="red" title="فشل الطلب قم بتحديث الموقع واطلب مرة اخرى" icon={<IconInfoCircle />} /> : null}

            <Accordion
                mt={20} variant="filled" defaultValue="1"
                style={{background: theme.colors.gray[0]}}
                styles={{
                    label: {
                        fontWeight: 700,
                        color: theme.colors.gray[7]
                    },
                    icon: {
                        color: theme.colors.gray[5]
                    },
                    content: {
                        padding: 0
                    }
                }}
            >
                <Accordion.Item value="1" style={{background: theme.colors.gray[0]}}>
                    <Accordion.Control style={{borderBottom: `2px solid ${dataStore?.information?.backgroundColor || "#645cbb"}7d`}} icon={<IconShoppingCartFilled size={26} /> } >ملخص الطلب</Accordion.Control>
                    <Accordion.Panel p={10}>
                        <Stack gap={0}>
                            <Group justify='space-between' style={{borderBottom: `2px dotted ${dataStore?.information?.backgroundColor || "#645cbb"}7d`}} py={10}>
                                <Text flex={4} fw={700} c={"gray.7"} >{data?.name}</Text>
                                
                                <Text flex={1} fw={700} c={"gray.7"} >
                                    <Text span={true} size='xs' fw={700} c={theme.white} bg={dataStore?.information?.backgroundColor || "#645cbb"} p={2} >{quantity}×</Text> {" "}
                                    {price?.toFixed(2)} د.ج
                                </Text>
                            </Group>
                            <Group justify='space-between' align='center' style={{borderBottom: `2px dotted ${dataStore?.information?.backgroundColor || "#645cbb"}7d`}} py={10}>
                                <Text flex={4} fw={700} c={"gray.7"} >سعر التوصيل</Text>
                                <Box flex={1}>
                                    {data?.freeShipping
                                        ? <Text fw={700} size='sm' maw={"fit-content"} c={theme.white} bg={dataStore?.information?.backgroundColor || "#645cbb"} p={5} >مجانا</Text>
                                        : <Text fw={700} size='sm' maw={"fit-content"} c={theme.white} bg={dataStore?.information?.backgroundColor || "#645cbb"} p={5} >{deliveryPrice} د.ج</Text>
                                    }
                                </Box>
                            </Group>
                            <Group justify='space-between' py={10}>
                                <Text flex={4} fw={700} c={"gray.7"} >السعر الإجمالي</Text>
                                
                                <Box flex={1}>
                                    <Text fw={700} c={dataStore?.information?.backgroundColor || "#645cbb"} >
                                        {data?.freeShipping 
                                            ? Math.round(quantity * price)
                                            : Math.round((quantity * price) + deliveryPrice)
                                        } د.ج
                                    </Text>
                                </Box>
                            </Group>
                        </Stack>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Card>
    );
}