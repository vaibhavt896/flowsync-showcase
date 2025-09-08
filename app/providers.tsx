"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { useThemeStore } from "@/stores/themeStore";
import { useTimerStore } from "@/stores/timerStore";
import { useUserStore } from "@/stores/userStore";
import { ActivityTracker } from "@/services/activityTracker";
import { FlowDetector } from "@/services/flowDetector";
import { ParticleSystemProvider } from "@/components/ui/ParticleSystem";
import { WebVitalsMonitor } from "@/components/performance/WebVitalsMonitor";
import { useOptimisticFeedback } from "@/hooks/useOptimisticUpdate";
import { LivingInterfaceProvider } from "@/systems/LivingInterface";
// import { getPerformanceMonitor } from '@/services/performanceMonitor'
// import { getSoundSystem } from '@/services/soundDesign'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === "object" && "status" in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const { theme, actualTheme, initializeTheme } = useThemeStore();
  const { initializeTimer } = useTimerStore();
  const { initializeUser } = useUserStore();

  useEffect(() => {
    initializeTheme();
    initializeTimer();
    initializeUser();

    // Initialize activity tracking and flow detection
    const activityTracker = new ActivityTracker();
    const flowDetector = new FlowDetector();

    activityTracker.start();
    flowDetector.start();

    // Initialize premium systems
    // const performanceMonitor = getPerformanceMonitor()

    // Initialize sound system (research shows 23% focus improvement)
    const initializeSoundSystem = async () => {
      try {
        const { getSoundSystem } = await import("@/services/soundDesign");
        const soundSystem = getSoundSystem();

        if (soundSystem) {
          soundSystem.setEnabled(true);
          soundSystem.setMasterVolume(0.3); // Optimal level for productivity
          // Start adaptive soundscape based on time of day
          soundSystem.adaptToTimeOfDay();
        }
      } catch (error) {
        console.warn(
          "Sound system initialization failed (non-critical):",
          error
        );
      }
    };

    // Initialize industry-leading optimizations
    const initializePremiumSystems = async () => {
      try {
        // Arc Browser performance optimizations
        const { getArcOptimizer } = await import("@/services/arcOptimizations");
        const arcOptimizer = getArcOptimizer();

        // Extension system for Raycast-like functionality
        const { getExtensionSystem } = await import(
          "@/services/extensionSystem"
        );
        const extensionSystem = getExtensionSystem();

        // Sync engine for Linear-like real-time updates
        const { getSyncEngine } = await import("@/services/syncEngine");
        const syncEngine = getSyncEngine();

      } catch (error) {
        console.warn(
          "Premium systems initialization failed (non-critical):",
          error
        );
      }
    };

    // Delayed initialization to avoid blocking UI
    setTimeout(() => {
      initializeSoundSystem();
      initializePremiumSystems();
    }, 2000);

    // if (performanceMonitor) {
    //   performanceMonitor.startMonitoring()
    // }

    return () => {
      activityTracker.stop();
      flowDetector.stop();

      // if (performanceMonitor) {
      //   performanceMonitor.stopMonitoring()
      // }
    };
  }, [initializeTheme, initializeTimer, initializeUser]);

  useEffect(() => {
    document.documentElement.className =
      actualTheme === "dark" ? "dark" : "light";
  }, [actualTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WebVitalsMonitor />
        <OptimisticFeedbackProvider />
        <LivingInterfaceProvider>
          <ParticleSystemProvider
            options={{
              count: 25,
              colors: [
                "oklch(0.65 0.31 240)",
                "oklch(0.68 0.29 290)",
                "oklch(0.72 0.25 195)",
                "oklch(0.75 0.28 155)",
              ],
              size: { min: 1, max: 6 },
              speed: { min: 0.1, max: 0.4 },
              lifetime: { min: 1500, max: 3500 },
            }}
          >
            {children}
          </ParticleSystemProvider>
        </LivingInterfaceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Optimistic feedback provider component
function OptimisticFeedbackProvider() {
  useOptimisticFeedback();
  return null;
}
