import React, {useState,useEffect} from 'react';
import { View , Text, TouchableOpacity,StyleSheet, Button,Image, ScrollView,ActivityIndicator,RefreshControl } from 'react-native';
import { Layout } from '../layout/Layout';
import { FileSystem } from '../components/FileSystem';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DatabaseProcess } from '../components/DatabaseProcess';
import { useRecipeContext } from '../context/RecipeContext';
export const Recipes = ({user,signOut}) => {
  const{dataRecipes,image,loading,showFileSystem,startLoading} = useRecipeContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if(loading){
    return(
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontSize:20, marginBottom:15}}>The recipes creating, please stand by...</Text>
          <ActivityIndicator size="large" color="#FFD700" />
      </View>
    )
  }
  return (
    <Layout signOut={signOut}>
      { showFileSystem ? (
        <ScrollView style={{marginTop:100}} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <View style={styles.create_section}>
            <FileSystem refreshing={refreshing}/>
          </View>
        </ScrollView> 
      )
       : (
        <ScrollView  refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            <View style={styles.header}>
              <Image source={{uri:image}} style={styles.content_image} />
            <View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{dataRecipes.title}</Text>
                <Text style={{fontSize:15, marginRight:50,marginTop:65,marginLeft:4}}>Recipe</Text>    
            </View>
            <DatabaseProcess userparams={user} newRecipeData={dataRecipes} image={image}/>
            </View>
            </View>
            <Text style={{ fontSize: 30, paddingLeft:15}}>Ingredients:</Text>
            <View style={styles.ingredients}>
            <Text style={{ fontSize: 23 }}>
            {dataRecipes.ingredients.join('\n')}
            </Text>
  </View>
  <Text style={{ fontSize: 30, paddingLeft:15}}>Instructions:</Text>
  <View style={styles.instructions}>
    <Text style={{ fontSize: 20 }}>
      {dataRecipes.instructions.join('\n')}
    </Text>
  </View>
</ScrollView>
       ) 
      } 
    </Layout>
  );
}
const styles = StyleSheet.create({
  title:{
    fontSize: 35,
    marginLeft:7,
    marginTop:27
  },
  titleContainer:{
    flex:1,
    flexDirection:"row",
  },
   header_wrap: {
      flex:1,
      flexDirection:"column"
   },
  add_favorite:{
    marginTop:40,
    left:-8,
    bottom:15,
    flexDirection:"row",
    justifyContent:"space-around"
  },
  ingredients:{
    textAlign:"left",
    margin:20,
    fontSize:20,
    color:'#333',
    fontWeight:'bold',
    listStyleType:"none",
    opacity: 0.8,
    shadowColor:'#000',

  },
  instructions:{
    textAlign:"left",
    alignContent:"stretch",
    textAlignVertical:"top",
    margin:20,
    color:'#333',
    fontWeight:'bold',
    listStyleType:"none",
    opacity: 0.8,
    shadowColor:'#000',
    flexWrap:"wrap",
  },

  create_section:{
      flex:1,
      justifyContent:"center",
      alignItems:"center",
  },
  header:{
    marginTop:50,
    width:400,
    height:200,
    justifyContent:"space-between",
    alignItems:"center",
    flexDirection:"row",
    flex:1,
    backgroundColor:"#e01c0d"
  },
  content_image : {
    width:150, 
    height:150,
    borderRadius:150,
    marginLeft:6
  },
  button:{
    height:40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
} 
)

