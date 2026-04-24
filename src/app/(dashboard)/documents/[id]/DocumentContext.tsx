"use client";

import { createContext, useContext } from "react";

interface DocumentContextType {
  document: any | null;
  loading: boolean;
}

const DocumentContext = createContext<DocumentContextType>({
  document: null,
  loading: true,
});

export const DocumentProvider = ({
  document,
  loading,
  children,
}: {
  document: any;
  loading: boolean;
  children: React.ReactNode;
}) => {
  return (
    <DocumentContext.Provider value={{ document, loading }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => useContext(DocumentContext);
