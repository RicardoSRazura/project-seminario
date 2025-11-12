import PartyCard from "@/components/CardCandidatos";

export default function CandidatosPage() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 gap-4 sm:p-6">

      {/* Contenedor de tarjetas */}
      <div className="flex flex-row overflow-x-auto space-x-4 p-4 text-black">
      <PartyCard  
          name="Claudia Sheinbaum"
          description="Candidata de Morena"
          imageUrl="/img/Claudia.jpg"
          slug="Claudia_Sheinbaum"
        />
        <PartyCard 
          name="Xóchitl Gálvez"
          description="Candidata del PAN"
          imageUrl="/img/Xochitl.jpg"
          slug="Xochitl_Galvez"
        />
        <PartyCard 
          name="Jorge Máynez"
          description="Candidato de Movimiento Ciudadano"
          imageUrl="/img/Maynez.jpg"
          slug="Jorge_Maynez"
        />
      </div>      
    </div>
  );
}
