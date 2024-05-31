import React, { useEffect, useState } from 'react';
import { client } from '../../lib/axiosClient';
import { UsersTabel } from '../../componants/Tables';
import { HeadPage } from '../../componants';
import { searchSortedData, sortedData } from '../../lib/sort';
import { useDisclosure } from '@mantine/hooks';
import { AddUser, DeleteUser, UpdateUser, UpdateUsers } from '../../componants/Modal';
import Cookies from 'universal-cookie';
import { useUsers } from '../../api';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
const cookies = new Cookies(null, { path: '/' });

export function Users () {
    const { t } = useTranslation();
    const [users, setUsers] = useState<any[]>([]);
    const [usersSorted, setUsersSorted] = useState<any[]>([]);
    const [selectedData, setSelectedData] = useState(null);
    const [openedAddModal, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [openedEditModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [openedDeleteModal, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const {loading, error, data: dataUser, refetch} = useUsers()
    const [role, setRole] = useState("");
    // const theme = useMantineTheme();

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])

    useEffect(() => {
        if (dataUser?.length >= 0) {
            setUsers(dataUser)
        }
    }, [dataUser])

    useEffect(() => {
        if (users && users?.length >= 0) {
            const newData = sortedData(users)
            setUsersSorted(newData)
        }
    }, [users])
    
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
                page={t('usersPage.name')}
                links={[
                    { title: t('usersPage.links.link01'), href: '/dashboard' },
                    { title: t('usersPage.links.link02'), href: '' }
                ]}
                labelCreate={t('usersPage.labelCreate')}
                labelExport=''
                onCreate={openAddModal}
                onExport={() => console.log()}
                hiddenExport={true}
            />
            
            <UsersTabel
                data={usersSorted}
                setOpenEditModal={openEditModal}
                setOpenDeleteModal={openDeleteModal}
                setSelectedData={setSelectedData}

                loading={loading}
            />

            <AddUser title={t('usersPage.addUser')} refetchData={refetch} opened={openedAddModal} onClose={closeAddModal} />
            <UpdateUsers title={t('usersPage.updateUser')} refetchData={refetch} data={selectedData} opened={openedEditModal} onClose={closeEditModal} />
            <DeleteUser refetchData={refetch} data={selectedData} opened={openedDeleteModal} onClose={closeDeleteModal} />
        </>
    );
}