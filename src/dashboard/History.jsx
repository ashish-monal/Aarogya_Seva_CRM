import {
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  View,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../component/Header';
import { API_ROUTES, getApiUrl } from '../api/Base';
const History = ({navigation, userData}) => {
  const [workedHistory, setWorkedHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    setIsLoading(true);
    fetch(getApiUrl(API_ROUTES.TIME_SHEET+userData.id))
      .then(response => response.json())
      .then(data => {
        // console.log('Line 17', data);
        setWorkedHistory(data); // Set the retrieved data to workedHistory state
      })
      .catch(error => {
        console.log('Error Fetching Data:', error);
      })
      .finally(() => {
        setRefreshing(false);
        setIsLoading(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [userData]);

 

  return (
    <ScrollView
      style={{backgroundColor: 'white'}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <Header navigation={navigation} userData={userData.id}/>
        <Text
          style={styles.title}>
          Work Overview
        </Text>
        {isLoading ? (
          <Image
            source={require('../../assests/aarogyasevalogo.png')}
            resizeMode="contain"
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              width: '75%',
            }}
          />
        ) : (
          <View style={styles.view}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.text, {borderWidth: 2}]}>
                Total Lead
              </Text>
              <Text style={[styles.text, {borderTopWidth: 2}]}>
              {workedHistory.total_leads}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
            <Text style={[styles.text,{borderLeftWidth:2}]}>Followups</Text>
              <Text style={[styles.text]}>{workedHistory.total_followups}</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.text,{borderLeftWidth:2}]}>Closed Positive</Text>
              <Text style={[styles.text]}>
                {workedHistory.total_closed_positive}
              </Text>
            </View>

            

            <View style={{flexDirection: 'row'}}>
            <Text style={[styles.text,{borderLeftWidth:2}]}>Closed Negative</Text>
              <Text style={[styles.text]}>{workedHistory.total_closed_negative}</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
            <Text style={[styles.text,{borderLeftWidth:2}]}>Remaining Lead</Text>
              <Text style={[styles.text]}>{workedHistory.total_leads -workedHistory.total_closed_positive - workedHistory.total_closed_negative}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    backgroundColor: 'white',
  },
  view: {
    marginVertical:25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginHorizontal:25
    
  },
  text: {
    width: '50%',
    color: 'black',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderRightColor: 'black',
    fontSize:18,
    fontWeight:'700'
  },
  title:{
    color: '#2e509d',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  }
});
