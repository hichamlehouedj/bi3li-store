import { Carousel } from '@mantine/carousel';
import { Badge, Box, Drawer, DrawerProps, Grid, Group, Image, Stack, Text } from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    data?: any;
    setSelectedData?: (id: string) => void;
} & DrawerProps;

export function ShowLandingPageDrawer(props: Props) {
    const { t } = useTranslation();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        if ("data" in props && props.data !== null) {
            setProduct(props?.data)
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
                        <Text fw={400} c={"gray.7"}>{t('drawer.landingPage.label01')}</Text>
                        <Text fw={600}>{product?.name}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.landingPage.label02')}</Text>
                        <Text fw={600}>{product?.price} {t("currency")}</Text>
                    </Group>
                </Grid.Col>
                
                <Grid.Col span={12} >
                    <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.landingPage.label03')}</Text>
                        <Text fw={600}>{product?.cost} {t("currency")}</Text>
                    </Group>
                </Grid.Col>
                
                <Grid.Col span={12} >
                    <Group justify='space-between' align='center' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                        <Text fw={400} c={"gray.7"}>{t('drawer.landingPage.label04')}</Text>
                        {product?.freeShipping 
                            ? <IconCircleCheck size={20} color='green' />
                            : <IconCircleX size={20} color='red' />
                        }
                    </Group>
                </Grid.Col>

                {product?.colors && product?.colors?.length > 0
                    ? <Grid.Col span={12} >
                        <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                            <Text fw={400} c={"gray.7"}>{t('drawer.landingPage.label05')}</Text>
                            <Group justify='flex-start' align='center' gap={5}>
                                {product?.colors?.map((item: string, index: number) => (
                                    <Box key={index} w={20} h={20} bg={item} style={{border: "1px solid #ddd", borderRadius: 3}} />
                                ))}
                            </Group>
                        </Group>
                    </Grid.Col>
                    : null
                }
                {product?.sizes && product?.sizes?.length > 0
                    ? <Grid.Col span={12} >
                        <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                            <Text fw={400} c={"gray.7"}>{t('drawer.landingPage.label06')}</Text>
                            <Group justify='flex-start' align='center' gap={5}>
                                {product?.sizes?.map((item: string, index: number) => (
                                    item !== "" && <Badge key={index} variant="outline" color="gray">{item}</Badge>
                                ))}
                            </Group>
                        </Group>
                    </Grid.Col>
                    : null
                }

                {/* {product?.categories && product?.categories?.length > 0
                    ? <Grid.Col span={12} >
                        <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                            <Text fw={400} c={"gray.7"}>الفئات الرئيسية :</Text>
                            <Group justify='flex-start' align='center' gap={5}>
                                {product?.categories?.map((item: string, index: number) => (
                                    item !== "" && <Badge key={index} variant="light" radius={"xs"} color="gray">{item}</Badge>
                                ))}
                            </Group>
                        </Group>
                    </Grid.Col>
                    : null
                }
                {product?.subCategories && product?.subCategories?.length > 0
                    ? <Grid.Col span={12} >
                        <Group justify='space-between' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                            <Text fw={400} c={"gray.7"}>الفئات الفرعية :</Text>
                            <Group justify='flex-start' align='center' gap={5}>
                                {product?.subCategories?.map((item: string, index: number) => (
                                    item !== "" && <Badge key={index} variant="light" radius={"xs"} color="gray">{item}</Badge>
                                ))}
                            </Group>
                        </Group>
                    </Grid.Col>
                    : null
                } */}

                {product?.offers && product?.offers?.length > 0
                    ? <Grid.Col span={12} >
                        <Stack justify='flex-start' bg={"#fff"} p={10} style={{borderRadius: 5}}>
                            <Text fw={400} c={"gray.7"}>{t('drawer.landingPage.label07')}</Text>
                            {product?.offers?.map((item: any, index: number) => (
                                <Stack justify='flex-start' align='flex-start' gap={5} p={5} style={{border: "1px solid #ddd", borderRadius: 5}}>
                                    <Group justify='space-between' align='center' w={"100%"}>
                                        <Text size={'sm'} c={"gray.8"} fw={600}>{item?.name}</Text>
                                        <Text size={'xs'} c={"#323232"} fw={600}>{item?.price} {t("currency")}</Text>
                                    </Group>
                                    <Group justify='flex-start' align='center' gap={3}>
                                        <Text size={'sm'} c={"gray.7"}>{t('drawer.landingPage.label08')}</Text>
                                        <Text size={'sm'} c={"gray.8"} fw={600}>{item?.quantity}</Text>
                                    </Group>
                                    <Group justify='flex-start' align='center' gap={3}>
                                        <Text size={'sm'} c={"gray.7"}>{t('drawer.landingPage.label09')}</Text>
                                        {item?.freeShipping 
                                            ? <IconCircleCheck size={15} color='green' />
                                            : <IconCircleX size={15} color='red' />
                                        }
                                    </Group>
                                </Stack>
                            ))}
                        </Stack>
                    </Grid.Col>
                    : null
                }

                <Grid.Col span={12} >
                    <Image src={`${process.env.REACT_APP_API_URL_IMAGES}/${product?.image}`} alt="" fit="contain" width={"100%"} />
                </Grid.Col>
            </Grid>
        </Drawer>
    );
}