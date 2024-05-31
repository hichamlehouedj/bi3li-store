import React, { useEffect, useState } from 'react';
import { client } from '../../lib/axiosClient';
import { ProductsTabel } from '../../componants/Tables';
import { HeadPage } from '../../componants';
import { Container, Drawer, Group, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import { IconLock, IconSearch } from '@tabler/icons-react';
import classes from './../../styles/Product.module.css';
import { searchSortedData, sortedData } from '../../lib/sort';
import { useDisclosure } from '@mantine/hooks';
import { AddProduct, DeleteProduct, UpdateProduct } from '../../componants/Modal';
import Cookies from 'universal-cookie';
import { useProducts } from '../../api';
import { ShowProductDrawer } from '../../componants/Drawer';
import { useTranslation } from 'react-i18next';
const cookies = new Cookies(null, { path: '/' });

export function Products () {
    const { t } = useTranslation();
    // const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [productsSorted, setProductsSorted] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const [searsh, setSearsh] = useState('');
    const [selectedData, setSelectedData] = useState(null);
    const [openedAddModal, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [openedEditModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [openedShowModal, { open: openShowModal, close: closeShowModal }] = useDisclosure(false);
    const [role, setRole] = useState("");
    // const theme = useMantineTheme();

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])
    
    const {loading, error, data: dataProducts, refetch} = useProducts()

    useEffect(() => {
        if (dataProducts.length >= 0) {
            setProducts(dataProducts)
        }
    }, [dataProducts])

    useEffect(() => {
        if (products && products?.length >= 0) {
            const newData = sortedData(products)
            setProductsSorted(newData)
        }
    }, [products])

    useEffect(() => {
        if (value === "true" || value === "false") {
            let filterData = products.filter((item: any) => item.posting == (value === "true"))
            filterData = sortedData(filterData)

            if (searsh && searsh !== "") {
                filterData = searchSortedData(filterData, ["name", "category"], searsh)
            }
            
            setProductsSorted(filterData)
        } else {
            let filterData = products
            filterData = sortedData(products)
            if (searsh && searsh !== "") {
                filterData = searchSortedData(filterData, ["name", "category"], searsh)
            }
            
            setProductsSorted(filterData)
        }
    }, [value, searsh])
    
    if (!["admin"].includes(role)) {
        return (
            <Container>
                <Stack align='center' justify='center' h={"calc(100vh - 130px)"}>
                    <IconLock size={45} strokeWidth={1.5} />
                    <Text>ليس لديك صلحيات للوصول لهذه الصفحة</Text>
                </Stack>
            </Container>
        )
    }
    return (
        <>
            <HeadPage
                page={t('productsPage.name')}
                links={[
                    { title: t('productsPage.links.link01'), href: '/dashboard' },
                    { title: t('productsPage.links.link02'), href: '' }
                ]}
                labelCreate={t('productsPage.labelCreate')}
                labelExport={t('productsPage.labelExport')}
                onCreate={openAddModal}
                onExport={() => console.log()}
                hiddenExport={true}
            />
            <Group justify='space-between' align='flex-end' mb={20}>
                <SegmentedControl
                    withItemsBorders={false} 
                    value={value}
                    onChange={setValue}
                    data={[
                        { label: t('productsPage.tags.tag01'), value: '' },
                        { label: t('productsPage.tags.tag02'), value: 'true' },
                        { label: t('productsPage.tags.tag03'), value: 'false' }
                    ]}
                    styles={{
                        root: {
                            border: "1px solid #E0E2E7",
                            background: "#fff",
                            height: 40,
                            alignItems: "center"
                        },
                        indicator: {
                            background: "#F2F7FB",
                            height: 30, minHeight: 30, maxHeight: 30,
                            boxShadow: "none"
                        }
                    }}
                    classNames={{
                        control: classes.control
                    }}
                />
                <TextInput
                    value={searsh}
                    onChange={(event) => setSearsh(event.currentTarget.value)}
                    leftSectionPointerEvents="none"
                    leftSection={<IconSearch size={18} />}
                    placeholder={t('productsPage.placeholderInput')}
                    styles={{
                        input: {height: 40}
                    }}
                />
            </Group>
            <ProductsTabel
                data={productsSorted}
                setOpenEditModal={openEditModal}
                setOpenDeleteModal={openDeleteModal}
                setOpenShowModal={openShowModal}
                
                setSelectedData={setSelectedData}

                loading={loading}
            />

            <AddProduct title={t('productsPage.addProduct')} refetchData={refetch} opened={openedAddModal} onClose={closeAddModal} />
            <UpdateProduct title={t('productsPage.updateProduct')} refetchData={refetch} data={selectedData} opened={openedEditModal} onClose={closeEditModal} />
            <DeleteProduct data={selectedData} refetchData={refetch} opened={openedDeleteModal} onClose={closeDeleteModal} />

            <ShowProductDrawer title={t('productsPage.showProduct')} data={selectedData} opened={openedShowModal} onClose={closeShowModal} />
        </>
    );
}