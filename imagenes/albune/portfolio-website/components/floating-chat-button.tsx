"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingChatButton() {
  return (
    <Button
      size="icon"
      className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
      onClick={() => alert("Chat functionality would open here")}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  )
}
