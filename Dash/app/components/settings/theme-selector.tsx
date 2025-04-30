"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"

interface ThemeSelectorProps {
  onThemeChange?: (theme: string) => void
}

interface ThemeOption {
  id: string
  name: string
  icon: React.ReactNode
  preview?: string
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string>(theme || "system")
  const [showThemeSelector, setShowThemeSelector] = useState(false)

  // Basic themes
  const basicThemes: ThemeOption[] = [
    {
      id: "light",
      name: "Light",
      icon: <Sun className="h-6 w-6" />
    },
    {
      id: "dark",
      name: "Dark",
      icon: <Moon className="h-6 w-6" />
    },
    {
      id: "system",
      name: "System",
      icon: <Monitor className="h-6 w-6" />
    }
  ]

  // Custom themes
  const customThemes: ThemeOption[] = [
    {
      id: "catppuccin",
      name: "Catppuccin",
      icon: <Palette className="h-6 w-6" />,
      preview: "/themes/catppuccin-preview.svg"
    },
    {
      id: "gruvbox",
      name: "Gruvbox",
      icon: <Palette className="h-6 w-6" />,
      preview: "/themes/gruvbox-preview.svg"
    },
    {
      id: "nord",
      name: "Nord",
      icon: <Palette className="h-6 w-6" />,
      preview: "/themes/nord-preview.svg"
    }
  ]

  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme)
    setTheme(newTheme)
    if (onThemeChange) {
      onThemeChange(newTheme)
    }
  }

  // Toggle theme selector
  const toggleThemeSelector = () => {
    setShowThemeSelector(!showThemeSelector)
  }

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    if (theme) {
      setSelectedTheme(theme)
    }
  }, [theme])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Basic theme selection */}
      <div className="grid grid-cols-3 gap-4">
        {basicThemes.map((themeOption) => (
          <Button
            key={themeOption.id}
            variant={selectedTheme === themeOption.id ? "default" : "outline"}
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => handleThemeChange(themeOption.id)}
          >
            {themeOption.icon}
            <span>{themeOption.name}</span>
          </Button>
        ))}
      </div>

      {/* Theme gallery toggle */}
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={toggleThemeSelector}
      >
        <Palette className="h-5 w-5" />
        <span>Browse More Themes</span>
      </Button>

      {/* Extended theme gallery */}
      {showThemeSelector && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customThemes.map((themeOption) => (
                <div 
                  key={themeOption.id}
                  className={`rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                    selectedTheme === themeOption.id ? 'border-primary ring-2 ring-primary/50' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleThemeChange(themeOption.id)}
                >
                  <div className="aspect-video bg-muted relative">
                    {themeOption.preview ? (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <img
                          src={themeOption.preview}
                          alt={`${themeOption.name} theme preview`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        {themeOption.icon}
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="font-medium">{themeOption.name}</span>
                    {selectedTheme === themeOption.id && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Active</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}