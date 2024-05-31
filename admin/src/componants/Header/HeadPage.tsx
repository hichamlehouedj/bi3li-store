import { Breadcrumbs, Anchor, Group, Stack, Text, Button } from '@mantine/core';
import { IconChevronLeft, IconLogout, IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './../../styles/HeadPage.module.css';

interface Props {
    page: string;
    links: {title: string, href: string}[]
    labelCreate?: string;
    labelExport: string;
    onCreate: () => void;
    onExport: () => void;

    hiddenExport?: boolean;
}

export function HeadPage({page, links, labelCreate, labelExport, onCreate, onExport, hiddenExport}: Props) {

    
    const openModal = () => {
        console.log("openModal");
        
        onCreate()
    };

    return (
        <Group justify='space-between' align='flex-end' mb={20} >
            <Stack gap={5}>
                <Text size='24px' c={"#333843"} fw={600}>{page}</Text>
                <Breadcrumbs separator={<IconChevronLeft size={16}/>} separatorMargin={3} >
                    {links.map((item, index) => (
                        index !== links.length - 1
                            ? <Link 
                                key={index} to={item.href} className={classes.link}
                                data-active={index !== links.length - 1 ? true : undefined}
                            >
                                {item.title}
                            </Link>
                            : <Text key={index} className={classes.lastLink}>{item.title}</Text>
                    ))}
                </Breadcrumbs>
            </Stack>
            <Group justify='space-between' align='flex-end' gap={5}>
                {!hiddenExport
                    ? <Button 
                        variant={labelCreate ? "transparent" : "filled"}
                        color={'#323232'} px={10}
                        leftSection={<IconLogout style={{transform: "rotate(-90deg)"}} size={18}/>}
                        onClick={() => onExport()}
                    >
                        {labelExport}
                    </Button>
                    : null
                }
                
                {labelCreate
                    ? <Button
                        variant="filled" color={'#323232'} px={10}
                        leftSection={<IconPlus size={18}/>}
                        onClick={() => onCreate()}
                      >
                        {labelCreate}
                    </Button>
                    : null
                }
            </Group>
        </Group>
    );
}