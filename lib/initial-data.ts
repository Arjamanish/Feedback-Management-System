// This file contains the initial feedback data for the v0 Feedback App
// This data is used when Supabase is not configured

import type { FeedbackItem } from "./types"

export function getInitialFeedbackItems(): FeedbackItem[] {
  const items: FeedbackItem[] = []

  // Define all feedback items with proper priority distribution
  const feedbackData = [
    // New Features
    {
      category: "New Features",
      title: "Reusable Components",
      description: "Use components across multiple projects for better consistency and faster development.",
      priority: "High" as const,
    },
    {
      category: "New Features",
      title: "Easy Project Importing",
      description: "One click migration process from live URL to Vercel/v0.",
      priority: "High" as const,
    },
    {
      category: "New Features",
      title: "3D Model Support",
      description: "Upload, host and display GLB 3D models in v0 projects.",
      priority: "Medium" as const,
    },
    {
      category: "New Features",
      title: "v0 Mobile App",
      description:
        "Chat on your phone and preview UI/code on laptop. Both the mobile and web app are 100% sync to maximize all your workflows.",
      priority: "High" as const,
    },
    {
      category: "New Features",
      title: "Voice Mode for Prompts",
      description: "Hands-free ideation and faster iteration cycles.",
      priority: "High" as const,
    },
    {
      category: "New Features",
      title: "Figma Sync (Two-Way)",
      description: "Keep design files and code in lock-step for seamless design-to-code workflow.",
      priority: "High" as const,
    },
    {
      category: "New Features",
      title: "Import Existing Site Wizard",
      description: "Migrate from Wix, Webflow, WordPress → Vercel/v0 with guided assistance.",
      priority: "Medium" as const,
    },
    {
      category: "New Features",
      title: "Deploy to Bitcoin/Ordinals",
      description: "Showcase v0 flexibility for niche blockchain use-cases.",
      priority: "Low" as const,
    },
    {
      category: "New Features",
      title: "Improved Analytics Dashboard",
      description: "Granular usage insights and project performance metrics.",
      priority: "Medium" as const,
    },

    // Core UI / UX
    {
      category: "Core UI / UX",
      title: "Chat Panel on the Right",
      description: "Matches IDE conventions and improves workflow for developers.",
      priority: "High" as const,
    },
    {
      category: "Core UI / UX",
      title: "Projects Dashboard as Default Landing",
      description: "Open to existing projects first, not a blank prompt.",
      priority: "Medium" as const,
    },
    {
      category: "Core UI / UX",
      title: "Duplicate Favorites",
      description: "De-duplicate in the Vercel dashboard for cleaner project management.",
      priority: "Medium" as const,
    },
    {
      category: "Core UI / UX",
      title: "Projects Panel Pops Open Accidentally",
      description: "Likely hover/focus bug on the left sidebar needs fixing.",
      priority: "High" as const,
    },
    {
      category: "Core UI / UX",
      title: "Nav Mis-centers if Logo & Copy Length Differ",
      description: "Apply robust flex/grid rules for consistent layout.",
      priority: "Low" as const,
    },
    {
      category: "Core UI / UX",
      title: "Rounded Avatars (PFP)",
      description: "Harmonize with the rounded UI style throughout the interface.",
      priority: "Low" as const,
    },
    {
      category: "Core UI / UX",
      title: "Consistent Button Styling",
      description: '"Feedback" and "New Project" buttons should share design tokens.',
      priority: "Medium" as const,
    },
    {
      category: "Core UI / UX",
      title: "External Display Support",
      description: "UI should scale cleanly on large monitors and ultrawide displays.",
      priority: "Medium" as const,
    },
    {
      category: "Core UI / UX",
      title: "Picture-in-Picture Preview",
      description: "Keep preview visible when chat is enlarged for better multitasking.",
      priority: "High" as const,
    },
    {
      category: "Core UI / UX",
      title: "Delightful Loading Screen",
      description: "Replace spinner with mini-game, quick tips, or curated content feed.",
      priority: "Low" as const,
    },

    // Quick Wins
    {
      category: "Quick Wins",
      title: "Rename Chat Within Fork Modal",
      description: "Avoid having to rename later for better organization.",
      priority: "Low" as const,
    },
    {
      category: "Quick Wins",
      title: "Breakpoints Preview",
      description: "Enable users to implement and test responsive designs with extra ease.",
      priority: "High" as const,
    },
    {
      category: "Quick Wins",
      title: "Inline Text & Link Editing in Design Mode",
      description: "Speed up copy tweaks without full regeneration.",
      priority: "Medium" as const,
    },
    {
      category: "Quick Wins",
      title: "Restore Console Tab in Top Navigation",
      description: "Quick log access for debugging.",
      priority: "Medium" as const,
    },
    {
      category: "Quick Wins",
      title: "Search Chat History",
      description: "Essential for long sessions and finding previous iterations.",
      priority: "High" as const,
    },

    // Project Management
    {
      category: "Project Management",
      title: "Project Folders & Archiving",
      description: "Organize and hide old projects for better workspace management.",
      priority: "High" as const,
    },
    {
      category: "Project Management",
      title: "Star/Favorite Individual v0 Projects",
      description: "Fast access to key work and important projects.",
      priority: "Medium" as const,
    },
    {
      category: "Project Management",
      title: "Transfer Projects Between Accounts",
      description: "Team ↔ Personal hand-offs for collaboration.",
      priority: "Low" as const,
    },
  ]

  // Convert to FeedbackItem format
  feedbackData.forEach((item, index) => {
    items.push({
      id: `item-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      category: item.category,
      title: item.title,
      description: item.description,
      status: "Open",
      priority: item.priority,
      createdAt: Date.now() - index * 1000, // Stagger creation times
    })
  })

  console.log(`Generated ${items.length} initial feedback items with priority distribution:`)
  const priorityCounts = items.reduce(
    (acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  console.log("Priority distribution:", priorityCounts)

  return items
}
