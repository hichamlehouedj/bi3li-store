import {Group, Title, Container, Box, ActionIcon} from '@mantine/core';
import { Carousel, Embla } from '@mantine/carousel';
import Slider, {Settings} from "react-slick";
import { useEffect, useRef, useState } from 'react';
import { sortedData } from '../../lib/sort';
import { ProductCard } from '../Cards';
import Autoplay from 'embla-carousel-autoplay';
import { IconArrowLeft, IconArrowRight, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import useStore from '../../store/useStore';

interface Props {
    data: any
}

export function ProductsSlider({data}: Props) {
    let [filterdAllProducts, setFiltredAllProducts] = useState<any>([]);
    const autoplay = useRef(Autoplay({ delay: 1000 }));
    const [embla, setEmbla] = useState<Embla | null>(null);
    const dataStore = useStore((state: any) => state.store);

    useEffect(() => {
        if (data && data.length >= 0) {
            const newSortedData = sortedData(data).slice(0, 10)

            setFiltredAllProducts(newSortedData)
        }
    }, [data])


    return (
        <section>
            <Group justify='space-between' h={50} my={30} align='center'>
                <Title order={4} ta="right">احدث المنتجات</Title>
            </Group>

            <Carousel 
                dir='ltr' loop dragFree align="start" mb={80}
                plugins={[autoplay.current]} onMouseEnter={autoplay.current.stop} onMouseLeave={autoplay.current.reset}
                slideSize={{ base: '75%', xs: '50%', sm: '33.333333%', md: '25%', lg: '20%', xl: '20%' }}
                slideGap={{ base: "xs", xs: "xs", sm: 'xs', md: 'sm', lg: 'sm', xl: 'md' }}
                nextControlIcon={<IconChevronRight color={dataStore?.information?.backgroundColor || "#645cbb"} size={22} strokeWidth={2} />}
                previousControlIcon={<IconChevronLeft color={dataStore?.information?.backgroundColor || "#645cbb"} size={22} strokeWidth={2} />}
                styles={{
                    controls: {
                        justifyContent: 'start',
                        height: 50,
                        top: -80,
                        right: "auto",
                        gap: 10
                    },
                    control: {
                        color: "#ffffff00",
                        border: "none",
                        boxShadow: "none"
                    }
                }}
            >
                {filterdAllProducts?.map((item: any, index: number) => (
                    <Carousel.Slide>
                        <ProductCard
                            key={index}
                            id={item._id}
                            title={item?.name}
                            image={`${process.env.REACT_APP_API_URL_IMAGES}/${item?.thumbnail}`}
                            price={item?.price }
                            priceAfterDiscount={item.priceAfterDiscount}
                            rating={item?.rating}
                        />
                    </Carousel.Slide>
                ))}
            </Carousel>
        </section>
    );
}