// src/hooks/useVault.ts
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { CONTRACTS, VAULT_ABI, WHBAR_ABI } from '@/lib/contracts';

export interface VaultStats {
  userShares: string;
  userBalance: string;
  totalAssets: string;
  totalSupply: string;
  sharePrice: string;
  availableAssets: string;
  minDeposit: string;
  isPaused: boolean;
  whbarBalance: string;
  whbarAllowance: string;
}

export interface DepositResult {
  success: boolean;
  txHash?: string;
  shares?: string;
  error?: string;
}

export interface WithdrawResult {
  success: boolean;
  txHash?: string;
  assets?: string;
  error?: string;
}

export const useVault = () => {
  const { signer, account, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Create contract instances
  const getContracts = useCallback(() => {
    if (!signer) return null;
    
    const vaultContract = new ethers.Contract(
      CONTRACTS.VAULT_ADDRESS,
      VAULT_ABI,
      signer
    );
    
    const whbarContract = new ethers.Contract(
      CONTRACTS.WHBAR_ADDRESS,
      WHBAR_ABI,
      signer
    );

    return { vaultContract, whbarContract };
  }, [signer]);

  // Fetch vault stats
  const fetchStats = useCallback(async () => {
    if (!signer || !account) return;

    setRefreshing(true);
    try {
      const contracts = getContracts();
      if (!contracts) return;

      const { vaultContract, whbarContract } = contracts;

      // Fetch all data in parallel
      const [
        userShares,
        userBalance,
        totalAssets,
        totalSupply,
        sharePrice,
        availableAssets,
        minDeposit,
        isPaused,
        whbarBalance,
        whbarAllowance,
      ] = await Promise.all([
        vaultContract.getUserShareBalance(account),
        vaultContract.getBalanceUser(account),
        vaultContract.totalAssets(),
        vaultContract.totalSupply(),
        vaultContract.getSharePrice(),
        vaultContract.getAvailableAssets(),
        vaultContract.minDeposit(),
        vaultContract.paused(),
        whbarContract.balanceOf(account),
        whbarContract.allowance(account, CONTRACTS.VAULT_ADDRESS),
      ]);

      setStats({
        userShares: ethers.formatEther(userShares),
        userBalance: ethers.formatEther(userBalance),
        totalAssets: ethers.formatEther(totalAssets),
        totalSupply: ethers.formatEther(totalSupply),
        sharePrice: ethers.formatEther(sharePrice),
        availableAssets: ethers.formatEther(availableAssets),
        minDeposit: ethers.formatEther(minDeposit),
        isPaused,
        whbarBalance: ethers.formatEther(whbarBalance),
        whbarAllowance: ethers.formatEther(whbarAllowance),
      });
    } catch (error) {
      console.error('Error fetching vault stats:', error);
    } finally {
      setRefreshing(false);
    }
  }, [signer, account, getContracts]);

  // Approve WHBAR spending
  const approveWHBAR = useCallback(async (amount: string): Promise<boolean> => {
    if (!signer) {
      console.error('No signer available');
      return false;
    }

    try {
      setLoading(true);
      const contracts = getContracts();
      if (!contracts) return false;

      const { whbarContract } = contracts;
      const amountWei = ethers.parseEther(amount);

      const tx = await whbarContract.approve(CONTRACTS.VAULT_ADDRESS, amountWei);
      await tx.wait();

      // Refresh stats after approval
      await fetchStats();
      return true;
    } catch (error: any) {
      console.error('Error approving WHBAR:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [signer, getContracts, fetchStats]);

  // Deposit to vault
  const deposit = useCallback(async (amount: string): Promise<DepositResult> => {
    if (!signer) {
      return { success: false, error: 'No signer available' };
    }

    try {
      setLoading(true);
      const contracts = getContracts();
      if (!contracts) return { success: false, error: 'Failed to get contracts' };

      const { vaultContract } = contracts;
      const amountWei = ethers.parseEther(amount);

      // Check if approval is needed
      if (stats) {
        const allowance = ethers.parseEther(stats.whbarAllowance);
        if (allowance < (amountWei)) {
          const approved = await approveWHBAR(amount);
          if (!approved) {
            return { success: false, error: 'Failed to approve WHBAR' };
          }
        }
      }

      // Execute deposit
      const tx = await vaultContract.depositLiquidity(amountWei, {
        gasLimit: 300000, // Set reasonable gas limit
      });

      const receipt = await tx.wait();

      // Parse events to get shares received
      let sharesReceived = '0';
      if (receipt.events) {
        const depositEvent = receipt.events.find((e: any) => e.event === 'LiquidityAdded');
        if (depositEvent) {
          sharesReceived = ethers.formatEther(depositEvent.args.shares);
        }
      }

      // Refresh stats
      await fetchStats();

      return {
        success: true,
        txHash: tx.hash,
        shares: sharesReceived,
      };
    } catch (error: any) {
      console.error('Error depositing:', error);
      let errorMessage = 'Unknown error occurred';
      
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [signer, getContracts, stats, approveWHBAR, fetchStats]);

  // Withdraw from vault
  const withdraw = useCallback(async (): Promise<WithdrawResult> => {
    if (!signer) {
      return { success: false, error: 'No signer available' };
    }

    try {
      setLoading(true);
      const contracts = getContracts();
      if (!contracts) return { success: false, error: 'Failed to get contracts' };

      const { vaultContract } = contracts;

      // Execute withdraw
      const tx = await vaultContract.withdrawProfits({
        gasLimit: 300000, // Set reasonable gas limit
      });

      const receipt = await tx.wait();

      // Parse events to get assets received
      let assetsReceived = '0';
      if (receipt.events) {
        const withdrawEvent = receipt.events.find((e: any) => e.event === 'LiquidityRemoved');
        if (withdrawEvent) {
          assetsReceived = ethers.formatEther(withdrawEvent.args.assets);
        }
      }

      // Refresh stats
      await fetchStats();

      return {
        success: true,
        txHash: tx.hash,
        assets: assetsReceived,
      };
    } catch (error: any) {
      console.error('Error withdrawing:', error);
      let errorMessage = 'Unknown error occurred';
      
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [signer, getContracts, fetchStats]);

  // Auto-fetch stats when wallet connects
  useEffect(() => {
    if (isConnected && account) {
      fetchStats();
    } else {
      setStats(null);
    }
  }, [isConnected, account, fetchStats]);

  return {
    stats,
    loading,
    refreshing,
    deposit,
    withdraw,
    approveWHBAR,
    refreshStats: fetchStats,
  };
};