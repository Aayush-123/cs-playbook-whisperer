// Chrome extension types
interface Chrome {
  storage: {
    local: {
      set(items: Record<string, any>): Promise<void>;
      get(keys?: string[] | string): Promise<Record<string, any>>;
    };
  };
  tabs: {
    create(createProperties: { url: string }): void;
  };
  runtime: {
    getURL(path: string): string;
  };
}

declare const chrome: Chrome;