export interface ChainNode {
  id: string;
  label: string;
  symbol: string;
  testnet: boolean;
  chainId?: string;
  tcxNetwork?: "MAINNET" | "TESTNET";
  rpcUrl?: string;
  explorer?: string;
  tcxChain?: "ETHEREUM";
}

export const CHAINS: Record<string, ChainNode> = {
  sepolia: {
    id: "sepolia",
    label: "Sepolia",
    symbol: "ETH",
    testnet: true,
    chainId: "11155111",
    tcxNetwork: "TESTNET",
    rpcUrl: "https://rpc.sepolia.org",
    explorer: "https://sepolia.etherscan.io",
    tcxChain: "ETHEREUM",
  },
  ethereum: {
    id: "ethereum",
    label: "Ethereum",
    symbol: "ETH",
    testnet: false,
    chainId: "1",
    tcxNetwork: "MAINNET",
    rpcUrl: "https://ethereum-rpc.publicnode.com",
    explorer: "https://etherscan.io",
    tcxChain: "ETHEREUM",
  },
};

export const CHAIN_LIST = Object.values(CHAINS);
export const DEFAULT_CHAIN = "sepolia";

export function getChain(id: string): ChainNode {
  const c = CHAINS[id];
  if (!c) throw new Error("未知网络");
  return c;
}
