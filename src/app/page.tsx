'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Award, ArrowRight, User, Star, Clock, Target } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/auth'

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 头部导航 */}
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
              <h1 className="text-xl font-bold text-gray-900">
                英语教育
              </h1>
            </div>

            {/* 登录按钮 */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {user?.name}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="primary" size="sm">
                    登录
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="px-4 py-16">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              陪伴孩子的
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                英语学习之旅
              </span>
            </h1>
            <p className="text-xl text-gray-600 mt-6 leading-relaxed">
              专业的英语教育体系，让家长实时了解孩子的学习进度
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="primary" size="lg" className="min-w-[160px]">
                    立即登录
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" className="min-w-[160px]">
                  了解更多
                </Button>
              </>
            ) : (
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="min-w-[160px]">
                  进入控制台
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            为什么选择我们
          </h2>
          <p className="text-gray-600 text-lg">
            专业的教学体系，贴心的家长服务
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: "系统化课程",
              description: "Pre-A到D级完整课程体系，循序渐进提升英语能力",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: Target,
              title: "实时进度",
              description: "随时查看孩子学习进度，了解每个故事的学习情况",
              color: "from-green-500 to-green-600"
            },
            {
              icon: Clock,
              title: "课时管理",
              description: "清晰的课时余额显示，合理安排学习计划",
              color: "from-purple-500 to-purple-600"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Card clickable className="h-full">
                <CardContent className="text-center space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 课程级别展示 */}
      <section className="px-4 py-16 bg-white/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            完整的课程体系
          </h2>
          <p className="text-gray-600 text-lg">
            从启蒙到高级，陪伴孩子每一步成长
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { level: 'Pre-A', name: '预备级', color: 'bg-purple-500' },
            { level: 'A', name: 'A级', color: 'bg-blue-500' },
            { level: 'B', name: 'B级', color: 'bg-green-500' },
            { level: 'C', name: 'C级', color: 'bg-yellow-500' },
            { level: 'D', name: 'D级', color: 'bg-red-500' },
          ].map((course, index) => (
            <motion.div
              key={course.level}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            >
              <Card clickable className="text-center">
                <CardContent>
                  <div className={`w-16 h-16 ${course.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white font-bold text-xl">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {course.name}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center space-y-8"
        >
          <h2 className="text-3xl font-bold text-gray-900">
            开始您的英语教育之旅
          </h2>
          <p className="text-xl text-gray-600">
            立即登录，查看孩子的学习进度
          </p>
          {!isAuthenticated && (
            <Link href="/login">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                立即开始
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">英</span>
            </div>
            <h3 className="text-xl font-bold">英语教育</h3>
          </div>
          <p className="text-gray-400 mb-4">
            专业的英语教育平台，陪伴孩子快乐学习
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 英语教育. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
