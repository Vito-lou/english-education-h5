'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Clock, CheckCircle, AlertCircle, Filter, Search } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/student'
import { homeworkApi } from '@/lib/api'
import type { HomeworkAssignment } from '@/lib/utils'

export default function HomeworkPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { currentStudent } = useStudentStore()
  const router = useRouter()
  
  const [homework, setHomework] = useState<HomeworkAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'submitted' | 'overdue'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (!currentStudent) {
      router.push('/dashboard')
      return
    }
    
    fetchHomework()
  }, [isAuthenticated, currentStudent, statusFilter, currentPage])

  const fetchHomework = async () => {
    if (!currentStudent) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await homeworkApi.getStudentHomework(currentStudent.id, {
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: currentPage,
        per_page: 10,
      })
      
      if (response.data.success) {
        setHomework(response.data.data)
        setTotalPages(response.data.pagination?.last_page || 1)
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      console.error('获取作业列表失败:', err)
      setError('获取作业列表失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (assignment: HomeworkAssignment) => {
    if (assignment.submission) {
      if (assignment.submission.status === 'graded') {
        return <CheckCircle className="w-5 h-5 text-green-500" />
      }
      return <CheckCircle className="w-5 h-5 text-blue-500" />
    }
    
    if (assignment.is_expired) {
      return <AlertCircle className="w-5 h-5 text-red-500" />
    }
    
    return <Clock className="w-5 h-5 text-orange-500" />
  }

  const getStatusText = (assignment: HomeworkAssignment) => {
    if (assignment.submission) {
      if (assignment.submission.status === 'graded') {
        return '已批改'
      }
      return assignment.submission.status === 'late' ? '迟交' : '已提交'
    }
    
    if (assignment.is_expired) {
      return '已过期'
    }
    
    return '待完成'
  }

  const getStatusColor = (assignment: HomeworkAssignment) => {
    if (assignment.submission) {
      if (assignment.submission.status === 'graded') {
        return 'text-green-600 bg-green-50'
      }
      return 'text-blue-600 bg-blue-50'
    }
    
    if (assignment.is_expired) {
      return 'text-red-600 bg-red-50'
    }
    
    return 'text-orange-600 bg-orange-50'
  }

  const filteredHomework = homework.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.class.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isAuthenticated || !currentStudent) {
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
                课后作业
              </h1>
              <p className="text-sm text-gray-500">
                {currentStudent.name}的作业列表
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="px-4 py-6">
        {/* 搜索和筛选 */}
        <motion.div
          className="space-y-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索作业标题或班级..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 状态筛选 */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: '全部', count: homework.length },
              { key: 'pending', label: '待完成', count: homework.filter(h => !h.submission && !h.is_expired).length },
              { key: 'submitted', label: '已提交', count: homework.filter(h => h.submission).length },
              { key: 'overdue', label: '已过期', count: homework.filter(h => !h.submission && h.is_expired).length },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => {
                  setStatusFilter(filter.key as any)
                  setCurrentPage(1)
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  statusFilter === filter.key
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* 作业列表 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  加载失败
                </h3>
                <p className="text-gray-500 mb-4">
                  {error}
                </p>
                <Button onClick={fetchHomework}>
                  重试
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : filteredHomework.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  暂无作业
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? '没有找到匹配的作业' : '老师还没有布置作业'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredHomework.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card 
                  clickable 
                  onClick={() => router.push(`/homework/${assignment.id}`)}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent>
                    <div className="space-y-3">
                      {/* 作业头部 */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {assignment.class.name} • {assignment.creator.name}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(assignment)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                            {getStatusText(assignment)}
                          </span>
                        </div>
                      </div>

                      {/* 作业要求预览 */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {assignment.requirements}
                      </p>

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>截止时间: {assignment.due_date_formatted}</span>
                        {assignment.submission && assignment.submission.score !== null && (
                          <span className="text-green-600 font-medium">
                            得分: {assignment.submission.score}/{assignment.submission.max_score}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <motion.div
            className="flex justify-center space-x-2 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <span className="flex items-center px-3 text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  )
}
