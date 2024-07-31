import { useState } from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ShowPDF({ pdfURL }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
  });
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Viewer fileUrl={pdfURL} plugins={[defaultLayoutPluginInstance]} />
    </Worker>
  );
}
