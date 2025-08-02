'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass'
  padding?: 'sm' | 'md' | 'lg'
  clickable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', clickable = false, children, onClick, ...props }, ref) => {
    const baseClasses = 'bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200'

    const variants = {
      default: 'bg-white border border-gray-100',
      gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100',
      glass: 'backdrop-blur-lg bg-white/80 border border-white/20',
    }

    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    if (clickable) {
      return (
        <motion.div
          className={cn(
            baseClasses,
            variants[variant],
            paddings[padding],
            'cursor-pointer hover:shadow-md',
            className
          )}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={onClick}
          ref={ref}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          className
        )}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// 卡片头部
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children }, ref) => {
    return (
      <motion.div
        className={cn('flex items-center justify-between mb-4', className)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        ref={ref}
      >
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {children}
        </div>
        {action && (
          <div className="ml-4">{action}</div>
        )}
      </motion.div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// 卡片内容
export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children }, ref) => {
    return (
      <motion.div
        className={cn('space-y-4', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        ref={ref}
      >
        {children}
      </motion.div>
    )
  }
)

CardContent.displayName = 'CardContent'

// 卡片底部
export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children }, ref) => {
    return (
      <motion.div
        className={cn('flex items-center justify-between mt-6 pt-4 border-t border-gray-100', className)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        ref={ref}
      >
        {children}
      </motion.div>
    )
  }
)

CardFooter.displayName = 'CardFooter'
