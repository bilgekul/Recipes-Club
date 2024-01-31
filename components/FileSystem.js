import React, { useState } from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Entypo } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { useRecipeContext } from '../context/RecipeContext';
export const FileSystem = ({refreshing}) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigation = useNavigation();
  const{setRecipesData,startLoading,setShowFileSystem}  = useRecipeContext();
  
  const sendImageToServer = async () => {
    if (image && !processing) {
      setProcessing(true);
      const formData = new FormData();
      try {
        formData.append('image', {
          uri: image,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
        startLoading();
        setShowFileSystem(false);
        const response = await fetch('http://192.168.3.203:5000/process_image', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          const recipes = responseData.recipes;
          console.log('Recipes:', recipes, 'image:', image);
          const title = recipes.split('\n\n')[0];
          const ingredientsString = recipes.split('\n\n')[1];
          const instructionsString = recipes.split('\n\n')[2];
          const ingredients = ingredientsString.split('\n').map(item => item.trim());
          const instructions = instructionsString.split('\n').map(item => item.trim());
          const dataRecipe = {
            title:title,
            ingredients:ingredients,
            instructions:instructions
          }
          setRecipesData(dataRecipe, image);
          navigation.navigate('Recipes');
        } else {
          console.error('Error sending image:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending image:', error);
      }finally{
        setLoading(false);
        setProcessing(false); 
      }
    }
  };
  
  const pickImage = async () => {
    if (!refreshing) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
  
      if (result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    }
  };
  
  return (
    <View>
       {loading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
         <Text>Yükleniyor</Text>
        </View>
        )}
      <TouchableOpacity onPress={pickImage}>
          <View style={{ width: 300, height: 300, borderColor: '#FFD700', borderWidth:4, alignItems: 'center', justifyContent: 'center', borderRadius:10 }}>
              {image ? <Image source={{ uri: image }} style={{ width: 290, height: 290, borderRadius:10 }} /> :  <><Entypo name="image" style={{marginBottom:30}} size={100} color="black" /><Text style={{fontSize:18, fontWeight:"500"}}>Select Image</Text></>}
          </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => sendImageToServer()} style={{ width:160, alignSelf:"center", alignItems:"center",flexDirection:"row", marginTop:15, borderColor:"#FFD700", borderWidth:3, borderRadius:5, backgroundColor:"#f8f8f8"}}>
          <AntDesign style={{paddingLeft:2}} name="book" size={35} color="#ffffff" />
          <Text style={{paddingLeft:8, fontSize:18, fontWeight:"500"}}>Give the Recipe</Text>
      </TouchableOpacity>
    </View>
  );
};


