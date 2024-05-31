import React, { useEffect } from 'react';
import { HeaderSimple } from '../components/Navbar';
import { ProductsByCategory } from '../components/Sections';
import { Footer } from '../components/Sections/Footer';

export function Products () {
    return (
        <>
            <HeaderSimple />
            <ProductsByCategory />
            <Footer/>
        </>
    );
}