import { Briefcase, Users, Zap } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export function ServiceCards() {
  const services = [
    {
      icon: Briefcase,
      title: "Máster en Diseño",
      subtitle: "Experto",
      color: "text-blue-500",
    },
    {
      icon: Users,
      title: "Diseñador Senior",
      subtitle: "Profesional",
      color: "text-blue-500",
    },
    {
      icon: Zap,
      title: "Experiencia Digital",
      subtitle: "Innovación",
      color: "text-blue-500",
    },
  ]

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <Card key={index} className="bg-card hover:bg-card/80 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <service.icon className={`h-8 w-8 ${service.color}`} />
            </div>
            <CardTitle className="text-lg">{service.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{service.subtitle}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
