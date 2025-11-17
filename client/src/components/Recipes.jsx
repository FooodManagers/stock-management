import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Spacer} from "@heroui/react";
import { Input, Button} from "@heroui/react";

export const Recipes = () => {
  const [keyword, setKeyword] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    // ページが読み込まれたときにローカルストレージからデータを読み込む
    const savedKeyword = localStorage.getItem('keyword');
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const savedCategoryId = localStorage.getItem('categoryId');

    if (savedKeyword) setKeyword(savedKeyword);
    if (savedRecipes.length > 0) setRecipes(savedRecipes);
    if (savedCategoryId) setCategoryId(savedCategoryId);
  }, []);

  const handleSearch = async () => {
    try {
      const cachedCategoryId = localStorage.getItem(`categoryId_${keyword}`);
      if (cachedCategoryId) {
        setCategoryId(cachedCategoryId);
      } else {
        console.log("fetchSearch");
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/recipe/searchCategory`, {
          params: { keyword },
        });
        const categoryIdData = response.data.combinedCategoryId;
        setCategoryId(categoryIdData);
        localStorage.setItem(`categoryId_${keyword}`, categoryIdData);
      }
      console.log('categoryId:', categoryId);
      await recipesSerch();
      setError(null);
    } catch (err) {
      console.error('Error searching category:', err);
      setError('Failed to search category.');
    }
  };

  const recipesSerch = async () => {
    try {
      const cachedRecipes = localStorage.getItem(`recipes_${categoryId}`);
      console.log('cachedRecipes:', cachedRecipes);
      if (cachedRecipes) {
        setRecipes(JSON.parse(cachedRecipes));
      } else {
        console.log("fetchRecipes");
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/recipe/recipes`, {
          params: { categoryId },
        });
        const recipesData = response.data.result.slice(0, 3);
        console.log('recipesData:', recipesData);
        setRecipes(recipesData);
        localStorage.setItem(`recipes_${categoryId}`, JSON.stringify(recipesData));
      }
      localStorage.setItem('keyword', keyword);
      localStorage.setItem('recipes', JSON.stringify(recipes));
      console.log('recipes:', recipes);
      localStorage.setItem('categoryId', categoryId);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes.');
    }
  };
  useEffect(() => {
    if (keyword) {
      recipesSerch();
    }
  }, [categoryId]); // categoryIdが変更されたときにfetchRecipesを実行


  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Spacer y={3} />
      <h1 className='text-lg font-bold ml-3'>レシピ検索</h1>
      <Divider className='my-4' />
      <div className='flex w-full mx-auto md:flex-nowrap gap-4'>
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          label="レシピを検索"
          fullWidth
          className='mx-4'
        />
        <Button onPress={handleSearch} className='my-auto mr-3 text-white' color="success">検索</Button>
      </div>
      <Spacer y={4} />
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
          <Spacer y={2} />
        </div>
      ))}
      <div style={{ height: '130px' }} />
      <div style={{ position: 'absolute', bottom: 110, width: '100%', textAlign: 'center' }}>
        <a href="https://webservice.rakuten.co.jp/" target="_blank" rel="noopener noreferrer">
          <img src="https://webservice.rakuten.co.jp/img/credit/200709/credit_22121.gif" border="0" alt="Rakuten Web Service Center" title="Rakuten Web Service Center" width="221" height="21"/>
        </a>
      </div>
    </div>
  );
};
