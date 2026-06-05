export interface AlertByDomain {
  domain_name: string;
  total: number;
}

export interface Summary {
  total_of_children: number;
  already_reviewed: number;
  alerts_by_domain: AlertByDomain[];
}

export interface Health {
  ultima_consulta: string;
  vacinas_em_dia: boolean;
  alertas: string[];
}

export interface Education {
  escola: string | null;
  frequencia_percent: number | null;
  alertas: string[];
}

export interface SocialAssistance {
  cad_unico: boolean;
  beneficio_ativo: boolean;
  alertas: string[];
}

export interface Child {
  id: string;
  nome: string;
  data_nascimento: string;
  bairro: string;
  responsavel: string;

  saude: Health | null;
  educacao: Education | null;
  assistencia_social: SocialAssistance | null;

  revisado: boolean;
  revisado_por: string | null;
  revisado_em: string | null;
  total_alertas: number;
}

export interface ListChildrenResponse {
  data: Child[];
  page: number;
  size: number;
  total: number;
}