import React from "react";
import { Spacer, Divider} from "@heroui/react";
import ItemList from "./ItemList";
import { HomeRecipe } from "./HomeRecipe";


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


export const Home = () => {
  return (
    <div>
      <Spacer y={3}/>
      <h1 className="text-lg font-bold ml-3">おすすめレシピ</h1>
      <Divider className="my-4" />
      <HomeRecipe />
      <Spacer y={3}/>
      <ItemList />
      <div style={{ height: '110px' }} />
    </div>
    
  );
};
