"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SelectedService, UserData } from "@/app/page"

interface SmartQuestionnaireProps {
  selectedServices: SelectedService[]
  userData: UserData
  onUserDataChange: (data: UserData) => void
  onNext: () => void
  onPrev: () => void
}

export function SmartQuestionnaire({
  selectedServices,
  userData,
  onUserDataChange,
  onNext,
  onPrev,
}: SmartQuestionnaireProps) {
  const hasTests = selectedServices.some((s) => s.type === "tests")
  const hasExaminations = selectedServices.some((s) => s.type === "examinations")
  const hasUrgent = selectedServices.some((s) => s.urgent)

  const handleInputChange = (field: keyof UserData, value: string) => {
    onUserDataChange({ ...userData, [field]: value })
  }

  const isFormValid = userData.name && userData.phone && userData.email

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Расскажите о себе</h2>
        <p className="text-muted-foreground">Эта информация поможет нам подобрать оптимальное время и клинику</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Контактные данные</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Имя и фамилия *</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="ivan@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Дополнительная информация */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Предпочтения</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">Предпочитаемый район</Label>
              <Select onValueChange={(value) => handleInputChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите район" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Центр</SelectItem>
                  <SelectItem value="north">Северный район</SelectItem>
                  <SelectItem value="south">Южный район</SelectItem>
                  <SelectItem value="east">Восточный район</SelectItem>
                  <SelectItem value="west">Западный район</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preferredTime">Удобное время</Label>
              <Select onValueChange={(value) => handleInputChange("preferredTime", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Утром (8:00-12:00)</SelectItem>
                  <SelectItem value="afternoon">Днем (12:00-17:00)</SelectItem>
                  <SelectItem value="evening">Вечером (17:00-20:00)</SelectItem>
                  <SelectItem value="any">Любое время</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(hasTests || hasExaminations) && (
              <div>
                <Label htmlFor="symptoms">Жалобы или симптомы</Label>
                <Textarea
                  id="symptoms"
                  value={userData.symptoms || ""}
                  onChange={(e) => handleInputChange("symptoms", e.target.value)}
                  placeholder="Опишите ваши жалобы (необязательно)"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Умные рекомендации */}
      {hasUrgent && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-destructive">⚡</div>
              <div>
                <h3 className="font-medium text-destructive mb-1">Срочная запись</h3>
                <p className="text-sm text-muted-foreground">
                  Мы найдем ближайшие доступные слоты для ваших срочных услуг
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasTests && hasExaminations && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-primary">💡</div>
              <div>
                <h3 className="font-medium text-primary mb-1">Умная рекомендация</h3>
                <p className="text-sm text-muted-foreground">
                  Рекомендуем сначала сдать анализы, а затем пройти обследование с результатами
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Назад
        </Button>
        <Button onClick={onNext} disabled={!isFormValid} className="px-8">
          Найти клиники
        </Button>
      </div>
    </div>
  )
}
