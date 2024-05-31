import {ActionIcon, Badge, Divider, Group, Image, Loader, Menu, Skeleton, Stack, Text} from '@mantine/core';
import {IconDotsVertical, IconEdit, IconTrash, IconCircleXFilled, IconCircleCheckFilled, IconEye, IconPencil, IconDatabaseOff} from '@tabler/icons-react';
import DataTable, {TableStyles} from 'react-data-table-component';
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';

const customStyles: TableStyles = {
    table: {
        style: {
            minHeight: 280,
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
    setSelectedData?: (data: any) => void;

    setOpenEditModal?: (status: boolean) => void;
    setOpenDeleteModal?: (status: boolean) => void;
    setOpenShowModal?: (status: boolean) => void;
    data?: any;
    loading?: boolean;
};

export const ProductsStatisticsTabel = ({data, loading}: Props) => {
    const { t } = useTranslation();
    const columns = [
        {name: t('tables.home.productsStatisticsTabel.row01'), selector: (row: any, index: number) => (
            <Group justify='flex-start' align='center' gap={8} wrap='nowrap'>
                <Image
                    src={row?.product?.thumbnail ? `${process.env.REACT_APP_API_URL_IMAGES}/${row?.product?.thumbnail}` : "/no-image.png"}
                    width={44} height={44}
                />
                <Stack justify='center' align='flex-start' gap={5}>
                    <Text size='14px' c={"#333843"} fw={500}>{row?.product?.name}</Text>
                    <Text size='12px' c={"#667085"}>{`${row?.product?.imagesProduct?.length || 0} ${t('tables.home.productsStatisticsTabel.imagesLable')}`}</Text>
                </Stack>
            </Group>
        ), minWidth: "250px"},
        {name: t('tables.home.productsStatisticsTabel.row02'), selector: (row: any, index: number) => `${row?.product?.price} ${t('currency')}`, minWidth: "110px" },
        {name: t('tables.home.productsStatisticsTabel.row03'), selector: (row: any, index: number) => `${row?.product?.priceAfterDiscount} ${t('currency')}`, minWidth: "120px"  },
        {name: t('tables.home.productsStatisticsTabel.row04'), selector: (row: any) => dayjs(row?.product?.createdAt).locale("ar").fromNow(), minWidth: "150px" },
        {name: t('tables.home.productsStatisticsTabel.row05'), selector: (row: any, index: number) => <Badge radius={'sm'} color='red' variant='light'>{row?.totalQuantity}</Badge>, minWidth: "110px"},
        
    ];

    
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
            pagination={false}
            paginationComponentOptions={{
                rowsPerPageText: t('tables.rowsPerPageText'),
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
            <Group h={60} miw={"25%"} px={16} justify='flex-start' align='center' gap={8} wrap='nowrap'>
                <Skeleton width={44} height={44} />
                <Stack justify='center' align='flex-start' gap={5}>
                    <Skeleton height={14} width={120} />
                    <Skeleton height={12} width={60} />
                </Stack>
            </Group>
            <Group h={60} miw={"18.75%"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"18.75%"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"18.75%"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
            <Group h={60} miw={"18.75%"} px={16} justify='flex-start' align='center'>
                <Skeleton height={13} width={60} />
            </Group>
        </Group>
    );
}