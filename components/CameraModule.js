import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import {Entypo} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRecipeContext } from '../context/RecipeContext';
export const CameraModule = () => {
 const[hasCameraPermission, setHasCameraPermission] = useState(null);
 const[image, setImage] = useState(null);
 const [processing, setProcessing] = useState(false);
 const[type, setType] = useState(Camera.Constants.Type.back);
 const[flash, setFlash] = useState(Camera.Constants.FlashMode.off);
 const cameraRef = useRef(null);
 const navigation = useNavigation();
 const{setRecipesData,startLoading,setShowFileSystem} = useRecipeContext();
 useEffect(()=>{
    (async()=>{
        MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
    })();
 },[]);

 const takePicture = async () => {
  if (cameraRef) {
    try {
      const data = await cameraRef.current.takePictureAsync();
      console.log(data);
      setImage(data.uri);
    } catch (error) {
      console.log(error);
    }
  }
};
 const saveImage = async() => {
    if(image){
      try{
          await MediaLibrary.createAssetAsync(image.uri);
          alert("Picture save!")
          setImage(null)
      }
      catch(e){
        console.log(e);
      }
    }
 }
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
      setShowFileSystem(false);
      const response = await fetch('http://192.168.3.203:5000/process_image', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      startLoading();
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

 if(hasCameraPermission === false){

    return <Text>No access to camera</Text>
 }

 return(
    <View style={styles.container}>
      {!image ?
        <Camera
              style = {styles.camera}
              type={type}
              flashMode={flash}
              ref={cameraRef}
        >
           <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 30,
           }}>
            <TouchableOpacity style={styles.button} onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}>
                  <Entypo name="retweet" size={28} color={"#f1f1f1"}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)}>
                  <Entypo name="flash" size={28} color= { flash === Camera.Constants.FlashMode.off ? "gray" : "#f1f1f1"}/>
              </TouchableOpacity>
           </View>
        </Camera>
        :
        <Image source={{uri:image}} style={styles.camera}/>
      }
       
        <View>
          {image ? 
           <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal:20,

           }}>
             <TouchableOpacity style={styles.button} onPress={() => setImage(null)}>
                <Entypo name="retweet" size={28} color={"#f1f1f1"}/>
                <Text style={styles.text}>Re-take</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.button} onPress={sendImageToServer}>
                <Entypo name="book" size={28} color={"#f1f1f1"}/>
                <Text style={styles.text}>Give Recipes</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.button} onPress={saveImage}>
                <Entypo name="check" size={28} color={"#f1f1f1"}/>
                <Text style={styles.text}>Save</Text>
             </TouchableOpacity>
           </View>
            :
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Entypo name="camera" size={28} color={"#f1f1f1"}/>
              <Text style={styles.text}>Take a picture</Text>
            </TouchableOpacity>
        
          }
        </View>
    </View>
 )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      paddingBottom:20
    },
    camera:{
      flex:1,
      borderRadius:20,
  
    },
    button:{
      height:40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text:{
      fontWeight: 'bold',
      fontSize: 16,
      color: '#f1f1f1',
      marginLeft: 10
    }
  });




