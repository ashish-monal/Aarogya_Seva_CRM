import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {getApiUrl, API_ROUTES} from '../api/Base';
import { Axios } from 'axios';
import { API_ROUTES_IMAGE, getApiUrlImage, } from '../api/Image';
const DetailsScreen = ({navigation, route}) => {
  const {jobData, userId, followups} = route.params;
  console.log('Line 20', jobData.id);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(
    'https://cdn1.iconfinder.com/data/icons/technology-devices-2/100/Profile-512.png',
  );
  const [image,setImage] = useState('');
  const [imageLoading, setImageLoading] = useState(true);

  // Fetch the image from the API when the component mounts
  useEffect(() => {
    const fileId = jobData.id;
    const readImageUrl = getApiUrl(API_ROUTES.READ_LEAD_IMAGE + fileId);
    fetch(readImageUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data, 'Line 36');
        const fileName = data.data[0]?.file_name;
        console.log(fileName, 'Line 38');

        //  Now Set the Profile image using file_name
        setImage(getApiUrlImage(API_ROUTES_IMAGE.LEAD_IMAGE_PROFILE+fileName))
       
        setImageLoading(false);
        // console.log(image,"Line 46")
      });
  }, [jobData.id]);

  useEffect(() => {
    // Load the profile image URL from AsyncStorage when the app starts
    AsyncStorage.getItem(`LeadProfileImage_${jobData.id}`)
      .then(imageURL => {
        if (imageURL) {
          setProfileImage(imageURL);
        }
      })
      .catch(error => {
        console.error('Error loading profile image URL:', error);
      });
  }, []);

  const choosePhotoFromLibrary = () => {
    setShowModal(false);
    
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      console.log(image);
      const formData = new FormData();
      formData.append('leadid', jobData.id);
      formData.append('image', {
        uri: image.path,
        type: image.mime,
        name: 'image.jpg',
      });

      // Define the API Endpoint URL for uploading the image
      const apiUrl = getApiUrl(API_ROUTES.LEAD_IMAGE);
      fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('API Response Line 64', data);

          // After Sucessfully uploading the image, fetch the file_Name
          const fileId = jobData.id;
          const readImageUrl = getApiUrl(API_ROUTES.READ_LEAD_IMAGE + fileId);
          fetch(readImageUrl)
            .then(response => response.json())
            .then(data => {
              console.log(data, 'Line 72');
              const fileName = data.data[0]?.file_name;
              console.log(fileName, 'Line 74');

              //  Now set the profilr image using the file_name
               setImage(getApiUrlImage(API_ROUTES_IMAGE.LEAD_IMAGE_PROFILE+fileName))
              setImageLoading(false);
            })
            .catch(error => {
              console.log('Read Image API ERROR:', error);
            });
        })
        .catch(error => {
          console.log('API ERROR Line 83:', error);
        });
      console.log('Line 52', formData);
      // setProfileImage(image.path);
      // console.log(profileImage);
    });
  };

  const takePhotoFromCamera = () => {
    setShowModal(false);
    ImagePicker.openCamera({
      cropping: true,
    }).then(image => {
      console.log(image);
      const formData = new FormData();
      formData.append('leadid', jobData.id);
      formData.append('image', {
        uri: image.path,
        type: image.mime,
        name: 'image.jpg',
      });
      const apiUrl = getApiUrl(API_ROUTES.LEAD_IMAGE);
      fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('API Response Line 64', data);

          // After Sucessfully uploading the image, fetch the file_Name
          const fileId = jobData.id;
          const readImageUrl = getApiUrl(API_ROUTES.READ_LEAD_IMAGE + fileId);
          fetch(readImageUrl)
            .then(response => response.json())
            .then(data => {
              console.log(data, 'Line 72');
              const fileName = data.data[0]?.file_name;
              console.log(fileName, 'Line 74');

              //  Now set the profilr image using the file_name
              setImage(getApiUrlImage(API_ROUTES_IMAGE.LEAD_IMAGE_PROFILE+fileName))
              setImageLoading(false);
            })
            .catch(error => {
              console.log('Read Image API ERROR:', error);
            });
        })
        .catch(error => {
          console.log('API ERROR Line 83:', error);
        });

      // setImage(image.path);
    });
  };

 

  const renderInner = () => {
    return (
      <View style={styles.panel}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.panelTitle}>Upload Leed Profile Photo</Text>
          {/* <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text> */}
        </View>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={takePhotoFromCamera}>
          <Text style={styles.panelButtonTitle}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.panelButton}
          onPress={choosePhotoFromLibrary}>
          <Text style={styles.panelButtonTitle}>Choose Photo From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => setShowModal(false)}>
          <Text style={styles.panelButtonTitle}>Cancle</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const fetchAccountStatus = async () => {
    const response = await Axios.get(
      getApiUrl(API_ROUTES.ACCOUNT_STATUS + userData),
    );
    console.log(response.data, 'Line 22');
    if (response.data.accountstatus === 1) {
    } else {
      // autologout();
      AsyncStorage.removeItem('userData');
      navigation.replace('Login');
    }
  };
  useEffect(() => {
    fetchAccountStatus();

    const interval = setInterval(fetchAccountStatus, 10 * 1000); // Check every 10 second

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);



  const autologout = async () => {
    try {
      const postData = {
        employee_id: userId.toString(),
      };
      console.log(postData, 'Line 190');
      const logoutStatus = await fetch(getApiUrl(API_ROUTES.LOGOUT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      // console.log(logoutStatus,"Line 157");
      if (logoutStatus.status === 200) {
        const responseJSON = await logoutStatus.json();
        console.log(responseJSON.message);
        console.log('Logout Status Change Sucessfully', 'Line 161');
        try {
          Geolocation.getCurrentPosition(async position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const postData = {
              employeeid: userId.toString(),
              latitude: latitude.toString(),
              longitude: longitude.toString(),
            };
            console.log(postData, 'Line 188');
            const logoutTimeResponse = await fetch(
              getApiUrl(API_ROUTES.USER_LOGOUT_TIME),
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
              },
            );
            if (logoutTimeResponse.status === 200) {
              // const responseJson = await logoutTimeResponse.json();
              AsyncStorage.removeItem('userData');
              navigation.replace('Login');
              console.log(' logout time Save Sucessfully Line 189');
            } else {
              console.log('Falied to save logout time Line 228');
            }
          });
        } catch (error) {
          console.log(error, 'Line 224');
        }
      } else {
        console.log('Failed to change the status', error);
      }
    } catch (error) {
      console.log('You are not logging today Line 203', error);
    }
  };


  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      // Simulating a delay for demonstration purposes
      setRefreshing(false);
    }, 2000);
  };

  const renderFollowupItem = ({item}) => (
    <View style={styles.followupItem}>
      {console.log(item, 'Line 144')}
      <Text style={styles.followupText}>Date: {item.visitdate}</Text>
      <Text style={styles.followupText}>
        Follow Up Methood: {item.followupmethods}
      </Text>
      <Text style={styles.followupText}>Discussion Notes: {item.notes}</Text>
      <Text style={styles.followupText}>Status: {item.outcome}</Text>
      {item.workwith_name != null && (
        <Text style={styles.followupText}>Work With: {item.workwith_name}</Text>
      )}
    </View>
  );
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={50} color="#00bc4c" />
        </TouchableOpacity>
        <Image
          source={require('../../assests/aarogyasevalogo.png')}
          resizeMode="contain"
          style={{width: '50%', height: 100}}
        />
        <TouchableOpacity onPress={autologout}>
          <Entypo name="log-out" size={50} color="#f08518" />
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Candidate Details</Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.view1}>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            {imageLoading || !image ? (
              <Image
                source={{uri:profileImage}}
                style={{width: 150, height: 150, borderRadius: 40}}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{uri:image}}
                style={{width: 150, height: 150, borderRadius: 40}}
                resizeMode="cover"
              />
            )}
            {/* <Image source={{uri: profileImage}}  style={{width: 150, height: 150, borderRadius: 40}} /> */}
          </TouchableOpacity>
          {showModal && renderInner()}
          <View style={{flexDirection: 'row', gap: 5}}>
            <View style={styles.design}>
              <Text style={styles.text}>Name</Text>
              <Text style={styles.text}>
                {jobData.title} {jobData.firstname} {jobData.middlename}{' '}
                {jobData.lastname}
              </Text>
            </View>
            {jobData.address != null && (
              <View style={styles.design}>
                <Text style={styles.text}>Address</Text>
                <Text style={styles.text}>{jobData.address}</Text>
              </View>
            )}
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            {jobData.background != null && (
              <View style={styles.design}>
                <Text style={styles.text}>Background</Text>
                <Text style={styles.text}>{jobData.background}</Text>
              </View>
            )}
            {jobData.backgroundsector != null && (
              <View style={styles.design}>
                <Text style={styles.text}>Background Sector</Text>
                <Text style={styles.text}>{jobData.backgroundsector}</Text>
              </View>
            )}
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            {jobData.email != null && (
              <View style={styles.design}>
                <Text style={styles.text}>Email</Text>
                <Text style={styles.text}>{jobData.email}</Text>
              </View>
            )}
            {jobData.mobile != null && (
              <View style={styles.design}>
                <Text style={styles.text}>Mobile Number</Text>
                <Text style={styles.text}>{jobData.mobile}</Text>
              </View>
            )}
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            {jobData.discussion != '-' && (
              <View style={styles.design}>
                <Text style={styles.text}>Discussion</Text>
                <Text style={styles.text}>{jobData.discussion}</Text>
              </View>
            )}
            {jobData.dateforfollowup != '-' && (
              <View style={styles.design}>
                <Text style={styles.text}>Date For Follow Up</Text>
                <Text style={styles.text}>{jobData.dateforfollowup}</Text>
              </View>
            )}
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            {jobData.timeforfollowup != '-' && (
              <View style={styles.design}>
                <Text style={styles.text}>Time For Follow Up</Text>
                <Text style={styles.text}>
                  {jobData.timeforfollowup.split(' ')[0].substring(0, 5)}
                </Text>
              </View>
            )}
            {jobData.followup != '-' && (
              <View style={styles.design}>
                <Text style={styles.text}>Follow Method</Text>
                <Text style={styles.text}>{jobData.followup}</Text>
              </View>
            )}
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            {jobData.outcome != '-' && (
              <View style={styles.design}>
                <Text style={styles.text}>Status</Text>
                <Text style={styles.text}>{jobData.outcome}</Text>
              </View>
            )}
            {jobData.landmark != '-' && (
              <View style={styles.design}>
                <Text style={styles.text}>Landmark</Text>
                <Text style={styles.text}>{jobData.landmark}</Text>
              </View>
            )}
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            {jobData.purposeamount != '-' && (
              <View style={styles.design}>
                <Text style={styles.text}>Business Amount</Text>
                <Text style={styles.text}>{jobData.purposeamount}</Text>
              </View>
            )}
            {jobData.source != null && (
              <View style={styles.design}>
                <Text style={styles.text}>Source</Text>
                <Text style={styles.text}>{jobData.source}</Text>
              </View>
            )}
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            {jobData.prospect != null && (
              <View style={styles.design}>
                <Text style={styles.text}>Prospect</Text>
                <Text style={styles.text}>{jobData.prospect}</Text>
              </View>
            )}
            {jobData.workwith_name != null && (
              <View style={styles.design}>
                <Text style={styles.text}>Work With</Text>

                <Text style={styles.text}>{jobData.workwith_name}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.followupsContainer}>
          <Text style={styles.heading}>Follow Ups</Text>

          <FlatList
            data={followups}
            renderItem={renderFollowupItem}
            keyExtractor={item => item.id.toString()}
            style={{flex: 1}}
          />
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('OutCome', {
              joblistId: jobData.id,
              userId: userId,
              jobDataDate: jobData.dateforfollowup,
            })
          }
          style={styles.touchableOpacityContainer}>
          <Text style={styles.LoginText}>Add Next Follow Up </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2e509d',
    backgroundColor: 'white',
  },
  heading: {
    color: '#2e509d',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  touchableOpacityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'green',
    width: '80%',
    height: 50,
    borderRadius: 25,
    marginVertical: 15,
  },
  LoginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
    color: 'black',
  },
  followupsContainer: {
    marginVertical: 25,
    marginHorizontal: 50,
  },
  followupItem: {
    borderWidth: 2,
    borderColor: '#f08518',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    elevation: 5,
  },
  followupText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  design: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    borderColor: '#2e509d',
    flexDirection: 'column',
    justifyContent: 'center',
    shadowColor: 'black',
    elevation: 15,
    backgroundColor: 'white',
    gap: 5,
    alignItems: 'center',
  },
  view1: {
    width: '100%',
    flexDirection: 'column',
    marginVertical: 25,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: 'white',
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});
