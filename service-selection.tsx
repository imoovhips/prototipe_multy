"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { TestTube, Stethoscope, UserCheck, Video } from "lucide-react"
import type { ServiceType, SelectedService } from "@/app/page"

interface ServiceSelectionProps {
  selectedServices: SelectedService[]
  onServicesChange: (services: SelectedService[]) => void
  onNext: () => void
}

const serviceOptions = [
  {
    id: "blood-test",
    type: "tests" as ServiceType,
    name: "Анализы крови",
    description: "Общий, биохимический, на гормоны",
    icon: TestTube,
    urgent: false,
    popular: true,
  },
  {
    id: "ultrasound",
    type: "examinations" as ServiceType,
    name: "УЗИ обследование",
    description: "Органов брюшной полости, малого таза",
    icon: Stethoscope,
    urgent: false,
    popular: true,
  },
  {
    id: "cardiologist",
    type: "in-person" as ServiceType,
    name: "Прием кардиолога",
    description: "Консультация и осмотр специалиста",
    icon: UserCheck,
    urgent: false,
    popular: false,
  },
  {
    id: "online-consultation",
    type: "online" as ServiceType,
    name: "Онлайн консультация",
    description: "Видеосвязь с врачом",
    icon: Video,
    urgent: false,
    popular: true,
  },
]

export function ServiceSelection({ selectedServices, onServicesChange, onNext }: ServiceSelectionProps) {
  const [urgentServices, setUrgentServices] = useState<string[]>([])

  const handleServiceToggle = (service: (typeof serviceOptions)[0]) => {
    const isSelected = selectedServices.some((s) => s.id === service.id)

    if (isSelected) {
      onServicesChange(selectedServices.filter((s) => s.id !== service.id))
      setUrgentServices(urgentServices.filter((id) => id !== service.id))
    } else {
      onServicesChange([
        ...selectedServices,
        {
          id: service.id,
          type: service.type,
          name: service.name,
          urgent: urgentServices.includes(service.id),
        },
      ])
    }
  }

  const handleUrgentToggle = (serviceId: string) => {
    const newUrgentServices = urgentServices.includes(serviceId)
      ? urgentServices.filter((id) => id !== serviceId)
      : [...urgentServices, serviceId]

    setUrgentServices(newUrgentServices)

    // Update selected services with urgent flag
    onServicesChange(
      selectedServices.map((service) =>
        service.id === serviceId ? { ...service, urgent: newUrgentServices.includes(serviceId) } : service,
      ),
    )
  }

  const isServiceSelected = (serviceId: string) => selectedServices.some((s) => s.id === serviceId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Какие услуги вам нужны?</h2>
        <p className="text-muted-foreground">Выберите все необходимые услуги. Мы составим оптимальный маршрут.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serviceOptions.map((service) => {
          const Icon = service.icon
          const isSelected = isServiceSelected(service.id)

          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => handleServiceToggle(service)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {service.name}
                        {service.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Популярно
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">{service.description}</CardDescription>
                    </div>
                  </div>
                  <Checkbox checked={isSelected} onChange={() => handleServiceToggle(service)} />
                </div>
              </CardHeader>

              {isSelected && (
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`urgent-${service.id}`}
                      checked={urgentServices.includes(service.id)}
                      onCheckedChange={() => handleUrgentToggle(service.id)}
                    />
                    <label htmlFor={`urgent-${service.id}`} className="text-sm text-muted-foreground cursor-pointer">
                      Срочно (в течение 1-2 дней)
                    </label>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {selectedServices.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Выбранные услуги:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedServices.map((service) => (
              <Badge key={service.id} variant="outline" className="gap-1">
                {service.name}
                {service.urgent && <span className="text-destructive">⚡</span>}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={selectedServices.length === 0} className="px-8">
          Далее
        </Button>
      </div>
    </div>
  )
}
