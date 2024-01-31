import React, { useState, useEffect} from 'react';
import { View, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRecipeContext } from '../context/RecipeContext';

export const DatabaseProcess = ({ userparams,newRecipeData,image}) => {
  const {profileRecipes} = useRecipeContext();
  const [favorite, setFavorite] = useState(0);
  const [save, setSave] = useState(false);
  const user = userparams;

  const fetchRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      profileRecipes(parsedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);
  
  const generateUniqueId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 8;
    let uniqueId = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters.charAt(randomIndex);
    }
    return uniqueId;
  }

  const handleSaveToDatabase = async () => {
    if (!user) {
      console.error('user is null!');
      return;
    }

    const newRecipeDataId = generateUniqueId();

    const newRecipe = {
      recipeId:newRecipeDataId,
      userId: user.uid,
      username: user.displayName,
      userEmail: user.email,
      recipeName: newRecipeData.title,
      recipeImage: image,
      ingredients: newRecipeData.ingredients,
      instructions: newRecipeData.instructions,
      isFavorite: favorite,
    };
    try {
      const recipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = recipes ? JSON.parse(recipes) : [];
      const updatedRecipes = [...parsedRecipes, newRecipe];
      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      profileRecipes(updatedRecipes);
      Alert.alert('Success', 'Recipe saved successfully.');
    } catch (error) {
      console.error('Handle Save Error:', error);
      Alert.alert('Error', 'Failed to save recipe.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.add_favorite}>
        {favorite ? (
          <TouchableOpacity style={{paddingLeft:50}} onPress={() => setFavorite(0)}>
            <AntDesign name="star" size={35} color="#FFFFF0" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{paddingLeft:50}} onPress={() => setFavorite(1)}>
            <AntDesign name="staro" size={35} color="#FFFFF0" />
          </TouchableOpacity>
        )}
        {save ? (
          <TouchableOpacity style={{paddingLeft:50}} onPress={() => setSave(false)}>
            <MaterialIcons name="add-circle" size={38} color="#FFFFF0" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{paddingLeft:60}} onPress={handleSaveToDatabase}>
            <MaterialIcons name="add-circle-outline" size={38} color="#FFFFF0" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  add_favorite: {
    marginTop: 30,
    left: -8,
    bottom: 18,
    flexDirection: 'row',
  },
});
