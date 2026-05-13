"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { forwardRef } from "react";

import { cn } from "@bonne-garde/ui/lib/utils";
import { transitions } from "@bonne-garde/ui/lib/animations";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-muted hover:text-foreground hover:border-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 rounded-lg px-4 py-2.5 text-sm [&_svg]:size-4",
        xs: "h-7 rounded-lg px-2.5 py-1 text-xs gap-1.5 [&_svg]:size-3",
        sm: "h-9 rounded-xl px-3 py-2 text-sm [&_svg]:size-4",
        lg: "h-12 rounded-xl px-6 py-3 text-base [&_svg]:size-5",
        icon: "h-10 w-10 rounded-xl [&_svg]:size-4",
        "icon-xs": "h-7 w-7 rounded-lg [&_svg]:size-3",
        "icon-sm": "h-9 w-9 rounded-xl [&_svg]:size-4",
        "icon-lg": "h-12 w-12 rounded-xl [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const MotionButton = motion.create("button");

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "default",
    size = "default",
    asChild = false,
    disabled,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  const baseClassName = cn(buttonVariants({ variant, size, className }));

  // Slot mode: no motion, pass through to child
  if (asChild) {
    return (
      <Slot
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={baseClassName}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  // Disabled mode: no animation
  if (disabled) {
    return (
      <button
        ref={ref}
        type={type}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        disabled={disabled}
        className={baseClassName}
        {...props}
      >
        {children}
      </button>
    );
  }

  // Normal mode: motion button - cast props to avoid style type conflict
  return (
    <MotionButton
      ref={ref}
      type={type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      className={baseClassName}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={transitions.springSoft}
      {...(props as unknown as React.ComponentProps<typeof MotionButton>)}
    >
      {children}
    </MotionButton>
  );
});

export { Button, buttonVariants };
export type { ButtonProps };
