import { useCallback, useEffect, useState } from "react";
import { client } from "../lib/axiosClient";
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

export const useStatistics = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await client.get(`/store/statistics`, {
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
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

      
    return { data, loading, error, refetch };
}