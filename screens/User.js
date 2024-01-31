import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import { AntDesign, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Layout } from '../layout/Layout';
import { useRecipeContext } from '../context/RecipeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const Profile = ({ user, signOut }) => {
  const { recipes, profileRecipes } = useRecipeContext();
  const [change_view, setView] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorite, setFavorite] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('recipes');
        const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
        profileRecipes(parsedRecipes);

        const totalFavoriteCount = parsedRecipes.reduce((total, recipe) => {
          return total + (recipe.isFavorite === 1 ? 1 : 0);
        }, 0);
        setFavorite(totalFavoriteCount);
      } catch (error) {
        console.error('Error fetching recipes from AsyncStorage:', error);
      }
    };

    fetchData();
  }, [refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleView = useCallback(() => {
    setView((prevView) => !prevView);
  }, []);

  const handleNavigateRecipe = async (recipeId) => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
  
      const selectedRecipe = parsedRecipes.find(recipe => recipe.recipeId === recipeId);
  
      if (selectedRecipe) {
        return navigation.navigate('Showing', { selectedRecipe });
      } else {
        console.error('Recipe not found with recipeId:', recipeId);
      }
    } catch (error) {
      console.error('Error navigating recipes:', error);
    }
  };
  
  
  const handleUpdateStar = async (recipeId) => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];

      const updatedRecipes = parsedRecipes.map(recipe => {
        if (recipe.recipeId === recipeId) {
          recipe.isFavorite = recipe.isFavorite === 1 ? 0 : 1;
        }
        return recipe;
      });

      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      profileRecipes(updatedRecipes);
    } catch (error) {
      console.error('Error updating star:', error);
    }
  };
  const handleDeleteRecipe = (recipeId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this recipe?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const storedRecipes = await AsyncStorage.getItem('recipes');
              const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
              const updatedRecipes = parsedRecipes.filter(recipe => recipe.recipeId !== recipeId);
              await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
              profileRecipes(updatedRecipes);
              console.log('Recipe deleted successfully');
            } catch (error) {
              console.error('Error deleting recipe:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Layout signOut={signOut}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <View>
            <Image style={{ width: 100, height: 100, borderRadius: 50, margin: 18, borderWidth: 2, borderColor: "#ff0000" }} source={{ uri: user.photoURL }} />
            <Text style={{ fontWeight: "500", fontSize: 15, paddingLeft: 37 }}>{user.displayName.split(' ')[0]}</Text>
          </View>
          <View style={{ paddingTop: 40, flex: 1, flexDirection: "row" }}>
            <View>
              <Text style={{ paddingLeft: 43, fontSize: 22, fontWeight: "600" }}>{recipes.length}</Text>
              <Text style={{ paddingLeft: 1, paddingTop: 6, fontSize: 15, fontWeight: "400" }}>Searching Recipes</Text>
            </View>
            <View style={{ paddingLeft: 30 }}>
              <Text style={{ paddingLeft: 34, fontSize: 22, fontWeight: "600" }}>{favorite}</Text>
              <Text style={{ paddingLeft: 1, paddingTop: 6, fontSize: 15, fontWeight: "400" }}>Favorite Recipes </Text>
            </View>
          </View>
        </View>
        <ScrollView>
          <View style={{ flexDirection: 'row', padding: 30, paddingTop:50, justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={toggleView}>
              <View style={{ width: 100, alignItems: 'center', borderBottomColor: '#FFD700', borderBottomWidth: change_view ? 3 : 0 }}>
                <MaterialIcons style={{ marginBottom: 4 }} name="grid-on" size={25} color="#FFD700" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleView}>
              <View style={{ width: 100, alignItems: 'center', borderBottomColor: '#FFD700', borderBottomWidth: change_view ? 0 : 3 }}>
                <MaterialCommunityIcons style={{ marginBottom: 4 }} name="mirror-rectangle" size={25} color="#FFD700" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {change_view ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 3 }}>
                {recipes.map((recipe, index) => (
                  <TouchableOpacity onPress={() => handleNavigateRecipe(recipe.recipeId)} key={index} style={{ margin: 2 }}>
                    <Image source={{ uri: recipe.recipeImage }} style={{ width: 120, height: 120 }} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={{ flexDirection: 'column' }}>
                {recipes.map((recipe, index) => (
                  <View key={index} style={{ margin: 2 }}>
                    <View style={{ marginTop: 20 }}>
                      <View style={{ flex: 1, flexDirection: "row", marginLeft: 15, width: 340, height: 24 }}>
                        <Image style={{ width: 36, height: 36, borderRadius: 18, marginLeft: 13, borderWidth: 2, borderColor: "#ff0000" }} source={{ uri: user.photoURL }} />
                        <Text style={{ fontWeight: "500", fontSize: 15, marginLeft: 8, marginTop: 8 }}>{user.displayName.split(' ')[0]}</Text>
                        <View>
                          <TouchableOpacity onPress={() => handleDeleteRecipe(recipe.recipeId)}>
                            <AntDesign style={{ marginLeft: 215, marginTop:10, transform: [{ rotate: '90deg' }] }} name="ellipsis1" size={22} color="#FFD700" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Image source={{ uri: recipe.recipeImage }} style={{ width: 340, height: 420, margin: 20 }} />
                      <View style={{ flex: 1, flexDirection: "row", marginLeft:20, width: 340, height: 80}}>
                          {
                            recipe.isFavorite === 1 ? (
                                <TouchableOpacity onPress={() => handleUpdateStar(recipe.recipeId)} style={{ paddingHorizontal: 10, paddingTop:7 }}>
                                    <AntDesign name="star" size={28} color="#FFD700" />
                                </TouchableOpacity>
                            ):(
                              <TouchableOpacity onPress={() => handleUpdateStar(recipe.recipeId)} style={{ paddingHorizontal: 10, paddingTop:7 }}>
                                    <AntDesign name="staro" size={28} color="#FFD700" />
                              </TouchableOpacity>
                            )
                          }
                          <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                             <Text style={{fontWeight: "400", fontSize: 16,paddingTop:15,paddingLeft:30}}>Recipe Name:</Text>
                             <Text style={{fontWeight: "600", fontSize: 16, color:"#FFD700"}}>{recipe.recipeName}</Text>
                             <Text style={{paddingLeft:21,paddingTop:20,fontSize:12,fontWeight:"500"}}>Details...</Text>
                          </View> 
                          <TouchableOpacity style={{ paddingLeft:20,paddingTop:7}} onPress={() => handleNavigateRecipe(recipe.recipeId)}>
                            <Ionicons name="arrow-forward" size={35} color="#FFD700" />
                          </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 25,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    borderColor: '#FFD700',
    borderWidth: 2,
    maxWidth: "auto",
    maxHeight: "auto"
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold',
  },
});


