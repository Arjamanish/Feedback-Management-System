"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, PlusCircle, Search, MoreHorizontal, Copy, Edit, Trash2 } from "lucide-react"
import AddFeedbackModal from "@/components/add-feedback-modal"
import CategoryFilters from "@/components/category-filters"
import { type FeedbackItem, type FeedbackStatus, ALL_CATEGORIES, type FeedbackPriority } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import {
  getFeedbackItems,
  addFeedbackItem,
  updateFeedbackStatus,
  updateFeedbackItem,
  deleteFeedbackItem,
} from "@/app/actions"

export default function FeedbackPage() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES)
  const [editingFeedback, setEditingFeedback] = useState<FeedbackItem | null>(null)
  const { toast } = useToast()

  // Touch/swipe handling refs and state
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const touchStartTime = useRef<number>(0)
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        !isModalOpen &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "BUTTON"
      ) {
        event.preventDefault()
        openAddModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isModalOpen])

  useEffect(() => {
    async function loadFeedback() {
      const items = await getFeedbackItems()
      setFeedbackItems(items)
    }
    loadFeedback()
  }, [])

  // Handle Enter key to open Add Feedback modal when not in modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if modal is closed and not typing in an input/textarea
      if (
        event.key === "Enter" &&
        !isModalOpen &&
        !event.metaKey &&
        !event.ctrlKey &&
        event.target instanceof HTMLElement &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) &&
        !event.target.closest('[role="combobox"]') &&
        !event.target.closest('[role="option"]')
      ) {
        event.preventDefault()
        openAddModal()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen])

  const uniqueCategories = useMemo(() => {
    const categories = new Set(feedbackItems.map((item) => item.category))
    return Array.from(categories).sort()
  }, [feedbackItems])

  const allCategories = useMemo(() => [ALL_CATEGORIES, ...uniqueCategories], [uniqueCategories])

  const categoryCounts = useMemo(() => {
    return feedbackItems.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [feedbackItems])

  const filteredFeedbackItems = useMemo(() => {
    const priorityOrder: Record<FeedbackPriority, number> = {
      High: 1,
      Medium: 2,
      Low: 3,
    }

    return feedbackItems
      .filter((item) => selectedCategory === ALL_CATEGORIES || item.category === selectedCategory)
      .filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        // Primary sort by priority
        const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityComparison !== 0) {
          return priorityComparison
        }
        // Secondary sort by createdAt (newest first)
        return b.createdAt - a.createdAt
      })
  }, [feedbackItems, searchTerm, selectedCategory])

  // Swipe navigation functions
  const navigateToCategory = (direction: "prev" | "next") => {
    const currentIndex = allCategories.indexOf(selectedCategory)
    let newIndex: number

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allCategories.length - 1
    } else {
      newIndex = currentIndex < allCategories.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedCategory(allCategories[newIndex])
  }

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
    touchStartTime.current = Date.now()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    const touchEndX = touch.clientX
    const touchEndY = touch.clientY
    const touchEndTime = Date.now()

    const deltaX = touchEndX - touchStartX.current
    const deltaY = touchEndY - touchStartY.current
    const deltaTime = touchEndTime - touchStartTime.current

    // Swipe thresholds
    const minSwipeDistance = 50
    const maxSwipeTime = 500
    const maxVerticalMovement = 100

    // Check if it's a valid horizontal swipe
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalMovement && deltaTime < maxSwipeTime) {
      if (deltaX > 0) {
        // Swipe right - go to previous category
        navigateToCategory("prev")
      } else {
        // Swipe left - go to next category
        navigateToCategory("next")
      }
    }
  }

  const handleAddFeedback = async (newFeedbackData: Omit<FeedbackItem, "id" | "createdAt" | "status">) => {
    if (editingFeedback) {
      const updatedItem = await updateFeedbackItem(editingFeedback.id, newFeedbackData)
      if (updatedItem) {
        setFeedbackItems((prevItems) => prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
        toast({ title: "Feedback updated successfully!" })
      } else {
        toast({ title: "Failed to update feedback", variant: "destructive" })
      }
      setEditingFeedback(null)
    } else {
      const addedItem = await addFeedbackItem(newFeedbackData)
      if (addedItem) {
        setFeedbackItems((prevItems) => [addedItem, ...prevItems])
        toast({ title: "Feedback added successfully!" })
      } else {
        toast({ title: "Failed to add feedback", variant: "destructive" })
      }
    }
    setIsModalOpen(false)
  }

  const handleUpdateStatus = async (id: string, status: FeedbackStatus) => {
    const updatedItem = await updateFeedbackStatus(id, status)
    if (updatedItem) {
      setFeedbackItems((prevItems) => prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
      toast({ title: `Feedback status updated to ${status}!` })
    } else {
      toast({ title: "Failed to update status", variant: "destructive" })
    }
  }

  const handleDeleteFeedback = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this feedback item?")) {
      const success = await deleteFeedbackItem(id)
      if (success) {
        setFeedbackItems((prevItems) => prevItems.filter((item) => item.id !== id))
        toast({ title: "Feedback deleted successfully!", variant: "destructive" })
      } else {
        toast({ title: "Failed to delete feedback", variant: "destructive" })
      }
    }
  }

  const handleEditFeedback = (item: FeedbackItem) => {
    setEditingFeedback(item)
    setIsModalOpen(true)
  }

  const handleCopyToClipboard = (item: FeedbackItem) => {
    const textToCopy = `Title: ${item.title}\nDescription: ${item.description}\nStatus: ${item.status}\nPriority: ${item.priority}\nCategory: ${item.category}`
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast({ title: "Copied to clipboard!" })
      })
      .catch((err) => {
        toast({ title: "Failed to copy", description: err.message, variant: "destructive" })
      })
  }

  const openAddModal = () => {
    setEditingFeedback(null)
    setIsModalOpen(true)
  }

  const getStatusColor = (status: FeedbackStatus) => {
    switch (status) {
      case "Open":
        return "bg-blue-500 hover:bg-blue-600"
      case "In Progress":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Done":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-normal">v0 Feedback</h1>
        </div>
        <Button onClick={openAddModal} className="hidden sm:flex">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Feedback
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search feedback..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-4 border-b md:border-none md:py-4">
        <CategoryFilters
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredFeedbackItems.length} of {feedbackItems.length} feedback items
      </div>

      {/* Mobile Cards Layout with Swipe Navigation */}
      <div
        ref={cardsContainerRef}
        className="md:hidden space-y-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "pan-y" }} // Allow vertical scrolling but handle horizontal swipes
      >
        {filteredFeedbackItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm
              ? `No feedback found for "${searchTerm}"`
              : "No feedback items yet. Click 'Add Feedback' to get started!"}
          </div>
        ) : (
          filteredFeedbackItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleEditFeedback(item)}
              className="bg-card border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-3">
                <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{item.description}</p>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge variant="outline" className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="default">{item.category}</Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px] hidden">Status</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[150px]">Category</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedbackItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? `No feedback found for "${searchTerm}"`
                    : "No feedback items yet. Click 'Add Feedback' to get started!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredFeedbackItems.map((item) => (
                <TableRow key={item.id} onClick={() => handleEditFeedback(item)} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <div className="font-semibold">{item.title}</div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="line-clamp-2 text-sm text-muted-foreground">{item.description}</div>
                  </TableCell>
                  <TableCell className="hidden">
                    <Badge className={`${getStatusColor(item.status)} text-white`}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{item.category}</Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyToClipboard(item)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy to Clipboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditFeedback(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteFeedback(item.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddFeedbackModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddFeedback}
        existingCategories={uniqueCategories}
        initialData={editingFeedback}
      />
      {/* Mobile Floating Action Button */}
      <Button
        onClick={openAddModal}
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow z-50 border-0 p-0"
        size="icon"
      >
        <Plus className="h-6 w-6 text-gray-700" style={{ width: "24px", height: "24px" }} />
      </Button>
    </div>
  )
}
