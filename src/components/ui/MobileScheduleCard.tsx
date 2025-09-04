'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, User, MapPin, BookOpen, Target, ChevronRight } from 'lucide-react'
import { Card, CardContent } from './Card'
import type { Schedule } from '@/lib/utils'

interface MobileScheduleCardProps {
  schedule: Schedule
  index: number
  onClick?: (schedule: Schedule) => void
}

export function MobileScheduleCard({ schedule, index, onClick }: MobileScheduleCardProps) {
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          dot: 'bg-blue-500'
        }
      case 'completed':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          dot: 'bg-green-500'
        }
      case 'cancelled':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          dot: 'bg-red-500'
        }
      case 'in_progress':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          dot: 'bg-yellow-500'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          dot: 'bg-gray-500'
        }
    }
  }

  const statusColors = getStatusColor(schedule.status)

  // 判断是否是今天
  const isToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return schedule.date === today
  }

  // 判断是否是过去的日期
  const isPast = () => {
    const today = new Date().toISOString().split('T')[0]
    return schedule.date < today
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onClick?.(schedule)}
      className="cursor-pointer"
    >
      <Card className={`border-l-4 ${statusColors.border} hover:shadow-md transition-all duration-200 ${
        isPast() ? 'opacity-75' : ''
      }`}>
        <CardContent className="p-4">
          {/* 头部：日期和状态 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <span className={`font-medium ${isToday() ? 'text-blue-600' : 'text-gray-900'}`}>
                  {schedule.formatted_date} {schedule.weekday_name}
                </span>
                {isToday() && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    今天
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
              <span className={`text-xs font-medium ${statusColors.text}`}>
                {schedule.status_name}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* 时间信息 */}
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900">
              {schedule.time_slot.time_range}
            </span>
            <span className="text-xs text-gray-500">
              ({schedule.time_slot.name})
            </span>
          </div>

          {/* 课程和教师信息 */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900">
                {schedule.course.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">
                {schedule.teacher.name} 老师
              </span>
              {schedule.classroom && (
                <>
                  <MapPin className="w-3 h-3 text-gray-400 ml-2" />
                  <span className="text-xs text-gray-500">
                    {schedule.classroom}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 课程内容预览 */}
          {(schedule.lesson_info || schedule.teaching_focus) && (
            <div className={`rounded-lg p-3 ${statusColors.bg}`}>
              {schedule.lesson_info && (
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    {schedule.lesson_info.unit_name}
                  </span>
                  {schedule.lesson_info.lesson_name && (
                    <span className="text-gray-600 ml-2">
                      - {schedule.lesson_info.lesson_name}
                    </span>
                  )}
                </div>
              )}
              
              {schedule.teaching_focus && (
                <div className="flex items-start space-x-1 mt-2">
                  <Target className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-700 line-clamp-2">
                    {schedule.teaching_focus}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 班级信息 */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                班级：{schedule.class.name}
              </span>
              <span className="text-xs text-gray-400">
                点击查看详情
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// 即将到来的课程卡片（简化版）
interface UpcomingScheduleCardProps {
  schedule: Schedule
  index: number
  onClick?: (schedule: Schedule) => void
}

export function UpcomingScheduleCard({ schedule, index, onClick }: UpcomingScheduleCardProps) {
  const statusColors = {
    scheduled: 'border-blue-200 bg-blue-50',
    completed: 'border-green-200 bg-green-50',
    cancelled: 'border-red-200 bg-red-50',
    in_progress: 'border-yellow-200 bg-yellow-50'
  }

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return schedule.date === today
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={() => onClick?.(schedule)}
      className="cursor-pointer"
    >
      <div className={`border-l-4 rounded-r-lg p-3 ${
        statusColors[schedule.status as keyof typeof statusColors] || 'border-gray-200 bg-gray-50'
      } hover:shadow-sm transition-shadow`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${isToday() ? 'text-blue-600' : 'text-gray-900'}`}>
              {schedule.formatted_date} {schedule.weekday_name}
            </span>
            {isToday() && (
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                今天
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {schedule.time_slot.time_range}
          </span>
        </div>
        
        <div className="text-sm text-gray-700 mb-1">
          {schedule.course.name}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{schedule.teacher.name} 老师</span>
          <span>{schedule.class.name}</span>
        </div>
      </div>
    </motion.div>
  )
}
