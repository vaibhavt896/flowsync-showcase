'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, TrendingUp, Clock, Target, Activity, Zap } from 'lucide-react'
import { AppleLiquidGlass } from './AppleLiquidGlass'

interface ChartDataPoint {
  name: string
  value: number
  time: string
  productivity: number
  focus: number
  energy: number
  color?: string
}

interface PremiumChartsProps {
  data?: ChartDataPoint[]
  type?: 'productivity' | 'focus' | 'energy' | 'overview'
  theme?: 'light' | 'dark'
  animated?: boolean
  interactive?: boolean
  className?: string
}

// Research-backed productivity colors
const PRODUCTIVITY_COLORS = {
  high: '#0000FF',      // Classic Blue - Maximum focus
  medium: '#5B7C99',    // Slate Blue - Professional
  good: '#2E8B57',      // Sea Green - Calming
  low: '#B6D0E2'        // Powder Blue - Stress reduction
}

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

// Generate sample productivity data
const generateProductivityData = (days: number = 7): ChartDataPoint[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    
    const baseProductivity = 70 + Math.random() * 30
    const timeFactor = Math.sin((i / days) * Math.PI) * 10
    const productivity = Math.max(0, Math.min(100, baseProductivity + timeFactor))
    
    return {
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      time: date.toISOString(),
      productivity: Math.round(productivity),
      focus: Math.round(productivity * 0.9 + Math.random() * 10),
      energy: Math.round(productivity * 0.8 + Math.random() * 20),
      value: Math.round(productivity),
      color: productivity > 85 ? PRODUCTIVITY_COLORS.high :
             productivity > 70 ? PRODUCTIVITY_COLORS.medium :
             productivity > 55 ? PRODUCTIVITY_COLORS.good : PRODUCTIVITY_COLORS.low
    }
  })
}

function ProductivityLineChart({ data, animated = true }: { data: ChartDataPoint[], animated?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
        />
        <YAxis 
          tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            backdropFilter: 'blur(10px)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="productivity" 
          stroke={PRODUCTIVITY_COLORS.high}
          strokeWidth={3}
          dot={{ fill: PRODUCTIVITY_COLORS.high, strokeWidth: 2, r: 6 }}
          animationDuration={animated ? 2000 : 0}
        />
        <Line 
          type="monotone" 
          dataKey="focus" 
          stroke={PRODUCTIVITY_COLORS.medium}
          strokeWidth={2}
          dot={{ fill: PRODUCTIVITY_COLORS.medium, strokeWidth: 2, r: 4 }}
          animationDuration={animated ? 2500 : 0}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function NivoLineChart({ data }: { data: ChartDataPoint[] }) {
  const nivoData = useMemo(() => [
    {
      id: 'Productivity',
      color: PRODUCTIVITY_COLORS.high,
      data: data.map(d => ({ x: d.name, y: d.productivity }))
    },
    {
      id: 'Focus',
      color: PRODUCTIVITY_COLORS.medium,
      data: data.map(d => ({ x: d.name, y: d.focus }))
    },
    {
      id: 'Energy',
      color: PRODUCTIVITY_COLORS.good,
      data: data.map(d => ({ x: d.name, y: d.energy }))
    }
  ], [data])

  return (
    <div style={{ height: '300px' }}>
      <ResponsiveLine
        data={nivoData}
        margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 100 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Day',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Score',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        colors={{ scheme: 'category10' }}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableSlices="x"
        animate={true}
        motionConfig="gentle"
        curve="catmullRom"
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
          }
        ]}
        theme={{
          axis: {
            ticks: {
              text: { fill: 'rgba(255, 255, 255, 0.8)' }
            },
            legend: {
              text: { fill: 'rgba(255, 255, 255, 0.9)' }
            }
          },
          grid: {
            line: { stroke: 'rgba(255, 255, 255, 0.1)' }
          },
          legends: {
            text: { fill: 'rgba(255, 255, 255, 0.8)' }
          }
        }}
      />
    </div>
  )
}

