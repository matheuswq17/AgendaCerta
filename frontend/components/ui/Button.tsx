import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
        danger: "bg-error text-white hover:bg-error/90",
      },
      size: {
        md: "h-10 py-2 px-4 text-body",
        lg: "h-12 py-2 px-6 text-body",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  href?: string;
  prefetch?: boolean | null;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, href, prefetch, children, ...props }, ref) => {
    const classes = buttonVariants({ variant, size, className });

    if (href) {
      const disabledClass = (isLoading || props.disabled) ? ' pointer-events-none opacity-50' : '';
      const onClickAnchor = (props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>) ?? undefined;
      return (
        <Link href={href} prefetch={prefetch ?? null} className={classes + disabledClass} onClick={onClickAnchor}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {children}
        </Link>
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };