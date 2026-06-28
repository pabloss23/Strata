// Mapa id de métrica -> código de indicador del World Bank (espejo del pipeline).
// Sirve para pedir la serie histórica al vuelo desde el cliente (API con CORS).
export const WB_CODE: Record<string, { code: string; source?: number }> = {
  gdp_per_capita: { code: "NY.GDP.PCAP.CD" },
  gdp_growth: { code: "NY.GDP.MKTP.KD.ZG" },
  inflation: { code: "FP.CPI.TOTL.ZG" },
  unemployment: { code: "SL.UEM.TOTL.ZS" },
  gini: { code: "SI.POV.GINI" },
  life_expectancy: { code: "SP.DYN.LE00.IN" },
  internet_users: { code: "IT.NET.USER.ZS" },
  access_electricity: { code: "EG.ELC.ACCS.ZS" },
  child_mortality: { code: "SH.DYN.MORT" },
  secondary_enrollment: { code: "SE.SEC.ENRR" },
  // Worldwide Governance Indicators (base de datos source=3)
  rule_of_law: { code: "GOV_WGI_RL.SC", source: 3 },
  control_of_corruption: { code: "GOV_WGI_CC.SC", source: 3 },
  voice_accountability: { code: "GOV_WGI_VA.SC", source: 3 },
  political_stability: { code: "GOV_WGI_PV.SC", source: 3 },
  government_effectiveness: { code: "GOV_WGI_GE.SC", source: 3 },
};
