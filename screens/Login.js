import { GoogleSignin,GoogleSigninButton} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import { StyleSheet, View,Image,Text} from 'react-native';
import { CameraModule } from '../components/CameraModule';
import { Recipes } from './Recipes';
import { Profile} from './User'
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipeProvider } from '../context/RecipeContext';
import { Showing } from './Showing';
const Stack = createNativeStackNavigator();
export const Login = () => {
  const[initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  GoogleSignin.configure({
    webClientId: '853477870661-a4qbmaqlrv4m5b7cs4hl6safasqd0mp0.apps.googleusercontent.com',
  });

  function onAuthStateChanged(user){
    setUser(user);
    if(initializing) setInitializing(false);
  };

  useEffect(()=>{
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber();
  },[]);

  const onGoogleButtonPress = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const user_sign_in = auth().signInWithCredential(googleCredential);
  
      user_sign_in.then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in", user);
      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.error(error);
    }
  };

 const signOut = async() => {
    try{
      await GoogleSignin.revokeAccess();
      await auth().signOut();
    }catch (error){
      console.error(error);
    }
  };

  if (initializing) return null;
  
  if(!user) {
    return (
       <View style={styles.container}>
        <Text style={{marginBottom:30, fontSize:60, fontWeight:"600"}}>𝓡𝓮𝓬𝓲𝓹𝓮 𝓒𝓵𝓾𝓫</Text>
        <Image source={require("../assets/logo.png")} style={{width:200, height:200, borderRadius:5, margin:7}}/>
        <GoogleSigninButton
          style={{width:300, height:65, marginTop:80}}
          onPress={onGoogleButtonPress}
        />
      </View>
    )
  }
  return(
<RecipeProvider>
    <NavigationContainer>
    <Stack.Navigator  screenOptions={{
        headerShown: false, 
      }}>
      <Stack.Screen name="Recipes">
        {(props) => <Recipes {...props} user={user} signOut={signOut}/>}
      </Stack.Screen>
      <Stack.Screen name="Camera" component={CameraModule} />
      <Stack.Screen name="Profile">
        {(props) => <Profile {...props} user={user} signOut={signOut} />}
      </Stack.Screen>
      <Stack.Screen name="Showing">
        {(props) => <Showing {...props} signOut={signOut} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
</RecipeProvider>

  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FF0000',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
