
import React from 'react';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onClose }) => {
  const imageUrl = `https://picsum.photos/seed/${recipe.title}/600/400`;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom duration-300">
      <div className="relative">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 z-10 p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-900 shadow-lg active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <img 
          src={imageUrl} 
          alt={recipe.title} 
          className="w-full h-72 object-cover"
        />
      </div>

      <div className="px-6 py-8 -mt-8 relative bg-white rounded-t-[40px] shadow-2xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-widest">
              {recipe.difficulty}
            </span>
            <span className="text-gray-400 text-sm font-medium">
              {recipe.nutrition.calories} kcal per serving
            </span>
          </div>
          <h2 className="text-3xl font-serif text-gray-900">{recipe.title}</h2>
          <p className="text-gray-500 leading-relaxed">{recipe.description}</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Time', value: recipe.cookTime, icon: '⏱️' },
            { label: 'Prot', value: recipe.nutrition.protein, icon: '🍗' },
            { label: 'Carb', value: recipe.nutrition.carbs, icon: '🍝' },
            { label: 'Fat', value: recipe.nutrition.fat, icon: '🥑' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-2xl flex flex-col items-center justify-center gap-1">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{stat.label}</span>
              <span className="text-xs font-bold text-gray-800">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Ingredients</h3>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-4 text-gray-600">
                <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></span>
                <span className="text-sm font-medium">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 pb-12">
          <h3 className="text-xl font-bold text-gray-900">Instructions</h3>
          <div className="space-y-8">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
