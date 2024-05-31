import React, { useEffect } from 'react';
import { HeaderSimple } from '../components/Navbar';
import { Products } from '../components/Sections';
import { Footer } from '../components/Sections/Footer';
import { BannerHeader } from '../components/Sections/BannerHeader';

export function Home () {
    return (
        <>
            <HeaderSimple />
            <BannerHeader />
            <Products />
            <Footer/>
        </>
    );
}