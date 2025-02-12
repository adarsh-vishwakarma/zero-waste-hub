"use client";

import { getAutocompleteSuggestions } from "@/actions/getAutoCompleteSuggestions";
import React, { useState } from "react";

const GomapaAutocomplete = ({ onPlaceSelected }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Handle input change
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
  
    if (value.length > 2) {
      try {
        // Call server-side function to fetch suggestions
        const { suggestions } = await getAutocompleteSuggestions(value);
        setSuggestions(suggestions);
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle selection of a suggestion
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.description); // Adjust based on the API response structure
    setSuggestions([]);
    onPlaceSelected(suggestion); // Pass the selected place to the parent component
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter waste location"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion.description} {/* Adjust based on API response structure */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GomapaAutocomplete;
