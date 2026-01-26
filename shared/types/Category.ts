type CategoryRequest = {
  id: string;
  name: string;
  icon: string;
  type: string;
  isActive?: boolean;
};

type CustomCategoryRequest = CategoryRequest & {
  userId: string;
};

export type { CategoryRequest, CustomCategoryRequest };
