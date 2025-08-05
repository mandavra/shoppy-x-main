
import HeroSlider from '../components/HeroSlider';
import FeaturedProduts from '../components/FeaturedProduts';
import HomeCategories from '../components/HomeCategories';
import Features from '../components/Features';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
    
  return (
    <>
    <Helmet>
  {/* Title */}
  <title>ShoppyX | Discover Trending Products Online – Fashion, Gadgets & More</title>

  {/* Meta Description */}
  <meta
    name="description"
    content="Welcome to ShoppyX – your go-to destination for trending fashion, cutting-edge gadgets, home essentials, and exclusive deals. Shop smart and elevate your lifestyle."
  />

  {/* Keywords */}
  <meta
    name="keywords"
    content="ShoppyX, online shopping, trending products, fashion, electronics, home decor, smart shopping, gadgets, best deals, exclusive offers"
  />

  {/* Open Graph for social sharing */}
  <meta property="og:title" content="Shop Smarter with ShoppyX" />
  <meta
    property="og:description"
    content="Explore ShoppyX for the latest in fashion, tech, home and more. Enjoy exclusive offers and a seamless shopping experience."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://shoppy-x.vercel.app/" />
  <meta property="og:image" content="https://shoppy-x.vercel.app/og-default.jpg" />

  {/* Canonical URL */}
  <link rel="canonical" href="https://shoppy-x.vercel.app/" />
</Helmet>

    <div className='bg-gray-100'>
        {/* hero */}
        <HeroSlider></HeroSlider>
        {/* Featured Produts */}
        <FeaturedProduts></FeaturedProduts>
    {/* categories */}
        <HomeCategories></HomeCategories>
    {/* features */}
        <Features></Features>
    </div>
    </>
  );
};

export default HomePage;