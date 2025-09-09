"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Calendar, Search, CheckCircle } from "lucide-react"
import type { SelectedService, UserData, Clinic, BookingItem } from "@/app/page"
import TimeSlots from "./time-slots" // Предполагается, что компонент TimeSlots уже существует

interface ClinicMapProps {
  selectedServices: SelectedService[]
  userData: UserData
  bookings: BookingItem[]
  onBookingsChange: (bookings: BookingItem[]) => void
  onNext: () => void
  onPrev: () => void
}

// Моковые данные клиник
const mockClinics: Clinic[] = [
  {
    id: "clinic-1",
    name: 'МедЦентр "Здоровье+"',
    address: "ул. Ленина, 15",
    distance: 0.8,
    services: ["tests", "examinations", "in-person"],
    availableSlots: ["09:00", "11:30", "14:00", "16:30"],
    rating: 4.8,
  },
  {
    id: "clinic-2",
    name: 'Клиника "Семейный доктор"',
    address: "пр. Мира, 42",
    distance: 1.2,
    services: ["tests", "in-person", "online"],
    availableSlots: ["08:30", "10:00", "15:00", "17:00"],
    rating: 4.6,
  },
  {
    id: "clinic-3",
    name: 'Диагностический центр "Точность"',
    address: "ул. Советская, 8",
    distance: 2.1,
    services: ["tests", "examinations"],
    availableSlots: ["07:30", "09:30", "13:00", "15:30"],
    rating: 4.9,
  },
]

const extendedClinics: Clinic[] = [
  ...mockClinics,
  {
    id: "clinic-4",
    name: 'Многопрофильная клиника "Медлайф"',
    address: "ул. Гагарина, 23",
    distance: 3.2,
    services: ["tests", "examinations", "in-person", "online"],
    availableSlots: ["08:00", "12:00", "16:00", "18:00"],
    rating: 4.7,
  },
  {
    id: "clinic-5",
    name: 'Центр здоровья "Витал+"',
    address: "ул. Пушкина, 67",
    distance: 4.1,
    services: ["tests", "examinations", "in-person"],
    availableSlots: ["09:30", "13:30", "17:30"],
    rating: 4.5,
  },
  {
    id: "clinic-6",
    name: 'Лабораторный центр "БиоТест"',
    address: "пр. Победы, 89",
    distance: 5.0,
    services: ["tests", "examinations"],
    availableSlots: ["07:00", "11:00", "14:30", "18:30"],
    rating: 4.8,
  },
  {
    id: "clinic-7",
    name: 'Телемедицинский центр "ДокторОнлайн"',
    address: "Онлайн консультации",
    distance: 0,
    services: ["online"],
    availableSlots: ["09:00", "12:00", "15:00", "18:00", "21:00"],
    rating: 4.4,
  },
]

