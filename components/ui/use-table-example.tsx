"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { UseTable } from "./use-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Users, Shield, Activity } from "lucide-react"

/**
 * Exemplo de uso do componente UseTable
 * Demonstra layout responsivo, filtros dinâmicos e funcionalidades avançadas
 */

// Dados mock para demonstração
interface MockUser {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending"
  role: string
  department: string
  created_at: string
}

const mockData: MockUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "ADMIN",
    department: "IT",
    created_at: "2024-01-15"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    role: "MANAGER",
    department: "HR",
    created_at: "2024-02-20"
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "inactive",
    role: "USER",
    department: "Sales",
    created_at: "2024-03-10"
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    status: "pending",
    role: "USER",
    department: "Marketing",
    created_at: "2024-03-25"
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "active",
    role: "MANAGER",
    department: "Finance",
    created_at: "2024-04-05"
  }
]

export function UseTableExample() {
  // Definição das colunas
  const columns: ColumnDef<MockUser>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                ID: {user.id}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.email}</div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge 
            variant={
              status === "active" ? "default" : 
              status === "pending" ? "secondary" : 
              "outline"
            }
            className="capitalize"
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role
        return (
          <Badge 
            variant={role === "ADMIN" ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            {role}
          </Badge>
        )
      },
    },
    {
      id: "department",
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.department}</div>
      ),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Configuração dos filtros
  const filterConfig = [
    {
      id: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" }
      ]
    },
    {
      id: "role",
      title: "Role",
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Manager", value: "MANAGER" },
        { label: "User", value: "USER" }
      ]
    },
    {
      id: "department",
      title: "Department",
      options: [
        { label: "IT", value: "IT" },
        { label: "HR", value: "HR" },
        { label: "Sales", value: "Sales" },
        { label: "Marketing", value: "Marketing" },
        { label: "Finance", value: "Finance" }
      ]
    }
  ]

  const handleRowClick = (user: MockUser) => {
    console.log("Row clicked:", user)
    // Aqui você pode abrir um modal, navegar para detalhes, etc.
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">UseTable Component Example</h2>
        <p className="text-muted-foreground">
          Demonstração do componente UseTable com layout responsivo, filtros dinâmicos e funcionalidades avançadas.
        </p>
      </div>

      <UseTable
        data={mockData}
        columns={columns}
        filters={filterConfig}
        searchKey="name"
        onRowClick={handleRowClick}
      />

      <div className="p-4 bg-muted/30 rounded-lg space-y-2">
        <h4 className="font-semibold">Funcionalidades Demonstradas:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Layout Flex:</strong> Search bar no topo, controles em flex com justify-between</li>
          <li>• <strong>Filtros Inline:</strong> Todos os filtros em flex-row com bordas padronizadas</li>
          <li>• <strong>Mobile Expandable:</strong> Rows expansíveis com informações em grid responsivo</li>
          <li>• <strong>Colunas Padrão:</strong> Todas as colunas visíveis por padrão, ocultação progressiva responsiva</li>
          <li>• <strong>Filtros dinâmicos:</strong> Status, Role e Department com indicadores visuais ativos</li>
          <li>• <strong>Search global:</strong> Busca por nome com clear button e borda destacada</li>
          <li>• <strong>Botões com Bordas:</strong> Todos os botões com border-2 e hover effects</li>
          <li>• <strong>Seleção de linhas:</strong> Checkbox para seleção múltipla</li>
          <li>• <strong>Ordenação:</strong> Clique nos headers para ordenar</li>
          <li>• <strong>Paginação:</strong> Controles Previous/Next com seletor de itens por página</li>
          <li>• <strong>Visibilidade de colunas:</strong> Dropdown sempre disponível</li>
          <li>• <strong>Actions:</strong> Menu dropdown com ações para cada linha</li>
          <li>• <strong>Responsivo:</strong> Container com max-w-screen e layout adaptativo</li>
          <li>• <strong>UX Mobile:</strong> Informações detalhadas em grid 2 colunas expandível</li>
          <li>• <strong>Colunas Progressivas:</strong> Ocultar colunas automaticamente em telas menores</li>
          <li>• <strong>Alinhamento Inteligente:</strong> Items à esquerda, actions à direita</li>
          <li>• <strong>Container Máximo:</strong> Usa toda a largura da tela para máxima responsividade</li>
          <li>• <strong>Expansão Completa:</strong> Todas as colunas aparecem na expansão mobile (exceto actions)</li>
          <li>• <strong>Botão Collapse Micro:</strong> Largura mínima (w-6) sem padding, botão 20x20px</li>
          <li>• <strong>Clear Filter Minimalista:</strong> Botão X integrado aos filtros, apenas 32x32px</li>
          <li>• <strong>Altura Padronizada:</strong> Todos os elementos com h-8 para consistência</li>
          <li>• <strong>Suporte Multi-Select:</strong> Múltiplos filtros em linha horizontal</li>
        </ul>
      </div>
    </div>
  )
}


