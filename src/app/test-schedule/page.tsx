'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { studentApi } from '@/lib/api'

export default function TestSchedulePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testAPI = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Testing schedule API...')
      const response = await studentApi.getSchedule(1, {
        date_from: '2024-01-01',
        date_to: '2024-12-31'
      })
      
      console.log('API Response:', response.data)
      setResult(response.data)
    } catch (err: any) {
      console.error('API Error:', err)
      setError(err.response?.data?.message || err.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">课程表API测试</h1>
      
      <div className="mb-4">
        <Button 
          onClick={testAPI} 
          disabled={loading}
          className="mr-4"
        >
          {loading ? '测试中...' : '测试课程表API'}
        </Button>
        
        <Button 
          onClick={() => {
            setResult(null)
            setError(null)
          }}
          variant="outline"
        >
          清空结果
        </Button>
      </div>

      {error && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-red-600 mb-2">错误信息</h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">API响应结果</h3>
            <div className="space-y-4">
              <div>
                <strong>Success:</strong> {result.success ? '✅' : '❌'}
              </div>
              <div>
                <strong>Message:</strong> {result.message}
              </div>
              {result.data && (
                <div>
                  <strong>Data:</strong>
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-96">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
