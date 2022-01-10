import { useMemo, useState, useEffect } from "react";

const onList = [];
const onAnyList= [];

/**
 * A hook to allow getting and setting items to storage, hook comes
 * with context and also event listener like functionality
 *
 * @param type either local or session
 *
 * @example
 * const storage = useLocalStorage('session');
 * <StorageContext.Provider value={storage}>...</StorageContext.Provider>
 */
export default function useLocalStorage(type) {
  const [storageType] = useState((window)[`${type}Storage`]);

  // Listen for different windows changing storage
  useEffect(() => {
    /**
     * Set up a listener for if another window updates storage
     * Only fires events for `init`, `set` and `remove`
     *
     * @param event event from listener
     */
    const handleStorage = (event) => {
      const { key, oldValue, newValue } = event;

      if (key && key.match(/^(\$\$)(.*)(_data)$/)) return;

      if (oldValue === null && newValue !== null) {
        onList
          .filter((obj) => obj.type === "init")
          .forEach((obj) => obj.callback(key));
        onAnyList.forEach((obj) => obj.callback("init", key));
      } else if (oldValue !== null && newValue !== null) {
        onList
          .filter((obj) => obj.type === "set")
          .forEach((obj) => obj.callback(key));
        onAnyList.forEach((obj) => obj.callback("set", key));
      } else if (oldValue === null && newValue !== null) {
        onList
          .filter((obj) => obj.type === "remove")
          .forEach((obj) => obj.callback(key));
        onAnyList.forEach((obj) => obj.callback("remove", key));
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  });

  // Prevent rerun on parent redraw
  return useMemo(() => {
    return {
      init: (key, data) => {
        const type = typeof data;
        if (type === "object") {
          data = JSON.stringify(data);
        }
        storageType.setItem(key, data);
        storageType.setItem(`$$${key}_data`, type);
        onList
          .filter((obj) => obj.type === "init")
          .forEach((obj) => obj.callback(key));
        onAnyList.forEach((obj) => obj.callback("init", key));
      },

      set: (key, data) => {
        const type = typeof data;
        if (type === "object") {
          data = JSON.stringify(data);
        }
        storageType.setItem(key, data);
        storageType.setItem(`$$${key}_data`, type);
        onList
          .filter((obj) => obj.type === "set")
          .forEach((obj) => obj.callback(key));
        onAnyList.forEach((obj) => obj.callback("set", key));
      },

      get: (key) => {
        const type = storageType.getItem(`$$${key}_data`);
        const data = storageType.getItem(key);

        onList
          .filter((obj) => obj.type === "get")
          .forEach((obj) => obj.callback(key));
        onAnyList.forEach((obj) => obj.callback("get", key));

        switch (type) {
          case "object":
            return JSON.parse(data);
          case "number":
            return parseFloat(data);
          case "boolean":
            return data === "true";
          case "undefined":
            return undefined;
          default:
            return data;
        }
      },

      remove: (key)=> {
        storageType.removeItem(key);
        storageType.removeItem(`$$${key}_data`);
        onList
          .filter((obj) => obj.type === "remove")
          .forEach((obj) => obj.callback(key));
        onAnyList.forEach((obj) => obj.callback("remove", key));
      },

      clear: () => {
        storageType.clear();
        onList
          .filter((obj) => obj.type === "clear")
          .forEach((obj) => obj.callback());
        onAnyList.forEach((obj) => obj.callback("clear"));
      },

      on: (event, func) => {
        onList.push({ type: event, callback: func });
      },

      onAny: (func) => {
        onAnyList.push({ callback: func });
      },

      off: (event, func) => {
        const remove = onList.indexOf(
          onList.filter((e) => e.type === event && e.callback === func)[0]
        );
        if (remove >= 0) onList.splice(remove, 1);
      },

      offAny: (func) => {
        const remove = onAnyList.indexOf(
          onAnyList.filter((e) => e.callback === func)[0]
        );
        if (remove >= 0) onAnyList.splice(remove, 1);
      }
    } ;
  }, [storageType]);
}