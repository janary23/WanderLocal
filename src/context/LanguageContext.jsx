// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export const LanguageContext = createContext(null);

const SUPPORTED_LANGUAGES = [
  { code: 'en',  label: 'English',  flag: '🇺🇸', nativeName: 'English'  },
  { code: 'fil', label: 'Filipino', flag: '🇵🇭', nativeName: 'Filipino' },
  { code: 'es',  label: 'Spanish',  flag: '🇪🇸', nativeName: 'Español'  },
  { code: 'zh',  label: 'Chinese',  flag: '🇨🇳', nativeName: '中文'      },
  { code: 'ja',  label: 'Japanese', flag: '🇯🇵', nativeName: '日本語'    },
  { code: 'ko',  label: 'Korean',   flag: '🇰🇷', nativeName: '한국어'    },
  { code: 'fr',  label: 'French',   flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de',  label: 'German',   flag: '🇩🇪', nativeName: 'Deutsch'  },
];

const translationCache = {};

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const translate = useCallback(async (strings, targetLang) => {
    if (targetLang === 'en') {
      setTranslations({});
      setCurrentLang('en');
      return;
    }

    if (translationCache[targetLang]) {
      setTranslations(translationCache[targetLang]);
      setCurrentLang(targetLang);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsTranslating(true);
    setError(null);

    const langLabel = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.label || targetLang;

    try {
      const BATCH_SIZE = 25;
      const PROXY_URL = 'http://localhost/WandereLocal/api/translate.php';
      
      const chunks = [];
      for (let i = 0; i < strings.length; i += BATCH_SIZE) {
        chunks.push(strings.slice(i, i + BATCH_SIZE));
      }

      const results = await Promise.all(chunks.map(async (chunk) => {
        const response = await fetch(PROXY_URL, {
          method: 'POST',
          signal: abortRef.current.signal,
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            q: chunk,
            target: targetLang === 'fil' ? 'tl' : targetLang
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || `Proxy Error ${response.status}`);
        }

        const data = await response.json();
        if (!data.data?.translations) {
          throw new Error('Invalid translation response');
        }
        return data.data.translations.map(t => t.translatedText);
      }));

      const allTranslations = results.flat();
      const finalResult = {};
      
      strings.forEach((orig, idx) => {
        finalResult[orig] = allTranslations[idx] || orig;
      });

      translationCache[targetLang] = finalResult;
      setTranslations(finalResult);
      setCurrentLang(targetLang);

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Translation error:', err);
        const mockTranslations = {};
        strings.forEach(s => { mockTranslations[s] = `[${targetLang.toUpperCase()}] ${s}`; });
        setError(`Translation engine unavailable. Using fallback mode.`);
        setTranslations(mockTranslations);
        setCurrentLang(targetLang);
      }
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const t = useCallback((str) => {
    if (currentLang === 'en' || !str) return str;
    return translations[str] ?? str;
  }, [currentLang, translations]);

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, translate, t, isTranslating, error, SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
