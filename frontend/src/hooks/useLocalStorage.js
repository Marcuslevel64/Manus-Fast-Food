import { useCallback, useEffect, useState } from "react";
import { getItem, setItem } from "../services/storage";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => getItem(key, initialValue));

  useEffect(() => {
    setItem(key, value);
  }, [key, value]);

  const update = useCallback((next) => {
    setValue((current) =>
      typeof next === "function" ? next(current) : next
    );
  }, []);

  return [value, update];
}
