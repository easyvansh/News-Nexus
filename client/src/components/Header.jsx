import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');

  const categories = ['World', 'Technology', 'Sports', 'Entertainment', 'Business'];
  const countries = ['USA', 'Canada', 'UK', 'Australia', 'India'];

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    // Handle category selection logic, e.g., update state or navigate
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    // Handle country selection logic, e.g., update state or navigate
  };

  return (
    <header className="bg-blue-800 text-white p-4 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-4 md:mb-0">
        <Link to="/" className="text-2xl font-bold">
          NewsAggregator
        </Link>
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="flex items-center space-x-2">
          <label htmlFor="category" className="text-sm">
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="text-black rounded p-1"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="country" className="text-sm">
            Country:
          </label>
          <select
            id="country"
            value={country}
            onChange={handleCountryChange}
            className="text-black rounded p-1"
          >
            <option value="">Select Country</option>
            {countries.map((ctry) => (
              <option key={ctry} value={ctry.toLowerCase()}>
                {ctry}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
