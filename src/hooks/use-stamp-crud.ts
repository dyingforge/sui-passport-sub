'use client'

import { useState } from 'react'
import { apiFetch } from '~/lib/apiClient'
import type { VerifyClaimStampResponse, DbStampResponse, VerifyClaimStampRequest} from '~/types/stamp'

export function useStampCRUD() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getStamps = async () => {
    try {
      setIsLoading(true)
      const response = await apiFetch<{ results: DbStampResponse[] }>(`/api/stamps`,{
        method: 'GET'
      })
      return response.results as DbStampResponse[]
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch claim stamps'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }
  const verifyClaimStamp = async (data: VerifyClaimStampRequest) => {
    try {
      const response = await apiFetch<VerifyClaimStampResponse>(`/api/stamps/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return response
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to verify claim stamp'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    getStamps,
    verifyClaimStamp
  }
}