export function ClinicMap({ selectedServices, userData, bookings, onBookingsChange, onNext, onPrev }: ClinicMapProps) {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({})
  const [showExtendedSearch, setShowExtendedSearch] = useState(false)
  const [singleClinicMode, setSingleClinicMode] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [showTimeSlots, setShowTimeSlots] = useState(false)

  const serviceGroups = selectedServices.reduce(
    (groups, service) => {
      if (!groups[service.type]) {
        groups[service.type] = []
      }
      groups[service.type].push(service)
      return groups
    },
    {} as Record<string, SelectedService[]>,
  )

  const getFullServiceClinics = () => {
    const requiredServiceTypes = [...new Set(selectedServices.map((s) => s.type))]
    const clinicsToUse = showExtendedSearch ? extendedClinics : mockClinics

    return clinicsToUse
      .filter((clinic) => requiredServiceTypes.every((serviceType) => clinic.services.includes(serviceType as any)))
      .sort((a, b) => a.distance - b.distance)
  }

  const getRelevantClinics = (serviceType: string) => {
    const clinicsToUse = showExtendedSearch ? extendedClinics : mockClinics
    return clinicsToUse
      .filter((clinic) => clinic.services.includes(serviceType as any))
      .sort((a, b) => a.distance - b.distance)
  }

  const handleClinicSelection = (clinic: Clinic) => {
    setSelectedClinic(clinic)
    setShowTimeSlots(true)
  }

  const handleBackToClinicSelection = () => {
    setShowTimeSlots(false)
    setSelectedClinic(null)
  }

  const handleSlotSelection = (serviceId: string, clinicId: string, slot: string) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [`${serviceId}-${clinicId}`]: slot,
    }))

    const service = selectedServices.find((s) => s.id === serviceId)
    const clinic = showExtendedSearch
      ? extendedClinics.find((c) => c.id === clinicId)
      : mockClinics.find((c) => c.id === clinicId)

    if (service && clinic) {
      const newBooking: BookingItem = {
        service,
        clinic,
        slot,
        date: getNextAvailableDate(service.urgent),
      }

      const updatedBookings = bookings.filter((b) => b.service.id !== serviceId)
      onBookingsChange([...updatedBookings, newBooking])
    }
  }

  const getNextAvailableDate = (urgent?: boolean) => {
    const today = new Date()
    const daysToAdd = urgent ? 1 : 3
    const targetDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
    return targetDate.toLocaleDateString("ru-RU")
  }

  const allServicesBooked = selectedServices.every((service) =>
    bookings.some((booking) => booking.service.id === service.id),
  )

  const fullServiceClinics = getFullServiceClinics()
  const hasFullServiceClinics = fullServiceClinics.length > 0

  if (showTimeSlots && selectedClinic) {
    return (
      <TimeSlots
        selectedServices={selectedServices}
        selectedClinic={selectedClinic}
        bookings={bookings}
        onBookingsChange={onBookingsChange}
        onNext={onNext}
        onBack={handleBackToClinicSelection}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Выберите клиники и время</h2>
        <p className="text-muted-foreground">
          {showExtendedSearch
            ? "Показаны все доступные клиники в вашем городе"
            : "Мы подобрали оптимальный маршрут с учетом ваших предпочтений"}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={!showExtendedSearch && !singleClinicMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setShowExtendedSearch(false)
              setSingleClinicMode(false)
            }}
          >
            Рекомендуемые
          </Button>
          <Button
            variant={showExtendedSearch && !singleClinicMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setShowExtendedSearch(true)
              setSingleClinicMode(false)
            }}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Все клиники
          </Button>
          {hasFullServiceClinics && (
            <Button
              variant={singleClinicMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSingleClinicMode(true)
                setShowExtendedSearch(false)
              }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Записаться в одну клинику
            </Button>
          )}
        </div>

        {!showExtendedSearch && !singleClinicMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExtendedSearch(true)}
            className="text-primary hover:text-primary/80"
          >
            Не вижу нужную клинику →
          </Button>
        )}
      </div>

      {singleClinicMode && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Все услуги в одном месте
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              Мы нашли клиники, где вы можете пройти все назначенные процедуры в один день. Это сэкономит ваше время и
              упростит логистику.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fullServiceClinics.map((clinic) => (
                <Card key={clinic.id} className="cursor-pointer hover:shadow-md transition-all border-green-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">{clinic.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {clinic.address} {clinic.distance > 0 && `• ${clinic.distance} км`}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{clinic.rating}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-green-700">Доступные услуги:</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedServices.map((service) => (
                            <Badge key={service.id} variant="secondary" className="text-xs">
                              {service.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Доступно с {getNextAvailableDate()}
                      </div>

                      <div className="space-y-2">
                        <Button onClick={() => handleClinicSelection(clinic)} className="w-full" size="sm">
                          Выбрать время
                        </Button>
                        <p className="text-xs text-green-600 text-center">✓ Включено в ваш пакет услуг</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!showExtendedSearch && !singleClinicMode && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Рекомендуемый маршрут
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(serviceGroups).map(([type, services], index) => (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {type === "tests" && "Анализы"}
                      {type === "examinations" && "Обследования"}
                      {type === "in-person" && "Очный прием"}
                      {type === "online" && "Онлайн консультация"}
                    </div>
                    <div className="text-sm text-muted-foreground">{services.map((s) => s.name).join(", ")}</div>
                  </div>
                  {services.some((s) => s.urgent) && (
                    <Badge variant="destructive" className="text-xs">
                      Срочно
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showExtendedSearch && !singleClinicMode && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Search className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Расширенный поиск клиник</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Показаны все доступные клиники. Расстояние может быть больше, но у вас больше вариантов выбора времени
                  и специалистов.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!singleClinicMode && (
        <div className="space-y-6">
          {selectedServices.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{service.name}</span>
                  {service.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      ⚡ Срочно
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getRelevantClinics(service.type).map((clinic) => (
                    <Card key={clinic.id} className="cursor-pointer hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">{clinic.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {clinic.address} {clinic.distance > 0 && `• ${clinic.distance} км`}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{clinic.rating}</span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Доступное время:</Label>
                            <Button
                              variant="outline"
                              className="w-full mt-1 justify-start bg-transparent"
                              onClick={() => handleClinicSelection(clinic)}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Выбрать время
                            </Button>
                          </div>

                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {getNextAvailableDate(service.urgent)}
                          </div>

                          <div className="text-xs text-green-600 text-center">✓ Включено в ваш пакет услуг</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Назад
        </Button>
        <Button onClick={onNext} disabled={!allServicesBooked} className="px-8">
          Подтвердить запись
        </Button>
      </div>
    </div>
  )
}
