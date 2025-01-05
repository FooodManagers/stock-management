import "../output.css"
import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import ItemList from "./ItemList";
import { HomeRecipe } from "./HomeRecipe";


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


export const Home = () => {
  return (
    <div>
      <HomeRecipe />
      <ItemList />
    </div>
    
  );
};