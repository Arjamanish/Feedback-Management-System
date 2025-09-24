"use server"

import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { FeedbackItem } from "@/lib/types"
import { getInitialFeedbackItems } from "@/lib/initial-data"

// In-memory storage for preview mode - force refresh each time
let memoryStorage: FeedbackItem[] = []
let isInitialized = false

function initializeMemoryStorage() {
  console.log("Initializing memory storage with fresh data...")
  memoryStorage = getInitialFeedbackItems()
  isInitialized = true
  console.log(`Loaded ${memoryStorage.length} items into memory storage`)
}

export async function getFeedbackItems(): Promise<FeedbackItem[]> {
  if (!isSupabaseConfigured) {
    // Always reinitialize to ensure we get fresh data
    initializeMemoryStorage()
    console.log("Returning fresh memory storage data")
    return [...memoryStorage] // Return a copy to avoid mutations
  }

  try {
    const { data, error } = await supabase.from("feedback_items").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching feedback items:", error)
      initializeMemoryStorage()
      return [...memoryStorage]
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      category: item.category,
      createdAt: new Date(item.created_at).getTime(),
    }))
  } catch (error) {
    console.error("Error fetching feedback items:", error)
    initializeMemoryStorage()
    return [...memoryStorage]
  }
}

export async function addFeedbackItem(
  feedbackData: Omit<FeedbackItem, "id" | "createdAt" | "status">,
): Promise<FeedbackItem | null> {
  if (!isSupabaseConfigured) {
    // Ensure we have the latest initial data
    if (!isInitialized) {
      initializeMemoryStorage()
    }
    const newItem: FeedbackItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...feedbackData,
      status: "Open",
      createdAt: Date.now(),
    }
    memoryStorage.unshift(newItem)
    return newItem
  }

  try {
    const { data, error } = await supabase
      .from("feedback_items")
      .insert([
        {
          title: feedbackData.title,
          description: feedbackData.description,
          priority: feedbackData.priority,
          category: feedbackData.category,
          status: "Open",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error adding feedback item:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.category,
      createdAt: new Date(data.created_at).getTime(),
    }
  } catch (error) {
    console.error("Error adding feedback item:", error)
    return null
  }
}

export async function updateFeedbackStatus(id: string, status: string): Promise<FeedbackItem | null> {
  if (!isSupabaseConfigured) {
    if (!isInitialized) {
      initializeMemoryStorage()
    }
    const itemIndex = memoryStorage.findIndex((item) => item.id === id)
    if (itemIndex !== -1) {
      memoryStorage[itemIndex].status = status as any
      return memoryStorage[itemIndex]
    }
    return null
  }

  try {
    const { data, error } = await supabase.from("feedback_items").update({ status }).eq("id", id).select().single()

    if (error) {
      console.error("Error updating feedback status:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.category,
      createdAt: new Date(data.created_at).getTime(),
    }
  } catch (error) {
    console.error("Error updating feedback status:", error)
    return null
  }
}

export async function updateFeedbackItem(
  id: string,
  feedbackData: Omit<FeedbackItem, "id" | "createdAt" | "status">,
): Promise<FeedbackItem | null> {
  if (!isSupabaseConfigured) {
    if (!isInitialized) {
      initializeMemoryStorage()
    }
    const itemIndex = memoryStorage.findIndex((item) => item.id === id)
    if (itemIndex !== -1) {
      memoryStorage[itemIndex] = {
        ...memoryStorage[itemIndex],
        ...feedbackData,
      }
      return memoryStorage[itemIndex]
    }
    return null
  }

  try {
    const { data, error } = await supabase
      .from("feedback_items")
      .update({
        title: feedbackData.title,
        description: feedbackData.description,
        priority: feedbackData.priority,
        category: feedbackData.category,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating feedback item:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.category,
      createdAt: new Date(data.created_at).getTime(),
    }
  } catch (error) {
    console.error("Error updating feedback item:", error)
    return null
  }
}

export async function deleteFeedbackItem(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    if (!isInitialized) {
      initializeMemoryStorage()
    }
    const itemIndex = memoryStorage.findIndex((item) => item.id === id)
    if (itemIndex !== -1) {
      memoryStorage.splice(itemIndex, 1)
      return true
    }
    return false
  }

  try {
    const { error } = await supabase.from("feedback_items").delete().eq("id", id)

    if (error) {
      console.error("Error deleting feedback item:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting feedback item:", error)
    return false
  }
}
