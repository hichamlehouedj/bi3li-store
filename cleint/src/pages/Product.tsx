import React, { useEffect, useRef, useState } from 'react';
import { Badge, Box, Container, Grid, Group, Image, Stack, Text, Title } from '@mantine/core';
import { FormOrder } from '../components/Sections';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { HeaderSimple } from '../components/Navbar';
import { Footer } from '../components/Sections/Footer';
import { ProductCard } from '../components/Cards';
import { useWindowScroll } from '@mantine/hooks';
import useStore from '../store/useStore';


export function Product () {
    const autoplay = useRef(Autoplay({ delay: 5000 }));
    let { id } = useParams();
    const [product, setProduct] = useState<any>(null)
    const [similarProducts, setSimilarProducts] = useState<any>([])
    const [scroll, scrollTo] = useWindowScroll();
    const dataStore = useStore((state: any) => state.store);

    useEffect(() => {
        scrollTo({y: 0})
        axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`)
        .then(({data}) => {
            setProduct(data)
        })
        .catch((error) => console.log(error));
    }, [id])

    useEffect(() => {
        if (product && "upsell" in product && product.upsell) {
            axios.get(`${process.env.REACT_APP_API_URL}/upsell-products`, {
                params: {
                    categories: product.categories || [],
                    subCategories: product.subCategories || []
                }
            })
            .then(({data}) => {
                setSimilarProducts(data)
            })
            .catch((error) => console.log(error));
        }
    }, [product])

    return (
        <>
            <HeaderSimple />
            <Container size={'lg'} mt={130}>
                <Grid gutter="xl" mt={50}>
                    <Grid.Col span={{ base: 12, sm: 12, md: 5, lg: 5, xl: 5 }}>
                        <Carousel dir='ltr' loop dragFree align="start" plugins={[autoplay.current]} onMouseEnter={autoplay.current.stop} onMouseLeave={autoplay.current.reset}>
                            <Carousel.Slide>
                                <Box pos={'relative'}>
                                    <Image src={`${process.env.REACT_APP_API_URL_IMAGES}/${product?.thumbnail}`} alt={""} width={"100%"} fit={'cover'}  />
                                    {product?.priceAfterDiscount > 0
                                        ? <Badge variant="filled" color={dataStore?.information?.backgroundColor || "#645cbb"} size='lg' radius={0} style={{position: "absolute", top: 0, left: 0, zIndex: 10}}>
                                                تخفيض
                                            </Badge>
                                        : null
                                    }
                                </Box>
                            </Carousel.Slide>
                            {product?.imagesProduct?.map((item: any, index: number) => (
                                <Carousel.Slide key={index}>
                                    <Box pos={'relative'}>
                                        <Image src={`${process.env.REACT_APP_API_URL_IMAGES}/${item}`} alt={""} width={"100%"} fit={'cover'}  />
                                        {product?.priceAfterDiscount > 0
                                            ? <Badge variant="filled" color={dataStore?.information?.backgroundColor || "#645cbb"} size='lg' radius={0} style={{position: "absolute", top: 0, left: 0, zIndex: 10}}>
                                                    تخفيض
                                                </Badge>
                                            : null
                                        }
                                    </Box>
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 12, md: 7, lg: 7, xl: 7 }}>
                        <Stack>
                            <Title order={1} fz={"28px"} fw={700}>
                                {product?.name}
                            </Title>
                            <Text fz={"18px"} c="dimmed">
                                {product?.shortDescription}
                            </Text>
                            <Group gap={10} mt={20}>
                                <Text fz={"24px"} fw={'bold'} c={dataStore?.information?.backgroundColor || "#645cbb"}>
                                    {product?.priceAfterDiscount > 0 ? product?.priceAfterDiscount : product?.price} د.ج
                                </Text>
                                {product?.priceAfterDiscount > 0
                                    ? <Text fz={"21px"} fw={'bold'} c="dimmed" td="line-through">
                                        {product?.price} د.ج
                                    </Text>
                                    : null
                                }
                                {product?.priceAfterDiscount > 0
                                    ? <Badge variant="filled" color={'red'} size='xl' radius={"xs"}>
                                        {Math.round(100 - ((product?.priceAfterDiscount * 100) / product?.price))}%
                                    </Badge>
                                    : null
                                }
                            </Group>

                            <FormOrder data={product} />
                            <Box mt={30} c={"gray.7"} dangerouslySetInnerHTML={{__html: product?.description}} />

                        </Stack>
                    </Grid.Col>
                </Grid>

                
                {similarProducts?.length > 0
                    ? <>
                        <Group mt={50} mb={20}>
                            <Text fz={"18px"} c="gray.8">منتجات مشابهة</Text>
                        </Group>
                        <Carousel 
                            dir='ltr' loop dragFree align="start"
                            slideSize={{ base: '75%', xs: '50%', sm: '33.333333%', md: '25%', lg: '20%', xl: '20%' }}
                            slideGap={{ base: "xs", xs: "xs", sm: 'xs', md: 'sm', lg: 'sm', xl: 'md' }}
                            slidesToScroll={1}

                            plugins={[autoplay.current]}
                            onMouseEnter={autoplay.current.stop}
                            onMouseLeave={autoplay.current.reset}
                        >
                            {similarProducts?.map((item: any, index: number) => (
                                <Carousel.Slide key={index}>
                                    <ProductCard
                                        key={index}
                                        id={item._id}
                                        title={item?.name}
                                        image={`${process.env.REACT_APP_API_URL_IMAGES}/${item?.thumbnail}`}
                                        price={item?.price }
                                        priceAfterDiscount={item.priceAfterDiscount}
                                    />
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                    </>
                    : null
                }
            </Container>
            <Footer/>
        </>
    );
}