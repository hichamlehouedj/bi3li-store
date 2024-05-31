import React, { useEffect, useRef, useState } from 'react';
import { Badge, Box, Button, Container, Grid, Group, Image, Stack, Text, Title } from '@mantine/core';
import { FormOrder } from '../components/Sections';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { HeaderSimple } from '../components/Navbar';
import { Footer } from '../components/Sections/Footer';
import { ProductCard } from '../components/Cards';
import useStore from '../store/useStore';


export function Order () {
    let { status, id, type } = useParams();
    const dataStore = useStore((state: any) => state.store);

    useEffect(() => {
    }, [status, id])

    return (
        <>
            <HeaderSimple />
            <Container size={'lg'} mt={130} >
                <Grid justify='center' align='center' w={"100%"}>
                    <Grid.Col span={{ base: 12, md: 10, lg: 7, xl: 6 }}>
                        <Box w={"100%"} h={"100%"} bg={"#fff"} p={20} py={40} style={{borderRadius: 8, boxShadow: "0px 0px 10px 5px #eee"}}>
                            {status === "confirmed"
                                ? <Stack justify='center' align='center' gap={0}>
                                    <Image src={"/check.png"} w={35} h={35} />
                                    <Text mt={30} size='xl' fw={700} c={"gray.8"}>تم استلام طلبك بنجاح</Text>
                                    <Text mt={10} size='md' c={"gray.7"} ta={'center'} >سوف يتم الاتصال بك لتأكيد طلبك وارساله مع شركة الشحن</Text>
                                    <Text mt={5} size='sm' c={"gray.6"}>لا تتردد ابد في الاتصال بنا في حال اي استفسار</Text>
                                    <Button 
                                        mt={30} color={dataStore?.information?.backgroundColor || "#645cbb"} radius={'xs'}
                                        component={Link} to={type === "product" ? `/product/${id}` : `/${id}`}
                                    >رجوع للتسوق</Button>
                                </Stack>
                                : <Stack justify='center' align='center' gap={0}>
                                    <Image src={"/failed.png"} w={35} h={35} />
                                    <Text mt={30} size='xl' fw={700} c={"gray.8"}>فشل استلام طلبك للاسف</Text>
                                    <Text mt={10} size='md' c={"gray.7"} ta={'center'} maw={370}>يبدوا انه هناك مشكل. قم بإعادة الطلب وتاكد ان كل معلوماتك سليمة ولا يوجود حقول فارغة</Text>
                                    <Text mt={5} size='sm' c={"gray.6"}>لا تتردد ابد في الاتصال بنا في حال اي استفسار</Text>
                                    <Button
                                        mt={30} color='red' radius={'xs'}
                                        component={Link} to={type === "product" ? `/product/${id}` : `/${id}`}
                                    >إعادة الطلب</Button>
                                </Stack>
                            }
                        </Box>
                    </Grid.Col>
                </Grid>
            </Container>
            <Footer/>
        </>
    );
}