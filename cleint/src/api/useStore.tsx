import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface _Props {
    id: string;
}

export const useStore = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/store`);
            
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