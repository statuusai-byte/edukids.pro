import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAge } from "@/context/AgeContext"
import { Rocket } from "lucide-react"
import { useLocation } from "react-router-dom"

const AgeGateModal = () => {
  const { ageGroup, setAgeGroup } = useAge()
  const location = useLocation()

  // A página inicial ('/') tem a sua própria interface de seleção de idade.
  // Portanto, este modal só deve aparecer noutras páginas se nenhuma idade for selecionada.
  const isHomePage = location.pathname === '/'
  const isOpen = !ageGroup && !isHomePage

  const handleSelectAge = (group: '4-6' | '7-9' | '10-12') => {
    setAgeGroup(group)
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="glass-card border-primary/50 sm:max-w-md text-center p-8"
        // Impede que o modal seja fechado ao clicar fora, forçando uma seleção.
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Wrap all direct children of DialogContent in a single div */}
        <div>
          <DialogHeader>
            <div className="mx-auto mb-4 rounded-full bg-primary/20 p-3 border border-primary/50 w-fit">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">Continue a Aventura!</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Para aceder a esta página, por favor, selecione a faixa etária do explorador.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col space-y-3">
            <Button size="lg" onClick={() => handleSelectAge('4-6')}>
              4-6 anos
            </Button>
            <Button size="lg" onClick={() => handleSelectAge('7-9')}>
              7-9 anos
            </Button>
            <Button size="lg" onClick={() => handleSelectAge('10-12')}>
              10-12 anos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AgeGateModal