import {ActionIcon, Badge, Button, CopyButton, Divider, Group, HoverCard, Image, List, Menu, Skeleton, Stack, Text, Tooltip, rem} from '@mantine/core';
import {IconDotsVertical, IconEdit, IconTrash, IconCircleXFilled, IconCircleCheckFilled, IconCheck, IconX, IconDatabaseOff, IconEye, IconCopy, IconRefresh, IconTrack, IconTruckDelivery} from '@tabler/icons-react';
import DataTable, {TableStyles} from 'react-data-table-component';
import dayjs from "dayjs";
import { client } from '../../lib/axiosClient';

import Cookies from "universal-cookie";
import { notifications } from '@mantine/notifications';
import { map, z } from 'zod';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const cookies = new Cookies(null, { path: '/' });

const customStyles: TableStyles = {
    table: {
        style: {
            minHeight: 380,
            border: "2px solid #E0E2E7",
            borderRadius: "8px"
        },
    },
    headRow: {
        style: {
            borderRadius: "8px 8px 0 0",
            ":nth-child(1)": {
                borderRadius: "0 8px 0 0"
            },
            ":nth-last-child(1)": {
                borderRadius: "8px 0 0 0"
            }
        },
    },
    headCells: {
        style: {
            fontWeight: 800,
            fontSize: 14,
            background: "#F9F9FC",
            height: "56px",
            ":nth-child(1)": {
                background: "#F9F9FC",
            }
        }
    },
    cells: {
        style: {
            height: "60px"
        }
    }
};

type Props = {
    setSelectedData: (data: any) => void;

    setOpenEditModal: (status: boolean) => void;
    setOpenDeleteModal: (status: boolean) => void;
    setOpenChangeStatusModal: (status: boolean) => void;
    setOpenShowModal: (status: boolean) => void;
    setOpenConfirmedModal: (status: boolean) => void;
    data?: any;
    loading?: boolean;

    refetchData?: () => void;
    meta?: any;
    page?: number;
    setPage?: (page: number) => void;
    limit?: number;
    setLimit?: (limit: number) => void;
};

