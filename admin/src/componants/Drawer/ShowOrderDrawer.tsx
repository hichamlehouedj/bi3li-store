import { Carousel } from '@mantine/carousel';
import { ActionIcon, Badge, Box, Button, CopyButton, Drawer, DrawerProps, Grid, Group, Image, Stack, Text, Tooltip, rem } from '@mantine/core';
import { IconCheck, IconCircleCheck, IconCircleX, IconCopy, IconPrinter } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    data?: any;
    setSelectedData?: (id: string) => void;
} & DrawerProps;

export function ShowOrderDrawer(props: Props) {
    const { t } = useTranslation();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        if ("data" in props && props.data !== null) {
            setOrder(props?.data)
        }
    }, [props.data])

    const closeModal = () => {
        props.onClose();
    };

    return (
        <Drawer {...props} onClose={closeModal} styles={{body: {background: "#eee"}}}>
            <Grid gutter={15} justify="center" h={"100%"}>
                <Grid.Col span={12} mt={20}>
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label01')}</Text>
                        <Text fw={600}>{order?.product?.name}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label02')}</Text>
                        <Text fw={600}>{order?.fullName}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label03')}</Text>
                        <Text fw={600}>{order?.phone}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label04')}</Text>
                        <Text fw={600}>{order?.price * order?.quantity} {t("currency")}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label05')}</Text>
                        <Text fw={600}>{order?.quantity}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label06')}</Text>
                        <Text fw={600}>{
                            order?.status === "pending" ? <Badge radius={'sm'} color='yellow' variant='light'>{t('drawer.order.badge01')}</Badge> 
                            : order?.status === "confirmed" ? <Badge radius={'sm'} color='green' variant='light'>{t('drawer.order.badge02')}</Badge> 
                                : order?.status === "closed" ? <Badge radius={'sm'} color='red' variant='light'>{t('drawer.order.badge03')}</Badge>
                                : order?.status === "abandoned" ? <Badge radius={'sm'} color='orange' variant='light'>{t('drawer.order.badge04')}</Badge> : null
                        }</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label07')}</Text>
                        <Text fw={600}>{order?.deliveryPrice} {t("currency")}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label08')}</Text>
                        <Text size='sm' fw={500} c={"gray.8"}>{dayjs(order?.createdAt).format("HH:mm YYYY-MM-DD")}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} gap={5} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label09')}</Text>
                        <Text size='sm' fw={500} c={"gray.8"}>{
                            order?.typeFee === "home_fee" 
                                ? <Badge radius={'sm'} color='gray' variant='outline'>{t('drawer.order.badge05')}</Badge>
                                : <Badge radius={'sm'} color='gray' variant='outline'>{t('drawer.order.badge06')}</Badge>
                        }</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label10')}</Text>
                        <Text size='sm' fw={500} c={"gray.8"}>{order?.state}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label11')}</Text>
                        <Text size='sm' fw={500} c={"gray.8"}>{order?.city}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.order.label12')}</Text>
                        <Text size='sm' fw={500} c={"gray.8"}>{order?.address}</Text>
                    </Group>
                </Grid.Col>

                <Grid.Col span={12} >
                    <Group justify='flex-start' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Stack gap={10} w={"100%"}>
                            <Group justify='space-between' >
                                <Text fw={400} c={"gray.7"}>{t('drawer.order.label13')}</Text>
                                <Text size='sm' fw={500} c={"gray.8"}>{
                                    order?.deliveryCompany?.name === "Yalidine"
                                        ? <Image src={"/yalidine-logo.png"} width={"auto"} height={26} />
                                        : null
                                }</Text>
                            </Group>

                            <Group justify='space-between' >
                                <Text fw={400} c={"gray.7"}>{t('drawer.order.label14')}</Text>
                                <Text size='sm' fw={500} c={"gray.8"}>{
                                    order?.deliveryCompany?.name === "Yalidine"
                                        ? <CopyButton value={order?.deliveryCompany?.trackingCode} timeout={2000}>
                                            {({ copied, copy }) => (
                                                <Tooltip label={copied ? t('drawer.order.copiedLabel') : t('drawer.order.copyLabel')} withArrow position="top">
                                                    <Button
                                                        color={copied ? 'teal' : '#dc3545'}
                                                        variant="outline" onClick={copy} size='xs'
                                                        leftSection={copied ? (<IconCheck style={{ width: rem(14) }} />) : (<IconCopy style={{ width: rem(14) }} />)}
                                                    >
                                                        {order?.deliveryCompany?.trackingCode}
                                                    </Button>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                        : null
                                }</Text>
                            </Group>
                            {order?.deliveryCompany?.bordereau && order?.deliveryCompany?.bordereau !== ""
                                ? <Group justify='space-between' >
                                    <Text fw={400} c={"gray.7"}>{t('drawer.order.label15')}</Text>
                                    <ActionIcon
                                        color={'teal'} variant="outline"
                                        component='a' target='_blank'
                                        href={order?.deliveryCompany?.bordereau}
                                    >
                                        <IconPrinter style={{ width: rem(14) }} />
                                    </ActionIcon>
                                </Group>
                                : null
                            }
                        </Stack>
                    </Group>
                </Grid.Col>


                {order?.colors && order?.colors?.length > 0
                    ? <Grid.Col span={12} >
                        <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                            <Text fw={400} c={"gray.7"}>{t('drawer.order.label16')}</Text>
                            <Group justify='flex-start' align='center' gap={5}>
                                {order?.colors?.map((item: string, index: number) => (
                                    <Box key={index} w={20} h={20} bg={item} style={{border: "1px solid #ddd", borderRadius: 3}} />
                                ))}
                            </Group>
                        </Group>
                    </Grid.Col>
                    : null
                }
                {order?.sizes && order?.sizes?.length > 0
                    ? <Grid.Col span={12} >
                        <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                            <Text fw={400} c={"gray.7"}>{t('drawer.order.label17')}</Text>
                            <Group justify='flex-start' align='center' gap={5}>
                                {order?.sizes?.map((item: string, index: number) => (
                                    item !== "" && <Badge key={index} variant="outline" color="gray">{item}</Badge>
                                ))}
                            </Group>
                        </Group>
                    </Grid.Col>
                    : null
                }
            </Grid>
        </Drawer>
    );
}