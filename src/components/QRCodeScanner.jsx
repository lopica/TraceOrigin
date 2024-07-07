// src/components/QRCodeScanner.js
import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
  const qrCodeScannerRef = useRef(null);

  useEffect(() => {
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 30, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    html5QrCodeScanner.render(onScanSuccess, onScanError);

    qrCodeScannerRef.current = html5QrCodeScanner;

    return () => {
      html5QrCodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrCodeScanner", error);
      });
    };
  }, [onScanSuccess, onScanError]);

  return <div id="reader" style={{ width: "100%" }} />;
};

export default QRCodeScanner;
