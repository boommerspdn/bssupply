import Link from "next/link"
import { Fragment } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type BreadcrumbItemConfig = {
  label: string
  href?: string
}

export function PageBreadcrumbs({ items }: { items: BreadcrumbItemConfig[] }) {
  if (!items.length) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <Fragment key={`${item.label}-${item.href ?? index}`}>
              <BreadcrumbItem>
                {isCurrent ? (
                  <BreadcrumbPage className="font-medium text-primary">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href ?? "#"}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isCurrent ? <BreadcrumbSeparator /> : null}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
