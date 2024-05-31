import { ActionIcon, Box, Button, Divider, Grid, Group, Image, Stack, Text, TextInput, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import FormData from "form-data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconCheck, IconCloudUpload, IconPhoto, IconPlus, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { notifications } from "@mantine/notifications";

import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;


export const UpdateCategory = (props: Props) => {
    const { t } = useTranslation();
    const schema = z.object({
        name: z.string({required_error: t('modals.updateCategory.schemaName')}).min(2, { message: 'الاسم يجب ان لا يقل عن حرفين' }),
    });
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, insertListItem, removeListItem, values} = useForm({
        initialValues: {
            name: "", subCategories: [""]
        },
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });

    const [image, setImage] = useState(null);
    const [imageSrc, setImageSrc] = useState<any>(null);

    useEffect(() => {
        if (props.opened && "data" in props && props.data !== null) {
            const product = props.data
            setValues({
                name: product?.name,
                subCategories: product?.subCategories
            })
            setImageSrc(`${process.env.REACT_APP_API_URL_IMAGES}/${product?.image}`)
        }
    }, [props.opened, props.data])

    const onSubmitForm = ({name, subCategories}: any) => {
        setLoading(true)
        let data = new FormData();
        data.append('name', name);
        data.append('subCategories', subCategories.join(","));
        data.append('image', image);
        
        
        client.put(`/category/${props.data._id}`, data, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.updateCategory.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.updateCategory.alert02'), color: '#fff' });
            console.log(error)
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
        setImage(null)
        setImageSrc(null)
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
            <Box style={{padding: 20}} >
                <form onSubmit={onSubmit(onSubmitForm)} id="submit_form">
                    <Grid gutter={20} justify="center">
                        <Grid.Col span={12} >
                            <label style={{marginBottom: 20, fontSize: 16}}>{t('modals.updateCategory.label01')}</label>
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
                                                <Text size="lg" mt={10}>{t('modals.updateCategory.text01Dropzone')}</Text>
                                                <Text size="sm" c="dimmed">{t('modals.updateCategory.text02Dropzone')}</Text>
                                            </Stack>
                                        }
                                    </Dropzone.Idle>
                                </Group>
                            </Dropzone>
                        </Grid.Col>

                        <Grid.Col span={12} >
                            <TextInput
                                label={t('modals.updateCategory.label02')}
                                placeholder={t('modals.updateCategory.placeholder02')}
                                withAsterisk
                                {...getInputProps("name")}
                            />
                        </Grid.Col>

                        <Grid.Col span={12} >
                            <Divider
                                label={
                                    <Button
                                        variant="transparent" color={'#323232'}
                                        leftSection={<IconPlus size={18}/>}
                                        onClick={() => insertListItem('subCategories', "")}
                                    >
                                        {t('modals.updateCategory.addSubCategories')}
                                    </Button>
                                }
                                labelPosition="left"
                            />
                        </Grid.Col>

                        {values.subCategories.map((item, index) => (
                            <Grid.Col span={12} key={index}>
                                <Group w={"100%"} wrap="nowrap">
                                    <TextInput
                                        label={`${t('modals.updateCategory.label03')} ${index + 1}`}
                                        placeholder={`${t('modals.updateCategory.placeholder03')} ${index + 1}`}
                                        withAsterisk
                                        {...getInputProps(`subCategories.${index}`)}
                                        w={"100%"}
                                    />
                                    <ActionIcon color="red" mb={5} onClick={() => removeListItem('subCategories', index)}>
                                        <IconTrash size="1rem" />
                                    </ActionIcon>
                                </Group>
                            </Grid.Col>
                        )) }
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};