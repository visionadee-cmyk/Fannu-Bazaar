import QRCode from 'react-qr-code';
import { Download, Smartphone } from 'lucide-react';

export default function QRCodeInstall() {
  const appUrl = 'https://fannu-bazaar.vercel.app';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Smartphone className="w-5 h-5" style={{ color: '#10B981' }} />
        <h3 className="text-lg font-semibold text-gray-900">Install App</h3>
      </div>
      
      <div className="flex justify-center mb-4">
        <div className="bg-white p-4 rounded-xl border-2 border-gray-100">
          <QRCode 
            value={appUrl} 
            size={160}
            level="H"
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        Scan to download the app
      </p>
      
      <a
        href={appUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-lg"
        style={{ background: '#10B981' }}
      >
        <Download className="w-4 h-4" />
        <span>Download App</span>
      </a>
    </div>
  );
}
