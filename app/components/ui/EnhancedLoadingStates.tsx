'use client'

import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

/**
 * Enhanced Loading States using react-loading-skeleton
 * Provides premium loading experiences with theme awareness
 */

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'chart' | 'dashboard' | 'custom'
  count?: number
  height?: number | string
  width?: number | string
  className?: string
  darkMode?: boolean
}

export function LoadingSkeleton({
  variant = 'text',
  count = 1,
  height,
  width,
  className = '',
  darkMode = true
}: LoadingSkeletonProps) {
  const skeletonProps = {
    count,
    height: height || getDefaultHeight(variant),
    width: width || getDefaultWidth(variant),
    className: `${className} gpu-accelerated`
  }

  const themeProps = darkMode ? {
    baseColor: 'rgba(255, 255, 255, 0.1)',
    highlightColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem'
  } : {
    baseColor: '#ebebeb',
    highlightColor: '#f5f5f5',
    borderRadius: '0.5rem'
  }

  return (
    <SkeletonTheme {...themeProps}>
      {renderVariant(variant, skeletonProps)}
    </SkeletonTheme>
  )
}

function getDefaultHeight(variant: string): number | string {
  switch (variant) {
    case 'card': return 200
    case 'text': return 20
    case 'avatar': return 40
    case 'chart': return 300
    case 'dashboard': return 120
    default: return 20
  }
}

function getDefaultWidth(variant: string): number | string | undefined {
  switch (variant) {
    case 'avatar': return 40
    case 'dashboard': return '100%'
    default: return undefined
  }
}

function renderVariant(variant: string, props: any) {
  switch (variant) {
    case 'card':
      return (
        <div className="space-y-3">
          <Skeleton height={200} borderRadius="0.75rem" />
          <Skeleton height={24} width="60%" />
          <Skeleton count={2} height={16} />
        </div>
      )

    case 'avatar':
      return (
        <div className="flex items-center space-x-3">
          <Skeleton circle width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton height={16} width="40%" />
            <Skeleton height={14} width="60%" />
          </div>
        </div>
      )

    case 'chart':
      return (
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton height={24} width={120} />
            <Skeleton height={20} width={80} />
          </div>
          <Skeleton height={300} borderRadius="0.5rem" />
          <div className="flex justify-center space-x-4">
            <Skeleton height={12} width={60} />
            <Skeleton height={12} width={60} />
            <Skeleton height={12} width={60} />
          </div>
        </div>
      )

    case 'dashboard':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton height={20} width={60} />
                <Skeleton circle width={32} height={32} />
              </div>
              <Skeleton height={32} width="50%" />
              <Skeleton height={4} borderRadius="9999px" />
            </div>
          ))}
        </div>
      )

    case 'text':
    default:
      return <Skeleton {...props} />
  }
}

// Specific loading components for common use cases
export function DashboardCardSkeleton({ darkMode = true }: { darkMode?: boolean }) {
  return <LoadingSkeleton variant="dashboard" darkMode={darkMode} />
}

export function ChartSkeleton({ darkMode = true }: { darkMode?: boolean }) {
  return <LoadingSkeleton variant="chart" darkMode={darkMode} />
}

export function UserAvatarSkeleton({ darkMode = true }: { darkMode?: boolean }) {
  return <LoadingSkeleton variant="avatar" darkMode={darkMode} />
}

export function ContentCardSkeleton({ darkMode = true }: { darkMode?: boolean }) {
  return <LoadingSkeleton variant="card" darkMode={darkMode} />
}

// Animated loading placeholder with performance optimization
export function AnimatedLoadingPlaceholder({ 
  className = '',
  children
}: { 
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={`animate-pulse gpu-accelerated ${className}`}>
      <div className="bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer bg-[length:200%_100%] absolute inset-0" />
      {children || (
        <div className="space-y-4">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
        </div>
      )}
    </div>
  )
}

// Loading states for specific FlowSync components
export function TimerSkeleton() {
  return (
    <SkeletonTheme baseColor="rgba(255,255,255,0.1)" highlightColor="rgba(255,255,255,0.2)">
      <div className="flex flex-col items-center space-y-6">
        <Skeleton circle width={200} height={200} />
        <div className="space-y-2 text-center">
          <Skeleton height={32} width={150} />
          <Skeleton height={20} width={100} />
        </div>
        <div className="flex space-x-4">
          <Skeleton height={40} width={80} />
          <Skeleton height={40} width={80} />
        </div>
      </div>
    </SkeletonTheme>
  )
}

export function InsightsSkeleton() {
  return (
    <SkeletonTheme baseColor="rgba(255,255,255,0.1)" highlightColor="rgba(255,255,255,0.2)">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton height={20} width={80} />
                <Skeleton circle width={24} height={24} />
              </div>
              <Skeleton height={36} width={60} />
              <Skeleton height={8} width="100%" />
            </div>
          ))}
        </div>
        <ChartSkeleton />
      </div>
    </SkeletonTheme>
  )
}

export default LoadingSkeleton