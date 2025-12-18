import { MapPin, FileText, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { usePropertyInfo, useInvestmentLimits, useTokenValueIDR } from '../../hooks/usePropertyToken';
import { formatIDR, formatTokensRaw } from '../../lib/format';
import { LoadingScreen } from '../ui/Spinner';

export function PropertyDetails() {
  const { data: property, isLoading: isLoadingProperty } = usePropertyInfo();
  const { min, max, isLoading: isLoadingLimits } = useInvestmentLimits();
  const { data: tokenValue, isLoading: isLoadingValue } = useTokenValueIDR();

  const isLoading = isLoadingProperty || isLoadingLimits || isLoadingValue;

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <LoadingScreen message="Loading property details..." />
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

  const legalDocument = property[4];
  const hasLegalDoc = legalDocument && legalDocument.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{property[0]}</h2>
            <div className="flex items-center gap-1 text-gray-500 mt-1">
              <MapPin className="h-4 w-4" />
              {property[1]}
            </div>
          </div>
          <Badge variant={property[5] ? 'success' : 'danger'} size="md">
            {property[5] ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Total Value</p>
            <p className="text-lg font-bold text-purple-900">{formatIDR(property[2])}</p>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg">
            <p className="text-sm text-pink-600 mb-1">Total Tokens</p>
            <p className="text-lg font-bold text-pink-900">{formatTokensRaw(property[3])}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Token Price</p>
            <p className="text-lg font-bold text-blue-900">{formatIDR(tokenValue || 0n)}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Investment Range</p>
            <p className="text-lg font-bold text-green-900">
              {formatTokensRaw(min || 0n)} - {formatTokensRaw(max || 0n)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Legal Documents
          </h3>
          {hasLegalDoc ? (
            <a
              href={`https://ipfs.io/ipfs/${legalDocument}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
            >
              View Legal Document
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <p className="text-sm text-gray-500">No legal document uploaded yet</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
