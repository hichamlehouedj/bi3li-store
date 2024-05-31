import React, { useEffect, useState } from 'react';
import { client } from '../../lib/axiosClient';
import { LandingProductsTabel, ProductsTabel } from '../../componants/Tables';
import { HeadPage } from '../../componants';
import { searchSortedData, sortedData } from '../../lib/sort';
import { useDisclosure } from '@mantine/hooks';
import { AddLandingProduct, DeleteLandingProduct, UpdateLandingProduct } from '../../componants/Modal';

import Cookies from 'universal-cookie';
import { useLandingPage } from '../../api';
import { ShowLandingPageDrawer } from '../../componants/Drawer';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
const cookies = new Cookies(null, { path: '/' });
export function LandingPage () {
    const { t } = useTranslation();
    const [products, setProducts] = useState<any[]>([]);
    const [productsSorted, setProductsSorted] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const [searsh, setSearsh] = useState('');
    const [selectedData, setSelectedData] = useState(null);
    const [openedAddModal, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [openedEditModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [openedShowModal, { open: openShowModal, close: closeShowModal }] = useDisclosure(false);
    const {loading, error, data: dataLandingPage, refetch} = useLandingPage()
    const [role, setRole] = useState("");
    // const theme = useMantineTheme();

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])

    useEffect(() => {
        if (dataLandingPage.length >= 0) {
            setProducts(dataLandingPage)
        }
    }, [dataLandingPage])

    useEffect(() => {
        if (products && products?.length >= 0) {
            const newData = sortedData(products)
            setProductsSorted(newData)
        }
    }, [products])

    useEffect(() => {
        let filterData = products
        if (searsh && searsh !== "") {
            filterData = searchSortedData(filterData, ["name", "category"], searsh)
        }
        
        setProductsSorted(filterData)
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
                page={t('landingPage.name')}
                links={[
                    { title: t('landingPage.links.link01'), href: '/dashboard' },
                    { title: t('landingPage.links.link02'), href: '' }
                ]}
                labelCreate={t('landingPage.labelCreate')}
                labelExport={t('landingPage.labelExport')}
                onCreate={openAddModal}
                onExport={() => console.log()}
                hiddenExport={true}
            />
            
            <LandingProductsTabel
                data={productsSorted}
                setOpenEditModal={openEditModal}
                setOpenDeleteModal={openDeleteModal}
                setOpenShowModal={openShowModal}
                
                setSelectedData={setSelectedData}

                loading={loading}
            />

            <AddLandingProduct title={t('landingPage.addLandingProduct')} refetchData={refetch} opened={openedAddModal} onClose={closeAddModal} />
            <UpdateLandingProduct title={t('landingPage.updateLandingProduct')} refetchData={refetch} data={selectedData} opened={openedEditModal} onClose={closeEditModal} />
            <DeleteLandingProduct data={selectedData} refetchData={refetch} opened={openedDeleteModal} onClose={closeDeleteModal} />

            <ShowLandingPageDrawer title={t('landingPage.showLandingProduct')} data={selectedData} opened={openedShowModal} onClose={closeShowModal} />
        </>
    );
}