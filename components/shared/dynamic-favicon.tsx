"use client";

import { useEffect } from "react";

export function DynamicFavicon() {
  useEffect(() => {
    const updateFavicon = (isDark: boolean) => {
      // Remove todos os links de favicon existentes
      const existingLinks = document.querySelectorAll('link[rel*="icon"]');
      existingLinks.forEach((link) => link.remove());

      // Cria novo link para o favicon apropriado
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/x-icon";
      link.href = isDark ? "/favicon-light.ico" : "/favicon-dark.ico";
      document.head.appendChild(link);

      // Também adiciona o SVG adaptável como fallback
      const svgLink = document.createElement("link");
      svgLink.rel = "icon";
      svgLink.type = "image/svg+xml";
      svgLink.href = "/favicon-adaptive.svg";
      document.head.appendChild(svgLink);
    };

    // Detecta o tema atual
    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Atualiza o favicon baseado no tema atual
    updateFavicon(darkMediaQuery.matches);

    // Listener para mudanças de tema
    const handleChange = (e: MediaQueryListEvent) => {
      updateFavicon(e.matches);
    };

    darkMediaQuery.addEventListener("change", handleChange);

    return () => {
      darkMediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return null; // Componente invisível
}
