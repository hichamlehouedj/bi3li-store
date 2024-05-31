import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Container, Grid, Image, Loader } from '@mantine/core';
import { FormLandingOrder, FormOrder } from '../components/Sections';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { IconPlus } from '@tabler/icons-react';
import { useScrollIntoView, useWindowScroll } from '@mantine/hooks';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import useStore from '../store/useStore';


export function LandingProduct () {
    let { id } = useParams();
    const [product, setProduct] = useState<any>(null)
    const [displayButton, setDisplayButton] = useState(true)
    const [scroll, scrollTo] = useWindowScroll();
    const { scrollIntoView, targetRef, } = useScrollIntoView<HTMLDivElement, HTMLDivElement>({
        onScrollFinish: () => {
            setDisplayButton(false)
        }
    });
    const [imageLoaded, setImageLoaded] = useState(false);
    const dataStore = useStore((state: any) => state.store);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/landing-product/${id}`)
        .then(({data}) => {
            setProduct(data)
        })
        .catch((error) => console.log(error));
    }, [id])

    useEffect(() => {
        if (scroll.y <= 100) {
            setDisplayButton(true)
        }
    }, [scroll])

    return (
        <>
            {!imageLoaded
                ? <div style={{position: "fixed", top: 0, bottom: 0, right: 0, left: 0, height: "100vh", width: "100vw", zIndex: 100, background: "#fffffff0", display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "center"}}>
                    <Loader color={dataStore?.information?.backgroundColor || "#645cbb"} size="xl" />
                </div>
                : null
            }
            <LazyLoadImage
                src={`${process.env.REACT_APP_API_URL_IMAGES}/${product?.image}.webp`}
                alt={""}
                height={"auto"}
                width={"100%"}
                effect='blur'
                threshold={100}
                delayTime={0}
                style={{cursor: 'pointer'}}
                onClick={() => scrollIntoView()}
                onLoad={() => setImageLoaded(true)}
                placeholderSrc='/loading.gif'
            />

            <Container size={'lg'} mt={130}>
                <Grid gutter="xl" mt={50} justify='center'>
                    <Grid.Col span={{ base: 12, sm: 12, md: 10, lg: 8, xl: 8 }}>
                        {imageLoaded
                            ? <FormLandingOrder targetRef={targetRef} data={product} />
                            : null
                        }
                    </Grid.Col>
                </Grid>
            </Container>

            {displayButton
                ? <Box style={{position: "fixed", bottom: 20, left: 20}}>
                    <Button className='pulse-button'
                        variant="filled" size={'lg'} color={dataStore?.information?.backgroundColor || "#645cbb"}
                        leftSection={<IconPlus size={18} />}
                        onClick={() => scrollIntoView()}
                    >أطلب الان</Button>
                </Box>
                : null
            }
            
        </>
    );
}