"use client"

import * as React from "react"
import { ResponsiveGridCarousel } from "./responsive-grid-carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, PieChart, TrendingUp, Users, DollarSign, Activity, Shield, Lock } from "lucide-react"

/**
 * Exemplos práticos do layout inteligente do ResponsiveGridCarousel
 * Demonstra como o componente adapta automaticamente baseado no número de children
 */

// Mock component para simular gráficos
function MockChart({ 
  title, 
  icon: Icon, 
  color = "blue" 
}: { 
  title: string
  icon: React.ComponentType<any>
  color?: string 
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`w-4 h-4 text-${color}-600`} />
          {title}
        </CardTitle>
        <CardDescription className="text-sm">
          Sample chart visualization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`h-48 bg-${color}-50 rounded-lg flex items-center justify-center border border-${color}-200`}>
          <div className="text-center">
            <Icon className={`w-8 h-8 text-${color}-400 mx-auto mb-2`} />
            <p className={`text-sm text-${color}-600 font-medium`}>{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Exemplo 1: Layout com 1 item (100% width)
export function OneItemExample() {
  return (
    <div className="space-y-4">
      <div className="px-4">
        <h3 className="text-lg font-semibold">Layout com 1 Item</h3>
        <p className="text-sm text-muted-foreground">
          Item único ocupa toda a largura disponível
        </p>
      </div>
      
      <ResponsiveGridCarousel
        enableAutoplay={false}
        gap="gap-6"
      >
        <MockChart title="Revenue Analytics" icon={DollarSign} color="green" />
      </ResponsiveGridCarousel>
    </div>
  )
}

// Exemplo 2: Layout com 2 itens (50% cada)
export function TwoItemsExample() {
  return (
    <div className="space-y-4">
      <div className="px-4">
        <h3 className="text-lg font-semibold">Layout com 2 Itens</h3>
        <p className="text-sm text-muted-foreground">
          Cada item ocupa 50% da largura em desktop
        </p>
      </div>
      
      <ResponsiveGridCarousel
        enableAutoplay={false}
        gap="gap-6"
      >
        <MockChart title="User Growth" icon={Users} color="blue" />
        <MockChart title="Revenue Trends" icon={TrendingUp} color="green" />
      </ResponsiveGridCarousel>
    </div>
  )
}

// Exemplo 3: Layout com 3 itens (primeiro 100%, outros dois 50% cada)
export function ThreeItemsExample() {
  return (
    <div className="space-y-4">
      <div className="px-4">
        <h3 className="text-lg font-semibold">Layout com 3 Itens</h3>
        <p className="text-sm text-muted-foreground">
          Primeiro item 100%, segundo e terceiro dividem a linha abaixo (50% cada)
        </p>
      </div>
      
      <ResponsiveGridCarousel
        enableAutoplay={false}
        gap="gap-6"
      >
        <MockChart title="Main Dashboard" icon={BarChart3} color="purple" />
        <MockChart title="User Activity" icon={Activity} color="orange" />
        <MockChart title="Security Metrics" icon={Shield} color="red" />
      </ResponsiveGridCarousel>
    </div>
  )
}

// Exemplo 4: Layout com 4+ itens (grid responsivo)
export function MultipleItemsExample() {
  return (
    <div className="space-y-4">
      <div className="px-4">
        <h3 className="text-lg font-semibold">Layout com 6 Itens</h3>
        <p className="text-sm text-muted-foreground">
          Grid responsivo com máximo 2 linhas: 4 itens na primeira linha, 2 na segunda
        </p>
      </div>
      
      <ResponsiveGridCarousel
        enableAutoplay={false}
        gap="gap-4"
      >
        <MockChart title="Users" icon={Users} color="blue" />
        <MockChart title="Revenue" icon={DollarSign} color="green" />
        <MockChart title="Activity" icon={Activity} color="orange" />
        <MockChart title="Security" icon={Shield} color="red" />
        <MockChart title="Permissions" icon={Lock} color="purple" />
        <MockChart title="Analytics" icon={PieChart} color="indigo" />
      </ResponsiveGridCarousel>
    </div>
  )
}

// Exemplo 5: Demonstração com conteúdo misto
export function MixedContentExample() {
  const mixedContent = [
    <MockChart key="chart1" title="Main Analytics" icon={BarChart3} color="blue" />,
    
    <Card key="stats" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-600" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Total Users</span>
          <Badge variant="secondary">1,234</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Active Now</span>
          <Badge variant="secondary">89</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Growth Rate</span>
          <Badge variant="secondary">+12%</Badge>
        </div>
      </CardContent>
    </Card>,
    
    <MockChart key="chart2" title="Performance" icon={TrendingUp} color="green" />
  ]

  return (
    <div className="space-y-4">
      <div className="px-4">
        <h3 className="text-lg font-semibold">Conteúdo Misto</h3>
        <p className="text-sm text-muted-foreground">
          Mistura de gráficos e cards de estatísticas
        </p>
      </div>
      
      <ResponsiveGridCarousel
        enableAutoplay={false}
        gap="gap-6"
      >
        {mixedContent}
      </ResponsiveGridCarousel>
    </div>
  )
}

// Exemplo completo com todos os layouts
export function AllLayoutsDemo() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">ResponsiveGridCarousel - Layout Inteligente</h2>
        <p className="text-muted-foreground">
          Demonstração de como o componente adapta automaticamente baseado no número de children
        </p>
      </div>
      
      <OneItemExample />
      <TwoItemsExample />
      <ThreeItemsExample />
      <MultipleItemsExample />
      <MixedContentExample />
      
      <div className="px-4 p-6 bg-muted/30 rounded-lg">
        <h4 className="font-semibold mb-2">Características do Layout Inteligente:</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• <strong>1 item:</strong> Ocupa toda a largura (100%)</li>
          <li>• <strong>2 itens:</strong> Cada um ocupa 50% da largura</li>
          <li>• <strong>3 itens:</strong> Primeiro 100%, outros dois 50% cada na linha abaixo</li>
          <li>• <strong>4+ itens:</strong> Grid responsivo com máximo 2 linhas</li>
          <li>• <strong>Container:</strong> Centralizado com <code>max-w-screen-xl</code></li>
          <li>• <strong>Responsivo:</strong> Vira carousel em telas menores que md</li>
          <li>• <strong>Sem overflow:</strong> Sempre respeita os limites da tela</li>
        </ul>
      </div>
    </div>
  )
}