function RadialProgressChart({ data }: { data: ChartDataPoint[] }) {
  const latestData = data[data.length - 1] || { productivity: 0, focus: 0, energy: 0 }
  
  const radialData = [
    { name: 'Productivity', value: latestData.productivity, fill: PRODUCTIVITY_COLORS.high },
    { name: 'Focus', value: latestData.focus, fill: PRODUCTIVITY_COLORS.medium },
    { name: 'Energy', value: latestData.energy, fill: PRODUCTIVITY_COLORS.good }
  ]

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={radialData}>
        <RadialBar 
          dataKey="value" 
          cornerRadius={8} 
          animationDuration={2000}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white'
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}

export function AnalyticsDashboard({ className = '' }: { className?: string }) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [chartType, setChartType] = useState<'line' | 'nivo' | 'radial'>('line')
  const [isAnimated, setIsAnimated] = useState(true)

  useEffect(() => {
    const productivityData = generateProductivityData(7)
    setData(productivityData)
    
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev]
        const lastPoint = newData[newData.length - 1]
        if (lastPoint) {
          lastPoint.productivity = Math.max(0, Math.min(100, 
            lastPoint.productivity + (Math.random() - 0.5) * 5
          ))
          lastPoint.focus = Math.max(0, Math.min(100,
            lastPoint.focus + (Math.random() - 0.5) * 3
          ))
          lastPoint.energy = Math.max(0, Math.min(100,
            lastPoint.energy + (Math.random() - 0.5) * 4
          ))
        }
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const averageProductivity = useMemo(() => {
    return data.reduce((sum, d) => sum + d.productivity, 0) / data.length || 0
  }, [data])

  const stats = [
    { name: 'Avg Productivity', value: Math.round(averageProductivity), icon: Brain, color: 'text-blue-400' },
    { name: 'Current Focus', value: data[data.length - 1]?.focus || 0, icon: Target, color: 'text-purple-400' },
    { name: 'Energy Level', value: data[data.length - 1]?.energy || 0, icon: Zap, color: 'text-green-400' },
    { name: 'Sessions Today', value: data.length, icon: Clock, color: 'text-yellow-400' }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AppleLiquidGlass
                material="regular"
                blur="heavy"
                rounded="xl"
                className="p-4 text-center"
              >
                <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.name}</div>
              </AppleLiquidGlass>
            </motion.div>
          )
        })}
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['line', 'nivo', 'radial'].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type as any)}
              className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                chartType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsAnimated(!isAnimated)}
          className="px-3 py-1 rounded-lg text-sm bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200"
        >
          {isAnimated ? 'Disable' : 'Enable'} Animation
        </button>
      </div>

      {/* Main Chart */}
      <AppleLiquidGlass
        material="regular"
        blur="heavy"
        rounded="2xl"
        className="p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Productivity Analytics</h3>
        <AnimatePresence mode="wait">
          <motion.div
            key={chartType}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {chartType === 'line' && <ProductivityLineChart data={data} animated={isAnimated} />}
            {chartType === 'nivo' && <NivoLineChart data={data} />}
            {chartType === 'radial' && <RadialProgressChart data={data} />}
          </motion.div>
        </AnimatePresence>
      </AppleLiquidGlass>

      {/* Performance Insights */}
      <AppleLiquidGlass
        material="regular"
        blur="heavy"
        rounded="xl"
        className="p-4"
      >
        <h4 className="text-lg font-medium text-white mb-2">Performance Insights</h4>
        <div className="text-sm text-white/80 space-y-1">
          <div>• {averageProductivity > 80 ? 'Excellent' : averageProductivity > 60 ? 'Good' : 'Needs improvement'} productivity trend</div>
          <div>• Peak performance during {data.reduce((peak, current) => 
            current.productivity > peak.productivity ? current : peak, data[0] || {})?.name || 'N/A'}</div>
          <div>• {data.filter(d => d.productivity > 70).length}/{data.length} high-performance sessions</div>
        </div>
      </AppleLiquidGlass>
    </div>
  )
}

export default AnalyticsDashboard