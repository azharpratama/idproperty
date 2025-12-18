import { Link } from 'react-router-dom';
import { Building2, Shield, Coins, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyStats } from '../components/property/PropertyStats';

export function Home() {
  const features = [
    {
      icon: Building2,
      title: 'Fractional Ownership',
      description: 'Own a piece of premium Indonesian real estate with as little as 1 token.',
    },
    {
      icon: Shield,
      title: 'KYC Compliant',
      description: 'Full regulatory compliance with verified investor requirements.',
    },
    {
      icon: Coins,
      title: 'Liquid Investment',
      description: 'Trade your property tokens freely with other verified investors.',
    },
  ];

  const steps = [
    { step: 1, title: 'Connect Wallet', description: 'Connect your Web3 wallet to get started' },
    { step: 2, title: 'Complete KYC', description: 'Verify your identity through our KYC process' },
    { step: 3, title: 'Invest', description: 'Purchase property tokens and become an owner' },
    { step: 4, title: 'Trade', description: 'Transfer or trade tokens with other investors' },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
          <Building2 className="h-4 w-4" />
          Real World Asset Tokenization
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Invest in Indonesian
          <span className="block gradient-primary bg-clip-text text-transparent">
            Real Estate
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Own fractional shares of premium properties through blockchain technology.
          Secure, compliant, and accessible real estate investment.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/property">
            <Button size="lg">
              View Property
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <Link to="/portfolio">
            <Button variant="secondary" size="lg">
              My Portfolio
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Key Statistics
        </h2>
        <PropertyStats />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Featured Property
        </h2>
        <div className="max-w-md mx-auto">
          <PropertyCard />
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Why Choose IDProperty?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-8 bg-white rounded-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-0.5 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
