import './styles/App.css';
import { Route, Routes } from 'react-router-dom';
import { Home, Product, LandingProduct, Order, Products } from './pages';
import ReactPixel from 'react-facebook-pixel';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useStore from './store/useStore';

function App() {

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/store`)
        .then(({data}) => {
            // cookies.set('store', JSON.stringify(dataStore));
            useStore.setState({ store: data });
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/pixels`)
        .then(({data}) => {
            // const facebookData = data.filter((item: any) => item.name === "facebook")
            // console.log(facebookData);
            // setFacebookToken(facebookData?.[0]?.apiKey)
            const advancedMatching = undefined;
            data?.map((item: any, index: number) => {
                if (item?.apiKey !== "" && item?.apiKey.length > 10) {
                    ReactPixel.init(item?.apiKey, advancedMatching, {
                        autoConfig: true,
                        debug: true
                    });
                }
            })
            ReactPixel.pageView();
        })
        .catch((error) => console.log(error));
    }, [])

    return (
        <Routes>
            <Route index path="/" element={<Home />} />
            <Route index path="/product/:id" element={<Product />} />
            <Route index path="/products/:category" element={<Products />} />
            <Route index path="/:id" element={<LandingProduct />} />
            <Route index path="/order/:status/:type?/:id?" element={<Order />} />
        </Routes>
    );
}

export default App;
