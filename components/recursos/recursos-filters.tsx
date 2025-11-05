"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface RecursosFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  categorias: string[]
  selectedCategoria: string | null
  onCategoriaChange: (categoria: string | null) => void
}

export function RecursosFilters({
  searchTerm,
  onSearchChange,
  categorias,
  selectedCategoria,
  onCategoriaChange,
}: RecursosFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar recursos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filters */}
      {categorias.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategoria === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoriaChange(null)}
          >
            Todas
          </Button>
          {categorias.map((categoria) => (
            <Button
              key={categoria}
              variant={selectedCategoria === categoria ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoriaChange(categoria)}
            >
              {categoria}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
