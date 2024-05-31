import React, { useEffect, useState } from 'react';
import { client } from '../../lib/axiosClient';
import { ShippingTabel } from '../../componants/Tables';
import { HeadPage } from '../../componants';
import { searchSortedData, sortedData } from '../../lib/sort';
import { useDisclosure } from '@mantine/hooks';
import { AddShipping, DeleteShipping, UpdateShipping } from '../../componants/Modal';
import Cookies from 'universal-cookie';
import { useShipping } from '../../api';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
const cookies = new Cookies(null, { path: '/' });

export function Shipping () {
    const { t } = useTranslation();
    const [shippings, setShippings] = useState<any[]>([]);
    const [shippingsSorted, setShippingsSorted] = useState<any[]>([]);
    const [selectedData, setSelectedData] = useState(null);
    const [openedAddModal, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [openedEditModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const {loading, error, data: dataShipping, refetch} = useShipping()
    const [role, setRole] = useState("");
    // const theme = useMantineTheme();

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])

    useEffect(() => {
        if (dataShipping.length >= 0) {
            setShippings(dataShipping)
        }
    }, [dataShipping])

    useEffect(() => {
        if (shippings && shippings?.length >= 0) {
            const newData = sortedData(shippings)
            setShippingsSorted(newData)
        }
    }, [shippings])
    
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
                page={t('shippingPage.name')}
                links={[
                    { title: t('shippingPage.links.link01'), href: '/dashboard' },
                    { title: t('shippingPage.links.link02'), href: '' }
                ]}
                labelCreate={t('shippingPage.labelCreate')}
                labelExport=''
                onCreate={openAddModal}
                onExport={() => console.log()}
                hiddenExport={true}
            />
            
            <ShippingTabel
                data={shippingsSorted}
                setOpenEditModal={openEditModal}
                setOpenDeleteModal={openDeleteModal}
                setSelectedData={setSelectedData}

                loading={loading}
            />

            <AddShipping title={t('shippingPage.addShipping')} allShipping={shippingsSorted} refetchData={refetch} opened={openedAddModal} onClose={closeAddModal} />
            <UpdateShipping title={t('shippingPage.updateShipping')} allShipping={shippingsSorted} refetchData={refetch} data={selectedData} opened={openedEditModal} onClose={closeEditModal} />
            <DeleteShipping refetchData={refetch} data={selectedData} opened={openedDeleteModal} onClose={closeDeleteModal} />
        </>
    );
}