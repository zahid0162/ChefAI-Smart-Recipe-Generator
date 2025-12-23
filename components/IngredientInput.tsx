
import React, { useState, useRef } from 'react';
import { extractIngredientsFromImage } from '../services/geminiService';

interface IngredientInputProps {
  onAdd: (ingredients: string[]) => void;
  isLoading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onAdd, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const items = inputValue.split(',').map(i => i.trim()).filter(i => i !== '');
    onAdd(items);
    setInputValue('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const extracted = await extractIngredientsFromImage(base64);
        onAdd(extracted);
      } catch (err) {
        alert("Couldn't scan ingredients. Please try again.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="px-6 py-4 bg-white space-y-4">
      <div className="relative group">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="Eggs, flour, milk..."
            className="flex-grow px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-gray-700"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 bg-emerald-600 text-white rounded-2xl font-medium active:scale-95 transition-transform disabled:bg-gray-300"
          >
            Add
          </button>
        </form>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-grow h-px bg-gray-100"></div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">or scan your fridge</span>
        <div className="flex-grow h-px bg-gray-100"></div>
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-semibold border-2 border-dashed border-emerald-200 hover:bg-emerald-100 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Take Photo of Ingredients
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
    </div>
  );
};

export default IngredientInput;
