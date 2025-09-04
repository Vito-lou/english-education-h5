'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ScheduleDetailModal } from '@/components/ui/ScheduleDetailModal'
import { MobileScheduleCard, UpcomingScheduleCard } from '@/components/ui/MobileScheduleCard'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/student'
import { studentApi } from '@/lib/api'
import type { StudentSchedule, Schedule } from '@/lib/utils'

export default function SchedulePage() {
  const { user, isAuthenticated } = useAuthStore()
  const { students, currentStudent, fetchMyStudents, setCurrentStudent } = useStudentStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scheduleData, setScheduleData] = useState<StudentSchedule | null>(null)
  const [viewMode, setViewMode] = useState<'upcoming' | 'list'>('upcoming')
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // 获取课程表数据
  const fetchSchedule = async (studentId: number, dateFrom?: string, dateTo?: string) => {
    try {
      setLoading(true)
      setError(null)

      // 默认获取当前日期前后各30天的数据
      const defaultDateFrom = dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const defaultDateTo = dateTo || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]



      const response = await studentApi.getSchedule(studentId, {
        date_from: defaultDateFrom,
        date_to: defaultDateTo
      })

      if (response.data.success) {
        setScheduleData(response.data.data)
        console.log('Schedule data:', response.data.data)
      } else {
        setError(response.data.message || '获取课程表失败')
      }
    } catch (err: any) {
      console.error('获取课程表失败:', err)
      setError(err.response?.data?.message || err.message || '网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User authenticated, fetching students...')
      // 首先获取学生信息
      fetchMyStudents()
    }
  }, [isAuthenticated, fetchMyStudents])

  useEffect(() => {
    if (currentStudent) {
      console.log('Current student found:', currentStudent)
      // 有当前学生时获取课程表
      fetchSchedule(currentStudent.id)
    } else if (isAuthenticated) {
      console.log('No current student, but authenticated. Students:', students)
      // 如果没有当前学生但有学生列表，选择第一个
      if (students.length > 0) {
        console.log('Setting first student as current:', students[0])
        setCurrentStudent(students[0])
      }
    }
  }, [currentStudent, isAuthenticated, students])

  // 处理课程点击
  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setIsDetailModalOpen(true)
  }

  // 关闭详情弹窗
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedSchedule(null)
  }





  if (!isAuthenticated || !user) {
    return null
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-500 mt-4">加载课程表中...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-medium">{error}</p>
          </div>
          <Button onClick={() => currentStudent && fetchSchedule(currentStudent.id)}>
            重试
          </Button>
        </div>
      </main>
    )
  }

  const displaySchedules = scheduleData?.schedules || []

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
                课程表
              </h1>
              <p className="text-sm text-gray-500">
                {currentStudent?.name || scheduleData?.student_name}的课程安排
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => currentStudent && fetchSchedule(currentStudent.id)}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="px-4 py-6">
        {/* 视图切换 */}
        <motion.div
          className="flex bg-white rounded-xl p-1 mb-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            onClick={() => setViewMode('upcoming')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${viewMode === 'upcoming'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            即将到来 ({scheduleData?.upcoming_classes.length || 0})
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${viewMode === 'list'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            全部 ({scheduleData?.schedules.length || 0})
          </button>
        </motion.div>

        {/* 课程表内容 */}
        {displaySchedules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  暂无课程安排
                </h3>
                <p className="text-gray-500">
                  当前时间段内没有课程安排
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {viewMode === 'upcoming' ? (
              <div className="space-y-3">
                {(scheduleData?.upcoming_classes || []).map((schedule, index) => (
                  <UpcomingScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    index={index}
                    onClick={handleScheduleClick}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displaySchedules.map((schedule, index) => (
                  <MobileScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    index={index}
                    onClick={handleScheduleClick}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 课程详情弹窗 */}
        <ScheduleDetailModal
          schedule={selectedSchedule}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />
      </div>
    </main>
  )
}
