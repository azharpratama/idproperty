import { useAccount } from 'wagmi';
import { Coins, TrendingUp, Users, PieChart } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import {
  usePropertyInfo,
  useTokenValueIDR,
  useOwnershipPercent,
} from '../../hooks/usePropertyToken';
import { useTotalInvestors } from '../../hooks/useKYCRegistry';
import { formatIDR, formatPercent } from '../../lib/format';

export function PropertyStats() {
  const { address } = useAccount();
  const { data: property } = usePropertyInfo();
  const { data: tokenValue } = useTokenValueIDR();
  const { data: totalInvestors } = useTotalInvestors();
  const { data: ownership } = useOwnershipPercent(address);

  const stats = [
    {
      label: 'Token Price',
      value: formatIDR(tokenValue || 0n),
      icon: Coins,
      color: 'purple',
    },
    {
      label: 'Total Market Cap',
      value: formatIDR(property?.[2] || 0n),
      icon: TrendingUp,
      color: 'pink',
    },
    {
      label: 'Registered Investors',
      value: totalInvestors?.toString() || '0',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Your Ownership',
      value: address ? formatPercent(ownership || 0n) : '-',
      icon: PieChart,
      color: 'green',
    },
  ];

  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500', text: 'text-purple-900' },
    pink: { bg: 'bg-pink-50', icon: 'text-pink-500', text: 'text-pink-900' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', text: 'text-blue-900' },
    green: { bg: 'bg-green-50', icon: 'text-green-500', text: 'text-green-900' },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color];

        return (
          <Card key={stat.label}>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-lg font-bold ${colors.text}`}>{stat.value}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