export const OrdersTabel = ({data, meta, loading, refetchData, setSelectedData, setOpenEditModal, setOpenDeleteModal, setOpenShowModal, setOpenChangeStatusModal, setOpenConfirmedModal, page, setPage, limit, setLimit}: Props) => {
    const { t } = useTranslation();
    const [role, setRole] = useState("");

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])

    const columns = [
        {name: t('tables.orders.row01'), selector: (row: any, index: number) => (
            <Group justify='flex-start' align='center' gap={8} wrap='nowrap'>
                <Image 
                    src={
                        "product" in row
                            ? row?.product?.thumbnail ? `${process.env.REACT_APP_API_URL_IMAGES}/${row?.product?.thumbnail}` : "/no-image.png"
                            : row?.landingProduct?.image ? `${process.env.REACT_APP_API_URL_IMAGES}/${row?.landingProduct?.image}` : "/no-image.png"
                    }
                    width={44} height={44}
                />
                <Stack justify='center' align='flex-start' gap={5}>
                    <Text size='14px' c={"#333843"} fw={500}>{ "product" in row ? row?.product?.name : row?.landingProduct?.name }</Text>
                    <Text size='12px' c={"#667085"}>{`${row?.product?.imagesProduct?.length || 1} ${t('tables.orders.imagesLable')}`}</Text>
                </Stack>
            </Group>
        ), minWidth: "250px", sortable: true, sortFunction: (a: any, b: any) => a?.row?.product?.name > b?.row?.product?.name ? 1 : -1 },

        {name: t('tables.orders.row02'), selector: (row: any, index: number) => row?.fullName, minWidth: "170px" },
        {name: t('tables.orders.row03'), selector: (row: any, index: number) => row?.phone, minWidth: "120px" },
        {name: t('tables.orders.row04'), selector: (row: any, index: number) => `${row?.price * row?.quantity} ${t('currency')}`, minWidth: "110px", sortable: true, sortFunction: (a: any, b: any) => a?.price > b?.price ? 1 : -1 },
        {name: t('tables.orders.row05'), selector: (row: any, index: number) => row?.quantity, minWidth: "110px", sortable: true, sortFunction: (a: any, b: any) => a?.quantity > b?.quantity ? 1 : -1 },
        {name: t('tables.orders.row06'), selector: (row: any, index: number) => (
            row?.status === "pending" ? <Badge radius={'sm'} color='yellow' variant='light'>{t('tables.orders.badge01')}</Badge> 
                : row?.status === "confirmed" ? <Badge radius={'sm'} color='green' variant='light'>{t('tables.orders.badge02')}</Badge> 
                    : row?.status === "closed" ? <Badge radius={'sm'} color='red' variant='light'>{t('tables.orders.badge03')}</Badge>
                    : row?.status === "abandoned" ? <Badge radius={'sm'} color='orange' variant='light'>{t('tables.orders.badge04')}</Badge> : null
        ), minWidth: "140px", sortable: true, sortFunction: (a: any, b: any) => a?.posting > b?.posting ? 1 : -1 },
        {name: t('tables.orders.row07'), selector: (row: any) => dayjs(row?.createdAt).locale("ar").fromNow(), minWidth: "140px", sortable: true, sortFunction: (a: any, b: any) => a?.createdAt > b?.createdAt ? 1 : -1 },

        {name: t('tables.orders.row08'), selector: (row: any, index: number) => row?.state, minWidth: "140px", sortable: true, sortFunction: (a: any, b: any) => a?.state > b?.state ? 1 : -1 },

        {name: t('tables.orders.row09'), cell: (row: any) => (
            <Group wrap={"nowrap"} justify={"center"} w={"100%"} gap={5}>
                <ActionIcon
                    variant={"transparent"} color={"#667085"}
                    onClick={() => {
                        setSelectedData(row)
                        setOpenShowModal(true)
                    }}
                >
                    <IconEye size="1.125rem" />
                </ActionIcon>

                <Menu shadow="md" width={180}>
                    <Menu.Target>
                        <ActionIcon variant={"transparent"} color={"darck"}>
                            <IconDotsVertical size="1.125rem" />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        {["pending", "closed", "abandoned"].includes(row?.status)
                            ? <Menu.Item
                                leftSection={<IconCheck size={14} />}
                                onClick={() => {
                                    setSelectedData({...row, id: row._id, status: "confirmed"})
                                    setOpenChangeStatusModal(true)
                                }}
                            >{t('tables.orders.confirmedStatus')}</Menu.Item>
                            : null
                        }

                        {["pending", "abandoned"].includes(row?.status)
                            ? <Menu.Item
                                leftSection={<IconX size={14} />}
                                onClick={() => {
                                    setSelectedData({id: row._id, status: "closed"})
                                    setOpenChangeStatusModal(true)
                                }}
                            >{t('tables.orders.closedStatus')}</Menu.Item>
                            : null
                        }

                        {["confirmed"].includes(row?.status) && (!row?.deliveryCompany || typeof row?.deliveryCompany == "string" || row?.deliveryCompany?.trackingCode === "")
                            ? <Menu.Item
                                leftSection={<IconTruckDelivery size={14} />}
                                onClick={() => {
                                    setSelectedData(row)
                                    setOpenConfirmedModal(true)
                                }}
                            >{t('tables.orders.deliveryStatus')}</Menu.Item>
                            : null
                        }

                        <Divider />
                        <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => {
                                setSelectedData(row)
                                setOpenEditModal(true)
                            }}
                        >{t('tables.orders.edit')}</Menu.Item>
                        
                        {["admin"].includes(role)
                            ? <Menu.Item
                                leftSection={<IconTrash size={14} />}
                                onClick={() => {
                                    setSelectedData(row._id)
                                    setOpenDeleteModal(true)
                                }}
                            >{t('tables.orders.delete')}</Menu.Item>
                            : null
                        }
                        
                    </Menu.Dropdown>
                </Menu>
            </Group>
        ), allowOverflow: true, button: true, minWidth: '100px' }
    ];
    
    if (data?.[0]?.status === "confirmed") {
        columns.splice(-1, 0, 
            {name: t('tables.orders.row10'), selector: (row: any, index: number) => (
                row?.deliveryCompany?.name === "Yalidine"
                    ? <Group justify='flex-start' align='center' gap={8}>
                        <Image src={"/yalidine-logo.png"} width={"auto"} height={26} />
                        {row?.deliveryCompany?.trackingCode
                            ? <CopyButton value={row?.deliveryCompany?.trackingCode} timeout={2000}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? t('tables.orders.copied') : t('tables.orders.copy')} withArrow position="top">
                                        <Button 
                                            color={copied ? 'teal' : '#dc3545'}
                                            variant="outline" onClick={copy} size='xs'
                                            leftSection={copied ? (<IconCheck style={{ width: rem(14) }} />) : (<IconCopy style={{ width: rem(14) }} />)}
                                        >
                                            {row?.deliveryCompany?.trackingCode}
                                        </Button>
                                    </Tooltip>
                                )}
                            </CopyButton>
                            : <Button
                                color={'teal'} variant="outline" size='xs'
                                leftSection={<IconRefresh style={{ width: rem(14) }} />}
                                onClick={() => {
                                    setSelectedData(row)
                                    setOpenConfirmedModal(true)
                                }}
                            >
                                {t('tables.orders.refresh')}
                            </Button>
                        }
                    </Group>
                    : null
            ), minWidth: "200px" }
        )
        /*
            deliveryCompany: {
                name: "Yalidine",
                status: order.success ? "success" : "failed",
                trackingCode: order.tracking
            }
        */
    }

    const handlePageChange = (page: number) => {
		typeof setPage == "function" && setPage(page);
	};

	const handlePerRowsChange = async (newPerPage: number, page: number) => {
		typeof setLimit == "function" && setLimit(newPerPage);
	};

    return (
        <DataTable
            // @ts-ignore
            columns={columns}
            data={data}
            customStyles={customStyles}
            highlightOnHover
            persistTableHead={true}
            progressPending={loading || false}
            progressComponent={<LoadingTable />}
            noDataComponent={
                <Stack align='center' justify='center' p={10}>
                    <Image src={"/emptyData.png"} mah={150} w={"auto"} />
                    <Text size='14px' c={"#667085"}>{t('tables.emptyLable')}</Text>
                </Stack>
            }

            pagination={true}
			paginationServer={true}
			paginationTotalRows={meta?.totalRows}
			onChangeRowsPerPage={handlePerRowsChange}
			onChangePage={handlePageChange}

            paginationComponentOptions={{
                rowsPerPageText: t('tables.rangeSeparatorText'),
                rangeSeparatorText: t('tables.rangeSeparatorText')
            }}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50, 75, 100, 200]}
            paginationPerPage={limit}
        />
    );
};


const LoadingTable = () => {
    const numRows = [0,0,0];
    return (
        <Stack w={"100%"} p={0} m={0} gap={0}>
            {numRows.map((item, index) => (
                <RowSkeleton key={index}/>
            ))}
        </Stack>
    )
}

const RowSkeleton = () => {
    
    return (
        <Group w={"100%"} mih={48} align='stretch' gap={0} wrap='nowrap' style={{borderBottom: "2px solid #E0E2E7"}}>
            <Group h={60} miw={"250px"} px={16} justify='flex-start' align='center' gap={8} wrap='nowrap'>
                <Skeleton width={44} height={44} />
                <Stack justify='center' align='flex-start' gap={5}>
                    <Skeleton height={14} width={120} />
                    <Skeleton height={12} width={60} />
                </Stack>
            </Group>
            <Group h={60} miw={"170px"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"120px"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"110px"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"110px"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"140px"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"140px"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"140px"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"100px"} px={16} justify='flex-start' align='center'>
                <Group wrap={"nowrap"} justify={"center"} w={"100%"} gap={2}>
                    <Skeleton height={18} width={18} />
                    <Skeleton height={18} width={18} />
                </Group>
            </Group>
        </Group>
    );
}