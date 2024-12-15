import React, { useState, useEffect } from 'react';
import "../output.css";
import { Link, useLocation } from 'react-router-dom';

export const BottomNaviBar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  // useEffect(() => {
  //   setSelected(location.pathname);
  // }, [location.pathname]);

  const handleSelected = (path) => {
    setSelected(path);
  };
  console.log(selected);

  return (
    <div className="fixed z-50 w-full h-20 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-200 dark:border-gray-200 shadow-md">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        <Link
          to="/"
          onClick={() => handleSelected('/')}
          className={`inline-flex flex-col items-center justify-center px-5 rounded-s-full group hover:rounded-full ${
           selected === '/' ? 'bg-gray-300  rounded-full' : 'hover:bg-gray-50 dark:hover:bg-gray-300'
          }`}
        >
          <svg className={`w-5 h-5 mb-1 ${selected === '/' ? 'text-green' : 'text-gray-500 dark:text-gray-500 group-hover:text-green dark:group-hover:text-green'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
          </svg>
          <span className="text-sm">ホーム</span>
        </Link>
        <div id="tooltip-home" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
          Home
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <Link
          to="/list"
          onClick={() => handleSelected('/list')}
          className={`inline-flex flex-col items-center justify-center px-5 group hover:rounded-full ${
            selected === '/list' ? 'bg-gray-300  rounded-full' : 'hover:bg-gray-50 dark:hover:bg-gray-300'
          }`}
        >
          <svg className={`w-6 h-6 mb-1 ${selected === '/list' ? 'fill-green' : 'text-gray-500 dark:text-gray-400 group-hover:fill-green dark:group-hover:fill-green'}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6B7280">
            <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
          </svg>
          <span className="text-sm">リスト</span>
        </Link>
        <div id="tooltip-list" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <div className="flex items-center justify-center">
          <Link
            to="/scan"
            onClick={() => handleSelected('/scan')}
            className={`inline-flex items-center justify-center flex-col size-20 font-medium rounded-full group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-darkgreen ${
              selected === '/scan' ? 'bg-darkgreen ring-darkgreen ring-4 outline-none dark:ring-darkgreen' : 'bg-green hover:bg-darkgreen'
            }`}
          >
            <svg className="size-10 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="27px" viewBox="0 -960 960 960" width="24px" fill="#fff">
              <path d="M40-120v-200h80v120h120v80H40Zm680 0v-80h120v-120h80v200H720ZM160-240v-480h80v480h-80Zm120 0v-480h40v480h-40Zm120 0v-480h80v480h-80Zm120 0v-480h120v480H520Zm160 0v-480h40v480h-40Zm80 0v-480h40v480h-40ZM40-640v-200h200v80H120v120H40Zm800 0v-120H720v-80h200v200h-80Z"/>
            </svg>
            <span className="text-sm text-gray-200">スキャン</span>
          </Link>
        </div>
        <Link
          to="/recipes"
          onClick={() => handleSelected('/recipes')}
          className={`inline-flex flex-col items-center justify-center px-5 group hover:rounded-full ${
            selected === '/recipes' ? 'bg-gray-300  rounded-full' : 'hover:bg-gray-50 dark:hover:bg-gray-300'
          }`}
        >
         <svg className={`w-6 h-6 mb-1 ${selected === '/recipe' ? 'fill-green' : 'text-gray-500 dark:text-gray-400 group-hover:fill-green dark:group-hover:fill-green'}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6B7280">
            <path d="M280-80v-366q-51-14-85.5-56T160-600v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98T360-446v366h-80Zm400 0v-320H560v-280q0-83 58.5-141.5T760-880v800h-80Z"/>
          </svg>
          <span className="text-sm">レシピ</span>
        </Link>
        <Link
          to="/settings"
          onClick={() => handleSelected('/settings')}
          className={`inline-flex flex-col items-center justify-center px-5 rounded-e-full group hover:rounded-full ${
            selected === '/settings' ? 'bg-gray-300  rounded-full' : 'hover:bg-gray-50 dark:hover:bg-gray-300'
          }`}
        >
          <svg className={`w-6 h-6 mb-1 ${selected === '/settings' ? 'fill-green' : 'text-gray-500 dark:text-gray-400 group-hover:fill-green dark:group-hover:fill-green'}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6B7280">
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
          </svg>
          <span className="text-sm">設定</span>
        </Link>
      </div>
    </div>
  );
};