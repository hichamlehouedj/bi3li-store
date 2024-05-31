import {Group, Title, Text, SimpleGrid, Container, useMantineTheme, Stack, Loader, Image, Box, Grid, Chip} from '@mantine/core';
import { ProductCard } from '../Cards';
import useAxios from 'axios-hooks'
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchSortedData } from '../../lib/sort';
import { useMediaQuery } from '@mantine/hooks';
import useStore from '../../store/useStore';

export function ProductsByCategory() {
    let { category } = useParams();
    const theme = useMantineTheme();
    let [searchParams, setSearchParams] = useSearchParams();
    let [filterdAllProducts, setFiltredAllProducts] = useState<any>([]);
    const [{ data: allProducts, loading, error }, refetch] = useAxios(
        `${process.env.REACT_APP_API_URL}/posting-products`
    )
    const matches = useMediaQuery('(max-width: 36em)');
    const dataStore = useStore((state: any) => state.store);

    useEffect(() => {
        if (allProducts && allProducts.length >= 0) {
            let newData = allProducts?.filter((item: any) => item.categories.includes(category))
            
            setFiltredAllProducts(newData)
        }
    }, [allProducts, category])

    useEffect(() => {
        const search = searchParams.get("search");
        if (search && search !== "") {
            setSearchParams({search})
            let newData = searchSortedData(allProducts, ["name"], search)
            setFiltredAllProducts(newData)
        } else {
            setSearchParams()
            setFiltredAllProducts(allProducts)
        }
    }, [searchParams.get("search")])
    

    if (error) return <p>Error!</p>
    
    return (
        <Container size="xl" mt={dataStore?.topBar && dataStore?.topBar?.show && dataStore?.topBar?.content !== "" ? 140 : 100}>
            {loading
                ? <Stack align='center' justify='center' mt={50}>
                    <Loader color={dataStore?.information?.backgroundColor || "#645cbb"} size="md" type="bars" />
                </Stack>
                : null
            }
            <Group justify='space-between' h={50} my={matches ? 20 : 30} align='center'>
                <Title order={4} ta="right">{category}</Title>
            </Group>

            {filterdAllProducts && filterdAllProducts?.length > 0
                ? <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 5 }} spacing="sm" >
                    {filterdAllProducts?.map((item: any, index: number) => (
                        <ProductCard
                            key={index}
                            id={item._id}
                            title={item?.name}
                            image={`${process.env.REACT_APP_API_URL_IMAGES}/${item?.thumbnail}`}
                            price={item?.price }
                            priceAfterDiscount={item.priceAfterDiscount}
                            rating={item?.rating}
                        />
                    ))}
                    </SimpleGrid>
                : <Stack align='center' justify='center' mt={50}>
                    <Image src={"/shopping-trolley.png"} h={"100px"} w={"100px"} fit='contain' />
                </Stack>
            }
        </Container>
    );
}