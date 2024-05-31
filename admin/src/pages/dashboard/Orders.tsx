import React, { useEffect, useState } from 'react';
import { client } from '../../lib/axiosClient';
import { OrdersTabel } from '../../componants/Tables';
import { ChangeStatusOrder, ConfirmedOrder, DeleteOrder, UpdateOrder } from '../../componants/Modal';
import { HeadPage } from '../../componants';
import { ActionIcon, Button, Container, Dialog, Drawer, Group, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import { IconLock, IconLogout, IconSearch, IconX } from '@tabler/icons-react';
import classes from './../../styles/Product.module.css';
import { searchSortedData } from '../../lib/sort';
import Cookies from 'universal-cookie';
import { useOrders, useSearchOrders } from '../../api';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { DatePickerInput } from '@mantine/dates';
import XLSX from "sheetjs-style";
//@ts-ignore
import * as FileServer from "file-saver";
import dayjs from 'dayjs';
import { ShowOrderDrawer } from '../../componants/Drawer';
import { useTranslation } from 'react-i18next';

const cookies = new Cookies(null, { path: '/' });

export function Orders () {
    const { t } = useTranslation();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openShowModal, setOpenShowModal] = useState(false);
    const [openChangeStatusModal, setOpenChangeStatusModal] = useState(false);
    const [openConfirmedModal, setOpenConfirmedModal] = useState(false);
    //
    const [selectedData, setSelectedData] = useState<any>(null);
    
    const [openedExportDialog, { close: closeExportDialog, open: openExportDialog }] = useDisclosure(false);

    const [search, setSearch] = useState('');

    const [orders, setOrders] = useState<any[]>([]);
    const [ordersSorted, setOrdersSorted] = useState<any[]>([]);

    const [meta, setMeta] = useState<any[]>([]);
    const [status, setStatus] = useState("pending");
    const [page, setPage] = useState<any>(1);
    const [limit, setLimit] = useState<any>(5);
    const [sort, setSort] = useState<any>(-1);
    
    const [exportType, setExportType] = useState("month");
    const [dateExport, setDateExport] = useState<any[]>([]);

    const {loading, error, data: dataOrders, refetch} = useOrders({
        limit, page, sort, status
    })
    const {loading: loadingSearch, data: dataSearch, fetchData: fetchSearch} = useSearchOrders()
    const [role, setRole] = useState("");

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])

    useEffect(() => {
        if (dataOrders) {
            setOrders(dataOrders.data)
            setOrdersSorted(dataOrders.data)
            setMeta(dataOrders.meta)
            setPage(dataOrders?.meta?.current_page)
        }
    }, [dataOrders])

    useEffect(() => {
        if (dataSearch && search !== "") {
            setOrdersSorted(dataSearch)
        }
    }, [dataSearch])

    useEffect(() => {
        if (search === "") {
            setOrdersSorted(orders)
        } else {
            fetchSearch(status, search)
        }
    }, [search])

    const onExport = () => {
        client.get(`/deliveryExport/${status}/${exportType}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            },
            params: {
                start: dateExport?.[0],
                end: dateExport?.[1]
            }
        })
        .then(async ({data}) => {
            closeExportDialog()
            setExportType("month")
            setDateExport([])
            await exportToExcel(data)
        })
        .catch((error) => {
            closeExportDialog()
            setExportType("month")
            setDateExport([])
            console.log(error);
        })
    }

    const exportToExcel = async (dataToExcel: any) => {
        let newDataToExcel = []
        for (let i = 0; i < dataToExcel.length; i++) {
            const element = dataToExcel[i];
            newDataToExcel.push({
                'المنتج': element?.product?.name,
                'اسم العميل': element?.fullName,
                'السعر': `${element?.price} ${t("currency")}`,
                'الكمية': element?.quantity,
                'حالة الطلب': element?.status === "pending" ? "قيد الانتظار" : element?.status === "confirmed" ? "مؤكد" : element?.status === "closed" ? "مرفوض" : element?.status === "abandoned" ? "عربة متروكة" : "",
                'تاريخ الطلب': dayjs(element?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                'نوع التوصيل': element?.typeFee === "home_fee" ? "للمنزل" : "للمكتب",
                'الولاية': element?.state,
                'البلدية': element?.city,
                'العنوان': element?.address
            })
        }
        const ws = XLSX.utils.json_to_sheet(newDataToExcel);
        const wb = {Sheets: {'data': ws}, SheetNames: ['data']}
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;UTF-8"})

        FileServer.saveAs(data, `all-order-${dayjs().format("YYYY-MM-DD-HH:mm:ss")}.xlsx`)
    }

    if (!["admin", "confirmed"].includes(role)) {
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
                page={t('ordersPage.name')}
                links={[
                    { title: t('ordersPage.links.link01'), href: '/dashboard' },
                    { title: t('ordersPage.links.link02'), href: '' }
                ]}
                labelExport={t('ordersPage.labelExport')}
                onCreate={() => console.log()}
                onExport={openExportDialog}
            />

            <Group justify='space-between' align='flex-end' mb={20}>
                <SegmentedControl
                    withItemsBorders={false} 
                    value={status}
                    onChange={setStatus}
                    data={[
                        { label: t('ordersPage.tags.tag01'), value: 'pending' },
                        { label: t('ordersPage.tags.tag02'), value: 'confirmed' },
                        { label: t('ordersPage.tags.tag03'), value: 'closed' },
                        { label: t('ordersPage.tags.tag04'), value: 'abandoned' },
                        
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
                    leftSectionPointerEvents="none"
                    leftSection={<IconSearch size={18} />}
                    placeholder={t('ordersPage.placeholder')}
                    styles={{
                        input: {height: 40}
                    }}
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                />
            </Group>

            <OrdersTabel
                data={ordersSorted}
                setOpenDeleteModal={setOpenDeleteModal}
                setOpenEditModal={setOpenEditModal}
                setOpenShowModal={setOpenShowModal}
                setOpenChangeStatusModal={setOpenChangeStatusModal}
                setOpenConfirmedModal={setOpenConfirmedModal}
                setSelectedData={setSelectedData}
                refetchData={refetch}
                loading={loading || loadingSearch}
                meta={meta}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
            />

            <UpdateOrder title={t('ordersPage.updateOrder')}  data={selectedData} refetchData={refetch} opened={openEditModal} onClose={() => setOpenEditModal(false)} />
            <DeleteOrder data={selectedData} refetchData={refetch} opened={openDeleteModal} onClose={() => setOpenDeleteModal(false)} />
            <ChangeStatusOrder data={selectedData} refetchData={refetch} opened={openChangeStatusModal} onClose={() => setOpenChangeStatusModal(false)} />
            <ConfirmedOrder title={t('ordersPage.confirmedOrder')} data={selectedData} refetchData={refetch} opened={openConfirmedModal} onClose={() => setOpenConfirmedModal(false)} />

            <Dialog 
                opened={openedExportDialog} withCloseButton onClose={closeExportDialog}
                size={"lg"} radius="md" position={{ top: 70, right: 120 }}
            >
                <SegmentedControl
                    mt={10}
                    withItemsBorders={false} 
                    value={exportType}
                    onChange={setExportType}
                    data={[
                        { label: t('ordersPage.dialogExport.tags.tag01'), value: 'all' },
                        { label: t('ordersPage.dialogExport.tags.tag02'), value: 'month' },
                        { label: t('ordersPage.dialogExport.tags.tag03'), value: 'between' }
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

                <Group w={"100%"} mt={20} justify='space-between' align="center" wrap='nowrap'>
                    {exportType === "between"
                        ? <DatePickerInput
                            type="range"
                            placeholder={t('ordersPage.dialogExport.placeholder')}
                            w={"100%"}
                            locale='ar'
                            //@ts-ignore
                            value={dateExport}
                            onChange={setDateExport}
                            popoverProps={{}}
                        />
                        : exportType === "all"
                            ? <Text size='sm'>{t('ordersPage.dialogExport.text01')}</Text>
                            : <Text size='sm'>{t('ordersPage.dialogExport.text02')}</Text>
                    }
                    
                    <Button 
                        variant={"outline"}
                        color={'#323232'} px={10} miw={70}
                        onClick={onExport}
                    >
                        {t('ordersPage.dialogExport.button')}
                    </Button>
                </Group>
            </Dialog>

            <ShowOrderDrawer title={t('ordersPage.showOrder')} data={selectedData} opened={openShowModal} onClose={() => setOpenShowModal(false)} />
        </>
    );
}