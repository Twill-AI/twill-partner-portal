import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "transition p-1.5 px-2 font-medium focus:outline-none flex items-center space-x-0.5 whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-gray80 hover:bg-gray100 text-black50 stroke-black50 rounded-md clickable shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-md clickable",
        outline:
          "border border-[#676767] hover:bg-[#F7F7F7] text-[#3F3F3F] stroke-[#3F3F3F] bg-white rounded-md clickable",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-md clickable",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-md clickable",
        link: "text-primary underline-offset-4 hover:underline",
        gray: "text-black50 stroke-black50 border-gray80 bg-white hover:bg-gray40 border rounded-lg clickable shadow-sm font-semibold text-[13.5px] px-3 py-2", 
        primary: "bg-azure100 hover:bg-azure100/90 text-white stroke-white rounded-lg clickable shadow font-semibold text-[14px] px-4 py-2", 
        info: "text-[#387094] stroke-[#387094] bg-[#3870941F] rounded-md clickable",
        transparent: "bg-transparent hover:bg-transparent !text-[#3F3F3F] !stroke-[#3F3F3F] rounded-md clickable",
        iconButton: "bg-gray40 hover:bg-gray60 text-black50 stroke-black50 rounded-lg clickable aspect-square shadow-sm p-2", 
      },
      size: {
        default: "text-[13px]",
        sm: "text-[13px] !py-0.5",
        lg: "text-[13px]",
        icon: "!p-[5px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
