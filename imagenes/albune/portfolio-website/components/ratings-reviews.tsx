"use client"

import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function RatingsReviews() {
  const reviews = [
    {
      name: "Sofía Martínez",
      rating: 5,
      comment: "Alejandro superó mis expectativas. El diseño del logo fue perfecto y capturó la esencia de mi marca.",
      date: "15 Agosto, 2023",
    },
    {
      name: "Carlos Pineda",
      rating: 5,
      comment: "Trabajo profesional y entregado a tiempo. Excelente comunicación durante todo el proyecto.",
      date: "28 Septiembre, 2023",
    },
    {
      name: "Laura Gómez",
      rating: 5,
      comment: "Necesitaba una landing page urgente y Alejandro la hizo realista con un diseño fantástico.",
      date: "3 Agosto, 2023",
    },
  ]

  const ratingDistribution = [
    { stars: 5, count: 98 },
    { stars: 4, count: 25 },
    { stars: 3, count: 7 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ]

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Valoración General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-end gap-2">
            <span className="text-5xl font-bold">4.8</span>
            <div className="mb-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 5 ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">(133 reseñas)</span>
            </div>
          </div>

          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="w-4 text-sm">{item.stars}</span>
                <Progress value={(item.count / 133) * 100} className="flex-1" />
                <span className="w-8 text-right text-sm text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Reseñas de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">{review.name}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
              <p className="mt-2 text-xs text-muted-foreground">{review.date}</p>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent">
            Ver Todas las Reseñas
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
