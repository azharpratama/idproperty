import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            2025 IDProperty. All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Built on</span>
            <a
              href="https://www.mantle.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
            >
              Mantle Network
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://sepolia.mantlescan.xyz/address/0x9D4eA7e7Eb182C628bb202a1521Aa053868Cbeb6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
            >
              Explorer
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://docs.mantle.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
            >
              Docs
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
