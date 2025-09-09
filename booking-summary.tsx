"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Calendar, User, Phone, Mail, CheckCircle } from "lucide-react"
import type { BookingItem, UserData } from "@/app/page"

interface BookingSummaryProps {
  bookings: BookingItem[]
  userData: UserData
  onPrev: () => void
}

export function BookingSummary({ bookings, userData, onPrev }: BookingSummaryProps) {
  const handleConfirmBooking = () => {
    // Здесь была бы логика отправки данных на сервер
    alert("Запись успешно подтверждена! Вам придет SMS с подтверждением.")
  }

  // Группировка по клиникам для оптимального отображения
  const bookingsByClinic = bookings.reduce(
    (groups, booking) => {
      const clinicId = booking.clinic.id
      if (!groups[clinicId]) {
        groups[clinicId] = {
          clinic: booking.clinic,
          bookings: [],
        }
      }
      groups[clinicId].bookings.push(booking)
      return groups
    },
    {} as Record<string, { clinic: any; bookings: BookingItem[] }>,
  )

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Подтверждение записи</h2>
        <p className="text-muted-foreground">Проверьте данные и подтвердите запись на медицинские услуги</p>
      </div>

      {/* Информация о пациенте */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Данные пациента
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{userData.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{userData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{userData.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Маршрут по клиникам */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ваш маршрут</h3>

        {Object.values(bookingsByClinic).map((group, index) => (
          <Card key={group.clinic.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div>{group.clinic.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {group.clinic.address}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">
                  {group.bookings.length} услуг{group.bookings.length > 1 ? "и" : "а"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {group.bookings.map((booking, bookingIndex) => (
                  <div key={booking.service.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {booking.service.name}
                          {booking.service.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              ⚡ Срочно
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.slot}
                          </span>
                        </div>
                      </div>
                    </div>
                    {bookingIndex < group.bookings.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Важная информация */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">Важная информация:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• За 24 часа до приема вам придет SMS-напоминание</li>
            <li>• Возьмите с собой паспорт и полис ОМС</li>
            <li>• Для анализов крови приходите натощак</li>
            <li>• Отменить или перенести запись можно по телефону клиники</li>
          </ul>
        </CardContent>
      </Card>

      {/* Итоговая стоимость */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Итого к оплате:</span>
            <span className="text-primary">{bookings.length * 1500} ₽</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Оплата производится в клинике</p>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Назад
        </Button>
        <Button onClick={handleConfirmBooking} className="px-8" size="lg">
          Подтвердить запись
        </Button>
      </div>
    </div>
  )
}
