import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, MessageCircle } from "lucide-react"

export function RecentPublications() {
  const publications = [
    {
      title: "Tendencias en Diseño UX/UI para 2024",
      image: "/modern-ui-design-trends.jpg",
      views: 234,
      comments: 12,
    },
    {
      title: "Cómo Elegir la Paleta de Colores Perfecta",
      image: "/color-palette-design.png",
      views: 189,
      comments: 8,
    },
    {
      title: "El Impacto del Branding en el Éxito de tu Negocio",
      image: "/branding-business-success.jpg",
      views: 312,
      comments: 15,
    },
  ]

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Publicaciones Recientes</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {publications.map((pub, index) => (
          <Card key={index} className="group overflow-hidden bg-card hover:bg-card/80 transition-all">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={pub.image || "/placeholder.svg"}
                alt={pub.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="mb-3 font-semibold leading-tight">{pub.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{pub.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{pub.comments}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button variant="outline" size="lg">
          Ver Todas
        </Button>
      </div>
    </div>
  )
}
