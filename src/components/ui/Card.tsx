"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ─── Card ──────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  /** @deprecated kept for backwards compatibility; no longer applies glassmorphism */
  glass?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  const base =
    "bg-surface/80 backdrop-blur-sm border border-border rounded-2xl p-6 transition-all duration-200";
  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          base,
          "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
          className,
        )}
      >
        {children}
      </motion.div>
    );
  }
  return <div className={cn(base, className)}>{children}</div>;
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-4 border-b border-border", className)}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-border bg-background rounded-b-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-background text-text border border-border",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-primary/10 text-primary border border-primary/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Modal ─────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text/40 animate-fade-in"
        onClick={onClose}
      />
      {/* Modal content */}
      <div
        className={cn(
          "relative w-full bg-surface border border-border rounded-xl animate-fade-in-up",
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-text">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted hover:text-text hover:bg-background transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-border/60", className)}
    />
  );
}

// ─── EmptyState ────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center mb-4 text-2xl text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

// ─── Section Header ────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", "mb-10", className)}>
      <h2 className="text-3xl font-semibold tracking-tight text-text mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-muted max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  show: boolean;
  onClose: () => void;
}

export function Toast({ message, type = "info", show, onClose }: ToastProps) {
  if (!show) return null;

  const types = {
    success: "bg-surface border-green-300 text-green-800",
    error: "bg-surface border-red-300 text-red-800",
    info: "bg-surface border-primary/40 text-primary",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-fade-in-up">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg border",
          types[type]
        )}
      >
        <span className="text-base font-semibold">{icons[type]}</span>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-current opacity-60 hover:opacity-100"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
