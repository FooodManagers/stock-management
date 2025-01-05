import "../output.css"
import React, { useState } from 'react';
import axios from 'axios';

export const Recipes = () => {
    const [keyword, setKeyword] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recipe/search', {
        params: { keyword },
      });
      const data = response.data.result || []; // デフォルト値を設定
      setRecipes(data);
      setError(null);
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError('Failed to search recipes.');
    }
  };

  return (
    <div>
      <h1>Recipe Search</h1>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter ingredient"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.recipeId}>
            <h2>{recipe.recipeTitle}</h2>
            <img src={recipe.foodImageUrl} alt={recipe.recipeTitle} />
            <p>{recipe.recipeDescription}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};