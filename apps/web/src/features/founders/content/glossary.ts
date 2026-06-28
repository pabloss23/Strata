// Strata Founders — glosario experto (Parte D). Conceptos de fiscalidad y legal
// internacional para fundadores. Educativo y orientativo (verificar con fuentes
// primarias). La herramienta ENSEÑA marcos para saber qué preguntar a un asesor;
// no diseña esquemas. i18n VAL/CAS/ENG.
import type { Lang } from "@/lib/i18n";

export interface GlossTerm {
  id: string;
  title: string;
  def: string;
  caveat?: string;
}

const ES: GlossTerm[] = [
  { id: "tax_residency", title: "Residencia fiscal (persona)", def: "Dónde tributas tu renta mundial. Se dispara por los 183 días y por vínculos (vivienda, familia, centro de intereses vitales).", caveat: "Mudarte sin romper la residencia previa no sirve. Algunos países tienen variantes (regla de 60 días en Chipre)." },
  { id: "effective_management", title: "Sede de dirección efectiva", def: "Una empresa puede ser residente fiscal allí donde se gestiona de hecho, no solo donde está registrada.", caveat: "Gestionar tu empresa extranjera desde tu casa puede hacerla tributable en tu país." },
  { id: "pe", title: "Establecimiento permanente (PE)", def: "Presencia estable que permite a un país gravar esos beneficios y exigir IVA. Es el riesgo nº 1 del nómada con empresa extranjera.", caveat: "Trabajar de forma continuada desde un país puede crear PE allí." },
  { id: "cfc", title: "Reglas CFC", def: "Tu país te atribuye y grava los beneficios no distribuidos de una empresa extranjera que controlas (en la UE, vía ATAD).", caveat: "Alcanzan a pequeños founders. El régimen non-dom NO anula el CFC. Suele haber exención por actividad económica real." },
  { id: "substance", title: "Sustancia económica (ESR)", def: "Oficina, empleados, dirección y lógica comercial reales. Hoy es obligatoria; sin ella, la estructura no protege.", caveat: "Las jurisdicciones de 0% (UAE, Caimán, BVI) tienen Economic Substance Regulations." },
  { id: "crs", title: "CRS", def: "Más de 110 países intercambian automáticamente datos bancarios de no residentes. La opacidad bancaria como estrategia terminó.", caveat: "FATCA es el equivalente para personas de EE. UU." },
  { id: "pillar_two", title: "Pillar Two / GloBE", def: "Impuesto mínimo global del 15%. Afecta sobre todo a grupos con ingresos >750 M€.", caveat: "Aunque no te aplique directamente, endurece los CFC del resto." },
  { id: "beps", title: "BEPS", def: "Marco OCDE contra el traslado artificial de beneficios. Es el origen de CFC, sustancia, CRS y la obligación de reporte.", },
  { id: "gaar", title: "GAAR (norma general anti-abuso)", def: "Permite a Hacienda ignorar estructuras artificiales sin sustancia económica real, aunque cumplan la letra de la ley." },
  { id: "dac6", title: "DAC6 / MDR", def: "Obliga a intermediarios (o al propio contribuyente) a reportar a Hacienda arreglos transfronterizos con ciertas 'señas', en 30 días.", caveat: "Diseñar un esquema de planificación agresiva es, en sí mismo, una actividad reportable y con responsabilidad del intermediario." },
  { id: "ppt_lob", title: "PPT / LOB", def: "Cláusulas anti-abuso de los tratados: niegan los beneficios del convenio si el propósito principal de la estructura es obtener la ventaja fiscal.", caveat: "Matan el 'treaty shopping' (interponer una sociedad solo para aprovechar un tratado)." },
  { id: "territorial", title: "Territorial · mundial · remesa", def: "Territorial no grava la renta extranjera (Georgia, Panamá, Paraguay); mundial grava todo; por remesa grava lo que entra al país.", caveat: "Malasia exenta hasta 2036; Tailandia por remesa con cambios desde 2024." },
  { id: "dtt", title: "Convenios de doble imposición (DTT)", def: "Tratados entre países que evitan pagar dos veces, reducen retenciones y definen dónde tributa cada tipo de renta.", caveat: "Sus beneficios se pierden si activas las cláusulas anti-abuso (PPT/LOB)." },
  { id: "participation_exemption", title: "Participación-exención", def: "Dividendos y plusvalías intragrupo exentos si se cumplen condiciones. Es la pieza clave de los holdings.", },
  { id: "exit_tax", title: "Exit tax (impuesto de salida)", def: "Algunos países gravan las plusvalías latentes al emigrar (p. ej. Alemania, o España en ciertos casos).", caveat: "Mudarte 'para no pagar' puede activarlo justo al salir." },
  { id: "non_dom", title: "Domicilio vs residencia (non-dom)", def: "Algunos países distinguen residencia fiscal de domicilio; es la base de los regímenes non-dom (Chipre, Malta).", caveat: "Suele eximir la renta extranjera no remitida, pero no anula el CFC." },
  { id: "pass_through", title: "Entidad transparente", def: "La empresa no tributa por sí misma; sus beneficios se atribuyen al socio (p. ej. una LLC de EE. UU. con un solo socio).", caveat: "Si la gestionas desde tu país, puedes crear PE/dirección efectiva allí." },
  { id: "vat_oss", title: "IVA / OSS digital", def: "B2C digital en la UE → IVA del país del cliente (vía OSS); B2B → inversión del sujeto pasivo.", caveat: "Tener la entidad fuera de la UE no exime si operas dentro." },
];

