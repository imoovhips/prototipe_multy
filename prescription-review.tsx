"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { TestTube, Stethoscope, UserCheck, Video, Clock, User, AlertCircle } from "lucide-react"
import type { ServiceType, SelectedService } from "@/app/page"

interface PrescriptionReviewProps {
  selectedServices: SelectedService[]
  onServicesChange: (services: SelectedService[]) => void
  onNext: () => void
}

const serviceIcons = {
  tests: TestTube,
  examinations: Stethoscope,
  "in-person": UserCheck,
  online: Video,
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  expired: "bg-gray-100 text-gray-600",
}

const statusLabels = {
  active: "Активное",
  expired: "Истекшее",
}

export function PrescriptionReview({ selectedServices, onServicesChange, onNext }: PrescriptionReviewProps) {
  const [urgentServices, setUrgentServices] = useState<string[]>([])

  const handleUrgentToggle = (serviceId: string) => {
    const newUrgentServices = urgentServices.includes(serviceId)
      ? urgentServices.filter((id) => id !== serviceId)
      : [...urgentServices, serviceId]

    setUrgentServices(newUrgentServices)

    onServicesChange(
      selectedServices.map((service) =>
        service.id === serviceId ? { ...service, urgent: newUrgentServices.includes(serviceId) } : service,
      ),
    )
  }

  const activeServices = selectedServices.filter((service) => service.status === "active")
  const expiredServices = selectedServices.filter((service) => service.status === "expired")

  const groupedActiveServices = activeServices.reduce(
    (acc, service) => {
      if (!acc[service.type]) {
        acc[service.type] = []
      }
      acc[service.type].push(service)
      return acc
    },
    {} as Record<ServiceType, SelectedService[]>,
  )

  const groupedExpiredServices = expiredServices.reduce(
    (acc, service) => {
      if (!acc[service.type]) {
        acc[service.type] = []
      }
      acc[service.type].push(service)
      return acc
    },
    {} as Record<ServiceType, SelectedService[]>,
  )

  const typeLabels = {
    tests: "Анализы",
    examinations: "Обследования",
    "in-person": "Очные приемы",
    online: "Онлайн консультации",
  }

  const renderServiceGroup = (services: SelectedService[], isExpired = false) => {
    const groupedServices = services.reduce(
      (acc, service) => {
        if (!acc[service.type]) {
          acc[service.type] = []
        }
        acc[service.type].push(service)
        return acc
      },
      {} as Record<ServiceType, SelectedService[]>,
    )

    return Object.entries(groupedServices).map(([type, serviceList]) => {
      const Icon = serviceIcons[type as ServiceType]

      return (
        <div key={type} className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${isExpired ? "text-muted-foreground" : "text-primary"}`} />
            <h3 className={`text-lg font-medium ${isExpired ? "text-muted-foreground" : ""}`}>
              {typeLabels[type as ServiceType]}
            </h3>
            <Badge variant="outline">{serviceList.length}</Badge>
          </div>

          <div className="grid gap-3">
            {serviceList.map((service) => (
              <Card key={service.id} className={`transition-all ${isExpired ? "opacity-60" : "hover:shadow-md"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {service.name}
                        <Badge className={statusColors[service.status || "active"]}>
                          {statusLabels[service.status || "active"]}
                        </Badge>
                      </CardTitle>

                      {service.prescribedBy && (
                        <div className="flex items-center gap-1 mt-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{service.prescribedBy}</span>
                        </div>
                      )}

                      {service.notes && <CardDescription className="mt-1">{service.notes}</CardDescription>}
                    </div>
                  </div>
                </CardHeader>

                {!isExpired && (
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`urgent-${service.id}`}
                        checked={urgentServices.includes(service.id)}
                        onCheckedChange={() => handleUrgentToggle(service.id)}
                      />
                      <label
                        htmlFor={`urgent-${service.id}`}
                        className="text-sm cursor-pointer flex items-center gap-1"
                      >
                        <Clock className="h-4 w-4" />
                        Срочно (1-2 дня)
                      </label>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Ваши направления</h2>
        <p className="text-muted-foreground">
          Проверьте назначенные процедуры. Активные направления доступны для записи
        </p>
      </div>

      {activeServices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-foreground flex items-center gap-2">
            Активные направления
            <Badge variant="default">{activeServices.length}</Badge>
          </h3>
          {renderServiceGroup(activeServices)}

          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Доступно к записи:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(groupedActiveServices).map(([type, services]) => (
                <div key={type} className="text-center">
                  <div className="font-medium">{services.length}</div>
                  <div className="text-muted-foreground">{typeLabels[type as ServiceType]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-lg border">
            <div className="text-center">
              <h3 className="font-medium text-lg mb-1">Готовы записаться?</h3>
              <p className="text-sm text-muted-foreground">
                Система автоматически подберет оптимальные варианты для всех ваших направлений
              </p>
            </div>
            <Button onClick={onNext} size="lg" className="w-full">
              Записаться на все ({activeServices.length})
            </Button>
          </div>
        </div>
      )}

      {expiredServices.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Истекшие направления
            <Badge variant="outline">{expiredServices.length}</Badge>
          </h3>
          {renderServiceGroup(expiredServices, true)}
          <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-muted">
            <p className="text-sm text-muted-foreground">
              Истекшие направления недоступны для записи. Обратитесь к врачу для получения новых направлений.
            </p>
          </div>
        </div>
      )}

      {activeServices.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">Нет активных направлений</h3>
          <p className="text-muted-foreground">
            Все ваши направления истекли. Обратитесь к врачу для получения новых направлений.
          </p>
        </div>
      )}
    </div>
  )
}
