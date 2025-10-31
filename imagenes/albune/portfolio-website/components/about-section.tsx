import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AboutSection() {
  const services = ["Diseño Gráfico", "Diseño Web", "UX/UI", "Branding", "Motion Graphics", "Consultoría"]

  return (
    <div className="mt-8">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Sobre Mí</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-relaxed text-foreground">
            Soy Alejandro, un diseñador gráfico y desarrollador web con más de 10 años de experiencia, especializado en
            crear soluciones visuales impactantes y funcionales. Mi enfoque se centra en la usabilidad y la estética,
            integrando que cada proyecto no solo sea atractivo, sino también intuitivo y efectivo. He trabajado con
            clientes de diversos sectores, ayudándoles a transformar ideas en experiencias digitales memorables, desde
            interfaces de usuario intuitivas hasta sitios web dinámicos y efectivos. Mi objetivo es siempre ofrecer
            resultados de vanguardia que combinen diseño innovador y tecnología de punta para ofrecer resultados de
            vanguardia.
          </p>

          <div>
            <h3 className="mb-3 font-semibold">Categorías de Servicio</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((service, index) => (
                <Badge key={index} variant="secondary">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
