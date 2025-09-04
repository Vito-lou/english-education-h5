'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Image as ImageIcon,
  Video,
  FileIcon,
  Upload,
  Send
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MediaViewer } from '@/components/ui/MediaViewer'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/student'
import { homeworkApi } from '@/lib/api'
import type { HomeworkAssignment, HomeworkAttachment } from '@/lib/utils'

export default function HomeworkDetailPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { currentStudent } = useStudentStore()
  const router = useRouter()
  const params = useParams()
  const homeworkId = parseInt(params.id as string)

  const [homework, setHomework] = useState<HomeworkAssignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitContent, setSubmitContent] = useState('')
  const [submitFiles, setSubmitFiles] = useState<File[]>([])
  const [mediaViewer, setMediaViewer] = useState<{
    isOpen: boolean
    media: HomeworkAttachment | null
  }>({ isOpen: false, media: null })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!currentStudent) {
      router.push('/dashboard')
      return
    }

    fetchHomeworkDetail()
  }, [isAuthenticated, currentStudent, homeworkId])

  const fetchHomeworkDetail = async () => {
    if (!currentStudent) return

    try {
      setLoading(true)
      setError(null)

      const response = await homeworkApi.getHomeworkDetail(homeworkId, {
        student_id: currentStudent.id,
      })

      if (response.data.success) {
        setHomework(response.data.data)
        // 如果已有提交记录，填充表单
        if (response.data.data.submission) {
          setSubmitContent(response.data.data.submission.content || '')
        }
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      console.error('获取作业详情失败:', err)
      setError('获取作业详情失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSubmitFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSubmitFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!homework || !currentStudent) return

    if (!submitContent.trim() && submitFiles.length === 0) {
      alert('请输入作业内容或上传文件')
      return
    }

    try {
      setSubmitting(true)

      const response = await homeworkApi.submitHomework(homeworkId, {
        student_id: currentStudent.id,
        content: submitContent,
        attachments: submitFiles,
      })

      if (response.data.success) {
        alert('提交成功！')
        fetchHomeworkDetail() // 重新获取详情
        setSubmitFiles([]) // 清空文件列表
      } else {
        alert(response.data.message)
      }
    } catch (err) {
      console.error('提交作业失败:', err)
      alert('提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />
    } else if (type.startsWith('video/')) {
      return <Video className="w-4 h-4" />
    } else {
      return <FileIcon className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const openMediaViewer = (attachment: HomeworkAttachment) => {
    setMediaViewer({ isOpen: true, media: attachment })
  }

  const closeMediaViewer = () => {
    setMediaViewer({ isOpen: false, media: null })
  }

  const getStatusInfo = (assignment: HomeworkAssignment) => {
    if (assignment.submission) {
      if (assignment.submission.status === 'graded') {
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          text: '已批改',
          color: 'text-green-600 bg-green-50'
        }
      }
      return {
        icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
        text: assignment.submission.status === 'late' ? '迟交' : '已提交',
        color: 'text-blue-600 bg-blue-50'
      }
    }

    if (assignment.is_expired) {
      return {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        text: '已过期',
        color: 'text-red-600 bg-red-50'
      }
    }

    return {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      text: '待完成',
      color: 'text-orange-600 bg-orange-50'
    }
  }

  if (!isAuthenticated || !currentStudent) {
    return null
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </main>
    )
  }

  if (error || !homework) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="px-4 py-6">
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                加载失败
              </h3>
              <p className="text-gray-500 mb-4">
                {error || '作业不存在'}
              </p>
              <Button onClick={() => router.back()}>
                返回
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const statusInfo = getStatusInfo(homework)

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
                作业详情
              </h1>
              <p className="text-sm text-gray-500">
                {homework.class.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {statusInfo.icon}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="px-4 py-6 space-y-6">
        {/* 作业信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader title={homework.title} />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">班级:</span>
                  <span className="ml-2 font-medium">{homework.class.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">老师:</span>
                  <span className="ml-2 font-medium">{homework.creator.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">截止时间:</span>
                  <span className="ml-2 font-medium">{homework.due_date_formatted}</span>
                </div>
                <div>
                  <span className="text-gray-500">发布时间:</span>
                  <span className="ml-2 font-medium">
                    {new Date(homework.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {homework.unit && (
                <div className="text-sm">
                  <span className="text-gray-500">关联单元:</span>
                  <span className="ml-2 font-medium">{homework.unit.name}</span>
                </div>
              )}

              {homework.knowledge_points && homework.knowledge_points.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-500">知识点:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {homework.knowledge_points.map((point) => (
                      <span
                        key={point.id}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        {point.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 作业要求 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader title="作业要求" />
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">
                  {homework.requirements}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 作业附件 */}
        {homework.attachments && homework.attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader title="作业附件" />
              <CardContent>
                <div className="space-y-3">
                  {homework.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                        onClick={() => {
                          if (attachment.type.startsWith('image/') || attachment.type.startsWith('video/')) {
                            openMediaViewer(attachment)
                          } else {
                            window.open(attachment.url, '_blank')
                          }
                        }}
                      >
                        {getFileIcon(attachment.type)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.size)}
                            {(attachment.type.startsWith('image/') || attachment.type.startsWith('video/')) &&
                              ' • 点击预览'
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 已提交的作业 */}
        {homework.submission && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader title="我的提交" />
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">提交时间:</span>
                    <span className="ml-2 font-medium">
                      {homework.submission.submitted_at ?
                        new Date(homework.submission.submitted_at).toLocaleString() :
                        '未提交'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">状态:</span>
                    <span className="ml-2 font-medium">
                      {homework.submission.status === 'submitted' ? '已提交' :
                        homework.submission.status === 'late' ? '迟交' : '已批改'}
                    </span>
                  </div>
                </div>

                {homework.submission.content && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">提交内容:</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {homework.submission.content}
                      </p>
                    </div>
                  </div>
                )}

                {homework.submission.attachments && homework.submission.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">提交附件:</h4>
                    <div className="space-y-2">
                      {homework.submission.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div
                            className="flex items-center space-x-3 flex-1 cursor-pointer"
                            onClick={() => {
                              if (attachment.type.startsWith('image/') || attachment.type.startsWith('video/')) {
                                openMediaViewer(attachment)
                              } else {
                                window.open(attachment.url, '_blank')
                              }
                            }}
                          >
                            {getFileIcon(attachment.type)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(attachment.size)}
                                {(attachment.type.startsWith('image/') || attachment.type.startsWith('video/')) &&
                                  ' • 点击预览'
                                }
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(attachment.url, '_blank')}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {homework.submission.status === 'graded' && (
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">得分:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {homework.submission.score}/{homework.submission.max_score}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">批改时间:</span>
                        <span className="ml-2 font-medium">
                          {homework.submission.graded_at ?
                            new Date(homework.submission.graded_at).toLocaleString() :
                            '未批改'
                          }
                        </span>
                      </div>
                    </div>

                    {homework.submission.teacher_feedback && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">老师反馈:</h4>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 whitespace-pre-wrap">
                            {homework.submission.teacher_feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 提交作业表单 */}
        {!homework.is_expired && (!homework.submission || homework.submission.status !== 'graded') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader title={homework.submission ? "重新提交作业" : "提交作业"} />
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    作业内容
                  </label>
                  <textarea
                    value={submitContent}
                    onChange={(e) => setSubmitContent(e.target.value)}
                    placeholder="请输入作业内容..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    上传附件
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          点击上传文件或拖拽文件到此处
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          支持图片、视频、PDF、Word文档，单个文件最大20MB
                        </p>
                      </div>
                    </label>

                    {submitFiles.length > 0 && (
                      <div className="space-y-2">
                        {submitFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file.type)}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              删除
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitting || (!submitContent.trim() && submitFiles.length === 0)}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {homework.submission ? "重新提交" : "提交作业"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* 媒体查看器 */}
      {mediaViewer.media && (
        <MediaViewer
          isOpen={mediaViewer.isOpen}
          onClose={closeMediaViewer}
          media={{
            url: mediaViewer.media.url,
            name: mediaViewer.media.name,
            type: mediaViewer.media.type,
          }}
        />
      )}
    </main>
  )
}
