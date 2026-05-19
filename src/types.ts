export interface WalletSession {
  address: string;
  keystoreJson: string;
  derivationPath: string;
  label: string;
}

export interface ClueNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  risk: "low" | "med" | "high";
}

export interface ClueEdge {
  from: string;
  to: string;
}
