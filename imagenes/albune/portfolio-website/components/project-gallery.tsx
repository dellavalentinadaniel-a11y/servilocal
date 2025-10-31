import Image from "next/image"
import { Card } from "@/components/ui/card"

export function ProjectGallery() {
  const projects = [
    {
      title: "Diseño de Aplicación Móvil",
      image: "/mobile-app-design-mockup.jpg",
    },
    {
      title: "Diseño de Gestión de Marca",
      image: "/brand-identity-design.png",
    },
    {
      title: "Experiencia de Usuario Digital",
      image: "/digital-user-experience-design.jpg",
    },
  ]

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Galería de Proyectos</h2>
        <a href="#" className="text-sm text-primary hover:underline">
          Explorar Proyectos Más
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={index} className="group overflow-hidden bg-card hover:bg-card/80 transition-all">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{project.title}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
