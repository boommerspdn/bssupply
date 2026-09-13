"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SupplyCategory } from "@/types/catalog"

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
}: {
  name: string
  defaultValue: string | undefined
  options: FilterOption[]
  className?: string
}) {
  const [value, setValue] = useState(toSelectValue(defaultValue))

  return (
    <>
      <input type="hidden" name={name} value={fromSelectValue(value)} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className={className}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value || "all"} value={toSelectValue(option.value)}>
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
}: {
  categories: SupplyCategory[]
  values: Record<string, string | undefined>
}) {
  return (
    <form className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_180px_160px_auto]">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          name="q"
          defaultValue={values.q}
          placeholder="ค้นหาชื่อสินค้า รุ่น ยี่ห้อ"
          className="pl-9"
        />
      </div>
      <FilterSelect
        name="category"
        defaultValue={values.category}
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
        options={CONDITION_OPTIONS}
      />
      <div className="flex gap-2">
        <FilterSelect
          name="sort"
          defaultValue={values.sort || "featured"}
          options={SORT_OPTIONS}
          className="min-w-0 flex-1"
        />
        <Button type="submit" className="h-10">
          ค้นหา
        </Button>
      </div>
    </form>
  )
}
