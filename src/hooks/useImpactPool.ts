import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { CONTRACTS, IMPACT_POOL_ABI } from '@/lib/contracts';

export interface ImpactPoolStats {
  userBalance: string;
  totalPoolBalance: string;
  userDonationRate: number;
  totalDonated: string;
  certificatesEarned: number;
  availableCertificates: ImpactCertificate[];
}

export interface ImpactCertificate {
  id: string;
  amount: string;
  timestamp: number;
  isMinted: boolean;
  tokenId?: string;
}

export interface DonationResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export const useImpactPool = () => {
  const { signer, account, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ImpactPoolStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getContracts = useCallback(() => {
    if (!signer) return null;

    const impactPoolContract = new ethers.Contract(
      CONTRACTS.IMPACT_POOL_ADDRESS,
      IMPACT_POOL_ABI,
      signer
    );

    return { impactPoolContract };
  }, [signer]);

  const fetchStats = useCallback(async () => {
    if (!signer || !account) return;

    setRefreshing(true);
    try {
      const contracts = getContracts();
      if (!contracts) return;

      const { impactPoolContract } = contracts;

      const [
        userBalance,
        totalPoolBalance,
        userDonationRate,
        totalDonated,
        certificatesCount,
        certificates
      ] = await Promise.all([
        impactPoolContract.getUserBalance(account),
        impactPoolContract.getTotalPoolBalance(),
        impactPoolContract.getUserDonationRate(account),
        impactPoolContract.getUserTotalDonated(account),
        impactPoolContract.getUserCertificateCount(account),
        impactPoolContract.getUserCertificates(account, 0, 10)
      ]);

      const formattedCertificates = certificates.map((cert: any) => ({
        id: cert.id.toString(),
        amount: ethers.formatEther(cert.amount),
        timestamp: cert.timestamp.toNumber(),
        isMinted: cert.isMinted,
        tokenId: cert.tokenId?.toString()
      }));

      setStats({
        userBalance: ethers.formatEther(userBalance),
        totalPoolBalance: ethers.formatEther(totalPoolBalance),
        userDonationRate: userDonationRate.toNumber(),
        totalDonated: ethers.formatEther(totalDonated),
        certificatesEarned: certificatesCount.toNumber(),
        availableCertificates: formattedCertificates
      });
    } catch (error) {
      console.error('Error fetching impact pool stats:', error);
    } finally {
      setRefreshing(false);
    }
  }, [signer, account, getContracts]);

  const updateDonationRate = useCallback(async (rate: number): Promise<DonationResult> => {
    if (!signer) {
      return { success: false, error: 'No signer available' };
    }

    try {
      setLoading(true);
      const contracts = getContracts();
      if (!contracts) return { success: false, error: 'Failed to get contracts' };

      const { impactPoolContract } = contracts;

      const tx = await impactPoolContract.setDonationRate(rate * 100, {
        gasLimit: 200000,
      });

      const receipt = await tx.wait();

      await fetchStats();

      return {
        success: true,
        txHash: tx.hash,
      };
    } catch (error: any) {
      console.error('Error updating donation rate:', error);
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

  const mintCertificate = useCallback(async (certificateId: string): Promise<DonationResult> => {
    if (!signer) {
      return { success: false, error: 'No signer available' };
    }

    try {
      setLoading(true);
      const contracts = getContracts();
      if (!contracts) return { success: false, error: 'Failed to get contracts' };

      const { impactPoolContract } = contracts;

      const tx = await impactPoolContract.mintCertificate(certificateId, {
        gasLimit: 300000,
      });

      const receipt = await tx.wait();

      await fetchStats();

      return {
        success: true,
        txHash: tx.hash,
      };
    } catch (error: any) {
      console.error('Error minting certificate:', error);
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

  const withdrawFromPool = useCallback(async (amount: string): Promise<DonationResult> => {
    if (!signer) {
      return { success: false, error: 'No signer available' };
    }

    try {
      setLoading(true);
      const contracts = getContracts();
      if (!contracts) return { success: false, error: 'Failed to get contracts' };

      const { impactPoolContract } = contracts;
      const amountWei = ethers.parseEther(amount);

      const tx = await impactPoolContract.withdraw(amountWei, {
        gasLimit: 250000,
      });

      const receipt = await tx.wait();

      await fetchStats();

      return {
        success: true,
        txHash: tx.hash,
      };
    } catch (error: any) {
      console.error('Error withdrawing from pool:', error);
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
    updateDonationRate,
    mintCertificate,
    withdrawFromPool,
    refreshStats: fetchStats,
  };
};