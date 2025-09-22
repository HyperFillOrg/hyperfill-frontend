import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Users, Globe, Award, ExternalLink, Download, Shield, Plus } from 'lucide-react';

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
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Hedera Partner
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Cryptocurrency donations for nonprofits</p>
                <p className="text-sm">Enabling crypto donations to verified nonprofits worldwide through blockchain technology</p>
              </div>
              <Button variant="ghost" size="sm">
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
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Hedera Partner
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Renewable energy access</p>
                <p className="text-sm">Democratizing access to renewable energy through blockchain-powered microgrids</p>
              </div>
              <Button variant="ghost" size="sm">
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
                  <h4 className="font-semibold">Celo Foundation</h4>
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Hedera Partner
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Financial inclusion</p>
                <p className="text-sm">Building accessible financial tools for underbanked communities worldwide</p>
              </div>
              <Button variant="ghost" size="sm">
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
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div>
                <p className="font-medium">Certificate #156</p>
                <p className="text-sm text-muted-foreground">
                  $127.30 donated • December 2024
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onWithdrawCertificate('cert_156')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Mint
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div>
                <p className="font-medium">Certificate #155</p>
                <p className="text-sm text-muted-foreground">
                  $98.45 donated • November 2024
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Minted
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};