'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, User, MapPin, BookOpen, Target, Users } from 'lucide-react'
import { Card, CardContent } from './Card'
import { Button } from './Button'
import type { Schedule } from '@/lib/utils'

interface ScheduleDetailModalProps {
  schedule: Schedule | null
  isOpen: boolean
  onClose: () => void
}

export function ScheduleDetailModal({ schedule, isOpen, onClose }: ScheduleDetailModalProps) {
  if (!schedule) return null

  // 获取状态颜色和图标
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        }
      case 'completed':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      case 'cancelled':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        }
      case 'in_progress':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        }
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        }
    }
  }

  const statusInfo = getStatusInfo(schedule.status)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          >
            {/* 弹窗内容 */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    课程详情
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {schedule.formatted_date} {schedule.weekday_name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* 内容 */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-0 schedule-detail-modal">
                {/* 基本信息 */}
                <div className="space-y-4">
                  {/* 时间信息 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">上课时间</div>
                      <div className="text-gray-600 mt-1">
                        {schedule.time_slot.time_range}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.time_slot.name}
                      </div>
                    </div>
                  </div>

                  {/* 课程信息 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">课程</div>
                      <div className="text-gray-600 mt-1">
                        {schedule.course.name}
                      </div>
                      {schedule.lesson_info && (
                        <div className="text-sm text-gray-500 mt-1">
                          {schedule.lesson_info.unit_name} - {schedule.lesson_info.lesson_name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 教师信息 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">授课教师</div>
                      <div className="text-gray-600 mt-1">
                        {schedule.teacher.name}
                      </div>
                    </div>
                  </div>

                  {/* 班级信息 */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">班级</div>
                      <div className="text-gray-600 mt-1">
                        {schedule.class.name}
                      </div>
                    </div>
                  </div>

                  {/* 教室信息 */}
                  {schedule.classroom && (
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">教室</div>
                        <div className="text-gray-600 mt-1">
                          {schedule.classroom}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 教学内容 */}
                {(schedule.lesson_content || schedule.teaching_focus) && (
                  <div className="space-y-4">
                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-blue-500" />
                        教学安排
                      </h3>

                      {schedule.lesson_content && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-3">
                          <div className="text-sm font-medium text-gray-900 mb-2">
                            课程内容
                          </div>
                          <div className="text-sm text-gray-700">
                            {schedule.lesson_content}
                          </div>
                        </div>
                      )}

                      {schedule.teaching_focus && (
                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="text-sm font-medium text-blue-900 mb-2">
                            教学重点
                          </div>
                          <div className="text-sm text-blue-700">
                            {schedule.teaching_focus}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 底部操作 */}
              <div className="p-6 border-t border-gray-100">
                <Button
                  onClick={onClose}
                  className="w-full"
                  size="lg"
                >
                  知道了
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
