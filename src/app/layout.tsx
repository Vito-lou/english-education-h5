import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '英语教育家长端',
  description: '查看孩子的英语学习进度，课时余额，课程内容',
  keywords: ['英语教育', '家长端', '课程查询', '学习进度'],
  authors: [{ name: '英语教育团队' }],

  // Favicon 设置
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  },

  // PWA相关
  manifest: '/manifest.json',

  // 移动端优化
  formatDetection: {
    telephone: false,
  },

  // 社交媒体分享
  openGraph: {
    title: '英语教育家长端',
    description: '查看孩子的英语学习进度',
    type: 'website',
    locale: 'zh_CN',
    images: ['/logo.jpeg'],
  },

  // 微信分享优化
  other: {
    'wechat:card': 'summary',
    'wechat:title': '英语教育家长端',
    'wechat:description': '查看孩子的英语学习进度',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        {/* 移动端优化 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="英语教育" />

        {/* 微信浏览器优化 */}
        <meta name="x5-orientation" content="portrait" />
        <meta name="x5-fullscreen" content="true" />
        <meta name="x5-page-mode" content="app" />

        {/* 预加载关键资源 */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL} />
      </head>
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="min-h-full bg-gray-50">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
