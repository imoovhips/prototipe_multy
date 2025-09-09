"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Star, ArrowLeft } from "lucide-react"
import type { SelectedService, Clinic, BookingItem } from "@/app/page"

interface TimeSlotsProps {
  selectedServices: SelectedService[]
  selectedClinic: Clinic
  bookings: BookingItem[]
  onBookingsChange: (bookings: BookingItem[]) => void
  onNext: () => void
  onBack: () => void
}

// Генерация слотов на несколько дней
const generateTimeSlots = (clinic: Clinic, days = 7) => {
  const slots = []
  const today = new Date()

  for (let day = 1; day <= days; day++) {
    const date = new Date(today.getTime() + day * 24 * 60 * 60 * 1000)
    const dateStr = date.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })

    // Для каждого дня генерируем доступные слоты
    const daySlots = clinic.availableSlots.map((time) => ({
      date: date.toLocaleDateString("ru-RU"),
      dateStr,
      time,
      available: Math.random() > 0.3, // 70% слотов доступны
    }))

    slots.push(...daySlots)
  }

  return slots
}

const TimeSlots = ({
  selectedServices,
  selectedClinic,
  bookings,
  onBookingsChange,
  onNext,
  onBack,
}: TimeSlotsProps) => {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, { date: string; time: string }>>({})

  const timeSlots = generateTimeSlots(selectedClinic)
  const groupedSlots = timeSlots.reduce(
    (groups, slot) => {
      if (!groups[slot.dateStr]) {
        groups[slot.dateStr] = []
      }
      groups[slot.dateStr].push(slot)
      return groups
    },
    {} as Record<string, typeof timeSlots>,
  )

  const handleSlotSelection = (serviceId: string, date: string, time: string) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [serviceId]: { date, time },
    }))

    const service = selectedServices.find((s) => s.id === serviceId)
    if (service) {
      const newBooking: BookingItem = {
        service,
        clinic: selectedClinic,
        slot: time,
        date,
      }

      const updatedBookings = bookings.filter((b) => b.service.id !== serviceId)
      onBookingsChange([...updatedBookings, newBooking])
    }
  }

  const allServicesBooked = selectedServices.every((service) =>
    bookings.some((booking) => booking.service.id === service.id),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад к клиникам
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Выберите время записи</h2>
          <p className="text-muted-foreground">Клиника: {selectedClinic.name}</p>
        </div>
      </div>

      {/* Информация о клинике */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{selectedClinic.name}</h3>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {selectedClinic.address}
                {selectedClinic.distance > 0 && ` • ${selectedClinic.distance} км`}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{selectedClinic.rating}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Услуги:</div>
              <div className="flex flex-wrap gap-1 mt-1 justify-end">
                {selectedServices.map((service) => (
                  <Badge key={service.id} variant="secondary" className="text-xs">
                    {service.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Выбор времени для каждой услуги */}
      <div className="space-y-6">
        {selectedServices.map((service, index) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <span>{service.name}</span>
                </div>
                {service.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    ⚡ Срочно
                  </Badge>
                )}
              </CardTitle>
              {selectedSlots[service.id] && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Выбрано: {selectedSlots[service.id].date} в {selectedSlots[service.id].time}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(groupedSlots).map(([dateStr, slots]) => (
                  <div key={dateStr}>
                    <h4 className="font-medium text-sm mb-2 text-muted-foreground">{dateStr}</h4>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                      {slots.map((slot) => (
                        <Button
                          key={`${slot.date}-${slot.time}`}
                          variant={
                            selectedSlots[service.id]?.date === slot.date &&
                            selectedSlots[service.id]?.time === slot.time
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => handleSlotSelection(service.id, slot.date, slot.time)}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Clock className="h-3 w-3" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Кнопки навигации */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Изменить клинику
        </Button>
        <Button onClick={onNext} disabled={!allServicesBooked} className="px-8">
          Подтвердить все записи
        </Button>
      </div>
    </div>
  )
}

export default TimeSlots
