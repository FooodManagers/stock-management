const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const RAKUTEN_RECIPE_API_URL = process.env.RAKUTEN_RECIPE_API_URL;
const RAKUTEN_RECIPE_SEARCH_API_URL = process.env.RAKUTEN_RECIPE_SEARCH_API_URL;
const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;

router.get('/', (req, res) => {
  res.send('Hello from the recipe router!');
});

// レシピを取得するエンドポイント
router.get('/recipes', async (req, res) => {
  try {
    const response = await axios.get(RAKUTEN_RECIPE_API_URL, {
      params: {
        applicationId: RAKUTEN_APP_ID,
        categoryId: req.query.categoryId || '10-275', // デフォルトのカテゴリIDを設定
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// カテゴリリストを取得するエンドポイント
router.get('/categories', async (req, res) => {
  try {
    const response = await axios.get(RAKUTEN_RECIPE_SEARCH_API_URL, {
      params: {
        applicationId: RAKUTEN_APP_ID,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// 特定の食材を検索してカテゴリ番号を取得するエンドポイント
router.get('/searchCategory', async (req, res) => {
  const  {keyword}  = req.query;
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    const response = await axios.get(RAKUTEN_RECIPE_SEARCH_API_URL, {
      params: {
        applicationId: RAKUTEN_APP_ID,
      },
    });

    const categories = response.data.result.medium;
    let categoryId = null;
    let parentCategoryId = null;

    for (const category of categories) {
      if (category.categoryName.includes(keyword)) {
        categoryId = category.categoryId;
        parentCategoryId = category.parentCategoryId;
        break;
      }
    }

    if (categoryId && parentCategoryId) {
      const combinedCategoryId = `${parentCategoryId}-${categoryId}`;
      res.json({ combinedCategoryId });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error searching category:', error);
    res.status(500).json({ error: 'Failed to search category' });
  }
});

module.exports = router;