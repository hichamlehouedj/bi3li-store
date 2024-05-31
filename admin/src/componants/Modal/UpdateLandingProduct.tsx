import { ActionIcon, Box, Button, Checkbox, CloseButton, Divider, Grid, Group, Image, MultiSelect, NumberInput, Stack, Switch, Tabs, TagsInput, Text, TextInput, Textarea, rem } from "@mantine/core";
import Modal, { Props as ModalProps } from "./Modal";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { client } from "../../lib/axiosClient";
import FormData from "form-data";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconCheck, IconCloudUpload, IconMinus, IconPhoto, IconPlus, IconTrash, IconUpload, IconX, IconXboxX } from "@tabler/icons-react";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { notifications } from "@mantine/notifications";
import classes from "../../styles/AddProduct.module.css"
import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";

const cookies = new Cookies(null, { path: '/' });
type Props = {
    setSelectedData?: (id: string) => void;
    data?: any;
    refetchData?: () => void;
} & ModalProps;

const listColor = ['#fefefe', '#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']

export const UpdateLandingProduct = (props: Props) => {
    const { t } = useTranslation();
    const schema = z.object({
        name: z.string({message: t('modals.updateLandingProduct.schemaName')}).min(2, { message: t('modals.updateLandingProduct.schemaName2') }),
        price: z.number({message: t('modals.updateLandingProduct.schemaPrice')}).gt(0, { message: t('modals.updateLandingProduct.schemaPrice2') }),
        cost: z.number({message: t('modals.updateLandingProduct.schemaCost')}),
    });
    const [loading, setLoading] = useState(false);
    const {onSubmit, reset, getInputProps, setValues, values, removeListItem, insertListItem} = useForm({
        initialValues: {
            name: "", price: 0, cost: 0, freeShipping: false,
            sizes: [], colors: [], offers: []
        },
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });
    // let [allCategories, setAllCategories] = useState<any[]>([]);
    // let [allMainCategories, setAllMainCategories] = useState<{label: string, value: string}[]>([]);
    // let [allSubCategories, setAllSubCategories] = useState<string[]>([]);
    // let [category, setCategory] = useState<string[]>([]);
    // let [subCategory, setSubCategory] = useState<string[]>([]);

    const [image, setImage] = useState(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [hasOffers, setHasOffers] = useState(false);

    // useEffect(() => {
    //     client.get(`/category`)
    //     .then(({data}) => {
    //         setAllCategories(data)
    //         let newCategory: {label: string, value: string}[] = []
    //         for (let index = 0; index < data?.length; index++) {
    //             const element = data[index];
    //             newCategory.push({label: element?.name, value: element?.name})
    //         }
    //         setAllMainCategories(newCategory.sort((a, b) => {
    //             var textA = a.label.toUpperCase();
    //             var textB = b.label.toUpperCase();
    //             return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    //         }))
    //     })
    //     .catch((error) => console.log(error));
    // }, [])

    // useEffect(() => {
    //     if(category?.length > 0) {
    //         const filterCategory: any[] = allCategories.filter((item: any) => category.includes(item.name))
            
    //         if (filterCategory?.length > 0) {
    //             let newSubCategory: string[] = []

    //             for (let i = 0; i < filterCategory?.length; i++) {
    //                 if ("subCategories" in filterCategory[i]) {
    //                     const subCategories = filterCategory[i].subCategories
    //                     if (subCategories?.length > 0) {
    //                         newSubCategory = [...newSubCategory, ...subCategories]
    //                     }
    //                 }
    //             }

    //             setAllSubCategories(newSubCategory.sort((a, b) => {
    //                 var textA = a.toUpperCase();
    //                 var textB = b.toUpperCase();
    //                 return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    //             }))
    //         }
    //     }
    // }, [category])

    useEffect(() => {
        if (props.opened && "data" in props && props.data !== null) {
            const product = props.data
            setValues({
                name: product?.name,
                price: product?.price,
                cost: product?.cost,
                freeShipping: product?.freeShipping,
                colors: product?.colors || [],
                sizes: product?.sizes || [],
                offers: product?.offers || []
            })
            // setCategory(product?.categories)
            // setSubCategory(product?.subCategories)
            setHasOffers(product?.offers?.length > 0)
            setImageSrc(`${process.env.REACT_APP_API_URL_IMAGES}/${product?.image}`)
        }
    }, [props.opened, props.data])

    const onSubmitForm = ({name, price, cost, freeShipping, sizes, colors, offers}: any) => {
            setLoading(true)
            let data = new FormData();
            data.append('name', name);
            data.append('price', price);
            data.append('cost', cost);
            data.append('freeShipping', freeShipping);
            data.append('image', image);

            // data.append('categories', category?.length > 0 ? category.join(",") : null);
            // data.append('subCategories', subCategory?.length > 0 ? subCategory.join(",") : null);
    
            data.append('sizes', sizes?.length > 0 ? sizes.join(",") : null);
            data.append('colors', colors?.length > 0 ? colors.join(",") : null);
            data.append('offers', offers?.length > 0 ? JSON.stringify(offers) : JSON.stringify([]));
            
            
            client.put(`/landing-product/${props.data._id}`, data, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': cookies.get('token') || ""
                }
            })
            .then(({data}) => {
                notifications.show({ message: t('modals.updateLandingProduct.alert02'), color: '#fff' });
                console.log(data);
                setLoading(false)
                typeof props?.refetchData == "function" && props?.refetchData()
                closeModal()
            })
            .catch((error) => {
                notifications.show({ message: t('modals.updateLandingProduct.alert02'), color: '#fff' });
                console.log(error)
                setLoading(false)
            });
    }

    const handleThumbnailChange = (files: any) => {
        const file = files?.[0]
        setImage(file)
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event: any) => setImageSrc(event.target.result);
    };
    
    // const removeCategory = (value: string) => {
    //     const filterCategory: any[] = allCategories.filter((item: any) => item.name === value)
            
    //     if (filterCategory?.length > 0 && "subCategories" in filterCategory[0]) {
    //         const subCategories = filterCategory[0].subCategories
    //         let newSubCategory: string[] = []

    //         for (let index = 0; index < subCategories?.length; index++) {
    //             const element = subCategories[index];
    //             newSubCategory.push(element)
    //         }
            
    //         const newSubCategoriesAfterRemove = subCategory.filter((item: any) => !newSubCategory.includes(item))
    //         setSubCategory(newSubCategoriesAfterRemove)
    //     }            
    // }

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
                    <Grid gutter={20} justify="flex-start">
                        <Grid.Col span={12} >
                            <TextInput
                                label={t('modals.updateLandingProduct.label01')}
                                placeholder={t('modals.updateLandingProduct.placeholder01')}
                                withAsterisk
                                {...getInputProps("name")}
                            />
                        </Grid.Col>

                        <Grid.Col span={{base: 12, md: 6}} >
                            <NumberInput
                                label={t('modals.updateLandingProduct.label02')}
                                placeholder={t('modals.updateLandingProduct.placeholder02')}
                                withAsterisk
                                {...getInputProps("price")}
                            />
                        </Grid.Col>
                        <Grid.Col span={{base: 12, md: 6}} >
                            <NumberInput
                                label={t('modals.updateLandingProduct.label03')}
                                placeholder={t('modals.updateLandingProduct.placeholder03')}
                                withAsterisk
                                {...getInputProps("cost")}
                            />
                        </Grid.Col>
                        
                        

                        {/* <Grid.Col  span={{base: 12, md: 6}}>
                            <MultiSelect
                                label={"الفئة"}
                                placeholder="إختار فئة المنتج او مجموعة الفئات"
                                value={category} onChange={setCategory}
                                data={allMainCategories}
                                onRemove={removeCategory}
                            />
                        </Grid.Col>
                        <Grid.Col  span={{base: 12, md: 6}}>
                            <MultiSelect
                                label={"الفئة الفرعية"}
                                placeholder="اختر القئات الفرعية للمنتج بعد اختيار الفئة الرئيسية"
                                value={subCategory} onChange={setSubCategory}
                                data={allSubCategories}
                            />
                        </Grid.Col> */}

                        <Grid.Col  span={{base: 12, md: 6}} >
                            <TagsInput
                                label={t('modals.updateLandingProduct.label04')}
                                placeholder={t('modals.updateLandingProduct.placeholder04')}
                                {...getInputProps("sizes")}
                            />
                        </Grid.Col>

                        <Grid.Col span={12} >
                            <Checkbox.Group
                                label={t('modals.updateLandingProduct.label05')}
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

                        <Grid.Col span={{base: 12, md: 6}} >
                            <Switch
                                labelPosition="left"
                                label={t('modals.updateLandingProduct.label06')}
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
                                label={t('modals.updateLandingProduct.label07')}
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
                                                {t('modals.updateLandingProduct.addOffer')}
                                            </Button>
                                        }
                                        labelPosition="left"
                                    />

                                    {values.offers.map((item, index) => (
                                        <Grid key={index} className={classes.cardOffer}>
                                            <Group gap={5} className={classes.btnOffer}>
                                                <Text size="xs" c={'#323232'}>{t('modals.updateLandingProduct.labelOffer')} {index + 1}</Text>
                                                <ActionIcon
                                                    variant="transparent" color={'red'} size={"xs"}
                                                    onClick={() => removeListItem('offers', index)}
                                                >
                                                    <IconTrash size={18}/>
                                                </ActionIcon>
                                            </Group>
                                            
                                            <Grid.Col span={6} >
                                                <TextInput
                                                    label={t('modals.updateLandingProduct.label09')}
                                                    placeholder={t('modals.updateLandingProduct.placeholder09')}
                                                    {...getInputProps(`offers.${index}.name`)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={6} >
                                                <NumberInput
                                                    label={t('modals.updateLandingProduct.label10')}
                                                    placeholder={t('modals.updateLandingProduct.placeholder10')}
                                                    withAsterisk
                                                    {...getInputProps(`offers.${index}.price`)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={6} >
                                                <NumberInput
                                                    label={t('modals.updateLandingProduct.label11')}
                                                    placeholder={t('modals.updateLandingProduct.placeholder11')}
                                                    withAsterisk
                                                    {...getInputProps(`offers.${index}.quantity`)}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={6} style={{alignSelf: "end"}}>
                                                <Switch
                                                    labelPosition="left"
                                                    label={t('modals.updateLandingProduct.label12')}
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
                            <label style={{marginBottom: 20, fontSize: 16}}>{t('modals.updateLandingProduct.label13')}</label>
                            <Dropzone
                                onDrop={handleThumbnailChange}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={10 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                multiple={false}
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
                                        {imageSrc
                                            ? <Image src={imageSrc} alt="Uploaded Image" height={350} />
                                            : <Stack align="center" justify="center" gap={2}>
                                                <IconCloudUpload size={40} style={{ color: 'var(--mantine-color-gray-8)' }} stroke={1} />
                                                <Text size="lg" mt={20}>{t('modals.updateLandingProduct.text01Dropzone')}</Text>
                                                <Text size="sm" c="dimmed">{t('modals.updateLandingProduct.text02Dropzone')}</Text>
                                            </Stack>
                                        }
                                    </Dropzone.Idle>
                                </Group>
                            </Dropzone>
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};