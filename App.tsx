
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import { generateRecipesFromIngredients } from './services/geminiService';
import { Recipe, AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    ingredients: [],
    recipes: [],
    loading: false,
    error: null,
    selectedRecipe: null
  });

  const [activeTab, setActiveTab] = useState<'discover' | 'pantry'>('discover');

  // Local storage persistence
  useEffect(() => {
    const saved = localStorage.getItem('chefai_ingredients');
    if (saved) {
      const parsed = JSON.parse(saved);
      setState(prev => ({ ...prev, ingredients: parsed }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chefai_ingredients', JSON.stringify(state.ingredients));
  }, [state.ingredients]);

  const addIngredients = (newItems: string[]) => {
    setState(prev => ({
      ...prev,
      ingredients: Array.from(new Set([...prev.ingredients, ...newItems]))
    }));
    setActiveTab('pantry');
  };

  const removeIngredient = (item: string) => {
    setState(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i !== item)
    }));
  };

  const clearIngredients = () => {
    setState(prev => ({ ...prev, ingredients: [] }));
  };

  const handleGenerateRecipes = async () => {
    if (state.ingredients.length === 0) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const recipes = await generateRecipesFromIngredients(state.ingredients);
      setState(prev => ({ ...prev, recipes, loading: false }));
      setActiveTab('discover');
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setState(prev => ({ ...prev, selectedRecipe: recipe }));
  };

  return (
    <Layout>
      <div className="bg-white">
        <IngredientInput 
          onAdd={addIngredients} 
          isLoading={state.loading} 
        />
        
        <div className="px-6 flex gap-8 border-b border-gray-100 mb-6">
          <button 
            onClick={() => setActiveTab('discover')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'discover' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            Discover
            {activeTab === 'discover' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('pantry')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'pantry' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            My Pantry ({state.ingredients.length})
            {activeTab === 'pantry' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full"></div>}
          </button>
        </div>

        <div className="px-6 pb-20">
          {activeTab === 'pantry' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Your Ingredients</h2>
                {state.ingredients.length > 0 && (
                  <button onClick={clearIngredients} className="text-xs font-bold text-red-500 uppercase">Clear All</button>
                )}
              </div>
              
              {state.ingredients.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🧺</span>
                  </div>
                  <p className="text-gray-400 text-sm">Add some ingredients to get started!</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {state.ingredients.map(ing => (
                    <div 
                      key={ing} 
                      className="group flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-full text-sm font-semibold border border-emerald-100"
                    >
                      {ing}
                      <button onClick={() => removeIngredient(ing)} className="hover:text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {state.ingredients.length > 0 && (
                <button
                  onClick={handleGenerateRecipes}
                  disabled={state.loading}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all disabled:bg-gray-300"
                >
                  {state.loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chef is thinking...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">👩‍🍳</span>
                      Generate Recipes
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  {state.recipes.length > 0 ? 'Suggested for You' : 'Recently Created'}
                </h2>
              </div>

              {state.error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 flex items-center gap-3">
                  <span className="text-lg">⚠️</span>
                  {state.error}
                </div>
              )}

              {state.recipes.length === 0 && !state.loading ? (
                <div className="text-center py-20 space-y-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl">🍳</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-900 font-bold">No recipes yet</p>
                    <p className="text-gray-400 text-xs px-12">Add ingredients to your pantry and let ChefAI create a custom meal for you.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {state.recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} onClick={handleRecipeClick} />
                  ))}
                  {state.loading && (
                    <div className="space-y-6 animate-pulse">
                      {[1, 2].map(i => (
                        <div key={i} className="bg-gray-50 h-64 rounded-3xl"></div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {state.selectedRecipe && (
        <RecipeDetail 
          recipe={state.selectedRecipe} 
          onClose={() => setState(prev => ({ ...prev, selectedRecipe: null }))} 
        />
      )}

      {/* Floating Action Button for mobile feel */}
      {!state.selectedRecipe && state.ingredients.length > 0 && activeTab === 'discover' && (
        <button
          onClick={handleGenerateRecipes}
          disabled={state.loading}
          className="fixed bottom-8 right-8 left-8 h-14 bg-emerald-600 text-white rounded-full font-bold flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all z-20 disabled:bg-gray-300 md:w-64 md:left-auto"
        >
          {state.loading ? (
             <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <>
              <span className="text-xl">✨</span>
              Refine Recipes
            </>
          )}
        </button>
      )}
    </Layout>
  );
};

export default App;
