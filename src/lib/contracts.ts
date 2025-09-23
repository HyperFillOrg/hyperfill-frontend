// src/lib/contracts.ts

// ===== ADDRESSES =====
export const CONTRACTS = {
    VAULT_ADDRESS: "0x8D03Cab8D66D923ae267f9e6727721aFDBdd25E2",
    WHBAR_ADDRESS: "0x66B8244b08be8F4Cec1A23C5c57A1d7b8A27189D",
    IMPACT_CERTIFICATE_ADDRESS: "0xB57E12b2F6d5C36D03a9c48EA45f9ea6b971878e",
    IMPACT_POOL_ADDRESS: "0x518fC4A2b56f592E0296649D4955Fde16F464549",
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
  "function withdrawProfits(uint256 impactAllocationBps) external returns (uint256 assets)",
  "function depositLiquidityWithoutShares(uint256 amount) external",
  "function moveFromVaultToWallet(uint256 amount, address tradingWallet) external",
  "function moveFromWalletToVault(uint256 amount, uint256 profitAmount, address fromWallet) external",
  "function returnAllCapital(address fromWallet) external",
  "function getUserShareBalance(address user) external view returns (uint256)",
  "function getBalanceUser(address user) external view returns (uint256)",
  "function getBalanceVault() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function shareToUser(address user) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "function totalAssets() public view returns (uint256)",
  "function getSharePrice() external view returns (uint256)",
  "function getAvailableAssets() external view returns (uint256)",
  "function totalAllocated() public view returns (uint256)",
  "function getVaultState() external view returns (uint256, uint256, uint256, uint256, uint256)",
  "function previewDeposit(uint256 assets) public view returns (uint256)",
  "function previewRedeem(uint256 shares) public view returns (uint256)",
  "function previewWithdrawalFee(uint256 assets) external view returns (uint256)",
  "function minDeposit() public view returns (uint256)",
  "function maxAllocationBps() public view returns (uint256)",
  "function withdrawalFeeBps() public view returns (uint256)",
  "function paused() public view returns (bool)",
  "function asset() public view returns (address)",
  "function feeRecipient() public view returns (address)",
  "function getTotalAccumulatedFees() external view returns (uint256)",
  "function accumulatedWithdrawalFees() public view returns (uint256)",
  "function withdrawFees() external",
  "function impactPool() public view returns (address)",
  "function getUserProfits(address user) external view returns (uint256)",
  "function getUserTotalDeposited(address user) external view returns (uint256)",
  "function addAuthorizedAgent(address agent) external",
  "function removeAuthorizedAgent(address agent) external",
  "function authorizedAgents(address agent) public view returns (bool)",
  "function getAuthorizedAgents() external view returns (address[])",
  "function setMaxAllocation(uint256 newMaxBps) external",
  "function setMinDeposit(uint256 newMinDeposit) external",
  "function setWithdrawalFee(uint256 newFeeBps) external",
  "function setFeeRecipient(address newRecipient) external",
  "function setImpactPool(address newImpactPool) external",
  "function pause() external",
  "function unpause() external",
  "function owner() public view returns (address)"
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

  // ===== IMPACT POOL ABI =====
  export const IMPACT_POOL_ABI = [
    "function getUserBalance(address user) external view returns (uint256)",
    "function getTotalPoolBalance() external view returns (uint256)",
    "function getUserDonationRate(address user) external view returns (uint256)",
    "function setDonationRate(uint256 rate) external",
    "function getUserTotalDonated(address user) external view returns (uint256)",
    "function getUserCertificateCount(address user) external view returns (uint256)",
    "function getUserCertificates(address user, uint256 offset, uint256 limit) external view returns (tuple(uint256 id, uint256 amount, uint256 timestamp, bool isMinted, uint256 tokenId)[])",
    "function mintCertificate(uint256 certificateId) external",
    "function withdraw(uint256 amount) external",
    "function donate(uint256 amount) external",
    "event DonationRateUpdated(address indexed user, uint256 rate)",
    "event CertificateMinted(address indexed user, uint256 certificateId, uint256 tokenId)",
    "event Donation(address indexed user, uint256 amount)",
    "event Withdrawal(address indexed user, uint256 amount)"
  ] as const;
