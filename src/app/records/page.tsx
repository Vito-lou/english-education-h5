'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Calendar, TrendingDown, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuthStore } from '@/stores/auth'
import { useRecords } from '@/stores/records'
import { useEffect, useState } from 'react'
import { formatDate, formatDateTime } from '@/lib/utils'

// 临时学生ID - 实际应用中应该从路由参数或用户状态获取
const TEMP_STUDENT_ID = 8

export default function RecordsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const {
    loading,
    error,
    summary,
    records,
    hasMore,
    getStatusColor,
    formatStatus,
    fetchClassHoursSummary,
    loadMoreRecords,
    reset
  } = useRecords()

  const [refreshing, setRefreshing] = useState(false)

  // 下拉刷新处理
  const handleRefresh = async () => {
    setRefreshing(true)
    reset() // 重置状态
    await fetchClassHoursSummary(TEMP_STUDENT_ID)
    setRefreshing(false)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      // 获取课时统计数据
      fetchClassHoursSummary(TEMP_STUDENT_ID)
    }
  }, [isAuthenticated]) // 移除 fetchClassHoursSummary 依赖

  if (!isAuthenticated || !user) {
    return null
  }

  // 加载状态
  if (loading && !summary) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    )
  }

  // 错误状态
  if (error && !summary) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchClassHoursSummary(TEMP_STUDENT_ID)}>
              重试
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 头部 */}
      <motion.header
        className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">
                课时记录
              </h1>
              <p className="text-sm text-gray-500">
                {summary.name}的学习记录
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing || loading}
            >
              {refreshing ? '刷新中...' : '刷新'}
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="px-4 py-6 space-y-6">


        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="text-center py-4">
                <div className="text-lg font-bold text-blue-600 mb-1">
                  {summary.total_lessons}
                </div>
                <p className="text-xs text-gray-600">
                  总课时
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-4">
                <div className="text-lg font-bold text-orange-600 mb-1">
                  {summary.used_lessons}
                </div>
                <p className="text-xs text-gray-600">
                  已消耗
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-4">
                <div className="text-lg font-bold text-green-600 mb-1">
                  {summary.remaining_lessons}
                </div>
                <p className="text-xs text-gray-600">
                  剩余
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>



        {/* 上课记录列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            上课记录
          </h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <LoadingSpinner />
                <p className="text-gray-500 mt-2">加载中...</p>
              </div>
            ) : !records || records.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">暂无上课记录</p>
                </CardContent>
              </Card>
            ) : (
              records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card>
                    <CardContent>
                      <div className="space-y-3">
                        {/* 头部信息 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${record.record_type === 'manual'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600'
                              }`}>
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {record.course_name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {record.teacher_name}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.attendance_status)}`}>
                              {formatStatus(record.attendance_status)}
                            </span>
                            {record.record_type === 'manual' && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                手动补录
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 详细信息 */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {record.schedule_date} {record.time_range}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingDown className="w-4 h-4 text-red-400" />
                            <span className="text-gray-600">
                              扣除 {record.deducted_lessons} 课时
                            </span>
                          </div>
                        </div>

                        {/* 备注 */}
                        {record.teacher_notes && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">备注：</span>
                              {record.teacher_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* 加载更多 */}
        {records.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            {hasMore ? (
              <Button
                variant="secondary"
                onClick={() => loadMoreRecords(TEMP_STUDENT_ID)}
                disabled={loading}
              >
                {loading ? '加载中...' : '加载更多记录'}
              </Button>
            ) : (
              <p className="text-gray-500 text-sm">没有更多记录了</p>
            )}
          </motion.div>
        )}
      </div>
    </main>
  )
}
