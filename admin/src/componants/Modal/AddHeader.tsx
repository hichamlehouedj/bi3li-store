import { ActionIcon, Box, Button, CloseButton, Divider, Grid, Group, Image, Overlay, Stack, Text, TextInput, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import FormData from "form-data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconCheck, IconCloudUpload, IconPhoto, IconPlus, IconTrash, IconUpload, IconX, IconXboxX } from "@tabler/icons-react";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { notifications } from "@mantine/notifications";
import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";
import { useStore } from "../../api";

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;


export const AddHeader = (props: Props) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const {loading: loadingStore, error, data: dataStore, refetch} = useStore()

    const [images, setImages] = useState<any[]>([]);
    const [imagesSrc, setImagesSrc] = useState<any[]>([]);
    const [oldImages, setOldImages] = useState<string[]>([]);

    useEffect(() => {
        if (props.opened && dataStore && "header" in dataStore && dataStore.header !== null) {
            for (let index = 0; index < dataStore.header.length; index++) {
                const element: string = dataStore.header[index];
                if (element !== "") {
                    setImagesSrc((pre: any) => [...pre, `${process.env.REACT_APP_API_URL_IMAGES}/${element}`])
                    setOldImages((pre: any) => [...pre, element])
                }
            }
        }
    }, [dataStore, props.opened])

    const onSubmitForm = () => {
        setLoading(true)
        
        let data = new FormData();
        data.append('oldImages', oldImages.join(","));
        
        for (let index = 0; index < images.length; index++) {
            const element = images[index];
            data.append('images', element);
        }
        
        client.post(`/store/header`, data, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.addHeader.alert01'), color: '#fff' });
            console.log(data);
            closeModal()
            refetch()
            setLoading(false)
        })
        .catch((error) => {
            notifications.show({ message: t('modals.addHeader.alert02'), color: '#fff' });
            console.log(error)
            setLoading(false)
        });
    }
    
    const handleImageChange = (files: any) => {
        setImages([...images, ...files])
        files.map((file: any, index: number) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
    
            reader.onload = (event: any) => setImagesSrc((pre: any) => [...pre, event.target.result]);
        })
    };

    const deleteImage = (index: number, image: any) => {
        let newImages = imagesSrc
        let oldImages2 = oldImages
        const indexOld = oldImages2.findIndex((item: any) => `${process.env.REACT_APP_API_URL_IMAGES}/${item}` === image)
        
        if (indexOld >= 0) {
            oldImages2.splice(index, 1)
            setOldImages([...oldImages2])
        } else {
            let newImagesProduct: any[] = []
            for (let i = 0; i < images.length; i++) {
                const file: Blob = images[i];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event: any) => {
                    const result = event.target.result
                    if (result !== image) {
                        newImagesProduct.push(file)
                    }
                };
            }
            setImages([...newImagesProduct])
        }

        newImages.splice(index, 1)
        setImagesSrc([...newImages])
    };

    const closeModal = () => {
        setImages([])
        setImagesSrc([])
        setOldImages([])

        props.onClose();
        setLoading(false)
    };
    

    return (
        <Modal
            {...props} onClose={closeModal} loading={loading}
            footer={
                <Box py={16} px={20} bg="slate.0">
                    <Group justify={"flex-end"} gap={"xs"}>
                        <Button color="gray" variant="outline" rightSection={<IconX size={15} />} bg="white" onClick={closeModal}>{t('modals.cancelling')}</Button>
                        <Button color={'#323232'} rightSection={<IconCheck size={15} />} onClick={onSubmitForm}>{t('modals.confirmation')}</Button>
                    </Group>
                </Box>
            }
        >
            <Box style={{padding: 20}} >
                <Grid gutter={20} justify="center">
                    <Grid.Col span={12} >
                        <label style={{marginBottom: 20, fontSize: 16}}>{t('modals.addHeader.label01')}</label>
                        <Dropzone
                            onDrop={handleImageChange}
                            onReject={(files) => console.log('rejected files', files)}
                            maxSize={5 * 1024 ** 2}
                            accept={IMAGE_MIME_TYPE}
                            multiple={true}
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
                                    <Stack align="center" justify="center" gap={2}>
                                        <IconCloudUpload size={40} style={{ color: 'var(--mantine-color-gray-8)' }} stroke={1} />
                                        <Text size="lg" mt={10}>{t('modals.addHeader.text01Dropzone')}</Text>
                                        <Text size="sm" c="dimmed">{t('modals.addHeader.text02Dropzone')}</Text>
                                    </Stack>
                                </Dropzone.Idle>
                            </Group>
                        </Dropzone>

                        
                        {imagesSrc.length > 0
                            ? <Group justify="flex-start" gap="xl" mt={20} mih={220}>
                                {imagesSrc.map((item: any, index: number) => (
                                    <Box key={index} pos={"relative"}>
                                        <CloseButton
                                            variant="transparent"
                                            pos={"absolute"} top={-15} right={-15}
                                            icon={<IconXboxX color="red" size={20} stroke={1.5} />}
                                            onClick={() => deleteImage(index, item)}
                                        />
                                        <Image src={item} alt="Uploaded Image" height={120} />
                                    </Box>
                                ))}
                            </Group>
                            : null
                        }
                    </Grid.Col>

                    
                </Grid>
            </Box>
        </Modal>
    );
};