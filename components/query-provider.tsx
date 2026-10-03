"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

const Provider = QueryClientProvider as React.ComponentType<{
  client: QueryClient
  children: React.ReactNode
}>

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 0, refetchOnWindowFocus: true, retry: 1 } },
  }))
  return <Provider client={client}>{children}</Provider>
}
