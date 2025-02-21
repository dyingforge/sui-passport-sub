/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { apiFetch } from '~/lib/apiClient';
import { useState } from 'react';
import { type DbUserResponse } from '~/types/userProfile';   


interface DbResponse<T> {
    success: boolean;
    data?: {
        success: boolean;
        meta:unknown;
        results: T[];
    };
    error?: string;
}

interface UseUserCrudReturn {
    isLoading: boolean;
    error: string | null;
    users: DbUserResponse[];
    fetchUsers: () => Promise<DbUserResponse[] | undefined>;
    fetchUserByAddress: (address: string) => Promise<DbResponse<DbUserResponse> | null>;
}

export function useUserCrud(): UseUserCrudReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<DbUserResponse[]>([]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiFetch<DbResponse<DbUserResponse>>('/api/user', {
                method: 'GET'
            })
            console.log("fetchUsers data", response)
            if (!response.success) {
                throw new Error(response.error);
            }
            setUsers(response.data?.results ?? []);
            return response.data?.results ?? [];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserByAddress = async (address: string): Promise<DbResponse<DbUserResponse> | null> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiFetch<DbResponse<DbUserResponse>>(`/api/user/id?address=${address}`, {
                method: 'GET',
            })
            console.log("fetchUserByAddress data", response);
            if (!response.success) {
                setError(response.error ?? 'Failed to fetch user');
                return response;
            }
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // const createNewUser = async (user: CreateUser): Promise<DbResponse | null> => {
    //     try {
    //         setIsLoading(true);
    //         setError(null);
    //         const response = await apiFetch<DbResponse>('/api/user', {
    //             method: 'POST',
    //             body: JSON.stringify(user)
    //         })
    //         const data = await response
    //         if (!data.success) {
    //             setError(data.error ?? 'Failed to create user');
    //             return data;
    //         }
    //         await fetchUsers(); // 刷新用户列表
    //         return data;
    //     } catch (err) {
    //         setError(err instanceof Error ? err.message : 'Failed to create user');
    //         return null;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const syncUserPoints = async (address: string, points: number) => {
    //     try {
    //         setIsLoading(true);
    //         setError(null);
    //         const response = await apiFetch<DbResponse>('/api/user/points', {
    //             method: 'PATCH',
    //             body: JSON.stringify({ address, points })
    //         })
    //         const data = await response
    //         if (!data.success) {
    //             setError(data.error ?? 'Failed to sync user points');
    //             return data;
    //         }
    //         return data;
    //     } catch (err) {
    //         setError(err instanceof Error ? err.message : 'Failed to sync user points');
    //         return null;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    return {
        isLoading,
        error,
        users,
        fetchUsers,
        fetchUserByAddress,
    };
}