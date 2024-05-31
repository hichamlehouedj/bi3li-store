import { ActionIcon, Box, Button, Checkbox, CloseButton, ColorInput, DEFAULT_THEME, Divider, Grid, Group, Image, MultiSelect, NumberInput, Select, Stack, Switch, Tabs, TagsInput, Text, TextInput, Textarea, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import FormData from "form-data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconCheck, IconCloudCheck, IconCloudUpload, IconMinus, IconPhoto, IconPlus, IconTrash, IconUpload, IconX, IconXboxX } from "@tabler/icons-react";
import classes from "../../styles/AddProduct.module.css"
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

import { RichText } from "../Custom";
import { notifications } from "@mantine/notifications";

import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

const listColor = ['#FFFFFFFF', '#000000FF', '#9E9E9EFF', '#7C4DFFFF', '#F44336FF', '#4CAF50FF', '#FF9800FF', '#2196F3FF', '#FFEB3BFF', '#795548FF']

export const AddProduct = (props: Props) => {
    const { t } = useTranslation();
    const schema = z.object({
        name: z.string({message: t('modals.addProduct.schemaName')}).min(2, { message: t('modals.addProduct.schemaName2') }),
        price: z.number({message: t('modals.addProduct.schemaPrice')}).gt(0, { message: t('modals.addProduct.schemaPrice2') }),
        cost: z.number({message: t('modals.addProduct.schemaCost')}),
        shortDescription:  z.string({message: t('modals.addProduct.schemaShortDescription')}).min(2, { message: t('modals.addProduct.schemaShortDescription2') }),
        offers: z.array(
            z.object({
                name: z.string({message: t('modals.addProduct.schemaOffersName')}).min(2, { message: t('modals.addProduct.schemaOffersName2') }),
                price: z.number({message: t('modals.addProduct.schemaOffersPrice')}).gt(0, { message: t('modals.addProduct.schemaOffersPrice2') }),
                quantity: z.number({message: t('modals.addProduct.schemaOffersQuantity')}).gt(0, { message: t('modals.addProduct.schemaOffersQuantity2') })
            })
        )
    });
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values, insertListItem, removeListItem, isValid, errors} = useForm({
        initialValues: {
            name: "", price: 0, priceAfterDiscount: 0, cost: 0, weight: 0, shortDescription: "",
            notRequireDelivery: false, freeShipping: false, posting: true,
            sizes: [], colors: [], upsell: false, offers: [], rating: 0
        },
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });
    let [description, setDescription] = useState("");
    let [allCategories, setAllCategories] = useState<any[]>([]);
    let [allMainCategories, setAllMainCategories] = useState<{label: string, value: string}[]>([]);
    let [allSubCategories, setAllSubCategories] = useState<string[]>([]);
    let [category, setCategory] = useState<string[]>([]);
    let [subCategory, setSubCategory] = useState<string[]>([]);

    const [thumbnail, setThumbnail] = useState(null);
    const [imagesProduct, setImagesProduct] = useState<string[]>([]);
    const [thumbnailSrc, setThumbnailSrc] = useState(null);
    const [imagesProductSrc, setImagesProductSrc] = useState<string[]>([]);
    const [hasDescount, setHasDescount] = useState(false);
    const [hasOffers, setHasOffers] = useState(false);
    const [errorDes, setErrorDes] = useState<any>(null);

    useEffect(() => {
        client.get(`/category`)
        .then(({data}) => {
            setAllCategories(data)
            let newCategory: {label: string, value: string}[] = []
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                newCategory.push({label: element?.name, value: element?.name})
            }
            setAllMainCategories(newCategory.sort((a, b) => {
                var textA = a.label.toUpperCase();
                var textB = b.label.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }))
        })
        .catch((error) => console.log(error));
    }, [])

    useEffect(() => {
        
        if(category.length > 0) {
            const filterCategory: any[] = allCategories.filter((item: any) => category.includes(item.name))
            
            if (filterCategory.length > 0) {
                let newSubCategory: string[] = []

                for (let i = 0; i < filterCategory.length; i++) {
                    if ("subCategories" in filterCategory[i]) {
                        const subCategories = filterCategory[i].subCategories
                        if (subCategories.length > 0) {
                            newSubCategory = [...newSubCategory, ...subCategories]
                        }
                    }
                }

                setAllSubCategories(newSubCategory.sort((a, b) => {
                    var textA = a.toUpperCase();
                    var textB = b.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                }))
            }
        }
    }, [category])

    const onSubmitForm = ({name, price, priceAfterDiscount, cost, weight, shortDescription,
        notRequireDelivery, freeShipping, posting, sizes, colors, upsell, offers, rating}: any) => {
        setLoading(true)
        let data = new FormData();
        data.append('name', name);
        data.append('price', price);
        data.append('priceAfterDiscount', priceAfterDiscount);
        data.append('cost', cost);
        data.append('weight', weight);
        data.append('shortDescription', shortDescription);
        data.append('description', description);
        data.append('notRequireDelivery', notRequireDelivery);
        data.append('freeShipping', freeShipping);
        data.append('posting', posting);
        data.append('thumbnail', thumbnail);

        data.append('categories', category.length > 0 ? category.join(",") : null);
        data.append('subCategories', subCategory.length > 0 ? subCategory.join(",") : null);

        data.append('sizes', sizes.join(","));
        data.append('colors', colors.join(","));
        data.append('upsell', upsell);
        data.append('rating', rating);
        data.append('offers', offers.length > 0 ? JSON.stringify(offers) : JSON.stringify([]));
        
        for (let index = 0; index < imagesProduct.length; index++) {
            const element = imagesProduct[index];
            data.append('imagesProduct', element);
        }

        client.post(`/products/`, data, {
            headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
            }
        })
        .then(({data}) => {
            notifications.show({ message: t('modals.addProduct.alert01'), color: '#fff' });
            console.log(data);
            setLoading(false)
            typeof props?.refetchData == "function" && props?.refetchData()
            closeModal()
        })
        .catch((error) => {
            notifications.show({ message: t('modals.addProduct.alert02'), color: '#fff' });
            console.log(error)
            setLoading(false)
        });
    }

    const handleThumbnailChange = (files: any) => {
        const file = files?.[0]
        setThumbnail(file)
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event: any) => setThumbnailSrc(event.target.result);
    };

    const handleImageProductChange = (files: any) => {
        setImagesProduct([...imagesProduct, ...files])
        files.map((file: any, index: number) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
    
            reader.onload = (event: any) => setImagesProductSrc((pre: any) => [...pre, event.target.result]);
        })
    };

    const deleteImage = (index: number) => {
        let newImages = imagesProductSrc
        newImages.splice(index, 1)

        let newImagesProduct = imagesProduct
        newImagesProduct.splice(index, 1)
        
        setImagesProductSrc([...newImages])
        setImagesProduct([...newImagesProduct])
    };

    //@ts-ignore
    const removeCategory = (value: string) => {
        const filterCategory = allCategories.filter((item: any) => item.name === value)
            
        if (filterCategory.length > 0 && "subCategories" in filterCategory[0]) {
            const subCategories = filterCategory[0].subCategories
            let newSubCategory: string[] = []

            for (let index = 0; index < subCategories.length; index++) {
                const element = subCategories[index];
                newSubCategory.push(element)
            }

            const newSubCategoriesAfterRemove = subCategory.filter((item: any) => !newSubCategory.includes(item))
            setSubCategory(newSubCategoriesAfterRemove)
        }            
    }

    const closeModal = () => {
        reset();
        setThumbnail(null)
        setThumbnailSrc(null)
        setImagesProduct([])
        setImagesProductSrc([])
        setHasOffers(false)
        setHasDescount(false)
        setDescription("")
        setAllCategories([])
        setAllMainCategories([])
        setAllSubCategories([])
        setCategory([])
        setSubCategory([])
        setErrorDes(null)
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
                        <Button loading={loading} color={'#323232'} rightSection={<IconCheck size={15} />} type="submit" form="submit_form">{t('modals.confirmation')}</Button>
                    </Group>
                </Box>
            }
        >
            <Box style={{padding: 20}} >
                <form onSubmit={onSubmit(onSubmitForm)} id="submit_form">
                    <Grid gutter={20} justify="flex-start">
                        <Grid.Col span={12} >
                            <label style={{marginBottom: 20, fontSize: 16}}>{t('modals.addProduct.label00')}</label>
                            <Dropzone
                                onDrop={handleThumbnailChange}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                multiple={false}
                                style={{borderWidth: 2}}
                            >
                                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
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
                                        {thumbnailSrc
                                            ? <Image src={thumbnailSrc} alt="Uploaded Image" height={220} />
                                            : <Stack align="center" justify="center" gap={2}>
                                                <IconCloudUpload size={40} style={{ color: 'var(--mantine-color-gray-8)' }} stroke={1} />
                                                <Text size="lg" mt={20}>{t('modals.addProduct.text01Dropzone')}</Text>
                                                <Text size="sm" c="dimmed">{t('modals.addProduct.text02Dropzone')}</Text>
                                            </Stack>
                                        }
                                    </Dropzone.Idle>
                                </Group>
                            </Dropzone>
                        </Grid.Col>

                        <Grid.Col span={{base: 12, md: 6}} >
                            <TextInput
                                label={t('modals.addProduct.label01')}
                                placeholder={t('modals.addProduct.placeholder01')}
                                withAsterisk
                                {...getInputProps("name")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{base: 12, md: 6}} >
                            <TextInput
                                label={t('modals.addProduct.label02')}
                                placeholder={t('modals.addProduct.placeholder02')}
                                withAsterisk
                                {...getInputProps("shortDescription")}
                            />
                        </Grid.Col>
                        <Grid.Col span={12} >
                            <Text size="sm">{t('modals.addProduct.label03')}</Text>
                            <RichText
                                content={description}
                                setContent={setDescription}
                            />
                        </Grid.Col>
                        
                        <Grid.Col span={12} >
                            <Switch
                                labelPosition="left"
                                label={t('modals.addProduct.label04')}
                                color={'#323232'}
                                styles={()=>({
                                    root: {
                                        background: "#fff",
                                        border: "1px solid #ced4da",
                                        borderRadius: 3,
                                        padding: "7px 10px"
                                    },
                                    body: { justifyContent: "space-between" },
                                    label: { paddingInlineStart: 0 }
                                })}
                                checked={hasDescount}
                                onChange={(event) => setHasDescount(event.currentTarget.checked)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{base: 12, md: hasDescount ? 4 : 6}} >
                            <NumberInput
                                label={t('modals.addProduct.label05')}
                                placeholder={t('modals.addProduct.placeholder05')}
                                withAsterisk
                                {...getInputProps("price")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{base: 12, md: hasDescount ? 4 : 6}} >
                            <NumberInput
                                label={t('modals.addProduct.label06')}
                                placeholder={t('modals.addProduct.placeholder06')}
                                withAsterisk
                                {...getInputProps("cost")}
                            />
                        </Grid.Col>
                        {hasDescount
                            ? <Grid.Col span={{base: 12, md: 4}} >
                                <NumberInput
                                    label={t('modals.addProduct.label07')}
                                    placeholder={t('modals.addProduct.placeholder07')}
                                    withAsterisk
                                    {...getInputProps("priceAfterDiscount")}
                                />
                            </Grid.Col>
                            : null
                        }
                        
                        
                        <Grid.Col  span={{base: 12, md: 6}} >
                            <NumberInput
                                label={t('modals.addProduct.label08')}
                                placeholder={t('modals.addProduct.placeholder08')}
                                {...getInputProps("weight")}
                            />
                        </Grid.Col>
                        
                        <Grid.Col  span={{base: 12, md: 6}} >
                            <TagsInput
                                label={t('modals.addProduct.label09')}
                                placeholder={t('modals.addProduct.placeholder09')}
                                {...getInputProps("sizes")}
                            />
                        </Grid.Col>

                        
                        <Grid.Col  span={{base: 12, md: 6}}>
                            <MultiSelect
                                label={t('modals.addProduct.label10')}
                                placeholder={t('modals.addProduct.placeholder10')}
                                value={category} onChange={setCategory}
                                data={allMainCategories}
                                onRemove={removeCategory}
                            />
                        </Grid.Col>
                        <Grid.Col  span={{base: 12, md: 6}}>
                            <MultiSelect
                                label={t('modals.addProduct.label11')}
                                placeholder={t('modals.addProduct.placeholder11')}
                                value={subCategory} onChange={setSubCategory}
                                data={allSubCategories}
                            />
                        </Grid.Col>


                        <Grid.Col span={12} >
                            <Checkbox.Group
                                label={t('modals.addProduct.label12')}
                                {...getInputProps("colors")}
                            >
                                <Group mt="xs">
                                    {listColor.map((item, index) => (
                                        <Checkbox
                                            key={index} color={item} size="lg" value={item} label=""
                                            styles={{
                                                input: {
                                                    backgroundColor: item
                                                }
                                            }}
                                            icon={({ indeterminate, ...others }) =>
                                                indeterminate ? <IconMinus {...others} /> : <IconCheck color={index === 0 ?  "#000" : "#fff"} {...others} />
                                            }
                                        />
                                    ))}
                                </Group>
                            </Checkbox.Group>
                        </Grid.Col>

                        
                        <Grid.Col span={{base: 12}} >
                            <NumberInput
                                label={t('modals.addProduct.label22')}
                                placeholder={t('modals.addProduct.placeholder22')}
                                withAsterisk
                                {...getInputProps("rating")}
                            />
                        </Grid.Col>


                        <Grid.Col span={{base: 12, md: 6}} >
                            <Switch
                                labelPosition="left"
                                label={t('modals.addProduct.label13')}
                                color={'#323232'}
                                styles={()=>({
                                    root: {
                                        background: "#fff",
                                        border: "1px solid #ced4da",
                                        borderRadius: 3,
                                        padding: "7px 10px"
                                    },
                                    body: { justifyContent: "space-between" },
                                    label: { paddingInlineStart: 0 }
                                })}
                                {...getInputProps("freeShipping", {type: "checkbox"})}
                            />
                        </Grid.Col>
                        <Grid.Col span={{base: 12, md: 6}} >
                            <Switch
                                labelPosition="left"
                                label={t('modals.addProduct.label14')}
                                color={'#323232'}
                                styles={()=>({
                                    root: {
                                        background: "#fff",
                                        border: "1px solid #ced4da",
                                        borderRadius: 3,
                                        padding: "7px 10px"
                                    },
                                    body: { justifyContent: "space-between" },
                                    label: { paddingInlineStart: 0 }
                                })}
                                {...getInputProps("posting", {type: "checkbox"})}
                            />
                        </Grid.Col>
                        <Grid.Col span={{base: 12, md: 6}} >
                            <Switch
                                labelPosition="left"
                                label={t('modals.addProduct.label15')}
                                color={'#323232'}
                                styles={()=>({
                                    root: {
                                        background: "#fff",
                                        border: "1px solid #ced4da",
                                        borderRadius: 3,
                                        padding: "7px 10px"
                                    },
                                    body: { justifyContent: "space-between" },
                                    label: { paddingInlineStart: 0 }
                                })}
                                {...getInputProps("upsell", {type: "checkbox"})}
                            />
                        </Grid.Col>
                        <Grid.Col span={{base: 12, md: 6}} >
                            <Switch
                                labelPosition="left"
                                label={t('modals.addProduct.label16')}
                                color={'#323232'}
                                styles={()=>({
                                    root: {
                                        background: "#fff",
                                        border: "1px solid #ced4da",
                                        borderRadius: 3,
                                        padding: "7px 10px"
                                    },
                                    body: { justifyContent: "space-between" },
                                    label: { paddingInlineStart: 0 }
                                })}
                                checked={hasOffers}
                                onChange={(event) => setHasOffers(event.currentTarget.checked)}
                            />
                        </Grid.Col>


                        {hasOffers ?
                            <>
                                <Grid.Col span={12}>
                                    <Divider
                                        mb={20}
                                        label={
                                            <Button
                                                variant="transparent" color={'gray'}
                                                leftSection={<IconPlus size={18}/>}
                                                onClick={() => insertListItem('offers', {name: "", price: 0, quantity: 0, freeShipping: false})}
                                            >
                                                {t('modals.addProduct.addOffer')}
                                            </Button>
                                        }
                                        labelPosition="left"
                                    />

                                    {values.offers.map((item, index) => (
                                        <Grid key={index} className={classes.cardOffer}>
                                            <Group gap={5} className={classes.btnOffer}>
                                                <Text size="xs" c={'#323232'}>{t('modals.addProduct.labelOffer')} {index + 1}</Text>
                                                <ActionIcon
                                                    variant="transparent" color={'red'} size={"xs"}
                                                    onClick={() => removeListItem('offers', index)}
                                                >
                                                    <IconTrash size={18}/>
                                                </ActionIcon>
                                            </Group>
                                            
                                            <Grid.Col span={6} >
                                                <TextInput
                                                    label={t('modals.addProduct.label17')}
                                                    placeholder={t('modals.addProduct.placeholder17')}
                                                    {...getInputProps(`offers.${index}.name`)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={6} >
                                                <NumberInput
                                                    label={t('modals.addProduct.label18')}
                                                    placeholder={t('modals.addProduct.placeholder18')}
                                                    withAsterisk
                                                    {...getInputProps(`offers.${index}.price`)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={6} >
                                                <NumberInput
                                                    label={t('modals.addProduct.label19')}
                                                    placeholder={t('modals.addProduct.placeholder19')}
                                                    withAsterisk
                                                    {...getInputProps(`offers.${index}.quantity`)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={6} style={{alignSelf: "end"}}>
                                                <Switch
                                                    labelPosition="left"
                                                    label={t('modals.addProduct.label20')}
                                                    color={'#323232'}
                                                    styles={()=>({
                                                        root: {
                                                            background: "#fff",
                                                            border: "1px solid #ced4da",
                                                            borderRadius: 3,
                                                            padding: "7px 10px"
                                                        },
                                                        body: { justifyContent: "space-between" },
                                                        label: { paddingInlineStart: 0 }
                                                    })}
                                                    {...getInputProps(`offers.${index}.freeShipping`, {type: "checkbox"})}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    ))}
                                </Grid.Col>
                            </>
                            : null
                        }
                        
                        <Grid.Col span={12} >
                            <label style={{marginBottom: 20, fontSize: 16}}>{t('modals.addProduct.label21')}</label>
                            <Dropzone
                                onDrop={handleImageProductChange}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                multiple={true}
                                style={{borderWidth: 2}}
                            >
                                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
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
                                            <Text size="lg" mt={20}>{t('modals.addProduct.text01Dropzone2')}</Text>
                                            <Text size="sm" c="dimmed">{t('modals.addProduct.text02Dropzone2')}</Text>
                                        </Stack>
                                    </Dropzone.Idle>
                                </Group>
                            </Dropzone>
                            {imagesProductSrc.length > 0
                                ? <Group justify="flex-start" gap="xl" mih={220}>
                                    {imagesProductSrc.map((item: any, index: number) => (
                                        <Box key={index} pos={"relative"}>
                                            <CloseButton
                                                variant="transparent"
                                                pos={"absolute"} top={-15} right={-15}
                                                icon={<IconXboxX color="red" size={20} stroke={1.5} />}
                                                onClick={() => deleteImage(index)}
                                            />
                                            <Image src={item} alt="Uploaded Image" height={120} />
                                        </Box>
                                    ))}
                                </Group>
                                : null
                            }
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};