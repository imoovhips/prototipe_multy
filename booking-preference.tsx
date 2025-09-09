"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Building2, UserCheck, ArrowLeft } from "lucide-react"

interface BookingPreferenceProps {
  onBack: () => void
  onShowMap: () => void
  onSearchClinic: (clinic: string, doctor?: string) => void
}

export function BookingPreference({ onBack, onShowMap, onSearchClinic }: BookingPreferenceProps) {
  const [searchMode, setSearchMode] = useState<"preference" | "search">("preference")
  const [clinicName, setClinicName] = useState("")
  const [doctorName, setDoctorName] = useState("")

  const handleSearch = () => {
    if (clinicName.trim()) {
      onSearchClinic(clinicName, doctorName || undefined)
    }
  }

  if (searchMode === "search") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSearchMode("preference")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Поиск клиники</h2>
            <p className="text-muted-foreground">Введите название клиники или имя врача</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinic">Название клиники *</Label>
            <Input
              id="clinic"
              placeholder="Например: Медицинский центр 'Здоровье'"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Имя врача (необязательно)</Label>
            <Input
              id="doctor"
              placeholder="Например: Иванов Иван Иванович"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>

          <Button onClick={handleSearch} disabled={!clinicName.trim()} className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Найти клинику
          </Button>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Подсказка:</strong> Если вы не помните точное название, введите часть названия или район
            расположения клиники
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Выбор способа записи</h2>
          <p className="text-muted-foreground">Знаете ли вы, в какую клинику хотите записаться?</p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              Нет, покажите варианты
            </CardTitle>
            <CardDescription>
              Система подберет оптимальные клиники рядом с вами для всех ваших направлений
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onShowMap} variant="outline" className="w-full bg-transparent">
              Показать карту клиник
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              Да, знаю клинику
            </CardTitle>
            <CardDescription>Укажите название клиники или имя врача для поиска доступных слотов</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setSearchMode("search")} variant="outline" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Найти мою клинику
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-200">
        <div className="flex items-start gap-2">
          <UserCheck className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium">Рекомендация</p>
            <p className="text-sm text-amber-700 mt-1">
              Если вы впервые записываетесь или не знаете подходящие клиники, выберите первый вариант. Система покажет
              проверенные медицинские центры с хорошими отзывами.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
