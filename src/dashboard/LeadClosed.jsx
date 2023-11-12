import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../component/Header';
import { API_ROUTES, getApiUrl } from '../api/Base';


const LeadClosed = ({navigation, userData}) => {
  const [closedJobList, setClosedJobList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // console.log('Line 6', userData.id);

  const fetchData = () => {
    setIsLoading(true);
    fetch(
      getApiUrl(API_ROUTES.CLOSED_LEAD+userData.id)
    )
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          // console.log(data.joblist_and_followup_data, 'Line 28');
          setClosedJobList(data.joblist_and_followup_data);
        }
      })
      .catch(error => {
        setRefreshing(false);
        setIsLoading(false);
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

  

  const renderList = ({item}) => {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.mainView}>
          <Text style={styles.text}>
            Name: - {item.title} {item.firstname} {item.middlename}
            {item.lastname}
          </Text>
          <Text style={styles.text}>Purpose : - {item.prospect}</Text>
          <Text style={styles.text}>Notes : - {item.followups[0]?.notes}</Text>
          <TouchableOpacity
            style={styles.touchableopacity}
            onPress={() =>
              navigation.navigate('ClosedDetailsScreen', {
                jobData: item,
                userId: userData.id,
                followups: item.followups,
              })
            }>
            <Text style={[styles.text, {color: '#2e509d'}]}>View Details</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} userData={userData.id} />
      <Text style={styles.title}>Lead Closed List</Text>
      {isLoading ? (
        <Image
          source={require('../../assests/aarogyasevalogo.png')}
          resizeMode="contain"
          style={styles.image}
        />
      ) : (
        <FlatList
          data={closedJobList}
          renderItem={renderList}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default LeadClosed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: '#2e509d',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    width: '75%',
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    width: '85%',
    alignSelf: 'center',
    borderWidth: 5,
    borderRadius: 15,
    borderColor: 'white',
    marginVertical: 15,
    height: 'auto',
    shadowColor: 'black',
    elevation: 15,
    backgroundColor: 'white',
    marginBottom: 25,
    padding: 15,
  },
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  touchableopacity: {
    backgroundColor: '#f08518',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
  },
});
