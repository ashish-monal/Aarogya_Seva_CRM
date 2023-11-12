import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Linking,
  RefreshControl,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../component/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getApiUrl,API_ROUTES } from '../api/Base';
const JobList = ({navigation, userData}) => {
  // console.log('Line 14', userData.id);
  const [joblist, setJobList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // console.log(userData, 'Line 16');

 
  const fetchData = () => {
    setIsLoading(true);
    fetch(getApiUrl(API_ROUTES.FOLLOW_UP_LIST + userData.id))
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          const sortedJobList = data.joblist_and_followup_data.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          );
          setJobList(sortedJobList);
        }
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

  const renderList = ({item}) => {
    // console.log(item,"Line 59");
    const followUpDate = new Date(item.followups[0]?.visitdate);
    const currentDate = new Date();

    let label = '';
    if (followUpDate > currentDate) {
      label = 'Upcomimg';
    } else if (
      followUpDate.getDate() === currentDate.getDate() &&
      followUpDate.getMonth() === currentDate.getMonth() &&
      followUpDate.getFullYear() === currentDate.getFullYear()
    ) {
      label = `Today`;
    } else {
      label = 'Pending';
    }
    const date = item.followups[0]?.visitdate;
    const time = item.followups[0]?.visittime;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.mainView}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MaterialCommunityIcons
              name="label"
              size={24}
              color={label.includes('Pending') ? 'red' : 'green'}
            />
            <Text style={{color: label.includes('Pending') ? 'red' : 'green'}}>
              {label}
            </Text>
            <Text style={{color: 'black'}}>Date: {date} </Text>
            {/* <Text style={{ color: 'black' }}>Time: {time} </Text> */}
          </View>
          <Text style={styles.text}>
            <Text>Name :- </Text>
            {`${item.title} ${item.firstname} ${item.middlename===null? '':item.middlename} ${item.lastname}`}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.text}>
              <Text>Mobile Number:-</Text>
              {item.mobile}
            </Text>
            <TouchableOpacity 
              onPress={() =>
                Linking.openURL(`tel:${item.mobile}`).catch(error => {
                  console.log('Error While Opening Dialer', error);
                })
              }>
              <FontAwesome
                name="phone"
                style={styles.icon}
                size={18}
                color="#2e509d"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>Address : - {item.address}</Text>
          <Text style={styles.text}>Purpose : - {item.prospect}</Text>
          <Text style={styles.text}>Required Action:-{item.followup}</Text>
          <TouchableOpacity
            style={styles.touchableopacity}
            onPress={() =>
              navigation.navigate('DetailsScreen', {
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
      {/* {console.log("Line 205",userData.id)} */}
      <Header navigation={navigation} userData={userData.id} />
      <Text
        style={styles.heading}>
        Created Lead
      </Text>
      {isLoading ? (
        <Image
          source={require('../../assests/aarogyasevalogo.png')}
          resizeMode="contain"
          style={styles.image}
        />
      ) : (
        <FlatList
          data={joblist}
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

export default JobList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
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
  image:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    width: '75%',
  },
  heading:{
    color: '#2e509d',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  icon:{
    marginLeft: 5,
    backgroundColor: '#f08518',
    borderRadius: 2,
    padding: 5,
  }
});
