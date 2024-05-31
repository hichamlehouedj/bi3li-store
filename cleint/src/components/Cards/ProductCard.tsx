import { Card, Image, Text, Group, Badge, Button, ActionIcon } from '@mantine/core';
import classes from './../../styles/ProductCard.module.css';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { IconShoppingCart, IconStarFilled } from '@tabler/icons-react';
import useStore from '../../store/useStore';


interface Props {
  id: string;
  title: string;
  image: string;
  price: number;
  priceAfterDiscount: number;
  rating?: number;
}

export function ProductCard({ id, image, title, price, priceAfterDiscount, rating }: Props) {
    const matches = useMediaQuery('(max-width: 36em)');
    const dataStore = useStore((state: any) => state.store);

    return (
        <Card withBorder radius={0} p="md" className={classes.card}>
            <Card.Section style={{position: 'relative'}}>
                <Image src={image} alt={title} width={"100%"} height={220} mah={220} fit={'fill'}  />
                {priceAfterDiscount > 0
                    ? <Badge variant="filled" color={dataStore?.information?.backgroundColor || "#645cbb"}  c={dataStore?.information?.textColor || "#fff"}  size='lg' className={classes.badge} radius={0}>
                        تخفيض
                    </Badge>
                    : null
                }

                {rating && rating > 0
                    ? <Badge variant="filled" color={"#fff"}  size='md' className={classes.rating} radius={10}>
                        <Group gap={3} justify='center' align='center'>
                            <IconStarFilled size={16} style={{color: "#f7ce2a"}} />
                            <Text size={"xs"} c={"#121212"} > {rating} </Text>
                        </Group>
                    </Badge>
                    : null
                }

                
            </Card.Section>
        
            <Card.Section className={classes.section} mt="sm" mb={0}>
                <Text size={matches ? "sm" : "md"} fw={600} component={Link} to={`/product/${id}`} className={classes.link}>
                    {title}
                </Text>

                <Group gap={10} justify='center'>
                    <Text size={matches ? "xs" : "sm"} fw={600} className={classes.label} c={dataStore?.information?.backgroundColor || "#645cbb"}>
                        {priceAfterDiscount > 0 ? priceAfterDiscount : price} د.ج
                    </Text>
                    {priceAfterDiscount > 0 
                        ? <Text size={matches ? "xs" : "sm"} fw={400} className={classes.label} c="gray.5" td="line-through">
                            {price} د.ج
                        </Text>
                        : null
                    }
                </Group>
                <Group flex={"auto"} mt={"xs"} align='flex-end'>
                    <Button 
                        variant='filled' radius={0} style={{ flex: 1 }} color={dataStore?.information?.backgroundColor || "#645cbb"} id='btn'
                        component={Link} to={`/product/${id}`}   c={dataStore?.information?.textColor || "#fff"}
                        rightSection={<IconShoppingCart size={20} />}
                    >
                        اشتري الآن
                    </Button>
                </Group>
            </Card.Section>
        </Card>
    );
}