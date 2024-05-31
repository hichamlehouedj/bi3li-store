import React, { useEffect, useState } from 'react';
import 'notyf/notyf.min.css';
import './App.css';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { Layout, Login, Home, Categories, Products, Orders, Shipping, Marketing, LandingPage, Settings, Users } from './pages';

import './lib/i18n';
import { useTranslation } from 'react-i18next';
import { DirectionProvider, useDirection } from '@mantine/core';

import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });
function App() {
  const { i18n } = useTranslation();
  const { toggleDirection, dir, setDirection } = useDirection();
  
  useEffect(() => {
    if(cookies.get('lang')) {
      setDirection(i18n.dir(cookies.get('lang')))
      i18n.changeLanguage(cookies.get('lang'));
    } else {
      setDirection(i18n.dir("ar"))
      i18n.changeLanguage("ar");
    }

    if (i18n.dir() === "rtl") {
      if (document) {
        //@ts-ignore
        document.querySelector("html").setAttribute("dir", "rtl")
      }
    }
  }, [cookies.get('lang')])
  
  return (
    
    <DirectionProvider i18nIsDynamicList={true} initialDirection={i18n.dir()}>
      <Routes>
        <Route index path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='categories' element={<Categories />} />
          <Route path='orders' element={<Orders />} />
          <Route path='products' element={<Products />} />

          <Route path='shipping' element={<Shipping />} />
          <Route path='marketing' element={<Marketing />} />
          <Route path='landingPage' element={<LandingPage />} />
          <Route path='settings' element={<Settings/>} />
          <Route path='users' element={<Users/>} />
        </Route>
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </DirectionProvider>
  );
}

export default App;
