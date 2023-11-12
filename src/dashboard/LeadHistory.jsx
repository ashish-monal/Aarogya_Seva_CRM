import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../component/Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Axios  from 'axios';
import { API_ROUTES, getApiUrl } from '../api/Base';
const LeadHistory = ({navigation, userData}) => {
  console.log(userData.id, 'Line 6');
  const [leadData, setLeadData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true); // Set refreshing to true to show the loading indicator
  
    // Perform the data fetching logic here
    Axios.post(getApiUrl(API_ROUTES.LEAD_DATA + userData.id))
      .then((response) => {
        if (response.status === 200) {
          setLeadData(response.data.data);
          setIsLoading(false);
        } else {
          console.error('API returned status code:', response.status);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      })
      .finally(() => {
        setRefreshing(false); // Set refreshing back to false to hide the loading indicator
      });
  };

  

  useEffect(() => {
   Axios
    .post(getApiUrl(API_ROUTES.LEAD_DATA+userData.id))
    .then((response) => {
      if (response.status === 200) {
        setLeadData(response.data.data);
        console.log(response.data.data,"Line 28")
        setIsLoading(false);
      } else {
        console.error('API returned status code:', response.status);
        setIsLoading(false);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    });
  }, [userData.id]);

  const filteredLeadData = leadData.filter((item) =>
    item['Lead_Name'].toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} userData={userData.id} />
      <Text style={styles.title}>Lead History List</Text>
      <View style={styles.searchView}>
        <FontAwesome5
          name="search"
          size={24}
          color="gray"
          style={{marginVertical: 10}}
        />
        <TextInput
          placeholder="Search History... "
          placeholderTextColor="black"
          style={{
            marginVertical: 10,
            marginHorizontal: 10,
            width: '75%',
            color: 'black',
            fontSize: 18,
          }}
          onChangeText={(text)=> setSearchQuery(text)}
          value={searchQuery}
        />
      </View>
      {isLoading ? (
        <Text>Loading Data Please Wait....</Text>
      ) : (
        <FlatList
          data={filteredLeadData}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={ // Add this part
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh} // Define the function to handle refresh
            />}
          renderItem={({item}) => (
            <View style={styles.View1}>
              <Text style={styles.text}>Created Date: {item['date']}</Text>
              <Text style={styles.text}>Name: {item['Lead_Name']}</Text>
              <Text style={styles.text}>Mobile Number: {item['Mobile_Number']}</Text>
              <Text style={styles.text}>Prospect: {item['Prospect']}</Text>
              <Text style={styles.text}>Background: {item['Background']}</Text>
              <TouchableOpacity
                style={styles.touchableopacity}
                onPress={() =>
                  navigation.navigate('LeadHistoryDetails', {
                    userId: userData.id,
                    userData: userData,
                    followupDetails: item['Followup Details'],
                  })
                }
              >
                <Text style={styles.viewDetails}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {/* <View style={styles.View1}>
        <Text style={styles.text}>Name: - {'Ashish Ranjan'}</Text>
        <Text style={styles.text}>Mobile Number: - {'6206416452'}</Text>
        <Text style={styles.text}>Prospect: - {'SUB HUB'}</Text>
        <Text style={styles.text}>Background: - {'HCW'}</Text>
        <TouchableOpacity style={styles.touchableopacity} onPress={() => navigation.navigate('LeadHistoryDetails',{userId:userData.id,userData:userData})}>
          <Text style={styles.viewDetails}>View Details</Text>
        </TouchableOpacity>
        
      </View> */}
    </View>
  );
};

export default LeadHistory;

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
  searchView: {
    borderColor: 'black',
    borderWidth: 1,
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 15,
    height: 'auto',
  },
  View1: {
    padding: 10,
    width: '75%',
    marginVertical: 10,
    borderColor: 'black',
    borderWidth: 2,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 10,
    backgroundColor: 'white',
    // alignItems:'center',
  },
  imageStyle: {
    width: '100%',
  },
  text: {
    fontSize: 18,
    color: 'gray',
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
  viewDetails: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
