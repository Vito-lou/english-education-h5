'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from './Button'

interface MediaViewerProps {
  isOpen: boolean
  onClose: () => void
  media: {
    url: string
    name: string
    type: string
  }
}

export function MediaViewer({ isOpen, onClose, media }: MediaViewerProps) {
  const [scale, setScale] = useState(1)

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = media.url
    link.download = media.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isImage = media.type.startsWith('image/')
  const isVideo = media.type.startsWith('video/')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* 头部工具栏 */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
          >
            <div className="text-white">
              <h3 className="font-medium truncate max-w-xs">{media.name}</h3>
            </div>
            <div className="flex items-center space-x-2">
              {isImage && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleZoomOut()
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleZoomIn()
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* 媒体内容 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isImage && (
              <motion.img
                src={media.url}
                alt={media.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{ transform: `scale(${scale})` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            
            {isVideo && (
              <video
                src={media.url}
                controls
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                style={{ maxHeight: '80vh' }}
              >
                您的浏览器不支持视频播放。
              </video>
            )}
            
            {!isImage && !isVideo && (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">无法预览此文件类型</p>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  下载文件
                </Button>
              </div>
            )}
          </motion.div>

          {/* 底部信息 */}
          {isImage && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 text-center"
            >
              <p className="text-white text-sm opacity-75">
                缩放: {Math.round(scale * 100)}% • 点击空白区域关闭
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
