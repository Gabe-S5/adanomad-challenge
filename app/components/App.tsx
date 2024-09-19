// app/components/App.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import PdfUploader from "./PdfUploader";
import KeywordSearch from "./KeywordSearch";
import PdfViewer from "./PdfViewer";
import { Sidebar } from "./Sidebar";
import { searchPdf } from "../utils/pdfUtils";
import type { IHighlight } from "react-pdf-highlighter";

export default function App() {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);
  const [highlightsKey, setHighlightsKey] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const pdfViewerRef = useRef<any>(null);

  useEffect(() => {
    setHighlightsKey((prev) => prev + 1);
  }, [highlights]);

  const handleFileUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setPdfUrl(fileUrl);
    setPdfUploaded(true);
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleDocument = () => {
    setPdfUploaded(false);
    setPdfUrl(null);
  };

  const scrollToHighlight = (highlight: IHighlight) => {
    console.log(highlight);
    pdfViewerRef.current.scrollTo(highlight);
  };

  const handleSearch = async () => {
    if (pdfUrl && searchTerm) {
      const keywords = searchTerm.split("|");
      let currentZoom = 1.45;

      if (pdfViewerRef.current) {
        if ("scale" in pdfViewerRef.current) {
          currentZoom = pdfViewerRef.current.scale;
        } else if (pdfViewerRef.current.viewer && "scale" in pdfViewerRef.current.viewer) {
          currentZoom = pdfViewerRef.current.viewer.scale;
        } else {
          console.warn("Unable to determine current zoom level. Using default zoom of 1.");
        }
      }

      // console.log("Current zoom level:", currentZoom);

      const newHighlights = await searchPdf(keywords, pdfUrl, currentZoom);
      // console.log("newHighlights:", JSON.stringify(newHighlights, null, 2));

      const updatedHighlights = [...highlights, ...newHighlights];
      setHighlights(updatedHighlights);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        toggleDocument={toggleDocument}
        scrollToHighlight={scrollToHighlight}
      ></Sidebar>
      <div className="p-8 bg-gray-100 flex-1 space-y-6">
        <PdfUploader onFileUpload={handleFileUpload} pdfUploaded={pdfUploaded} />
        <KeywordSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          resetHighlights={resetHighlights}
        />
        <PdfViewer
          pdfUrl={pdfUrl}
          highlights={highlights}
          setHighlights={setHighlights}
          highlightsKey={highlightsKey}
          pdfViewerRef={pdfViewerRef}
        />
      </div>
    </div>
  );
}
