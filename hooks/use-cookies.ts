import { useEffect } from 'react';

/**
 * Hook para manipulação de cookies no navegador.
 * Inclui funções para obter, limpar cookies específicos ou limpar todos os cookies.
 */
export function useCookies() {
  /**
   * Obtém todos os cookies como um objeto chave-valor.
   * @returns Um objeto contendo todos os cookies.
   */
  const getCookies = (): Record<string, string> => {
    if (typeof document === 'undefined') return {}; // Garantir que estamos no navegador
    return document.cookie
      .split('; ')
      .reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);
  };

  /**
   * Define um cookie com um valor e opções adicionais.
   * @param name Nome do cookie.
   * @param value Valor do cookie.
   * @param options Opções adicionais como path, maxAge, etc.
   */
  const setCookie = (name: string, value: string, options: { path?: string; maxAge?: number; secure?: boolean; sameSite?: 'Strict' | 'Lax' | 'None' } = {}): void => {
    if (typeof document !== 'undefined') {
      let cookieString = `${name}=${encodeURIComponent(value)}`;

      if (options.path) {
        cookieString += `; path=${options.path}`;
      }

      if (options.maxAge) {
        cookieString += `; max-age=${options.maxAge}`;
      }

      if (options.secure) {
        cookieString += `; Secure`;
      }

      if (options.sameSite) {
        cookieString += `; SameSite=${options.sameSite}`;
      }

      document.cookie = cookieString;
    }
  };

  /**
   * Limpa um cookie específico.
   * @param name Nome do cookie a ser limpo.
   */
  const clearCookie = (name: string): void => {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }
  };

  /**
   * Limpa todos os cookies disponíveis.
   */
  const clearAllCookies = (): void => {
    if (typeof document !== 'undefined') {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        clearCookie(name);
      });
    }
  };

  return { getCookies, setCookie, clearCookie, clearAllCookies };
}
