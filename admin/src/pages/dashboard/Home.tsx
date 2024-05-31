import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Box, Grid, Group, Image, Paper, SimpleGrid, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconBox, IconCurrencyDollar, IconExternalLink, IconShoppingBag } from '@tabler/icons-react';
import classes from './../../styles/StatsSegments.module.css';
import { LandingProductsStatisticsTabel, ProductsStatisticsTabel } from '../../componants/Tables';
import { useStatistics } from '../../api';
import { DonutChart } from '@mantine/charts';
import { useTranslation } from 'react-i18next';

const cookies = new Cookies(null, { path: '/' });

export function Home () {
    const { t } = useTranslation();
    const [statistics, setStatistics] = useState<any>(null);
    const theme = useMantineTheme();
    const {loading, error, data: dataStatistics, refetch} = useStatistics()
    const [role, setRole] = useState("");

    useEffect(() => {
        if (cookies.get('role')) {
            setRole(cookies.get('role'))
        }
    }, [cookies.get('role')])
    
    useEffect(() => {
        if (dataStatistics) {
            setStatistics(dataStatistics)
        }
    }, [dataStatistics])
    
    return (
        <Grid>
            <Grid.Col span={12}>
                <Box w={"100%"} h={190} bg={"#fff"} p={20}>
                    <Group justify='space-between' wrap='nowrap'>
                        <Stack justify='space-between' h={150}>
                            <Stack gap={15}>
                                <Text size='26px' fw={600} c={"dark.7"}>{t('homePage.title')} {cookies.get("name")} 👋</Text>
                                <Text size='sm' c={"gray.5"}>{t('homePage.description')}</Text>
                            </Stack>

                            <Text 
                                size='16px' c={"#323232"}
                                component='a'
                                target='_blank'
                                href={process.env.REACT_APP_STORE_URL}
                            >
                                <IconExternalLink size={14} style={{marginLeft: 2}} />
                                {t('homePage.link')}
                            </Text>
                        </Stack>
                        <Image src={"/header.png"} height={150} width={"auto"} visibleFrom='md' />
                    </Group>
                </Box>
            </Grid.Col>

            <Grid.Col span={12} mb={10}>
                <Text fz="xl" fw={600}>{t('homePage.sectionTitel01')}</Text>
            </Grid.Col>

            {["admin"].includes(role)
                ? <Grid.Col span={{base: 12, md: 4}}>
                    <Paper withBorder p="md" radius="md">
                        <Group justify="space-between">
                            <Text fz="lg" fw={700}>{t('homePage.statisticCard01.title')}</Text>
                            <IconCurrencyDollar size="1.4rem" className={classes.icon} stroke={1.5} />
                        </Group>

                        <Text c="dimmed" fz="sm">
                            {t('homePage.statisticCard01.statisticsTotal')} {statistics?.incomes?.todayIncome} {t("currency")}
                        </Text>

                        <SimpleGrid bg={theme.colors.gray[0]} p={10} cols={{ base: 1 }} mt="xl" style={{justifyItems: 'center', gap: 0}}>
                            <DonutChart
                                withLabelsLine withLabels
                                data={[
                                    { name: t('homePage.statisticCard01.statistic01'), value: statistics?.incomes?.sales, color: 'yellow' },
                                    { name: t('homePage.statisticCard01.statistic02'), value: statistics?.incomes?.netProfit, color: 'teal' }
                                ]} 
                            />
                            <Group justify='center'>
                                <Group gap={2} align='center'>
                                    <Box bg={'yellow'} w={14} h={14} style={{borderRadius: "50%"}} />
                                    <Text size='sm'>{t('homePage.statisticCard01.statistic01')}</Text>
                                </Group>
                                <Group gap={2} align='center'>
                                    <Box bg={'teal'} w={14} h={14} style={{borderRadius: "50%"}} />
                                    <Text size='sm'>{t('homePage.statisticCard01.statistic02')}</Text>
                                </Group>
                            </Group>
                        </SimpleGrid>
                    </Paper>
                </Grid.Col>
                : null
            }
            
            <Grid.Col span={{base: 12, md: 4}}>
                <Paper withBorder p="md" radius="md">
                    <Group justify="space-between">
                        <Text fz="lg" fw={700}>{t('homePage.statisticCard02.title')}</Text>
                        <IconShoppingBag size="1.4rem" className={classes.icon} stroke={1.5} />
                    </Group>

                    <Text c="dimmed" fz="sm">
                        {t('homePage.statisticCard02.statisticsTotal')} {statistics?.orders?.total || 0}
                    </Text>

                    <SimpleGrid bg={theme.colors.gray[0]} p={10} cols={{ base: 1 }} mt="xl" style={{justifyItems: 'center', gap: 0}}>
                        <DonutChart
                            withLabelsLine withLabels
                            data={[
                                { name: t('homePage.statisticCard02.statistic01'), value: statistics?.orders?.confirmed, color: 'teal' },
                                { name: t('homePage.statisticCard02.statistic02'), value: statistics?.orders?.pending, color: 'yellow' },
                                { name: t('homePage.statisticCard02.statistic03'), value: statistics?.orders?.closed, color: 'red' }
                            ]} 
                        />
                        <Group justify='center'>
                            <Group gap={2} align='center'>
                                <Box bg={'teal'} w={14} h={14} style={{borderRadius: "50%"}} />
                                <Text size='sm'>{t('homePage.statisticCard02.statistic01')}</Text>
                            </Group>
                            <Group gap={2} align='center'>
                                <Box bg={'yellow'} w={14} h={14} style={{borderRadius: "50%"}} />
                                <Text size='sm'>{t('homePage.statisticCard02.statistic02')}</Text>
                            </Group>
                            <Group gap={2} align='center'>
                                <Box bg={'red'} w={14} h={14} style={{borderRadius: "50%"}} />
                                <Text size='sm'>{t('homePage.statisticCard02.statistic03')}</Text>
                            </Group>
                        </Group>
                    </SimpleGrid>
                </Paper>
            </Grid.Col>

            {["admin"].includes(role)
                ? <Grid.Col span={{base: 12, md: 4}}>
                    <Paper withBorder p="md" radius="md">
                        <Group justify="space-between">
                            <Text fz="lg" fw={700}>{t('homePage.statisticCard03.title')}</Text>
                            <IconBox size="1.4rem" className={classes.icon} stroke={1.5} />
                        </Group>

                        <Text c="dimmed" fz="sm">
                            {t('homePage.statisticCard03.statisticsTotal')} {statistics?.products?.total}
                        </Text>

                        <SimpleGrid bg={theme.colors.gray[0]} p={10} cols={{ base: 1 }} mt="xl" style={{justifyItems: 'center', gap: 0}}>
                            <DonutChart
                                withLabelsLine withLabels
                                data={[
                                    { name: t('homePage.statisticCard03.statistic01'), value: statistics?.products?.publish, color: 'teal' },
                                    { name: t('homePage.statisticCard03.statistic02'), value: statistics?.products?.notPublish, color: 'red' }
                                ]}
                            />
                            <Group justify='center'>
                                <Group gap={2} align='center'>
                                    <Box bg={'teal'} w={14} h={14} style={{borderRadius: "50%"}} />
                                    <Text size='sm'>{t('homePage.statisticCard03.statistic01')}</Text>
                                </Group>
                                <Group gap={2} align='center'>
                                    <Box bg={'red'} w={14} h={14} style={{borderRadius: "50%"}} />
                                    <Text size='sm'>{t('homePage.statisticCard03.statistic02')}</Text>
                                </Group>
                            </Group>
                        </SimpleGrid>
                    </Paper>
                </Grid.Col>
                : null
            }
            {["admin"].includes(role)
                ? <>
                    <Grid.Col span={12} mb={10}>
                        <Text fz="xl" fw={600}>{t('homePage.sectionTitel02')}</Text>
                    </Grid.Col>
    
                    <Grid.Col span={12} mb={10}>
                        <ProductsStatisticsTabel
                            data={statistics?.bestSellerProducts}
        
                            loading={loading}
                        />
                    </Grid.Col>
        
                    <Grid.Col span={12} mb={10}>
                        <Text fz="xl" fw={600}>{t('homePage.sectionTitel03')}</Text>
                    </Grid.Col>
        
                    <Grid.Col span={12} mb={10}>
                        <LandingProductsStatisticsTabel
                            data={statistics?.bestSellerLandingProducts}
        
                            loading={loading}
                        />
                    </Grid.Col>
                </>
                : null
            }
        </Grid>
    );
}

/*
{
    "incomes": {
        "sales": 18498,
        "todayIncome": 0,
        "netProfit": 5898
    },
}
*/