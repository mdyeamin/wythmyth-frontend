import * as React from "react"
import { cn } from "../../../lib/utils"

export const Field = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1", className)} {...props} />
)

export const FieldGroup = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-6", className)} {...props} />
)

export const FieldLabel = ({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
)

export const FieldDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
)

export const FieldSeparator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("relative py-4 text-center text-xs uppercase text-muted-foreground", className)}
    {...props}
  >
    <span className="absolute left-0 top-1/2 w-full border-t"></span>
    <span className="relative bg-background px-2">{props.children}</span>
  </div>
)
