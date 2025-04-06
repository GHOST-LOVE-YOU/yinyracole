"use client";

import dynamic from "next/dynamic";

// Import TextLayer and AnnotationLayer styles globally
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// 动态导入react-pdf组件，禁用SSR
const PDFViewer = dynamic(() => import("./pdf-viewer-component"), {
  ssr: false,
});

interface PdfViewerProps {
  pdfPath: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfPath }) => {
  return (
    <div className="flex flex-col items-center my-5 w-full min-h-[80vh]">
      <PDFViewer pdfPath={pdfPath} />
    </div>
  );
};

export default PdfViewer;
