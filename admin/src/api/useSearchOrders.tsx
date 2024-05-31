import { useCallback, useEffect, useState } from "react";
import { client } from "../lib/axiosClient";
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });


export const useSearchOrders = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async (status: string, search: string) => {
        setLoading(true);
        try {
            const response = await client.get(`/ordersBySearch/${status}/${search}`, {
                headers: {
                'Accept': 'application/json',
                'Authorization': cookies.get('token') || ""
                }
            });
            
            if (response.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            setData(response?.data)
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const refetch = (status: string, search: string) => {
        fetchData(status, search);
    };

    return { data, loading, error, fetchData, refetch };
}