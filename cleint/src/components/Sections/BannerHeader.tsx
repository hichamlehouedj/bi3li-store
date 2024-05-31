import { Text, Container, Group, Image, useMantineTheme, Title } from '@mantine/core';
import { IconMapPinFilled, IconPhoneFilled, IconMailFilled } from '@tabler/icons-react';
import classes from './../../styles/Footer.module.css';
import { useEffect, useRef, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Cookies from 'universal-cookie';
import useStore from '../../store/useStore';
const cookies = new Cookies(null, { path: '/' });


export function BannerHeader() {
    const theme = useMantineTheme();
    const autoplay = useRef(Autoplay({ delay: 5000 }));
    const dataStore = useStore((state: any) => state.store);
  
    
    if (dataStore?.header?.length === 0) {
        return (<></>)
    }

    return (
        <section style={{marginTop: dataStore?.topBar && dataStore?.topBar?.show && dataStore?.topBar?.content ? 120 : 80}}>
            {dataStore?.header?.length > 1
                ? <Carousel dir='ltr' loop dragFree align="start" slideSize={{ base: '100%' }} plugins={[autoplay.current]} onMouseEnter={autoplay.current.stop} onMouseLeave={autoplay.current.reset}>
                    {dataStore?.header?.map((item: any, index: number) => (
                        <Carousel.Slide key={index}>
                            <Image src={`${process.env.REACT_APP_API_URL_IMAGES}/${item}`} alt={""} width={"100%"} mah={"calc(100vh - 80px)"} fit={'fill'}  />
                        </Carousel.Slide>
                    ))}
                </Carousel>
                : <Image src={`${process.env.REACT_APP_API_URL_IMAGES}/${dataStore?.header?.[0]}`} alt={""} width={"100%"} mah={"calc(100vh - 80px)"} fit={'fill'}  />
            }
        </section>
    );
}