import QRCode from 'react-qr-code';
import { Download, Smartphone, ImageDown } from 'lucide-react';
import { useRef } from 'react';

export default function QRCodeInstall() {
  const appUrl = 'https://fannu-bazaar.vercel.app';
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const container = qrContainerRef.current;
    if (!container) return;

    const svg = container.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'fannu-bazaar-qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = url;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Smartphone className="w-5 h-5" style={{ color: '#10B981' }} />
        <h3 className="text-lg font-semibold text-gray-900">Install App</h3>
      </div>
      
      <div className="flex justify-center mb-4">
        <div ref={qrContainerRef} className="bg-white p-4 rounded-xl border-2 border-gray-100">
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
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-lg"
          style={{ background: '#10B981' }}
        >
          <Download className="w-4 h-4" />
          <span>Open App</span>
        </a>
        <button
          onClick={downloadQRCode}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
        >
          <ImageDown className="w-4 h-4" />
          <span>Download QR</span>
        </button>
      </div>
    </div>
  );
}
