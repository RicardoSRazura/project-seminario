import Image from "next/image";
import { notFound } from "next/navigation";

interface Candidato {
  nombre: string;
  partido: string;
  imagen: string;
  biografia: string;
  propuestas: string[];
}

const candidatos: Record<string, Candidato> = {
  claudia_sheinbaum: {
    nombre: "Claudia Sheinbaum",
    partido: "Morena",
    imagen: "/img/Claudia.jpg",
    biografia:
      'Claudia Sheinbaum es una científica, académica y política mexicana, nacida en la Ciudad de México en 1962. Doctora en Ingeniería Energética por la UNAM, ha trabajado durante décadas en temas ambientales y energéticos. Fue Secretaria del Medio Ambiente del Distrito Federal durante la jefatura de gobierno de Andrés Manuel López Obrador, y posteriormente fue elegida Jefa de Gobierno de la Ciudad de México en 2018, siendo la primera mujer electa para ese cargo. En 2023 fue designada como la candidata presidencial de Morena para 2024, como parte de la continuidad del proyecto de la "Cuarta Transformación"',
    propuestas: ["Continuar los programas sociales del gobierno actual y fortalecer el estado de bienestar.", "Consolidar el sistema de salud pública universal y gratuito.", "Impulsar la transición energética hacia energías renovables.","Reforzar la educación pública y garantizar el acceso desde preescolar hasta universidad.","Terminar proyectos estratégicos como el Tren Maya y el Corredor Interoceánico.", "Luchar contra la corrupción con austeridad republicana."],
  },
  xochitl_galvez: {
    nombre: "Xóchitl Gálvez",
    partido: "PAN",
    imagen: "/img/Xochitl.jpg",
    biografia:
      'Xóchitl Gálvez es ingeniera, empresaria y política mexicana nacida en Tepatepec, Hidalgo, en 1963. De raíces indígenas otomíes, ha enfocado buena parte de su carrera en temas de innovación tecnológica, transparencia y derechos de los pueblos indígenas. Se ha desempeñado como comisionada nacional para el desarrollo de los pueblos indígenas y como senadora. Es conocida por su estilo directo y combativo. En 2023 fue designada como candidata presidencial del Frente Amplio por México, una coalición opositora al gobierno actual.',
    propuestas: ["Restablecer la seguridad pública con una estrategia civil, profesional y de inteligencia.", "Fortalecer el sistema de salud con abasto de medicamentos y mejor atención médica.", "Impulsar la inversión privada y empleo bien remunerado.","Garantizar programas sociales, pero sin corrupción ni clientelismo.","Reforzar la educación con apoyo a docentes, infraestructura y tecnología.", "Fomentar la transparencia y el combate frontal a la corrupción."],
  },
  jorge_maynez: {
    nombre: "Jorge Máynez",
    partido: "Movimiento Ciudadano",
    imagen: "/img/Maynez.jpg",
    biografia:
      'Jorge Álvarez Máynez es un político, abogado y académico mexicano originario de Zacatecas, nacido en 1985. Se ha desempeñado como diputado federal en múltiples legislaturas y ha ganado notoriedad por su enfoque moderno, progresista y por atraer al voto joven. Es licenciado en Derecho y tiene estudios en políticas públicas. Fue designado como candidato presidencial por Movimiento Ciudadano en 2024, promoviendo una visión innovadora y ajena a los partidos tradicionales.',
    propuestas: ["Garantizar el acceso universal a la educación con enfoque digital y técnico.", "Impulsar una economía verde con empleos para jóvenes en sectores sostenibles.", "Legalización de la marihuana y enfoque de salud pública en temas de drogas.", "Promoción de energías limpias y reducción del uso de combustibles fósiles.", "Reforma policial para profesionalizar cuerpos de seguridad.", "Reducción de privilegios en la clase política y más participación ciudadana."],
  },
  // otros candidatos...
};

export default function CandidatoPage({ params }: { params: { slug: string } }) {
  const candidato = candidatos[params.slug.toLowerCase()];

  if (!candidato) return notFound();

  return (
    <div className="max-w-6xl mx-auto p-6 text-black">
      {/* Cuadro de información principal */}
      <div className="flex border rounded-md overflow-hidden">
        {/* Imagen */}
        <div className="border-r p-4 flex items-center justify-center min-w-[140px]">
          <Image
            src={candidato.imagen}
            alt={candidato.nombre}
            width={145}
            height={120}
            className="rounded object-cover"
          />
        </div>

        {/* Texto info */}
        <div className="flex-1 p-4">
          <div className="mb-2">
            <span className="font-bold">Nombre: </span>
            {candidato.nombre}
            <hr className="border-black-400 mt-1" />
          </div>

          <div className="mb-2">
            <span className="font-bold">Partido: </span>
            {candidato.partido}
            <hr className="border-black-400 mt-1" />
          </div>

          <div>
            <span className="font-bold">Biografía: </span>
            <span>{candidato.biografia}</span>
          </div>
        </div>
      </div>

      {/* Propuestas */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-center mb-4">PROPUESTAS Y OBJETIVOS</h2>
        <ul className="list-disc list-inside space-y-1 px-4">
          {candidato.propuestas.map((p, idx) => (
            <li key={idx}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
