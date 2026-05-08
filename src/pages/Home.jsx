import React from 'react';
import Hero from '../components/Hero';
import FeaturedCollectibles from '../components/FeaturedCollectibles';
import DigitalFittingRoom from '../components/DigitalFittingRoom';

const Home = ({ onProductClick }) => {
  return (
    <>
      <Hero />
      <div className="main-grid-container">
        <FeaturedCollectibles onProductClick={onProductClick} />
        <DigitalFittingRoom />
      </div>
    </>
  );
};

export default Home;
