import React, { useEffect, useState } from 'react';
import { client } from '../../lib/axiosClient';
import { useDisclosure } from '@mantine/hooks';
import { HeadPage } from '../../componants';
import { AddCategory, DeleteCategory, UpdateCategory } from '../../componants/Modal';
import { CategoriesTabel } from '../../componants/Tables';
import Cookies from 'universal-cookie';
import { useCategories } from '../../api';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
const cookies = new Cookies(null, { path: '/' });

export function Categories () {
    const { t } = useTranslation();
    const [setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [categoriesSorted, setCategoriesSorted] = useState<any[]>([]);
    const [selectedData, setSelectedData] = useState(null);
    const [openedAddModal, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [openedEditModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const {loading, error, data: dataCategories, refetch} = useCategories()
    const [role, setRole] = useState("");
    // const theme = useMantineTheme();

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])

    useEffect(() => {
        if (dataCategories.length >= 0) {
            setCategories(dataCategories)
        }
    }, [dataCategories])

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
                page={t('categoriesPage.name')}
                links={[
                    { title: t('categoriesPage.links.link01'), href: '/dashboard' },
                    { title: t('categoriesPage.links.link02'), href: '' }
                ]}
                labelCreate={t('categoriesPage.labelCreate')}
                labelExport={t('categoriesPage.labelExport')}
                onCreate={openAddModal}
                onExport={() => console.log()}
                hiddenExport={true}
            />

            <CategoriesTabel
                data={categories}
                setSelectedData={setSelectedData}
                setOpenEditModal={openEditModal}
                setOpenDeleteModal={openDeleteModal}

                loading={loading}
            />

            <AddCategory title={t('categoriesPage.addCategory')} opened={openedAddModal} refetchData={refetch} onClose={closeAddModal} />
            <UpdateCategory title={t('categoriesPage.updateCategory')} data={selectedData} refetchData={refetch} opened={openedEditModal} onClose={closeEditModal} />
            <DeleteCategory data={selectedData} refetchData={refetch} opened={openedDeleteModal} onClose={closeDeleteModal} />
        </>
    );
}