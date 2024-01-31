import React from 'react';
import { View,TouchableOpacity, StyleSheet,Image,Text,Alert} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign,Entypo } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
export const Layout = ({children,signOut}) => {
  const navigation = useNavigation();
  
  const goToRecipes = () => {
    navigation.navigate('Recipes');
  }
  const goToProfile = () => {
    navigation.navigate('Profile');
  }

  const goToCamera = () =>{
    navigation.navigate('Camera');
  }

  const handlesignOutApp = (signOut) => {
     Alert.alert(
       'Confirm Quit',
       'Are you sure you want to sign out ?',
       [
        {
          text: 'No',
          style : 'cancel'
        },
        {
          text: 'Yes',
          onPress  : signOut
        }
       ],
       {cancelable: false}
     );
  }
  return (
      <View style={styles.layout}>
      <View style={{backgroundColor:"#FF0000", height:30}}></View>
      <View style={{backgroundColor:"#f8f8f8", height:53,flexDirection:"row"}}>
        <Image source={require("../assets/logo.png")} style={{width:40, height:40, borderRadius:20, margin:7}}/>
        <Text style={{paddingLeft:85, paddingTop:10, fontSize:28, fontWeight:"600"}}>𝓡𝓮𝓬𝓲𝓹𝓮 𝓒𝓵𝓾𝓫</Text>
        <TouchableOpacity onPress={() =>handlesignOutApp(signOut)}>
           <Entypo  style={{marginLeft:108, marginTop:15}} name="log-out" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
         {children}
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.button} onPress={goToRecipes}>
            <AntDesign name="book" size={35} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToCamera}>
            <MaterialIcons name="photo-camera" size={35} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToProfile}>
            <AntDesign name="user" size={35} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>   
  )
}

const styles = StyleSheet.create({
  layout:{
    flex:1,
    flexDirection:"column",
    backgroundColor:"#000000"
  },
  container:{
    flex:1
  },
  navigation: {
    justifyContent:"space-between",
    alignItems:"center",
    flexDirection:"row",
    backgroundColor:'#FF0000',
    height:55,
    padding:10
  },
  button:{
    height:35,
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
