export interface Template {
  id: string;
  productType: string;
  name: string;
  description: string | null;
  category: string | null;
  size: string | null;
  orientation: string | null;
  defaultCanvasData: unknown;
  previewUrl: string | null;
  isPremium: boolean;
  isActive: boolean;
  tags: string[];
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Public catalog list — excludes heavy canvas JSON */
export interface TemplateSummary {
  id: string;
  productType: string;
  name: string;
  description: string | null;
  category: string | null;
  size: string | null;
  orientation: string | null;
  previewUrl: string | null;
  isPremium: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/** Catalog item with plan-based access hint */
export interface TemplateCatalogItem extends TemplateSummary {
  locked: boolean;
  canUse: boolean;
}
