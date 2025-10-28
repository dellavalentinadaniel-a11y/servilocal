import { MapPin, Phone, Mail, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function LocationContact() {
  return (
    <>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Ubicación y Horarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Calle Ficticia 123, Ciudad Ejemplo, País Imaginario</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-primary">Horarios de Atención</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lunes - Viernes</span>
                <span>9:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sábado</span>
                <span>10:00 - 14:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domingo</span>
                <span>Cerrado</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">Servicio a nivel nacional e internacional (remoto)</p>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <a href="tel:+11234567890" className="hover:underline">
              +1 (123) 456-7890
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <a href="mailto:alejandro.vargas@example.com" className="hover:underline">
              alejandro.vargas@example.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <a href="https://designpro.com" className="hover:underline">
              www.designpro.com
            </a>
          </div>

          <Button className="w-full" size="lg">
            Enviar Mensaje
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
