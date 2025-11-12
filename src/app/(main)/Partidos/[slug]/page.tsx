import Image from "next/image";
import { notFound } from "next/navigation";

interface Partido {
    nombre: string;
    logo: string;
    sobre: string;
    propuestas: string[];
}

const partidos: Record<string, Partido> = {
    pan: {
        nombre: "PAN",
        logo: "/img/Pan Logo.png",
        sobre:
            "El PAN es un partido de centro-derecha fundado en 1939, que promueve principios como la democracia, el respeto a los derechos humanos y la economía de mercado. Se identifica con valores cristianos y republicanos, buscando una sociedad libre y solidaria. El partido Acción Nacional centra supensamiento y acción en la primacía de la persona como protagonista y destinataria de la acción política. Busca que el ejercicio responsable de la libertad en la democracia conduzca a la justicia y a la igualdad de oportunidades.",
        propuestas: [
            "Fortalecer la democracia y las instituciones.",
            "Impulsar una economía de libre mercado.",
            "Mejorar la seguridad pública y el estado de derecho.",
            "Promover políticas sociales que combatan la pobreza y la desigualdad.",
        ],
    },
    pri: {
        nombre: "PRI",
        logo: "/img/Pri Logo.png",
        sobre:
            "El Partido Revolucionario Institucional (PRI) es un partido político mexicano situado entre el centro y la centroderecha del espectro político. Fue fundado el 4 de marzo de 1929 bajo el nombre de Partido Nacional Revolucionario (PNR) por el expresidente Plutarco Elías Calles. En 1938 fue reconstituido como Partido de la Revolución Mexicana (PRM) y en 1946 fue refundado, adoptando su nombre actual. El PRI gobernó México durante setenta y un años consecutivos, de 1929 a 2000, y aunque ha experimentado fluctuaciones en su poder político, sigue siendo una fuerza política relevante en el país.",
        propuestas: [
            "Impulsar reformas que fortalezcan la economía y generen empleo.",
            "Mejorar la educación y los servicios de salud.",
            "Promover la seguridad pública y el estado de derecho.",
            "Fomentar la transparencia y el combate a la corrupción.​",
        ],
    },
    morena: {
        nombre: "Morena",
        logo: "/img/Morena Logo.png",
        sobre:
            "Morena, conocido oficialmente como Movimiento de Regeneración Nacional, es un partido político de izquierda en México. Fue creado el 2 de octubre de 2011 como un movimiento político y social impulsado por Andrés Manuel López Obrador, como parte de su campaña presidencial en las elecciones federales de 2012. El movimiento se constituyó como una asociación civil el 20 de noviembre de 2012, y el 9 de julio de 2014, el Instituto Nacional Electoral le otorgó su registro como partido político nacional, con efectos constitutivos a partir del 1 de agosto de 2014. Morena se ha consolidado como la principal fuerza política mexicana, ganando la presidencia del país dos veces, primero con Andrés Manuel López Obrador y ahora con Claudia Sheinbaum.",
        propuestas: [
            'Continuar con la "Cuarta Transformación" del país.',
            "Fortalecer los programas sociales y aumentar el salario mínimo.",
            "Completar proyectos como el Tren Maya y reforzar empresas públicas.",
            "Combatir el clasismo, racismo y machismo, y mejorar el sistema de salud.​",
        ],
    },
    mc: {
        nombre: "Movimiento Ciudadano",
        logo: "/img/MC Logo.png",
        sobre:
            "Movimiento Ciudadano es un partido político mexicano de centroizquierda fundado el 1 de agosto de 1999 bajo el nombre de Convergencia por la Democracia. En 2011, adoptó su nombre actual. Se define como una organización progresista que promueve la participación ciudadana, la transparencia y la rendición de cuentas. Busca fortalecer la democracia a través de la inclusión y el respeto a los derechos humanos, impulsando políticas públicas que respondan a las necesidades de la sociedad. ​",
        propuestas: [
            "Desmilitarizar la seguridad pública y fortalecer las policías locales.",
            "Implementar una reforma fiscal progresiva y un ingreso mínimo garantizado.",
            "Regular el uso de la cannabis y promover políticas de salud pública.",
            "Fortalecer los organismos autónomos y combatir la corrupción .​",
        ],
    },
    prd: {
        nombre: "PRD",
        logo: "/img/PRD Logo.png",
        sobre:
            "El PRD es un partido político mexicano de izquierda fundado en 1989 como resultado de la unión de diversas corrientes y movimientos sociales que buscaban una alternativa democrática al régimen dominante de la época. Se ha caracterizado por su lucha en favor de la justicia social, la equidad y la defensa de los derechos humanos. A lo largo de su historia, ha impulsado reformas políticas y sociales significativas en México. ​",
        propuestas: [
            "Defender los derechos de las minorías y grupos vulnerables.",
            "Promover una economía justa y sostenible.",
            "Fortalecer la educación y la salud pública.",
            "Impulsar la transparencia y la rendición de cuentas en el gobierno."
        ],
    },
    verde: {
        nombre: "PVEM",
        logo: "/img/partido Verde Logo.png",
        sobre:
            "El PVEM es un partido político mexicano fundado en 1986 con el nombre de Partido Verde Mexicano. Su origen se remonta a una brigada de vecinos en Coyoacán que, preocupados por la pérdida de espacios verdes, decidieron organizarse para promover la conciencia ambiental. En 1991, obtuvo su registro como partido político nacional bajo el nombre de Partido Verde Ecologista de México. Desde entonces, ha buscado representar las causas ecológicas y promover políticas públicas orientadas al desarrollo sostenible y la protección del medio ambiente. ​",
        propuestas: [
            "Fomentar el uso de energías limpias y la conservación de los recursos naturales.",
            "Promover la educación ambiental y la cultura ecológica.",
            "Impulsar políticas de desarrollo económico compatibles con la conservación del medio ambiente .​",
        ],
    },
    pt: {
        nombre: "PT",
        logo: "/img/PT Logo.png",
        sobre:
            'El PT es un partido político mexicano de izquierda fundado el 8 de diciembre de 1990. Surgió de la coordinación de diversas organizaciones sociales, como los Comités de Defensa Popular de Chihuahua y Durango, el Frente Popular de Lucha de Zacatecas y el Frente Popular "Tierra y Libertad" de Monterrey. El partido se define como una fuerza política que busca la transformación social y económica de México, promoviendo la justicia social, la equidad y la defensa de los derechos de los trabajadores. Nuestro lema es "Unidad Nacional, ¡Todo el poder al Pueblo!​"',
        propuestas: [
            "Impulsar políticas que beneficien a los sectores más desfavorecidos.",
            "Fortalecer los derechos laborales y mejorar las condiciones de trabajo.",
            "Promover una economía solidaria y sustentable.",
            "Apoyar la educación pública y gratuita para todos.",
        ],
    },
};

