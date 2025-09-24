"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ALL_CATEGORIES } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useRef, useEffect } from "react"

interface CategoryFiltersProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  categoryCounts: Record<string, number>
}

export default function CategoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryFiltersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const allCategories = [ALL_CATEGORIES, ...categories]

  // Scroll selected category to leftmost position
  useEffect(() => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const selectedButton = container.querySelector(`[data-category="${selectedCategory}"]`) as HTMLElement

    if (selectedButton) {
      const containerRect = container.getBoundingClientRect()
      const buttonRect = selectedButton.getBoundingClientRect()

      // Calculate the scroll position to bring the selected button to the left edge
      const scrollLeft = selectedButton.offsetLeft - container.offsetLeft

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      })
    }
  }, [selectedCategory])

  return (
    <div
      ref={scrollContainerRef}
      className="flex gap-x-4 overflow-x-auto whitespace-nowrap max-md:px-0 px-4 md:flex-wrap md:gap-2 md:p-4 md:mx-0 md:bg-muted/50 md:rounded-lg scrollbar-hide"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {allCategories.map((category) => {
        const count =
          category === ALL_CATEGORIES
            ? Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
            : categoryCounts[category] || 0
        const isSelected = selectedCategory === category

        return (
          <Button
            key={category}
            data-category={category}
            variant="ghost"
            size="sm"
            onClick={() => onSelectCategory(category)}
            className={cn(
              "flex-shrink-0 items-center gap-2 rounded-none max-md:px-4 px-1 pb-3 pt-2 font-medium md:rounded-md md:border md:px-3 md:py-2 relative",
              // Remove all interactive effects on mobile
              "max-md:hover:!bg-transparent max-md:focus:!bg-transparent max-md:active:!bg-transparent max-md:focus-visible:!bg-transparent",
              "max-md:!shadow-none max-md:hover:!shadow-none max-md:focus:!shadow-none max-md:active:!shadow-none max-md:focus-visible:!shadow-none",
              "max-md:!outline-none max-md:focus:!outline-none max-md:focus-visible:!outline-none",
              isSelected
                ? "max-md:!text-white max-md:hover:!text-white max-md:focus:!text-white max-md:active:!text-white text-primary shadow-[inset_0_-2px_0_0_hsl(var(--primary))] md:bg-primary md:text-primary-foreground md:shadow-sm"
                : "text-muted-foreground max-md:hover:!text-muted-foreground max-md:focus:!text-muted-foreground max-md:active:!text-muted-foreground max-md:focus-visible:!text-muted-foreground md:hover:text-foreground md:bg-background md:text-foreground md:hover:bg-accent md:hover:text-accent-foreground md:focus:bg-accent md:focus:text-accent-foreground",
              !isSelected && "md:border-input",
            )}
            style={{
              // Force override any remaining styles on mobile
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {category}
            <Badge
              variant="secondary"
              className={cn(
                "ml-1 text-xs",
                isSelected ? "bg-primary/10 text-primary md:bg-primary-foreground md:text-primary" : "",
              )}
            >
              {count}
            </Badge>
            {/* White line indicator for selected category on mobile */}
            {isSelected && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white md:hidden" />}
          </Button>
        )
      })}
    </div>
  )
}
