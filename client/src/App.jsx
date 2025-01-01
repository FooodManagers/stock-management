import { BottomNaviBar } from "./components/BottomNaviBar";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {Home} from './components/Home';
import {List} from './components/List';
import {Scan} from './components/Scan';
import {Recipes} from './components/Recipes';
import {Settings} from './components/Settings';
import React,{useEffect,useState} from 'react';


export const App = () => {
  const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/message')
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch((error) => console.error('Error:', error));
    }, []);
  return (
    <>
      <div>
        <h1>{message}</h1>
      </div>

      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<List />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <BottomNaviBar />
        </div>
      </Router>
    </>
  );
};