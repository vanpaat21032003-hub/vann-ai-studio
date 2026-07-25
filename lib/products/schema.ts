export const PRODUCT_SELECT =
  "id,title,category,gender,brand,color,material,status,notes,created_at,updated_at";

export type ProductStatus = "draft" | "analyzed" | "archived";

export type ProductRecord = {
  id: string;
  title: string;
  category: string | null;
  gender: string | null;
  brand: string | null;
  color: string | null;
  material: string | null;
  status: ProductStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductFormValues = Pick<
  ProductRecord,
  "title" | "category" | "gender" | "brand" | "color" | "material" | "notes"
>;

export type ProductActionState = {
  error: string | null;
  fieldErrors?: {
    title?: string;
  };
};

export type DeleteProductState = {
  error: string | null;
};

export type ArchiveProductState = {
  error: string | null;
};

type ProductFormResult =
  | { success: true; values: ProductFormValues }
  | { success: false; state: ProductActionState };

const PRODUCT_FIELDS = [
  "title",
  "category",
  "gender",
  "brand",
  "color",
  "material",
  "notes",
] as const;

function readTextField(formData: FormData, name: (typeof PRODUCT_FIELDS)[number]) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

export function parseProductForm(formData: FormData): ProductFormResult {
  const values = Object.fromEntries(
    PRODUCT_FIELDS.map((field) => [field, readTextField(formData, field)]),
  ) as Record<(typeof PRODUCT_FIELDS)[number], string | null>;

  if (Object.values(values).some((value) => value === null)) {
    return {
      success: false,
      state: { error: "Check the product details and try again." },
    };
  }

  if (!values.title) {
    return {
      success: false,
      state: {
        error: "Add a title before saving this product.",
        fieldErrors: { title: "Product title is required." },
      },
    };
  }

  return {
    success: true,
    values: {
      title: values.title,
      category: values.category || null,
      gender: values.gender || null,
      brand: values.brand || null,
      color: values.color || null,
      material: values.material || null,
      notes: values.notes || null,
    },
  };
}

export function isProductId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function getProductStatusLabel(status: ProductStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
