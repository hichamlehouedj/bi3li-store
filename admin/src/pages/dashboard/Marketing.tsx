import React, { useEffect, useState } from 'react';
import { client } from '../../lib/axiosClient';
import { MarketingTabel } from '../../componants/Tables';
import { HeadPage } from '../../componants';
import { searchSortedData, sortedData } from '../../lib/sort';
import { useDisclosure } from '@mantine/hooks';
import { AddMarketing, AddProduct, DeleteMarketing, UpdateMarketing } from '../../componants/Modal';

import Cookies from 'universal-cookie';
import { useMarketing } from '../../api';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
const cookies = new Cookies(null, { path: '/' });
export function Marketing () {
    const { t } = useTranslation();
    const [pixels, setPixels] = useState<any[]>([]);
    const [pixelsSorted, setPixelsSorted] = useState<any[]>([]);
    const [value, setValue] = useState('');
    const [searsh, setSearsh] = useState('');
    const [selectedData, setSelectedData] = useState(null);
    const [openedAddModal, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [openedEditModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [openedShowModal, { open: openShowModal, close: closeShowModal }] = useDisclosure(false);
    const {loading, error, data: dataMarketing, refetch} = useMarketing()
    const [role, setRole] = useState("");
    // const theme = useMantineTheme();

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])

    useEffect(() => {
        if (dataMarketing.length >= 0) {
            setPixels(dataMarketing)
        }
    }, [dataMarketing])

    useEffect(() => {
        if (pixels && pixels?.length >= 0) {
            const newData = sortedData(pixels)
            setPixelsSorted(newData)
        }
    }, [pixels])
    
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
                page={t('marketingPage.name')}
                links={[
                    { title: t('marketingPage.links.link01'), href: '/dashboard' },
                    { title: t('marketingPage.links.link02'), href: '' }
                ]}
                labelCreate={t('marketingPage.labelCreate')}
                labelExport={t('marketingPage.labelExport')}
                onCreate={openAddModal}
                onExport={() => console.log()}
                hiddenExport={true}
            />
            
            <MarketingTabel
                data={pixelsSorted}
                setOpenEditModal={openEditModal}
                setOpenDeleteModal={openDeleteModal}
                setOpenShowModal={openShowModal}
                
                setSelectedData={setSelectedData}

                loading={loading}
            />

            <AddMarketing title={t('marketingPage.addMarketing')} refetchData={refetch} opened={openedAddModal} onClose={closeAddModal} />
            <UpdateMarketing title={t('marketingPage.updateMarketing')} refetchData={refetch} data={selectedData} opened={openedEditModal} onClose={closeEditModal} />
            <DeleteMarketing data={selectedData} refetchData={refetch} opened={openedDeleteModal} onClose={closeDeleteModal} />
        </>
    );
}