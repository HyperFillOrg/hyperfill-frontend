import { useState, useEffect } from 'react';
import { useImpactCertificate } from '@/hooks/useImpactCertificate';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Users, Globe, Award, ExternalLink, Download, Shield, Plus, CheckCircle } from 'lucide-react';
import { CONTRACTS } from '@/lib/contracts';

interface ImpactPoolProps {
  userBalance: string;
  totalPoolBalance: string;
  userDonationRate: number;
  onUpdateDonationRate: (rate: number) => void;
  onWithdrawCertificate: (certificateId: string) => void;
}

export const ImpactPool = ({
  userBalance,
  totalPoolBalance,
  userDonationRate,
  onUpdateDonationRate,
  onWithdrawCertificate
}: ImpactPoolProps) => {
  const [customRate, setCustomRate] = useState(userDonationRate.toString());
  const [isCustomizing, setIsCustomizing] = useState(false);
  const { stats, loading, minting, mintCertificate } = useImpactCertificate();
  const { toast } = useToast();

  const handleRateUpdate = (rate: number) => {
    onUpdateDonationRate(rate);
    setIsCustomizing(false);
  };

  const handleCustomRateSubmit = () => {
    const rate = parseFloat(customRate);
    if (rate >= 0 && rate <= 100) {
      handleRateUpdate(rate);
    }
  };

  const handleMintCertificate = async (certificateId: number) => {
    try {
      const result = await mintCertificate(certificateId);
      if (result.success) {
        toast({
          title: "Certificate Minted",
          description: `Impact Certificate #${certificateId} has been minted successfully!`,
        });
      } else {
        toast({
          title: "Minting Failed",
          description: result.error || "Failed to mint certificate",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while minting",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-success" />
            Impact Pool Contribution
          </CardTitle>
          <CardDescription>
            Automatically donate a percentage of your vault yield to verified social impact projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Your Pool Balance</Label>
              <div className="text-2xl font-bold">${userBalance} WHBAR</div>
            </div>
            <div className="space-y-2">
              <Label>Total Pool</Label>
              <div className="text-2xl font-bold">${totalPoolBalance} WHBAR</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Donation Rate</Label>
              <Badge variant="outline" className="text-success border-success">
                {userDonationRate}% of yield
              </Badge>
            </div>

            {!isCustomizing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {[0, 5, 10, 15, 25].map((rate) => (
                    <Button
                      key={rate}
                      variant={userDonationRate === rate ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRateUpdate(rate)}
                      className="text-xs"
                    >
                      {rate}%
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCustomizing(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Custom Rate
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  placeholder="Enter rate %"
                />
                <Button onClick={handleCustomRateSubmit}>Apply</Button>
                <Button variant="outline" onClick={() => setIsCustomizing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>
            Projects receiving funding from the impact pool
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">The Giving Block</h4>
                </div>
                <p className="text-sm text-muted-foreground">Cryptocurrency donations for nonprofits</p>
                <p className="text-sm">Enabling crypto donations to verified nonprofits worldwide through blockchain technology</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.open('https://thegivingblock.com', '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Funding Progress</span>
                <span>$45,230 / $75,000</span>
              </div>
              <Progress value={60.3} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1,200+ nonprofits</span>
              <span>Global</span>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">Power Ledger Foundation</h4>
                </div>
                <p className="text-sm text-muted-foreground">Renewable energy access</p>
                <p className="text-sm">Democratizing access to renewable energy through blockchain-powered microgrids</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.open('https://www.powerledger.io', '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Funding Progress</span>
                <span>$28,750 / $60,000</span>
              </div>
              <Progress value={47.9} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>850 households</span>
              <span>Southeast Asia</span>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">Climate Collective</h4>
                </div>
                <p className="text-sm text-muted-foreground">Climate action and sustainability</p>
                <p className="text-sm">Supporting global climate initiatives and sustainable development projects</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.open('https://climatecollective.org', '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Funding Progress</span>
                <span>$12,400 / $40,000</span>
              </div>
              <Progress value={31.0} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2,500 users</span>
              <span>Latin America & Africa</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Impact Certificates
          </CardTitle>
          <CardDescription>
            HTS tokenized proof of your social impact contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Loading certificates...</div>
            ) : stats?.certificates.length ? (
              stats.certificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div>
                    <p className="font-medium">Certificate #{cert.id}</p>
                    <p className="text-sm text-muted-foreground">
                      ${cert.amount} donated • {new Date(cert.timestamp * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted-foreground">{cert.projectName}</p>
                  </div>
                  <div className="flex gap-2">
                    {cert.isMinted ? (
                      <Button variant="outline" size="sm" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Minted
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMintCertificate(cert.id)}
                        disabled={minting}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {minting ? 'Minting...' : 'Mint'}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cert.isMinted && cert.tokenId ?
                        window.open(`https://hashscan.io/testnet/token/${CONTRACTS.IMPACT_CERTIFICATE_ADDRESS}/${cert.tokenId}`, '_blank') :
                        window.open(`https://hashscan.io/testnet/contract/${CONTRACTS.IMPACT_CERTIFICATE_ADDRESS}`, '_blank')
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No certificates available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};