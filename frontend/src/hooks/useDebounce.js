// frontend/src/hooks/useDebounce.js

import { useState, useEffect } from 'react';

// Bu custom hook, bir değeri alır ve belirli bir gecikme süresinden sonra günceller.
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Değer değiştiğinde bir zamanlayıcı ayarla
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bir sonraki effect çalışmadan veya bileşen unmount olmadan önce
    // zamanlayıcıyı temizle. Bu, gereksiz güncellemeleri önler.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Sadece value veya delay değiştiğinde yeniden çalışır

  return debouncedValue;
}

export default useDebounce;