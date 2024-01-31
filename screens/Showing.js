import React, {useState,useEffect} from 'react';
import { View , Text,StyleSheet,Image, ScrollView,RefreshControl } from 'react-native';
import { Layout } from '../layout/Layout';
import { useRoute } from '@react-navigation/native';
export const Showing = ({signOut}) => {
   const route = useRoute();
   const { selectedRecipe } = route.params;
   const [refreshing, setRefreshing] = useState(false);

   const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

 if(selectedRecipe){
    return (
      <Layout signOut={signOut}>
        <ScrollView  refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>  
          <View style={styles.header}>
            <Image source={{uri:selectedRecipe.recipeImage}} style={styles.content_image} />
          <View>
          <View style={styles.titleContainer}>
              <Text style={styles.title}>{selectedRecipe.recipeName}</Text>
              <Text style={{fontSize:15, marginRight:50,marginTop:65,marginLeft:4}}>Recipe</Text>    
          </View>
          </View>
          </View>
          <Text style={{ fontSize: 30, paddingLeft:15,marginTop:20}}>Ingredients:</Text>
          <View style={styles.ingredients}>
          <Text style={{ fontSize: 23 }}>
          {selectedRecipe.ingredients.join('\n')}
          </Text>
          </View>
          <Text style={{ fontSize: 30, paddingLeft:15}}>Instructions:</Text>
          <View style={styles.instructions}>
          <Text style={{ fontSize: 20 }}>
          {selectedRecipe.instructions.join('\n')}
          </Text>
          </View>
        </ScrollView>
      </Layout> 
    )
  }  
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
      marginTop:20,
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
  
  