import {ActionIcon, Badge, Divider, Group, Image, Menu, Skeleton, Stack, Text} from '@mantine/core';
import {IconTrash, IconEye, IconPencil, IconExternalLink, IconDatabaseOff} from '@tabler/icons-react';
import DataTable, {TableStyles} from 'react-data-table-component';
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';

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
                borderRadius: "0 8px 0 0",
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

//data

type Props = {
    setSelectedData: (data: any) => void;

    setOpenEditModal: (status: boolean) => void;
    setOpenDeleteModal: (status: boolean) => void;
    setOpenShowModal: (status: boolean) => void;
    data?: any;
    loading?: boolean;
};

export const LandingProductsTabel = ({data, loading, setSelectedData, setOpenEditModal, setOpenDeleteModal, setOpenShowModal}: Props) => {
    const { t } = useTranslation();
    const columns = [
        {name: t('tables.landing.row01'), selector: (row: any, index: number) => (
            <Stack justify='center' align='flex-start' gap={8}>
                <Text size='14px' c={"#333843"} fw={600}>{row.name}</Text>
                <Text 
                    size='12px' c={"#323232"}
                    component='a'
                    target='_blank'
                    href={`${process.env.REACT_APP_STORE_URL}/${row.link}`}
                >
                    <IconExternalLink size={12} style={{marginLeft: 2}} />
                    {t('tables.landing.linkLable')}
                </Text>
            </Stack>
        ), minWidth: "200px"},
        {name: t('tables.landing.row02'), selector: (row: any, index: number) => `${row.price} ${t('currency')}`, minWidth: "110px", sortable: true, sortFunction: (a: any, b: any) => a?.price > b?.price ? 1 : -1 },
        {name: t('tables.landing.row03'), selector: (row: any, index: number) => (
            row.freeShipping 
            ? <Badge radius={'sm'} color='green' variant='light'>مجاني</Badge>
            : <Badge radius={'sm'} color='red' variant='light'>مدفوع</Badge>
        ), minWidth: "110px", sortFunction: (a: any, b: any) => a?.posting > b?.posting ? 1 : -1 },

        {name: t('tables.landing.row04'), selector: (row: any) => dayjs(row.createdAt).locale("ar").fromNow(), minWidth: "130px", sortable: true, sortFunction: (a: any, b: any) => a?.createdAt > b?.createdAt ? 1 : -1 },

        {name: t('tables.landing.row05'), cell: (row: any) => (
            <Group wrap={"nowrap"} justify={"center"} w={"100%"} gap={2}>
                <ActionIcon
                    variant={"transparent"} color={"#667085"}
                    onClick={() => {
                        setSelectedData(row)
                        setOpenShowModal(true)
                    }}
                >
                    <IconEye size="1.125rem" />
                </ActionIcon>
                <ActionIcon
                    variant={"transparent"} color={"#667085"}
                    onClick={() => {
                        setSelectedData(row)
                        setOpenEditModal(true)
                    }}
                >
                    <IconPencil size="1.125rem" />
                </ActionIcon>
                <ActionIcon
                    variant={"transparent"} color={"#667085"}
                    onClick={() => {
                        setSelectedData(row)
                        setOpenDeleteModal(true)
                    }}
                >
                    <IconTrash size="1.125rem" />
                </ActionIcon>
            </Group>
        ), allowOverflow: true, button: true, minWidth: "100px" }
    ];

    return (
        <DataTable
            // @ts-ignore
            columns={columns}
            data={data}
            customStyles={customStyles}
            highlightOnHover
            pagination={true}
            persistTableHead={true}
            progressPending={loading || false}
            progressComponent={<LoadingTable />}
            noDataComponent={
                <Stack align='center' justify='center' p={10}>
                    <Image src={"/emptyData.png"} mah={150} w={"auto"} />
                    <Text size='14px' c={"#667085"}>{t('tables.emptyLable')}</Text>
                </Stack>
            }
            paginationComponentOptions={{
                rowsPerPageText: t('tables.rangeSeparatorText'),
                rangeSeparatorText: t('tables.rangeSeparatorText')
            }}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50, 75, 100, 200]}
            paginationPerPage={5}
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
            <Group h={60} miw={"22.5%"} px={16} justify='flex-start' align='center' gap={8} wrap='nowrap'>
                <Stack justify='center' align='flex-start' gap={5}>
                    <Skeleton height={14} width={120} />
                    <Skeleton height={12} width={60} />
                </Stack>
            </Group>
            <Group h={60} miw={"22.5%"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"22.5%"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"22.5%"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"10%"} px={16} justify='flex-start' align='center'>
                <Group wrap={"nowrap"} justify={"center"} w={"100%"} gap={2}>
                    <Skeleton height={18} width={18} />
                    <Skeleton height={18} width={18} />
                    <Skeleton height={18} width={18} />
                </Group>
            </Group>
        </Group>
    );
}