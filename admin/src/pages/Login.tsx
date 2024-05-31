import React, { useEffect, useState } from 'react';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Alert,
  } from '@mantine/core';
import classes from './../styles/AuthenticationTitle.module.css';
import { useForm, zodResolver } from '@mantine/form';
import { client } from '../lib/axiosClient';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { IconInfoCircle } from '@tabler/icons-react';

const cookies = new Cookies(null, { path: '/' });

export function Login () {
    const { t, i18n, ready } = useTranslation();
    const navigate = useNavigate();

    const schema = z.object({
        email: z.string({message: t('loginPage.schemaEmail')}).email({message: t('loginPage.schemaEmail2')}).min(2, { message: t('loginPage.schemaEmail3') }),
        password: z.string({message: t('loginPage.schemaPassword')}).min(0, { message: t('loginPage.schemaPassword') }),
    });
    const {getInputProps, reset, onSubmit, setValues} = useForm({
        initialValues: {email: "", password: ""},
        validate: zodResolver(schema),
        validateInputOnBlur: true,
        validateInputOnChange: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<boolean |string>(false);

    const onSubmitForm = ({email, password}: any) => {
        setLoading(true)
        client.post('/users/log-in', {
            "email": email,
            "password": password
        })
        .then(({data, status, statusText}) => {
            if ("token" in data && "user" in data) {
                cookies.set('token', data?.token);
                cookies.set('id', data?.user?._id);
                cookies.set('name', data?.user?.name);
                cookies.set('email', data?.user?.email);
                cookies.set('role', data?.user?.role);
                navigate("/dashboard/");
                reset()
                setLoading(false)
            } else {
                if (data.code === "EMAIL_NOT_FOUND") {
                    setError(t('loginPage.alert01'))
                } else if (data.code === "PASSWORD_INCORRECT") {
                    setError(t('loginPage.alert02'))
                } else if (data.code === "EMAIL_NOT_VERIFY") {
                    setError(t('loginPage.alert03'))
                } else if (data.code === "ACCOUNT_NOT_ACTIVE") {
                    setError(t('loginPage.alert04'))
                } else {
                    setError(false)
                }
                setLoading(false)
            }
        })
        .catch((error) => {
            console.log(error)
            setLoading(false)
        });
    }

    return (
        <Container size={420} h={"100vh"} display={'flex'} style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <Title ta="center" className={classes.title}>
                {t('loginPage.Title')}
            </Title>
    
            <form onSubmit={onSubmit(onSubmitForm)} >
                <Paper withBorder shadow="md" p={30} mt={30} radius="md" miw={"30vw"}>
                    {error !== false
                        ? <Alert variant="light" color="red" title={error} icon={<IconInfoCircle />} />
                        : null
                    }
                    

                    <TextInput 
                        label={t('loginPage.label01')}
                        placeholder={t('loginPage.placeholder01')}
                        required
                        {...getInputProps("email")} 
                    />
                    <PasswordInput
                        label={t('loginPage.label02')}
                        placeholder={t('********')}
                        required mt="md"
                        {...getInputProps("password")}
                    />
                    <Button loading={loading} type='submit' fullWidth mt="xl">{t('loginPage.submit')}</Button>
                </Paper>
            </form>
        </Container>
    );
}