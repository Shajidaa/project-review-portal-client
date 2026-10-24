import React from "react"
import { cn } from "@/lib/utils"

interface MyContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  fluid?: boolean
}

export default function MyContainer({
  children,
  className,
  fluid = false,
  ...props
}: MyContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        fluid ? "max-w-full" : "max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
