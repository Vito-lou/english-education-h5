'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { LogOut, Search, BookOpen, Clock, User, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/auth'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated || !user) {
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
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">英</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  家长控制台
                </h1>
                <p className="text-sm text-gray-500">
                  欢迎，{user.name}
                </p>
              </div>
            </div>

            {/* 退出按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* 主要内容 */}
      <div className="px-4 py-6 space-y-6">
        {/* 欢迎卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="gradient">
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    欢迎回来！
                  </h2>
                  <p className="text-gray-600 mt-1">
                    查看孩子的学习进度和课程安排
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 功能菜单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            主要功能
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: Search,
                title: "查询学习情况",
                description: "输入孩子姓名，查看学习进度和课时余额",
                color: "from-blue-500 to-blue-600",
                href: "/search"
              },
              {
                icon: BookOpen,
                title: "课程体系",
                description: "了解完整的课程设置和学习内容",
                color: "from-green-500 to-green-600",
                href: "/courses"
              },
              {
                icon: Clock,
                title: "课时记录",
                description: "查看上课记录、课时余额和消费明细",
                color: "from-purple-500 to-purple-600",
                href: "/records"
              },
              {
                icon: Calendar,
                title: "课程表",
                description: "查看课程安排和上课时间表",
                color: "from-orange-500 to-orange-600",
                href: "/schedule"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card clickable onClick={() => router.push(item.href)}>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 快速统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            快速统计
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  5
                </div>
                <p className="text-sm text-gray-600">
                  课程级别
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  60+
                </div>
                <p className="text-sm text-gray-600">
                  精彩故事
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* 联系我们 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader title="需要帮助？" />
            <CardContent>
              <p className="text-gray-600 mb-4">
                如果您在使用过程中遇到任何问题，请随时联系我们的客服团队。
              </p>
              <Button variant="secondary" fullWidth>
                联系客服
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
