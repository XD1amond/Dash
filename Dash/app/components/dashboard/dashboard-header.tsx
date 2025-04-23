interface DashboardHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  title,
  description,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="mt-2 md:mt-0">{children}</div>}
    </div>
  )
}