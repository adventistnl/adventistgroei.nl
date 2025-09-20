"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  FileText,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Image,
  File,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { projectTranslations } from "@/lib/translations/projects"
import { ActivityData } from "@/components/projects/project-subsidies-table"

interface ViewReceiptsModalProps {
  isOpen: boolean
  onClose: () => void
  activity?: ActivityData
  onEditReceipt?: (receipt: any) => void
  onDeleteReceipt?: (receipt: any) => void
}

export function ViewReceiptsModal({ 
  isOpen, 
  onClose, 
  activity, 
  onEditReceipt, 
  onDeleteReceipt 
}: ViewReceiptsModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [selectedReceiptForView, setSelectedReceiptForView] = useState<any>(null)

  if (!activity) {
    return null
  }

  const getFileIcon = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase()
    if (extension === 'pdf') {
      return <File className="w-6 h-6 text-red-500" />
    }
    return <Image className="w-6 h-6 text-blue-500" />
  }

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'pt': return ptBR
      default: return ptBR
    }
  }

  const handleViewReceipt = (receipt: any) => {
    const extension = receipt.file_path.split('.').pop()?.toLowerCase()
    if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
      setSelectedReceiptForView(receipt)
    } else {
      // For PDFs, trigger download
      console.log('Download PDF:', receipt.file_path)
      // TODO: Implement actual download
    }
  }

  const handleDownloadReceipt = (receipt: any) => {
    console.log('Download receipt:', receipt.file_path)
    // TODO: Implement actual download
  }

  return (
    <>
      {/* Main Receipts List Modal */}
      <Dialog open={isOpen && !selectedReceiptForView} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t.activity.viewReceipts}
            </DialogTitle>
            <DialogDescription>
              {activity.name} - {activity.receipts.length} recibos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-medium text-primary">R$ {activity.budget_amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Orçamento</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-medium text-green-600">R$ {activity.approvedAmount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Aprovado</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-medium">{activity.receipts.length}</div>
                  <div className="text-xs text-muted-foreground">Recibos</div>
                </CardContent>
              </Card>
            </div>

            {/* Receipts List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {activity.receipts.map((receipt) => (
                  <Card key={receipt.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="cursor-pointer hover:scale-110 transition-transform" 
                            onClick={() => handleViewReceipt(receipt)}
                          >
                            {getFileIcon(receipt.file_path)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{receipt.description}</span>
                              <Badge 
                                variant="outline" 
                                className={receipt.approved ? 
                                  "text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" : 
                                  "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
                                }
                              >
                                {receipt.approved ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Aprovado
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Pendente
                                  </>
                                )}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(receipt.receipt_date), "dd/MM/yyyy", { locale: getDateLocale() })}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                R$ {receipt.amount.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewReceipt(receipt)}
                            className="gap-1 text-primary hover:bg-primary/5"
                          >
                            <Eye className="w-3 h-3" />
                            <span className="hidden sm:inline">Ver</span>
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => handleDownloadReceipt(receipt)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEditReceipt?.(receipt)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => onDeleteReceipt?.(receipt)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal */}
      {selectedReceiptForView && (
        <Dialog open={!!selectedReceiptForView} onOpenChange={() => setSelectedReceiptForView(null)}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Visualizar Recibo
                  </DialogTitle>
                  <DialogDescription>
                    {selectedReceiptForView.description}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Receipt Details */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="font-medium">R$ {selectedReceiptForView.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Valor</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="font-medium">
                      {format(new Date(selectedReceiptForView.receipt_date), "dd/MM/yyyy", { locale: getDateLocale() })}
                    </div>
                    <div className="text-xs text-muted-foreground">Data</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    {selectedReceiptForView.approved ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                    )}
                    <div className="font-medium">
                      {selectedReceiptForView.approved ? "Aprovado" : "Pendente"}
                    </div>
                    <div className="text-xs text-muted-foreground">Status</div>
                  </CardContent>
                </Card>
              </div>

              {/* Image Preview */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-full max-w-lg mx-auto bg-muted/30 rounded-lg p-8 border-2 border-dashed border-primary/20">
                      <div className="text-center text-muted-foreground">
                        <Image className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-sm font-medium mb-2">Prévia da Imagem do Recibo</p>
                        <p className="text-xs">
                          {selectedReceiptForView.file_path.split('/').pop()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          (Em um sistema real, a imagem seria exibida aqui)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadReceipt(selectedReceiptForView)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onEditReceipt?.(selectedReceiptForView)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
              </div>
              <Button variant="outline" onClick={() => setSelectedReceiptForView(null)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}