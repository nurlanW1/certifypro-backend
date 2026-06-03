export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "time"
  | "file"
  | "select"
  | "color"
  | "excel"
  | "repeater"
  | "url";

export type CatalogField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  repeaterFields?: CatalogField[];
  hint?: string;
  /** Show field only when another field equals value */
  showWhen?: { key: string; value: string };
  colSpan?: 1 | 2;
};

export type CatalogItem = {
  id: string;
  name: string;
  icon: string;
  group: string;
  mockupVariant: string;
  fields: CatalogField[];
};

export type EventBasics = {
  eventName: string;
  eventDate: string;
  organization: string;
  venue: string;
  description: string;
  logoFileName?: string;
};

export type CategoryFormData = Record<string, string | string[] | Record<string, string>[]>;

export type EventCreateDraft = {
  basics: EventBasics;
  enabled: Record<string, boolean>;
  forms: Record<string, CategoryFormData>;
  updatedAt: string;
};
