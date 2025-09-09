"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, AlertTriangle, CreditCard, MapPin, Phone } from "lucide-react"

interface ClinicSearchResultProps {
  searchQuery: string
  doctorQuery?: string
  onBack: () => void
  onShowMap: () => void
}

export function ClinicSearchResult({ searchQuery, doctorQuery, onBack, onShowMap }: ClinicSearchResultProps) {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)

  // Симуляция результатов поиска - в реальном приложении это будет API запрос
  const searchResults = {
    found: false, // Симулируем что клиника не найдена в системе
    suggestions: [
      {
        name: "Медицинский центр 'Здоровье Плюс'",
        address: "ул. Ленина, 45",
        phone: "+7 (495) 123-45-67",
        distance: "1.2 км",
        rating: 4.8,
        hasIntegration: true,
      },
      {
        name: "Клиника 'Семейный доктор'",
        address: "пр. Мира, 78",
        phone: "+7 (495) 987-65-43",
        distance: "2.1 км",
        rating: 4.6,
        hasIntegration: true,
      },
    ],
  }

  if (!searchResults.found) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Результаты поиска</h2>
            <p className="text-muted-foreground">По запросу: "{searchQuery}"</p>
          </div>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Клиника не найдена в системе
            </CardTitle>
            <CardDescription className="text-amber-700">
              К сожалению, клиника "{searchQuery}" пока не интегрирована с нашей системой онлайн-записи
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Платная запись
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Вы можете записаться в эту клинику платно через наш сервис. Мы свяжемся с клиникой и организуем запись
                для вас.
              </p>
              <Button variant="outline" onClick={() => setShowPaymentInfo(true)} className="w-full">
                Записаться платно
              </Button>
            </div>

            {showPaymentInfo && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">Как это работает:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Стоимость услуги: 500₽ за организацию записи</li>
                  <li>• Мы свяжемся с клиникой в течение 2 часов</li>
                  <li>• Подберем удобное время для всех ваших направлений</li>
                  <li>• Отправим подтверждение на ваш телефон</li>
                </ul>
                <Button className="w-full mt-3">Оплатить и записаться</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Похожие клиники в системе</h3>
          <p className="text-sm text-muted-foreground">
            Возможно, вы имели в виду одну из этих клиник? В них можно записаться бесплатно:
          </p>

          <div className="grid gap-3">
            {searchResults.suggestions.map((clinic, index) => (
              <Card key={index} className="hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {clinic.name}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {clinic.address}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {clinic.phone}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{clinic.distance}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">⭐ {clinic.rating}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full">Записаться бесплатно</Button>
                    <p className="text-xs text-green-600 text-center">✓ Включено в ваш пакет услуг</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button onClick={onShowMap} variant="outline">
            Показать все доступные клиники на карте
          </Button>
        </div>
      </div>
    )
  }

  return null
}
