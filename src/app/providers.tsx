'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 移动端优化的查询配置
            staleTime: 5 * 60 * 1000, // 5分钟
            gcTime: 10 * 60 * 1000, // 10分钟 (原 cacheTime)
            retry: (failureCount, error: any) => {
              // 网络错误重试，其他错误不重试
              if (error?.code === 'NETWORK_ERROR') {
                return failureCount < 2
              }
              return false
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false,
          },
        },
      })
  )

  // 确保在客户端渲染时才显示内容，避免hydration错误
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
