import { Box, Button, Checkbox, CloseButton, ColorInput, Divider, Grid, Group, Image, NumberInput, PasswordInput, Select, Stack, Switch, Tabs, Text, TextInput, Textarea, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import { IconCheck, IconCloudUpload, IconPhoto, IconUpload, IconX, IconXboxX } from "@tabler/icons-react";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { notifications } from "@mantine/notifications";

import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";
import Wilayas from '../../helper/wilayas.json';
import { useStore } from "../../api";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

export const UpdateStoreInfo = (props: Props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values} = useForm({
        initialValues: { 
            phone: "",
            email: "",
            facebook: "",
            tiktok: "",
            instagram: "",
            shortDescription: "",
            address: "",
            textColor: "",
            backgroundColor: ""
        }
    });
    const {loading: loadingStore, error, data: dataStore, refetch} = useStore()
    const [image, setImage] = useState<any>(null);
    const [oldImage, setOldImage] = useState<string>("");
    const [imageSrc, setImageSrc] = useState<string>("");

    useEffect(() => {
        if (dataStore && "information" in dataStore && dataStore.information !== null) {
            setValues({
                phone: dataStore.information.phone,
                email: dataStore.information.email,
                facebook: dataStore.information.facebook,
                tiktok: dataStore.information.tiktok,
                instagram: dataStore.information.instagram,
                shortDescription: dataStore.information.shortDescription,
                address: dataStore.information.address,
                textColor: dataStore.information.textColor,
                backgroundColor: dataStore.information.backgroundColor
            })
        }
        if (dataStore && "logo" in dataStore && dataStore.logo !== null) {
            setOldImage(dataStore.logo || "")
            setImageSrc(`${process.env.REACT_APP_API_URL_IMAGES}/${dataStore.logo}`)
        }
    }, [dataStore])

    const onSubmitForm = ({phone, email, facebook, tiktok, instagram, shortDescription, address, textColor, backgroundColor}: any) => {
        setLoading(true)
        
        let data = new FormData();
        data.append('phone', phone);
        data.append('email', email);
        data.append('facebook', facebook);
        data.append('tiktok', tiktok);
        data.append('instagram', instagram);
        data.append('shortDescription', shortDescription);
        data.append('address', address);
        data.append('textColor', textColor);
        data.append('backgroundColor', backgroundColor);
        data.append('oldLogo', oldImage);
        data.append('logo', image);

        client.put(`/store`, data, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.updateStoreInfo.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            refetch()
            closeModal()
        })
        .catch(({response}) => {
            notifications.show({ message: t('modals.updateStoreInfo.alert02'), color: '#fff' });
            setLoading(false)
        });
    }

    const handleImageChange = (files: any) => {
        const file = files?.[0]
        setImage(file)
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event: any) => setImageSrc(event.target.result);
    };

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
                    <Grid gutter={20} justify="flex-start">
                        <Grid.Col span={12} >
                            <label style={{marginBottom: 20, fontSize: 16}}>{t('modals.updateStoreInfo.label01')}</label>
                            <Dropzone
                                onDrop={handleImageChange}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                multiple={false}
                            >
                                <Group justify="center" gap="xl" mih={100} style={{ pointerEvents: 'none' }}>
                                    <Dropzone.Accept>
                                        <IconUpload
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        {imageSrc
                                            ? <Image src={imageSrc} alt="Uploaded Image" height={100} />
                                            : <Stack align="center" justify="center" gap={2}>
                                                <IconCloudUpload size={40} style={{ color: 'var(--mantine-color-gray-8)' }} stroke={1} />
                                                <Text size="lg" mt={10}>{t('modals.updateStoreInfo.text01Dropzone')}</Text>
                                                <Text size="sm" c="dimmed">{t('modals.updateStoreInfo.text02Dropzone')}</Text>
                                            </Stack>
                                        }
                                    </Dropzone.Idle>
                                </Group>
                            </Dropzone>
                        </Grid.Col>
                        <Grid.Col span={12} >
                            <TextInput
                                label={t('modals.updateStoreInfo.label02')}
                                placeholder={t('modals.updateStoreInfo.placeholder02')}
                                {...getInputProps("shortDescription")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.updateStoreInfo.label03')}
                                placeholder={t('modals.updateStoreInfo.placeholder03')}
                                withAsterisk
                                {...getInputProps("phone")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.updateStoreInfo.label04')}
                                placeholder={t('modals.updateStoreInfo.placeholder04')}
                                {...getInputProps("email")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12} >
                            <TextInput
                                label={t('modals.updateStoreInfo.label05')}
                                placeholder={t('modals.updateStoreInfo.placeholder05')}
                                {...getInputProps("address")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <ColorInput
                                label={t('modals.updateStoreInfo.label09')}
                                placeholder={t('modals.updateStoreInfo.placeholder09')}
                                withAsterisk
                                {...getInputProps("textColor")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <ColorInput
                                label={t('modals.updateStoreInfo.label10')}
                                placeholder={t('modals.updateStoreInfo.placeholder10')}
                                withAsterisk
                                {...getInputProps("backgroundColor")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.updateStoreInfo.label06')}
                                placeholder={t('modals.updateStoreInfo.placeholder06')}
                                {...getInputProps("facebook")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.updateStoreInfo.label07')}
                                placeholder={t('modals.updateStoreInfo.placeholder07')}
                                {...getInputProps("instagram")}
                            />
                        </Grid.Col>
                        <Grid.Col span={6} >
                            <TextInput
                                label={t('modals.updateStoreInfo.label08')}
                                placeholder={t('modals.updateStoreInfo.placeholder08')}
                                {...getInputProps("tiktok")}
                            />
                        </Grid.Col>
                        
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};