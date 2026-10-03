"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ProductSearchInput } from "@/components/product-search-input"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { isProductCondition, type SupplyCategory } from "@/types/catalog"

import { CONDITION_OPTIONS, SORT_OPTIONS } from "../products.constants"

const EMPTY_SELECT_VALUE = "__empty__"

type FilterOption = {
  value: string
  label: string
}

function toSelectValue(value: string | undefined) {
  return value || EMPTY_SELECT_VALUE
}

function fromSelectValue(value: string) {
  return value === EMPTY_SELECT_VALUE ? "" : value
}

function FilterSelect({
  name,
  defaultValue,
  options,
  className,
  onChange,
}: {
  name: string
  defaultValue: string | undefined
  options: FilterOption[]
  className?: string
  onChange?: (value: string) => void
}) {
  const [value, setValue] = useState(toSelectValue(defaultValue))

  return (
    <>
      <input type="hidden" name={name} value={fromSelectValue(value)} />
      <Select value={value} onValueChange={(nextValue) => { setValue(nextValue); onChange?.(fromSelectValue(nextValue)) }}>
        <SelectTrigger className={cn("cursor-pointer", className)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value || "all"}
              value={toSelectValue(option.value)}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

export function ProductFilters({
  categories,
  values,
  onApply,
  isLoading,
}: {
  categories: SupplyCategory[]
  values: Record<string, string | undefined>
  onApply: (params: URLSearchParams) => void
  isLoading: boolean
}) {
  const [category, setCategory] = useState(values.category)
  const [condition, setCondition] = useState(values.condition)
  return (
    <form
      className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_180px_160px_auto]"
      onSubmit={(event) => {
        event.preventDefault()
        const params = new URLSearchParams()
        new FormData(event.currentTarget).forEach((value, name) => {
          if (typeof value === "string" && value.trim())
            params.set(name, value.trim())
        })
        onApply(params)
      }}
    >
      <ProductSearchInput defaultValue={values.q}
        categoryDocumentId={category} condition={isProductCondition(condition) ? condition : undefined} />
      <FilterSelect
        name="category"
        defaultValue={values.category}
        onChange={setCategory}
        options={[
          { value: "", label: "ทุกหมวดหมู่" },
          ...categories.map((category) => ({
            value: category.documentId,
            label: category.name,
          })),
        ]}
      />
      <FilterSelect
        name="condition"
        defaultValue={values.condition}
        onChange={setCondition}
        options={CONDITION_OPTIONS}
      />
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <FilterSelect
          name="sort"
          defaultValue={values.sort || "newest"}
          options={SORT_OPTIONS}
          className="min-w-0 flex-1"
        />
        <Button type="submit" className="h-10 w-full cursor-pointer sm:w-auto" disabled={isLoading}>
          ค้นหา
        </Button>
      </div>
    </form>
  )
}
