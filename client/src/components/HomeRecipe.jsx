import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { use } from "react";

export const HomeRecipe = () => {
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      try {
        const response = await axios.get('http://it232044-pc.tail6d80a5.ts.net:5000/api/auth/recipeword', {
          headers: {
            'Authorization': token
          }
        });
        setKeyword(response.data.recipe_name); // キーワードを設定
        console.log(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data.');
      }
    };

    fetchData();
  }, []); // 初回レンダリング時にfetchDataを実行

  useEffect(() => {
    const fetchSearch = async () => {
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
        setError(null);
      } catch (err) {
        console.error('Error searching category:', err);
        setError('Failed to search category.');
      }
    };

    if (keyword) {
      fetchSearch();
    }
  }, [keyword]); // keywordが変更されたときにfetchSearchを実行

  useEffect(() => {
    const fetchRecipes = async () => {
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

    if (categoryId) {
      fetchRecipes();
    }
  }, [categoryId]); // categoryIdが変更されたときにfetchRecipesを実行

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: false }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
      {recipes.map((recipe) => (
        
          <SwiperSlide>
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
          </SwiperSlide>
      ))}
      </Swiper>
    </>
  );
}
