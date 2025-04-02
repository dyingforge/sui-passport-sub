/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { apiFetch } from '~/lib/apiClient';
import { useCallback, useState } from 'react';
import { type CreateUserParams, type DbUserResponse } from '~/types/userProfile';


interface DbResponse<T> {
    success: boolean;
    meta: unknown;
    results: T[];
}

interface UseUserCrudReturn {
    isLoading: boolean;
    error: string | null;
    users: DbUserResponse[];
    fetchUsers: () => Promise<DbUserResponse[] | undefined>;
    fetchUserByAddress: (address: string) => Promise<DbResponse<DbUserResponse> | null>;
    createOrUpdateUser: (user: CreateUserParams) => Promise<DbResponse<DbUserResponse> | null>;
    verifyCaptcha: (token: string) => Promise<boolean>;
}

export function useUserCrud(): UseUserCrudReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<DbUserResponse[]>([]);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiFetch<DbResponse<DbUserResponse>>('/api/user', {
                method: 'GET'
            })
            console.log("fetchUsers data", response);
            if (!response.success) {
                throw new Error("Failed to fetch users");
            }
            if (response.results) {
                setUsers(response.results);
            }
            return response.results;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUserByAddress = useCallback(async (address: string): Promise<DbResponse<DbUserResponse> | null> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiFetch<DbResponse<DbUserResponse>>(`/api/user/id?address=${address}`, {
                method: 'GET',
            })
            console.log("fetchUserByAddress data", response);
            if (!response.success) {
                setError("Failed to fetch user");
                return response;
            }
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

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

    const createOrUpdateUser = useCallback(async (user: CreateUserParams): Promise<DbResponse<DbUserResponse> | null> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiFetch<DbResponse<DbUserResponse>>('/api/user', {
                method: 'POST',
                body: JSON.stringify(user)
            })
            if (!response.success) {
                setError("Failed to create user");
                return response;
            }
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create user');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const verifyCaptcha = useCallback(async (token: string): Promise<boolean> => {
        try {
            const response = await apiFetch<{ success: boolean }>('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token })
            })
            return response.success;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to verify captcha');
            return false;
        }
    }, []);

    return {
        isLoading,
        error,
        users,
        fetchUsers,
        fetchUserByAddress,
        createOrUpdateUser,
        verifyCaptcha,
    };
}