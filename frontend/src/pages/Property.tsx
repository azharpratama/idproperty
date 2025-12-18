import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { PropertyDetails } from '../components/property/PropertyDetails';
import { PropertyStats } from '../components/property/PropertyStats';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useTokenValueIDR, usePropertyInfo } from '../hooks/usePropertyToken';
import { formatIDR, formatPercent } from '../lib/format';

export function Property() {
  const [tokenAmount, setTokenAmount] = useState('');
  const { data: tokenValue } = useTokenValueIDR();
  const { data: property } = usePropertyInfo();

  const amount = tokenAmount ? parseFloat(tokenAmount) : 0;
  const investmentValue = tokenValue ? amount * Number(tokenValue) : 0;
  const ownershipPercent =
    property && property[3] ? (amount / (Number(property[3]) / 1e18)) * 10000 : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Details</h1>
        <p className="text-gray-600">
          Explore the tokenized property and calculate your potential investment.
        </p>
      </div>

      <PropertyStats />

      <PropertyDetails />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">Investment Calculator</h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Token Amount"
                type="number"
                placeholder="Enter number of tokens"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                min="0"
                helperText="Enter the number of tokens you want to invest"
              />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Investment Value</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatIDR(investmentValue)}
                </p>
              </div>

              <div className="p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-pink-600 mb-1">Ownership Percentage</p>
                <p className="text-2xl font-bold text-pink-900">
                  {formatPercent(ownershipPercent)}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
