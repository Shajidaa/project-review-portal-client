import * as React from "react"
import Link from "next/link"
import { Code2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AuthCardWrapperProps {
  children: React.ReactNode
  title: string
  description?: string
  footerText?: string
  footerLinkText?: string
  footerLinkHref?: string
  footerIcon?: React.ReactNode
}

export function AuthCardWrapper({
  children,
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkHref,
  footerIcon,
}: AuthCardWrapperProps) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-32 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-32 size-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        <Card className="border-border/80 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-violet-500 text-white shadow-md shadow-primary/25">
              <Code2 className="size-6" />
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-4">{children}</CardContent>

          {footerText && footerLinkHref && footerLinkText && (
            <CardFooter className="flex flex-col border-t border-border/60 bg-muted/20 py-4 text-center">
              <p className="text-xs text-muted-foreground">
                {footerText}{" "}
                <Link
                  href={footerLinkHref}
                  className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  <span>{footerLinkText}</span>
                  {footerIcon}
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
