// src/components/QRCodeScanner.js
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = ({ onScanSuccess, onScanError }) => {
  const qrCodeScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 30, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    qrCodeScannerRef.current = html5QrCodeScanner;

    return () => {
      if (isScanning) {
        html5QrCodeScanner.clear().catch((error) => {
          console.error("Failed to clear html5QrCodeScanner", error);
        });
      }
    };
  }, [isScanning]);

  const startScanning = () => {
    qrCodeScannerRef.current.render(onScanSuccess, onScanError);
    setIsScanning(true);
  };

  const stopScanning = () => {
    qrCodeScannerRef.current.clear().then(() => {
      setIsScanning(false);
    }).catch((error) => {
      console.error("Failed to clear html5QrCodeScanner", error);
    });
  };

  return (
    <div className="qr-code-scanner-container">
      <div className="qr-code-scanner-header">
        <h1>QR Code Scanner</h1>
      </div>
      <div className="qr-code-scanner-body">
        <div id="reader" style={{ width: "100%" }} />
        {isScanning ? (
          <button onClick={stopScanning} className="qr-code-scanner-button">
            Stop Scanning
          </button>
        ) : (
          <button onClick={startScanning} className="qr-code-scanner-button">
            Start Scanning
          </button>
        )}
      </div>
      <div className="qr-code-scanner-footer">
        <p>Align the QR code within the frame to scan.</p>
      </div>
    </div>
  );
};

export default QRCodeScanner;
