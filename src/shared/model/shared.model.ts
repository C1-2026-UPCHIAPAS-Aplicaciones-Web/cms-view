export interface TooltipState {
  visible: boolean;
  text: string;
  left: number;
  top: number;
}

export interface SiteReference {
  id: string;
  name: string;
  domain: string;
  color: string;
}
