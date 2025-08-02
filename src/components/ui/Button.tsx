'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl'

    const variants = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-md hover:shadow-lg',
      secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-500 shadow-sm hover:shadow-md',
      success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-md hover:shadow-lg',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-md hover:shadow-lg',
      error: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md hover:shadow-lg',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    }

    const sizes = {
      sm: 'min-h-[36px] px-4 py-2 text-sm',
      md: 'min-h-[44px] px-6 py-3 text-base',
      lg: 'min-h-[52px] px-8 py-4 text-lg',
    }

    const { onClick, onMouseEnter, onMouseLeave, ...restProps } = props

    return (
      <motion.button
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={ref}
      >
        {loading && (
          <motion.div
            className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