const EN: GlossTerm[] = [
  { id: "tax_residency", title: "Tax residency (person)", def: "Where your worldwide income is taxed. Triggered by 183 days and by ties (home, family, centre of vital interests).", caveat: "Moving without breaking your prior residency doesn't work. Some countries have variants (Cyprus' 60-day rule)." },
  { id: "effective_management", title: "Place of effective management", def: "A company can be tax-resident where it is actually managed, not only where it's registered.", caveat: "Running your foreign company from home can make it taxable in your country." },
  { id: "pe", title: "Permanent establishment (PE)", def: "A stable presence that lets a country tax those profits and require VAT. The nomad-with-foreign-company's #1 risk.", caveat: "Working continuously from a country can create a PE there." },
  { id: "cfc", title: "CFC rules", def: "Your country attributes and taxes the undistributed profits of a foreign company you control (in the EU, via ATAD).", caveat: "They reach small founders. A non-dom regime does NOT cancel CFC. There's often an exemption for real activity." },
  { id: "substance", title: "Economic substance (ESR)", def: "Real office, staff, management and commercial rationale. Mandatory today; without it, the structure offers no protection.", caveat: "0% jurisdictions (UAE, Cayman, BVI) have Economic Substance Regulations." },
  { id: "crs", title: "CRS", def: "110+ countries automatically exchange non-residents' banking data. Banking secrecy as a strategy is over.", caveat: "FATCA is the equivalent for US persons." },
  { id: "pillar_two", title: "Pillar Two / GloBE", def: "A 15% global minimum tax. Mainly affects groups with >€750M revenue.", caveat: "Even if it doesn't apply to you directly, it tightens everyone else's CFC rules." },
  { id: "beps", title: "BEPS", def: "OECD framework against artificial profit shifting. The origin of CFC, substance, CRS and reporting duties." },
  { id: "gaar", title: "GAAR (general anti-abuse rule)", def: "Lets the tax authority ignore artificial structures with no real economic substance, even if they meet the letter of the law." },
  { id: "dac6", title: "DAC6 / MDR", def: "Requires intermediaries (or the taxpayer) to report cross-border arrangements with certain 'hallmarks' within 30 days.", caveat: "Designing an aggressive planning scheme is itself a reportable activity with intermediary liability." },
  { id: "ppt_lob", title: "PPT / LOB", def: "Treaty anti-abuse clauses: they deny treaty benefits if the main purpose of the structure is to obtain the tax advantage.", caveat: "They kill 'treaty shopping' (inserting a company just to use a treaty)." },
  { id: "territorial", title: "Territorial · worldwide · remittance", def: "Territorial doesn't tax foreign income (Georgia, Panama, Paraguay); worldwide taxes everything; remittance taxes what enters.", caveat: "Malaysia exempt until 2036; Thailand on remittance, changing since 2024." },
  { id: "dtt", title: "Double-tax treaties (DTT)", def: "Treaties between countries that avoid double taxation, reduce withholding and define where each income is taxed.", caveat: "Benefits are lost if you trigger the anti-abuse clauses (PPT/LOB)." },
  { id: "participation_exemption", title: "Participation exemption", def: "Intra-group dividends and gains exempt under conditions. The key piece of holding structures." },
  { id: "exit_tax", title: "Exit tax", def: "Some countries tax latent capital gains when you emigrate (e.g. Germany, or Spain in certain cases).", caveat: "Moving 'to stop paying' can trigger it right as you leave." },
  { id: "non_dom", title: "Domicile vs residency (non-dom)", def: "Some countries separate tax residency from domicile; it's the basis of non-dom regimes (Cyprus, Malta).", caveat: "It usually exempts unremitted foreign income, but doesn't cancel CFC." },
  { id: "pass_through", title: "Pass-through entity", def: "The company isn't taxed itself; its profits are attributed to the owner (e.g. a single-member US LLC).", caveat: "Managing it from your country can create a PE/effective management there." },
  { id: "vat_oss", title: "VAT / digital OSS", def: "Digital B2C in the EU → VAT of the customer's country (via OSS); B2B → reverse charge.", caveat: "Having the entity outside the EU doesn't exempt you if you operate inside." },
];

// Valenciano: reutiliza el castellano (lenguas muy próximas) para el contenido
// largo; el chrome de la sección sí está plenamente traducido.
const CA = ES;

export const GLOSSARY: Record<Lang, GlossTerm[]> = { es: ES, ca: CA, en: EN };
