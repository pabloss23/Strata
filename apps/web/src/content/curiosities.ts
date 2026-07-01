// Curiosidades y avances POSITIVOS del mundo: hechos curados sobre países
// influyentes, cada uno con su FUENTE (atribución), su AÑO y un enlace a NOTICIAS
// actuales del tema (epistemia honesta, ver CLAUDE.md). No son datos de métrica del
// pipeline: son contenido editorial curado, por eso viven aquí (content/) y no en
// data/. Al pulsar la tarjeta se selecciona el país en el globo; "Ver noticia" abre
// noticias reales y recientes. Optimista pero verificable.
import type { Lang } from "@/lib/i18n";

export type CurioTag = "energy" | "environment" | "tech" | "society" | "health";

export interface Curiosity {
  iso3: string; // país que se seleccionará en el globo
  tag: CurioTag;
  year: number; // año del dato/hito
  source: string; // organismo o publicación que respalda el dato (atribución)
  query: string; // término de búsqueda de NOTICIAS (específico del hecho y país)
  title: Record<Lang, string>;
  text: Record<Lang, string>;
}

// Enlace a NOTICIAS actuales sobre el hecho: una búsqueda de Google News SIEMPRE
// resuelve (nunca 404) y lleva a artículos reales y recientes del tema. Así "pulsar"
// lleva de verdad a la noticia, sin inventar URLs de artículos concretos.
export function newsUrl(query: string): string {
  return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=es-419&gl=ES&ceid=ES:es`;
}

// Metadatos de cada etiqueta: color e idioma. El color se usa para el punto y el chip.
export const TAG_META: Record<CurioTag, { color: string; label: Record<Lang, string> }> = {
  energy: { color: "#E8B04B", label: { es: "Energía", ca: "Energia", en: "Energy" } },
  environment: { color: "#3FBFA8", label: { es: "Medio ambiente", ca: "Medi ambient", en: "Environment" } },
  tech: { color: "#7C6FF0", label: { es: "Tecnología", ca: "Tecnologia", en: "Technology" } },
  society: { color: "#E4A0B7", label: { es: "Sociedad", ca: "Societat", en: "Society" } },
  health: { color: "#5FB5E5", label: { es: "Salud", ca: "Salut", en: "Health" } },
};

// Curados a mano. Positivos, influyentes y VIGENTES (panorama 2025-2026). Cada uno
// con su fuente y un enlace a noticias del tema; el año es el dato más reciente.
export const CURIOSITIES: Curiosity[] = [
  {
    iso3: "NOR",
    tag: "tech",
    year: 2026,
    source: "OFV",
    query: "Noruega coches eléctricos porcentaje ventas coche nuevo",
    title: { es: "Noruega casi cierra el motor de gasolina", ca: "Noruega quasi tanca el motor de gasolina", en: "Norway all but ends petrol cars" },
    text: {
      es: "Cerca del 90% de los coches nuevos vendidos ya son 100% eléctricos: es prácticamente el primer país en despedir el motor de combustión.",
      ca: "Prop del 90% dels cotxes nous venuts ja són 100% elèctrics: és pràcticament el primer país a acomiadar el motor de combustió.",
      en: "Around 90% of new cars sold are already fully electric — effectively the first country to retire the combustion engine.",
    },
  },
  {
    iso3: "FIN",
    tag: "society",
    year: 2025,
    source: "World Happiness Report 2025",
    query: "Finlandia país más feliz World Happiness Report",
    title: { es: "Finlandia, la más feliz otra vez", ca: "Finlàndia, la més feliç una altra vegada", en: "Finland, happiest yet again" },
    text: {
      es: "Encabeza el Informe Mundial de la Felicidad por octavo año seguido, sostenido por su confianza social.",
      ca: "Encapçala l'Informe Mundial de la Felicitat per huité any seguit, sostingut per la seua confiança social.",
      en: "It tops the World Happiness Report for an eighth year running, held up by high social trust.",
    },
  },
  {
    iso3: "CHN",
    tag: "energy",
    year: 2025,
    source: "IEA",
    query: "China récord energía solar eólica renovable coches eléctricos",
    title: { es: "China bate récords de energía limpia", ca: "La Xina bat rècords d'energia neta", en: "China smashes clean-energy records" },
    text: {
      es: "Instala más solar y eólica que el resto del mundo junto y lidera de largo las ventas de coche eléctrico.",
      ca: "Instal·la més solar i eòlica que la resta del món junt i lidera de bon tros les vendes de cotxe elèctric.",
      en: "It installs more solar and wind than the rest of the world combined and dominates electric-car sales.",
    },
  },
  {
    iso3: "IND",
    tag: "tech",
    year: 2025,
    source: "NPCI",
    query: "India UPI transacciones récord pagos digitales",
    title: { es: "India reinventa el pago", ca: "L'Índia reinventa el pagament", en: "India reinvents payments" },
    text: {
      es: "Su sistema UPI supera ya los 18.000 millones de transacciones al mes, el referente mundial de dinero digital.",
      ca: "El seu sistema UPI supera ja els 18.000 milions de transaccions al mes, el referent mundial de diners digitals.",
      en: "Its UPI rails now top 18 billion transactions a month — the world's benchmark for digital money.",
    },
  },
  {
    iso3: "BRA",
    tag: "environment",
    year: 2025,
    source: "INPE",
    query: "Amazonía Brasil deforestación baja mínimos INPE",
    title: { es: "La Amazonía sigue respirando", ca: "L'Amazònia continua respirant", en: "The Amazon keeps breathing" },
    text: {
      es: "La deforestación en la Amazonía brasileña encadena dos años a la baja y toca mínimos de casi una década.",
      ca: "La desforestació a l'Amazònia brasilera encadena dos anys a la baixa i toca mínims de quasi una dècada.",
      en: "Deforestation in the Brazilian Amazon has fallen two years running, near a decade low.",
    },
  },
  {
    iso3: "CRI",
    tag: "energy",
    year: 2025,
    source: "IEA",
    query: "Costa Rica electricidad renovable casi 100 por ciento",
    title: { es: "Costa Rica, casi 100% renovable", ca: "Costa Rica, quasi 100% renovable", en: "Costa Rica runs on renewables" },
    text: {
      es: "Genera alrededor del 99% de su electricidad con renovables (hidro, geotermia y viento) año tras año.",
      ca: "Genera al voltant del 99% de la seua electricitat amb renovables (hidro, geotèrmia i vent) any rere any.",
      en: "It produces roughly 99% of its electricity from renewables (hydro, geothermal and wind) year after year.",
    },
  },
  {
    iso3: "URY",
    tag: "energy",
    year: 2025,
    source: "IRENA",
    query: "Uruguay energía renovable eólica electricidad",
    title: { es: "Uruguay, transición eléctrica récord", ca: "Uruguai, transició elèctrica rècord", en: "Uruguay's power transition" },
    text: {
      es: "Cerca del 98% de su electricidad es renovable, sobre todo eólica, tras una transición admirada en el mundo.",
      ca: "Prop del 98% de la seua electricitat és renovable, sobretot eòlica, després d'una transició admirada al món.",
      en: "About 98% of its electricity is renewable, mostly wind, after a transition admired worldwide.",
    },
  },
  {
    iso3: "DEU",
    tag: "energy",
    year: 2025,
    source: "Fraunhofer ISE",
    query: "Alemania renovables cuota electricidad récord",
    title: { es: "Alemania roza el 60% renovable", ca: "Alemanya frega el 60% renovable", en: "Germany nears 60% renewable" },
    text: {
      es: "Las renovables ya cubren cerca del 60% de la electricidad generada, un máximo histórico para el país.",
      ca: "Les renovables ja cobreixen prop del 60% de l'electricitat generada, un màxim històric per al país.",
      en: "Renewables now cover close to 60% of generated electricity — an all-time high for the country.",
    },
  },
  {
    iso3: "BTN",
    tag: "environment",
    year: 2026,
    source: "UNFCCC",
    query: "Bután país carbono negativo bosques emisiones",
    title: { es: "Bután sigue siendo carbono negativo", ca: "Bhutan continua sent carboni negatiu", en: "Bhutan stays carbon negative" },
    text: {
      es: "Sus bosques absorben más CO₂ del que emite todo el país: continúa entre los poquísimos carbono-negativos.",
      ca: "Els seus boscos absorbeixen més CO₂ del que emet tot el país: continua entre els poquíssims carboni-negatius.",
      en: "Its forests still absorb more CO₂ than the whole country emits — one of the very few carbon-negative nations.",
    },
  },
  {
    iso3: "RWA",
    tag: "society",
    year: 2025,
    source: "IPU",
    query: "Ruanda mujeres parlamento mayor proporción del mundo",
    title: { es: "Ruanda lidera en igualdad política", ca: "Ruanda lidera en igualtat política", en: "Rwanda leads on political equality" },
    text: {
      es: "Más del 60% de su parlamento son mujeres, la mayor proporción del mundo, y se mantiene año tras año.",
      ca: "Més del 60% del seu parlament són dones, la major proporció del món, i es manté any rere any.",
      en: "Over 60% of its parliament are women — the highest share anywhere, held year after year.",
    },
  },
  {
    iso3: "EST",
    tag: "tech",
    year: 2025,
    source: "e-Estonia",
    query: "Estonia gobierno digital servicios públicos en línea",
    title: { es: "Estonia, país digital", ca: "Estònia, país digital", en: "Estonia, the digital state" },
    text: {
      es: "Casi el 99% de los trámites públicos se hacen en línea; sigue siendo pionera de la identidad y el voto digital.",
      ca: "Quasi el 99% dels tràmits públics es fan en línia; continua sent pionera de la identitat i el vot digital.",
      en: "Nearly 99% of public services are online; it remains a pioneer of digital ID and internet voting.",
    },
  },
  {
    iso3: "KEN",
    tag: "energy",
    year: 2025,
    source: "IEA",
    query: "Kenia energía geotérmica renovable electricidad",
    title: { es: "Kenia, potencia geotérmica", ca: "Kenya, potència geotèrmica", en: "Kenya's geothermal power" },
    text: {
      es: "Más del 80% de su electricidad es renovable, buena parte de la energía geotérmica del Rift.",
      ca: "Més del 80% de la seua electricitat és renovable, bona part de l'energia geotèrmica del Rift.",
      en: "Over 80% of its electricity is renewable, much of it geothermal energy from the Rift Valley.",
    },
  },
  {
    iso3: "PRT",
    tag: "energy",
    year: 2025,
    source: "REN",
    query: "Portugal electricidad 100% renovable días seguidos",
    title: { es: "Portugal, semanas 100% verdes", ca: "Portugal, setmanes 100% verdes", en: "Portugal's all-green weeks" },
    text: {
      es: "Ha llegado a cubrir toda su demanda eléctrica solo con renovables durante días seguidos, algo cada vez más habitual.",
      ca: "Ha arribat a cobrir tota la seua demanda elèctrica només amb renovables durant dies seguits, cada vegada més habitual.",
      en: "It has met all its electricity demand from renewables for days on end — increasingly the norm.",
    },
  },
  {
    iso3: "ETH",
    tag: "environment",
    year: 2025,
    source: "UNEP",
    query: "Etiopía reforestación árboles Green Legacy",
    title: { es: "Etiopía y su legado verde", ca: "Etiòpia i el seu llegat verd", en: "Ethiopia's green legacy" },
    text: {
      es: "Su campaña de reforestación acumula decenas de miles de millones de árboles plantados para frenar la erosión.",
      ca: "La seua campanya de reforestació acumula desenes de milers de milions d'arbres plantats per a frenar l'erosió.",
      en: "Its reforestation drive has planted tens of billions of trees to hold back erosion.",
    },
  },
  {
    iso3: "JPN",
    tag: "health",
    year: 2025,
    source: "WHO",
    query: "Japón esperanza de vida más alta del mundo",
    title: { es: "Japón vive más", ca: "El Japó viu més", en: "Japan lives longer" },
    text: {
      es: "Mantiene una de las mayores esperanzas de vida del mundo, cerca de los 84 años.",
      ca: "Manté una de les majors esperances de vida del món, prop dels 84 anys.",
      en: "It keeps one of the world's highest life expectancies, close to 84 years.",
    },
  },
  {
    iso3: "ISL",
    tag: "energy",
    year: 2025,
    source: "IEA",
    query: "Islandia energía geotérmica renovable electricidad",
    title: { es: "Islandia, calor de la tierra", ca: "Islàndia, calor de la terra", en: "Iceland, warmth from the earth" },
    text: {
      es: "Casi el 100% de su electricidad y calefacción vienen de la geotermia y la hidroeléctrica.",
      ca: "Quasi el 100% de la seua electricitat i calefacció vénen de la geotèrmia i la hidroelèctrica.",
      en: "Nearly 100% of its electricity and heating come from geothermal and hydro power.",
    },
  },
];
