import React, { createContext, useContext, useState } from "react";

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [dataRecipes, setDataRecipes] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFileSystem, setShowFileSystem] = useState(true);

  const setRecipesData = (recipesData, imageData) => {
    setDataRecipes(recipesData);
    setImage(imageData);
    setLoading(false);
  };

  const profileRecipes = (newRecipes) => {
    setRecipes(newRecipes);
  };

  const startLoading = () => {
    setLoading(true);
  };

  const contextValue = {
    dataRecipes,
    recipes,
    image,
    loading,
    showFileSystem,
    setShowFileSystem,
    setRecipesData,
    profileRecipes,
    startLoading,
    setLoading,
  };

  return (
    <RecipeContext.Provider value={contextValue}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => useContext(RecipeContext);
