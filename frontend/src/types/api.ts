export interface AlertByDomain {
  domain_name: string;
  total: number;
}

export interface Summary {
  total_of_children: number;
  already_reviewed: number;
  alerts_by_domain: AlertByDomain[];
}