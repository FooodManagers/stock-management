import "../output.css"
import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@heroui/react";

export const Recipes = () => {
  const [keyword, setKeyword] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const handleSearch = async () => {
    try {
      const cachedCategoryId = localStorage.getItem(`categoryId_${keyword}`);
      if (cachedCategoryId) {
        setCategoryId(cachedCategoryId);
      } else {
        console.log("fetchSearch");
        const response = await axios.get('http://it232044-pc.tail6d80a5.ts.net:5000/api/recipe/searchCategory', {
          params: { keyword },
        });
        const categoryIdData = response.data.combinedCategoryId;
        setCategoryId(categoryIdData);
        localStorage.setItem(`categoryId_${keyword}`, categoryIdData);
      }
      recipesSerch();
      setError(null);
    } catch (err) {
      console.error('Error searching category:', err);
      setError('Failed to search category.');
    }
  };

  const recipesSerch = async () => {
    try {
      const cachedRecipes = localStorage.getItem(`recipes_${categoryId}`);
      if (cachedRecipes) {
        setRecipes(JSON.parse(cachedRecipes));
      } else {
        console.log("fetchRecipes");
        const response = await axios.get('http://it232044-pc.tail6d80a5.ts.net:5000/api/recipe/recipes', {
          params: { categoryId },
        });
        const recipesData = response.data.result.slice(0, 3);
        setRecipes(recipesData);
        localStorage.setItem(`recipes_${categoryId}`, JSON.stringify(recipesData));
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes.');
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
        {recipes.map((recipe) => (
          <div key={recipe.recipeId}>
          <Card className="py-4 ">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">{recipe.recipeTitle}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl flex justify-center items-center"
                src={recipe.foodImageUrl}
                width={270}
                height={200}
              />
            </CardBody>
            <Divider />
            <CardFooter>
              <Link href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer">レシピを見る</Link>
            </CardFooter>
          </Card>
          
        </div>
      ))}
      <div style={{ position: 'absolute', bottom: 120, width: '100%', textAlign: 'center' }}>
        <a href="https://webservice.rakuten.co.jp/" target="_blank" rel="noopener noreferrer">
          <img src="https://webservice.rakuten.co.jp/img/credit/200709/credit_22121.gif" border="0" alt="Rakuten Web Service Center" title="Rakuten Web Service Center" width="221" height="21"/>
        </a>
      </div>
    </div>
  );
};