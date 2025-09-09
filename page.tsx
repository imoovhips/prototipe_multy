"use client"

import { useState } from "react"
import { PrescriptionReview } from "@/components/prescription-review"
import { BookingPreference } from "@/components/booking-preference"
import { ClinicSearchResult } from "@/components/clinic-search-result"
import { SmartQuestionnaire } from "@/components/smart-questionnaire"
import { ClinicMap } from "@/components/clinic-map"
import { BookingSummary } from "@/components/booking-summary"
import { Progress } from "@/components/ui/progress"

export type ServiceType = "tests" | "examinations" | "in-person" | "online"

export interface SelectedService {
  id: string
  type: ServiceType
  name: string
  urgent?: boolean
  prescribedBy?: string
  notes?: string
  status?: "active" | "expired"
}

export interface UserData {
  name: string
  phone: string
  email: string
  symptoms?: string
  preferredTime?: string
  location?: string
}

export interface Clinic {
  id: string
  name: string
  address: string
  distance: number
  services: ServiceType[]
  availableSlots: string[]
  rating: number
}

export interface BookingItem {
  service: SelectedService
  clinic: Clinic
  slot: string
  date: string
}

const steps = ["Направления", "Способ записи", "Анкета", "Клиники", "Подтверждение"]

export default function MedicalBookingApp() {
  const [currentStep, setCurrentStep] = useState(0)
  const [bookingFlow, setBookingFlow] = useState<"preference" | "search" | "map">("preference")
  const [searchQuery, setSearchQuery] = useState("")
  const [doctorQuery, setDoctorQuery] = useState("")

  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([
    {
      id: "blood-test-1",
      type: "tests",
      name: "Общий анализ крови",
      prescribedBy: "Терапевт Иванов И.И.",
      notes: "Контроль после лечения",
      status: "active",
    },
    {
      id: "ultrasound-1",
      type: "examinations",
      name: "УЗИ брюшной полости",
      prescribedBy: "Терапевт Иванов И.И.",
      status: "active",
    },
    {
      id: "cardiologist-1",
      type: "in-person",
      name: "Консультация кардиолога",
      prescribedBy: "Терапевт Иванов И.И.",
      notes: "По результатам ЭКГ",
      status: "active",
    },
    {
      id: "mri-expired",
      type: "examinations",
      name: "МРТ головного мозга",
      prescribedBy: "Невролог Петров П.П.",
      notes: "Направление истекло 15.11.2024",
      status: "expired",
    },
    {
      id: "endocrinologist-expired",
      type: "in-person",
      name: "Консультация эндокринолога",
      prescribedBy: "Терапевт Иванов И.И.",
      status: "expired",
    },
  ])
  const [userData, setUserData] = useState<UserData>({
    name: "",
    phone: "",
    email: "",
  })
  const [bookings, setBookings] = useState<BookingItem[]>([])

  const progress = ((currentStep + 1) / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleShowMap = () => {
    setBookingFlow("map")
    setCurrentStep(3)
  }

  const handleSearchClinic = (clinic: string, doctor?: string) => {
    setSearchQuery(clinic)
    setDoctorQuery(doctor || "")
    setBookingFlow("search")
  }

  const handleBackToPreference = () => {
    setBookingFlow("preference")
    setSearchQuery("")
    setDoctorQuery("")
  }

  const handleBackToClinicSelection = () => {
    // This will be handled within ClinicMap component
    // No need to change step, just reset internal state
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Запись по направлениям</h1>
          <p className="text-muted-foreground">Запишитесь на все назначенные процедуры с оптимальным маршрутом</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`text-sm font-medium ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}
              >
                {step}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          {currentStep === 0 && (
            <PrescriptionReview
              selectedServices={selectedServices}
              onServicesChange={setSelectedServices}
              onNext={nextStep}
            />
          )}

          {currentStep === 1 && bookingFlow === "preference" && (
            <BookingPreference onBack={prevStep} onShowMap={handleShowMap} onSearchClinic={handleSearchClinic} />
          )}

          {currentStep === 1 && bookingFlow === "search" && (
            <ClinicSearchResult
              searchQuery={searchQuery}
              doctorQuery={doctorQuery}
              onBack={handleBackToPreference}
              onShowMap={handleShowMap}
            />
          )}

          {currentStep === 2 && (
            <SmartQuestionnaire
              selectedServices={selectedServices}
              userData={userData}
              onUserDataChange={setUserData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}

          {currentStep === 3 && (
            <ClinicMap
              selectedServices={selectedServices}
              userData={userData}
              bookings={bookings}
              onBookingsChange={setBookings}
              onNext={nextStep}
              onPrev={prevStep}
              onBackToClinicSelection={handleBackToClinicSelection}
            />
          )}

          {currentStep === 4 && <BookingSummary bookings={bookings} userData={userData} onPrev={prevStep} />}
        </div>
      </div>
    </div>
  )
}
