/**
 * Sample React Native App
 * Created by Sumedh on 06/08/2020
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Modal
} from 'react-native';

const data = [6,5,4,3,2,1,0];
class App extends React.Component{
  state={
    data:[],
    liftPosition:0,
    isModalVisible:false,
    finalData:[]
  }

handleLift(number,direction){
console.log('handleLift',number,direction)
const {data} =this.state;
let newdata = JSON.parse(JSON.stringify(data))
let currentData={};
currentData.floor = number;
currentData.direction = number===0?'down':direction;
newdata.push(currentData)
this.setState({data:newdata});
}

  handleStart(){
    const{data}=this.state;
    let goingUpData =[];
    let goinDownData=[];
    if(data.length>0){
    data.map(item=>{
      if(item.direction==='up') goingUpData.push(item)
      else goinDownData.push(item)
    })

    goingUpData= sort_unique(goingUpData);
    goinDownData = sort_unique(goinDownData);
    console.log(goingUpData)
    if(goingUpData.length>0 && goinDownData.length>0){
    if(goingUpData[goingUpData.length-1].floor === goinDownData[0].floor)
    goingUpData.pop();
    }
    const finalData = [...goingUpData,...goinDownData]

    finalData.map((item,index)=>{
      setTimeout(() => {
        this.setState({ liftPosition: item.floor },()=>{
          if((finalData.length-1)===index){
            this.viewModal();
          }
        }); // edited
      }, 1000*(index+1));
    })
    
    this.setState({data:[],finalData})
  }
  }
  
  viewModal(){
    setTimeout(() => {
      this.setState({isModalVisible:true,liftPosition:0})
    }, 1000);
  }
  render(){
    const {liftPosition,isModalVisible,finalData}= this.state;
  return (
      <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
      contentContainerStyle={styles.container}>
       { data.map((item,index)=>{
          return<View style={styles.horizontalView} key={index}>
                <View style={styles.floors}>
                  <View style={[styles.lift,{backgroundColor:(((data.length-1)-liftPosition)) === index?'green':'grey'}]}/>
                  {index!==0 &&<TouchableOpacity style={[styles.floorBtn,{width:item==0?'65%':'30%'}]}
                  onPress={()=>this.handleLift(item,'up')}>
                    <Text>{item==0?'Ground':item} up</Text>
                    </TouchableOpacity>}
                    {index!==6 &&<TouchableOpacity style={[styles.floorBtn,{marginLeft:20}]}
                     onPress={()=>this.handleLift(item,'down')}>
                    <Text>{item} down</Text>
                      </TouchableOpacity>}
                </View>
         </View>
        })}
        <TouchableOpacity style={styles.start}
        onPress={()=>this.handleStart()}>
          <Text>Start</Text>
        </TouchableOpacity>
        </ScrollView>
        <Modal visible={isModalVisible} onRequestClose={()=>this.setState({isModalVisible:false})}>
<SafeAreaView style={styles.modalContainer}>
  <TouchableOpacity onPress={()=>this.setState({isModalVisible:false})} style={styles.modalContainer}>
  <Text>Order of Exceution is:</Text>
        <View style={{flexDirection:'row'}}>
        {finalData.map((item,index)=>{
          return <Text>{index===0?'':'=>'}{item.floor}</Text>
        })}
        </View>
        </TouchableOpacity>
</SafeAreaView>
        </Modal>
      </SafeAreaView>
  );
      }
};

const styles = StyleSheet.create({
  container:{flex:1},
  horizontalView:{borderBottomWidth:3, borderColor:'#000', height:'12%',paddingHorizontal:30},
  floors:{height:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  lift:{width:'30%',height:'70%',marginRight:20},
  floorBtn:{width:'30%',  height:'70%', borderWidth:3, borderColor:'#000',justifyContent:'center',alignItems:'center'},
  start:{backgroundColor:'yellow',width:'65%',  height:80, borderWidth:3, borderColor:'#000',justifyContent:'center',alignItems:'center',alignSelf:'center',marginVertical:20},
  modalContainer:{flex:1,justifyContent:'center',alignItems:'center'}
});

export default App;

function sort_unique(arr) {
  if (arr.length === 0) return arr;
  arr = arr.sort((a, b) => {
    return a.direction ==='up'?(a.floor - b.floor):(b.floor - a.floor);
  });
  var ret = [arr[0]];
  for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
    if (arr[i-1].floor !== arr[i].floor) {
      ret.push(arr[i]);
    }
  }
  return ret;
}