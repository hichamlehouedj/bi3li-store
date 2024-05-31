import {Group, Title, Text, SimpleGrid, Container, useMantineTheme, Stack, Loader} from '@mantine/core';
import { ProductCard } from '../Cards';
import useAxios from 'axios-hooks'
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchSortedData } from '../../lib/sort';
import { useMediaQuery } from '@mantine/hooks';
import axios from 'axios';
import { ProductsSlider } from './ProductsSlider';
import classes from './../../styles/Products.module.css';
import useStore from '../../store/useStore';
  
export function Products() {
    const theme = useMantineTheme();
    let [searchParams, setSearchParams] = useSearchParams();
    let [filterdAllProducts, setFiltredAllProducts] = useState<any>([]);
    const [{ data: allProducts, loading, error }, refetch] = useAxios(
        `${process.env.REACT_APP_API_URL}/posting-products`
    )
    const matches = useMediaQuery('(max-width: 36em)');
    let [allCategories, setAllCategories] = useState<any[]>([]);
    const dataStore = useStore((state: any) => state.store);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/category`)
        .then(({data}) => {
            setAllCategories(data)
        })
        .catch((error) => console.log(error));
    }, [])

    useEffect(() => {
        if (allProducts && allProducts.length >= 0) {
            setFiltredAllProducts(allProducts)
        }
    }, [allProducts])

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

    const filterDataFromCategory = (category: string) => {
        let newData = filterdAllProducts?.filter((item: any) => item.categories.includes(category))
        return newData?.slice(0, 10)
    }

    if (error) return <p>Error!</p>

    return (
        <Container size="xl" mt={dataStore?.header && dataStore?.header?.length > 0 ? 50 : 
            dataStore?.topBar && dataStore?.topBar?.show && dataStore?.topBar?.content ? 140 : 100
        }>
            {loading
                ? <Stack align='center' justify='center' mt={50}>
                    <Loader color={dataStore?.information?.backgroundColor || "#645cbb"} size="md" type="bars" />
                </Stack>
                : null
            }
            <ProductsSlider data={allProducts} />
        
            {allCategories.map((item: any, index) => (
                <>
                    <Group justify='space-between' h={50} my={matches ? 20 : 30} align='center'>
                        <Title order={4} ta="right">{item.name}</Title>
                        <Text 
                            c={'gray.8'} fw={'bold'} size={matches ? "xs" : 'sm'} display={'block'}
                            component={Link} to={`/products/${item.name}`} className={classes.categoryTitle}
                        >عرض الكل</Text>
                    </Group>

                    <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 5 }} spacing="sm" mb={matches ? 50 : 80}>
                        {filterDataFromCategory(item.name)?.map((item: any, index: number) => (
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
                </>
            ))}

            {/* {filterdAllProducts && filterdAllProducts?.length > 0
                ? <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing="sm" mt={50}>
                    {filterdAllProducts?.map((item: any, index: number) => (
                        <ProductCard
                            key={index}
                            id={item._id}
                            title={item?.name}
                            image={`${process.env.REACT_APP_API_URL_IMAGES}/${item?.thumbnail}`}
                            price={item?.price }
                            priceAfterDiscount={item.priceAfterDiscount}
                        />
                    ))}
                    </SimpleGrid>
                : <Stack align='center' justify='center' mt={50}>
                    <Image src={"/shopping-trolley.png"} h={"100px"} w={"100px"} fit='contain' />
                </Stack>
            } */}
        </Container>
    );
}