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
    <div style={{ position: 'relative', minHeight: '100vh' }}>
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
      <div style={{ position: 'absolute', bottom: 120, width: '100%', textAlign: 'center' }}>
        <a href="https://webservice.rakuten.co.jp/" target="_blank" rel="noopener noreferrer">
          <img src="https://webservice.rakuten.co.jp/img/credit/200709/credit_22121.gif" border="0" alt="Rakuten Web Service Center" title="Rakuten Web Service Center" width="221" height="21"/>
        </a>
      </div>
    </div>
  );
};