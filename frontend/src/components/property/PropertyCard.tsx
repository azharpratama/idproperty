import { Link } from 'react-router-dom';
import { MapPin, Coins, ArrowRight } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { usePropertyInfo, useTotalSupply, useTokenValueIDR } from '../../hooks/usePropertyToken';
import { formatIDR, formatTokensRaw } from '../../lib/format';
import { LoadingScreen } from '../ui/Spinner';

export function PropertyCard() {
  const { data: property, isLoading: isLoadingProperty } = usePropertyInfo();
  const { data: totalSupply, isLoading: isLoadingSupply } = useTotalSupply();
  const { data: tokenValue, isLoading: isLoadingValue } = useTokenValueIDR();

  const isLoading = isLoadingProperty || isLoadingSupply || isLoadingValue;

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <LoadingScreen message="Loading property..." />
        </CardBody>
      </Card>
    );
  }

  if (!property) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            Property data not available
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card hover>
      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/80 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-sm text-purple-600 font-medium">Property Image</p>
        </div>
      </div>

      <CardBody className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{property[0]}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="h-4 w-4" />
              {property[1]}
            </div>
          </div>
          <Badge variant={property[5] ? 'success' : 'danger'}>
            {property[5] ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Total Value</p>
            <p className="font-semibold text-gray-900">{formatIDR(property[2])}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Token Price</p>
            <p className="font-semibold text-gray-900">{formatIDR(tokenValue || 0n)}/token</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Coins className="h-4 w-4" />
          <span>{formatTokensRaw(totalSupply || 0n)} tokens available</span>
        </div>

        <Link
          to="/property"
          className="flex items-center justify-center gap-2 w-full py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardBody>
    </Card>
  );
}
