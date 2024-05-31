import { Autocomplete, Box, Button, Grid, Group, Image, NumberInput, Select, Stack, Switch, Tabs, Text, TextInput, Textarea, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import { IconCheck, IconCloudUpload, IconPhoto, IconUpload, IconX, IconXboxX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import Cookies from "universal-cookie";
import FormData from "form-data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import listCompanies from "../../listCompany.json"
import { z } from "zod";
import { useTranslation } from "react-i18next";

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    allShipping?: any;
    refetchData?: () => void;
} & ModalProps;


export const AddShipping = (props: Props) => {
    const { t } = useTranslation();

    const schema = z.object({
        name: z.string({message: t('modals.addShipping.schemaName')}).min(1, { message: t('modals.addShipping.schemaName2') }),
        apiKey: z.string({message: t('modals.addShipping.schemaApiKey')}).min(2, { message: t('modals.addShipping.schemaApiKey2') }),
        apiToken: z.string({message: t('modals.addShipping.schemaApiToken')}).min(2, { message: t('modals.addShipping.schemaApiToken2') }),
    });
    const [loading, setLoading] = useState(false);
    const [allDeliveryCompany, setAllDeliveryCompany] = useState<{value: string, disabled: boolean}[]>([]);
    const {onSubmit, reset, getInputProps, setValues, } = useForm({
        initialValues: {
            name: "", apiKey: "", apiToken: ""
        },
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });

    useEffect(() => {
        if (listCompanies) {
            let newData: {value: string, disabled: boolean}[] = []
            listCompanies.map((item: any) => {
                newData.push({value: item.name, disabled: props?.allShipping?.filter((item2: any) => item2?.name === item.name).length > 0})
            })
            setAllDeliveryCompany(newData)
        }
    }, [listCompanies, props?.allShipping])

    const onSubmitForm = ({name, apiKey, apiToken}: any) => {
        setLoading(true)
        let data = new FormData();
        data.append('name', name);
        data.append('apiKey', apiKey);
        data.append('apiToken', apiToken);
        data.append('logo', listCompanies.filter((item: any) => item?.name === name)?.[0]?.logo);

        client.post(`/delivery-company`, data, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.addShipping.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.addShipping.alert02'), color: '#fff' });
            console.log(error)
            setLoading(false)
        });
    }

    const closeModal = () => {
        reset();
        props.onClose();
        setLoading(false)
    };

    return (
        <Modal
            {...props} onClose={closeModal} loading={loading}
            footer={
                <Box py={16} px={20} bg="slate.0">
                    <Group justify={"flex-end"} gap={"xs"}>
                        <Button color={'gray'} variant="outline" rightSection={<IconX size={15} />} bg="white" onClick={closeModal}>{t('modals.cancelling')}</Button>
                        <Button color={'#323232'} rightSection={<IconCheck size={15} />} type="submit" form="submit_form">{t('modals.confirmation')}</Button>
                    </Group>
                </Box>
            }
        >
            <Box style={{padding: 20}}>
                <form onSubmit={onSubmit(onSubmitForm)} id="submit_form">
                    <Grid gutter={20} justify="center">
                        <Grid.Col span={{base: 12, md: 12}} >
                            <Autocomplete
                                label={t('modals.addShipping.label01')}
                                placeholder={t('modals.addShipping.placeholder01')}
                                data={allDeliveryCompany}
                                renderOption={({ option }) => (
                                    <Group gap="sm">
                                        <Image src={`${process.env.REACT_APP_API_URL_IMAGES}/${listCompanies.filter((item: any) => item?.name === option.value)?.[0]?.logo}`} h={30} />
                                        <Text size="sm">{option?.value}</Text>
                                    </Group>
                                )}
                                {...getInputProps("name")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12} >
                            <TextInput
                                label={t('modals.addShipping.label02')}
                                placeholder={t('modals.addShipping.placeholder02')}
                                withAsterisk
                                {...getInputProps("apiKey")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12} >
                            <Textarea
                                label={t('modals.addShipping.label03')}
                                placeholder={t('modals.addShipping.placeholder03')}
                                withAsterisk
                                rows={4}
                                {...getInputProps("apiToken")}
                            />
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};