import { QRCodeSVG } from "qrcode.react";
import Button from "./UI/Button";
import { useRef } from "react";

export default function QR({productRecognition, core}) {
  const qrContainerRef = useRef(null);

  const downloadQR = () => {
    if (qrContainerRef.current) {
      const svgElement = qrContainerRef.current.querySelector("svg");
      if (svgElement) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = blobURL;
        downloadLink.download = `${productRecognition}.svg`; // Set the download file name
        document.body.appendChild(downloadLink); // Append to body to make it work in Firefox
        downloadLink.click();
        document.body.removeChild(downloadLink); // Clean up
      } else {
        console.error("No SVG found");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div ref={qrContainerRef}>
        <QRCodeSVG
          value={`https://trace-origin.netlify.app/item?productRecognition=${productRecognition}`}
          size={200}
          level="L"
          includeMargin={true}
          className="mx-auto"
        />
      </div>
      {!core && <Button primary className="w-fit" onClick={downloadQR}>
        Xuất ảnh QR
      </Button>}
    </div>
  );
}
