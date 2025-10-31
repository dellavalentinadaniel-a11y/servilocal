import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ProfileHeader() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card">
      <div className="absolute inset-0 opacity-20">
        <Image src="/modern-office.png" alt="Background" fill className="object-cover" />
      </div>

      <div className="relative flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center">
        <div className="relative">
          <Image
            src="/professional-headshot.png"
            alt="Alejandro Vargas"
            width={120}
            height={120}
            className="rounded-full border-4 border-background"
          />
          <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Alejandro Vargas</h1>
          <p className="mt-1 text-muted-foreground">Diseñador Gráfico y Web Freelance</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-secondary/50">
              Diseño UX/UI
            </Badge>
            <Badge variant="secondary" className="bg-secondary/50">
              Desarrollo Web
            </Badge>
            <Badge variant="secondary" className="bg-secondary/50">
              Branding
            </Badge>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="flex flex-wrap gap-2 p-4">
          <Button variant="default" className="flex-1 sm:flex-none">
            Sobre mí
          </Button>
          <Button variant="ghost" className="flex-1 sm:flex-none">
            Mis servicios
          </Button>
          <Button variant="ghost" className="flex-1 sm:flex-none">
            Información
          </Button>
          <Button variant="ghost" className="flex-1 sm:flex-none">
            Recomendaciones
          </Button>
        </div>
      </div>
    </div>
  )
}
