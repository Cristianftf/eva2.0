import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, FileX, RefreshCw } from "lucide-react"

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = "Cargando...", className = "" }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

interface ErrorStateProps {
  error: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ error, onRetry, className = "" }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md">{description}</p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface SkeletonListProps {
  count?: number
  className?: string
}

export function SkeletonList({ count = 3, className = "" }: SkeletonListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  )
}

interface SkeletonGridProps {
  count?: number
  columns?: number
  className?: string
}

export function SkeletonGrid({ count = 6, columns = 3, className = "" }: SkeletonGridProps) {
  return (
    <div className={`grid gap-6 ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  )
}