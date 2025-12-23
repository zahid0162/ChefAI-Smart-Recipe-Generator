
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  // Placeholder images based on category logic or just random foodie pics
  const randomId = Math.floor(Math.random() * 1000);
  const imageUrl = `https://picsum.photos/seed/${recipe.title}/400/300`;

  return (
    <div 
      onClick={() => onClick(recipe)}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer active:scale-[0.98]"
    >
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
          {recipe.difficulty}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
           <span className="bg-emerald-600/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
             {recipe.cookTime}
           </span>
        </div>
      </div>
      <div className="p-5 space-y-2">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{recipe.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center gap-4 pt-2 text-gray-400 text-xs font-medium">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            {recipe.servings} Servings
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {recipe.prepTime} Prep
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
