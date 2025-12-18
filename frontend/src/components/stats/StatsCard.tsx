import { Card, CardBody } from '../ui/Card';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'purple' | 'pink' | 'blue' | 'green' | 'yellow' | 'red';
  description?: string;
}

const colorClasses = {
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-500',
    text: 'text-purple-900',
  },
  pink: {
    bg: 'bg-pink-50',
    icon: 'text-pink-500',
    text: 'text-pink-900',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    text: 'text-blue-900',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-500',
    text: 'text-green-900',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-500',
    text: 'text-yellow-900',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-500',
    text: 'text-red-900',
  },
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  color = 'purple',
  description,
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <Card>
      <CardBody>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
            {description && (
              <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
