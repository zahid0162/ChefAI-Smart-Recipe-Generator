
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  imagePrompt: string;
}

export interface AppState {
  ingredients: string[];
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  selectedRecipe: Recipe | null;
}
