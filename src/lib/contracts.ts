// src/lib/contracts.ts

// ===== ADDRESSES =====
export const CONTRACTS = {
    VAULT_ADDRESS: "0xFED81A469944B1D5d1500fA722Cb820a6481Dbcc",
    WHBAR_ADDRESS: "0xC230646FD55B68C7445C3b1aBB683C2357a7A180",
  } as const;
  
  // ===== HEDERA TESTNET CONFIG =====
  export const HEDERA_TESTNET = {
    chainId: 296,
    chainName: "Hedera Testnet",
    nativeCurrency: {
      name: "HBAR",
      symbol: "HBAR",
      decimals: 18,
    },
    rpcUrls: ["https://testnet.hashio.io/api"],
    blockExplorerUrls: ["https://hashscan.io/testnet"],
  } as const;
  
  // ===== VAULT ABI =====
  export const VAULT_ABI = [
    "function depositLiquidity(uint256 assets) external returns (uint256 shares)",
    "function withdrawProfits() external returns (uint256 assets)",
    "function getUserShareBalance(address user) external view returns (uint256)",
    "function getBalanceUser(address user) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function totalSupply() external view returns (uint256)",
    "function totalAssets() external view returns (uint256)",
    "function getSharePrice() external view returns (uint256)",
    "function getAvailableAssets() external view returns (uint256)",
    "function minDeposit() external view returns (uint256)",
    "function paused() external view returns (bool)",
    "function asset() external view returns (address)",
    "function previewDeposit(uint256 assets) external view returns (uint256)",
    "function previewRedeem(uint256 shares) external view returns (uint256)",
    "event LiquidityAdded(address indexed user, uint256 assets, uint256 shares)",
    "event LiquidityRemoved(address indexed user, uint256 assets, uint256 shares)"
  ] as const;
  
  // ===== WHBAR ABI =====
  export const WHBAR_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
    "function name() external view returns (string)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function deposit() external payable",
    "function withdraw(uint256 amount) external",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
  ] as const;
