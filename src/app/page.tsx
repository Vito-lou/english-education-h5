'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Award, ArrowRight, User, Star, Clock, Target } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <Image
                  src="/logo.jpeg"
                  alt="星云英语Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                星云英语
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
              让热爱与
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                高分同时发生
              </span>
            </h1>
            <p className="text-xl text-gray-600 mt-6 leading-relaxed">
              故事驱动习得 × AI赋能 · 专为中国孩子设计的英语成长方案
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
            线下深度教学 + 线上AI精准巩固
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: "故事驱动习得",
              description: "摒弃传统教材，通过分级故事沉浸式练习听说读写，自然培养语感，学得不痛苦",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: Target,
              title: "智能关联提分",
              description: "AI将故事中的语言点与校内考点无缝对接，能力提升与考试成绩同步达成",
              color: "from-green-500 to-green-600"
            },
            {
              icon: Clock,
              title: "个性化学习闭环",
              description: "课上故事引领，课后AI生成基于个人弱点的复习路径，确保高效掌握",
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
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <Image
                src="/logo.jpeg"
                alt="英语教育Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
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
