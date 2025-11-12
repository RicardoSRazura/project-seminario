import PartyCard from "@/components/CardPartido";

export default function PartidosPage() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 gap-4 sm:p-6">

      
      {/* Contenedor de tarjetas */}
      <div className="flex flex-row overflow-x-auto space-x-4 p-4 text-black">
        <PartyCard 
          name="PAN"
          description="El Partido Acción Nacional (PAN)"
          imageUrl="/img/Pan Logo.png"
          slug="pan"
        />
        <PartyCard 
          name="Morena"
          description="El Partido Movimiento de Regeneración Nacional (Morena)"
          imageUrl="/img/Morena Logo.png"
          slug="morena"
        />
        <PartyCard 
          name="PRI"
          description="El Partido Revolucionario Institucional (PRI)"
          imageUrl="/img/Pri Logo.png"
          slug="pri"
        />
        <PartyCard 
          name="Movimiento Ciudadano"
          description="El Partido Movimiento Ciudadano"
          imageUrl="/img/MC Logo.png"
          slug="mc"
        />

      </div>
      <div className="flex flex-row overflow-x-auto space-x-4 p-4">
      <PartyCard 
          name="PRD"
          description="Partido de la Revolución Democrática (PRD)"
          imageUrl="/img/PRD Logo.png"
          slug="prd"
        />
        <PartyCard 
          name="Partido Verde"
          description="El Partido Verde"
          imageUrl="/img/partido Verde Logo.png"
          slug="verde"
        />
        <PartyCard 
          name="Partido del Trabajo"
          description="El Partido del Trabajo (PT)"
          imageUrl="/img/PT Logo.png"
          slug="pt"
        />
      </div>
    </div>
  );
}

  