export default function PartidoPage({ params }: { params: { slug: string } }) {
    const partido = partidos[params.slug.toLowerCase()];

    if (!partido) {
        return notFound();
    }

    return (
        <>
            {/* Logo + nombre fuera del div centrado */}
            <div className="w-full max-w-5xl mx-auto px-8 text-black">
                <div className="flex items-center gap-4">
                    <Image src={partido.logo} alt={partido.nombre} width={80} height={80} />
                    <h1 className="text-3xl font-bold">
                        PARTIDO POLÍTICO {partido.nombre.toUpperCase()}
                    </h1>

                </div>
                <hr className="border-black border-t-2 mt-4" />
            </div>
            {/* Contenido centrado */}
            <div className="py-9 px-5 flex flex-col gap-12 items-center text-black">
                <div className="max-w-4xl">
                    {/* Subtítulo centrado */}
                    <h2 className="text-2xl font-bold text-center mb-6">SOBRE NOSOTROS</h2>
                    <p className="text-justify">{partido.sobre}</p>

                    <h2 className="text-2xl font-bold text-center mb-6 mt-6">PROPUESTAS Y OBJETIVOS</h2>
                    <ul className="text-left list-disc ml-6">
                        {partido.propuestas.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>

                </div>
            </div>
        </>
    );
}

