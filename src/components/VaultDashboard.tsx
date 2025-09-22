// src/components/VaultDashboard.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, TrendingUp, TrendingDown, Wallet, PiggyBank, Heart } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useVault } from '@/hooks/useVault';

export const VaultDashboard = () => {
  const { account, isConnected, isOnHederaTestnet } = useWallet();
  const { stats, loading, refreshing, deposit, withdraw, approveWHBAR, refreshStats } = useVault();
  const { toast } = useToast();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [donationPercentage, setDonationPercentage] = useState(5);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    if (stats && parseFloat(depositAmount) < parseFloat(stats.minDeposit)) {
      toast({
        title: "Amount too small", 
        description: `Minimum deposit is ${stats.minDeposit} WHBAR`,
        variant: "destructive",
      });
      return;
    }

    if (stats && parseFloat(depositAmount) > parseFloat(stats.whbarBalance)) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough WHBAR",
        variant: "destructive",
      });
      return;
    }

    setIsDepositing(true);
    try {
      const result = await deposit(depositAmount);
      
      if (result.success) {
        toast({
          title: "Deposit successful!",
          description: `Deposited ${depositAmount} WHBAR and received ${result.shares} shares`,
        });
        setDepositAmount('');
      } else {
        toast({
          title: "Deposit failed",
          description: result.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Deposit failed", 
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!stats || parseFloat(stats.userShares) === 0) {
      toast({
        title: "No shares to withdraw",
        description: "You don't have any shares in the vault",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      const result = await withdraw();
      
      if (result.success) {
        toast({
          title: "Withdrawal successful!",
          description: `Withdrew ${result.assets} WHBAR`,
        });
      } else {
        toast({
          title: "Withdrawal failed",
          description: result.error || "Unknown error", 
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleApprove = async () => {
    if (!depositAmount) return;
    
    try {
      const success = await approveWHBAR(depositAmount);
      if (success) {
        toast({
          title: "Approval successful",
          description: `Approved ${depositAmount} WHBAR for spending`,
        });
      }
    } catch (error) {
      toast({
        title: "Approval failed",
        description: "Failed to approve WHBAR",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to access the HyperFill Vault
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isOnHederaTestnet) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <CardTitle>Wrong Network</CardTitle>
            <CardDescription>
              Please switch to Hedera Testnet to use the vault
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? parseFloat(stats.whbarBalance).toFixed(4) : '0.0000'}
            </div>
            <p className="text-xs text-muted-foreground">WHBAR</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Shares</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? parseFloat(stats.userShares).toFixed(4) : '0.0000'}
            </div>
            <p className="text-xs text-muted-foreground">Vault Shares</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Share Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? parseFloat(stats.sharePrice).toFixed(4) : '1.0000'}
            </div>
            <p className="text-xs text-muted-foreground">WHBAR per Share</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? parseFloat(stats.totalAssets).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Total WHBAR</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Deposit WHBAR</CardTitle>
                <CardDescription>
                  Deposit WHBAR tokens to receive vault shares
                </CardDescription>
              </div>
              {stats?.isPaused && (
                <Badge variant="destructive">Paused</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (WHBAR)</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="0.0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={isDepositing || loading || stats?.isPaused}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Balance: {stats ? parseFloat(stats.whbarBalance).toFixed(4) : '0.0000'} WHBAR</span>
                <span>Min: {stats ? parseFloat(stats.minDeposit).toFixed(2) : '1.00'} WHBAR</span>
              </div>
            </div>

            {/* Approval Info */}
            {stats && depositAmount && parseFloat(depositAmount) > parseFloat(stats.whbarAllowance) && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Approval needed for {depositAmount} WHBAR
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleApprove}
                  disabled={loading}
                  className="mt-2"
                >
                  Approve WHBAR
                </Button>
              </div>
            )}

            <Button 
              onClick={handleDeposit} 
              disabled={isDepositing || loading || !depositAmount || stats?.isPaused}
              className="w-full"
            >
              {isDepositing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Depositing...
                </>
              ) : (
                'Deposit'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Withdraw Card */}
        <Card>
          <CardHeader>
            <CardTitle>Withdraw</CardTitle>
            <CardDescription>
              Withdraw all your shares and receive WHBAR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Your Shares:</span>
                  <span className="text-sm font-medium">
                    {stats ? parseFloat(stats.userShares).toFixed(4) : '0.0000'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Estimated WHBAR:</span>
                  <span className="text-sm font-medium">
                    {stats ? (parseFloat(stats.userShares) * parseFloat(stats.sharePrice)).toFixed(4) : '0.0000'}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-success" />
                  <Label className="text-sm font-medium">Impact Donation</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {[0, 5, 10].map((percentage) => (
                      <Button
                        key={percentage}
                        variant={donationPercentage === percentage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDonationPercentage(percentage)}
                        className="text-xs flex-1"
                      >
                        {percentage}%
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {donationPercentage > 0
                      ? `${donationPercentage}% of withdrawn profits will be donated to verified social impact projects on Hedera. This creates transparency through blockchain verification and helps fund education, clean energy, and financial inclusion initiatives worldwide.`
                      : "No donation will be made from withdrawn profits."
                    }
                  </p>
                  {donationPercentage > 0 && stats && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Donation amount:</span>
                      <span className="font-medium text-success">
                        {((parseFloat(stats.userShares) * parseFloat(stats.sharePrice)) * donationPercentage / 100).toFixed(4)} WHBAR
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleWithdraw}
              disabled={isWithdrawing || loading || !stats || parseFloat(stats.userShares) === 0}
              variant="destructive"
              className="w-full"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                'Withdraw All'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={refreshStats}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh Data
        </Button>
      </div>
    </div>
  );
};