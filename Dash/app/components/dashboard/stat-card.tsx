import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCardData } from "@/types/dashboard"

type StatCardProps = StatCardData

export function StatCard({ title, value, change, changeType }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
              changeType === "increase"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            )}
          >
            {changeType === "increase" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            <span>{change}%</span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}