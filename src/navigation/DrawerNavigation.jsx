import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import JobList from '../dashboard/JobList';
import CreateJobList from '../dashboard/CreateJobList';
import Profile from '../dashboard/Profile';
import LeadClosed from '../dashboard/LeadClosed';
import EmployeePerformance from '../dashboard/EmployeePerformance';
import History from '../dashboard/History';
import AdminJobAssigned from '../dashboard/AdminJobAssigned';
import SharedLeadbyEmployee from '../dashboard/SharedLeadbyEmployee';
import LeadHistory from '../dashboard/LeadHistory';
import TimeSheet from '../dashboard/TimeSheet';
import MonthPlan from '../dashboard/MonthPlan';
import SelfAssignedJob from '../dashboard/SelfAssignedJob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {API_ROUTES, getApiUrl} from '../api/Base';
import Header from '../component/Header';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import { API_ROUTES_IMAGE, getApiUrlImage } from '../api/Image';
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const CustomDrawerContent = ({userData, ...props}) => {
  const {name, email, id} = userData;
  // console.log(id, 'Line 25');
  const device = useCameraDevices();
  const [databaseImage, setDataBaseImage] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(
    'https://cdn1.iconfinder.com/data/icons/technology-devices-2/100/Profile-512.png',
  );
  const [image, setImage] = useState(
    'https://www.clipartkey.com/mpngs/m/82-824693_dummy-image-of-user.png',
  );

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicroPhonePermission = await Camera.requestMicrophonePermission();

    console.log(newCameraPermission, 'and', newMicroPhonePermission);
  };
  if (device == null) {
    return <ActivityIndicator />;
  }

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    // Load the profile image URL from AsyncStorage when the app starts
    AsyncStorage.getItem('profileImage')
      .then(imageURL => {
        if (imageURL) {
          setProfileImage(imageURL);
        }
      })
      .catch(error => {
        console.error('Error loading profile image URL:', error);
      });
  }, []);

  useEffect(() => {
    const fileId = id;
    const readImageUrl = getApiUrl(API_ROUTES.READ_USER_IMAGE + fileId);
    fetch(readImageUrl)
      .then(response => response.json())
      .then(data => {
        // console.log(data, 'Line 36');
        const fileName = data.data[0]?.file_name;
        console.log(fileName, 'Line 38');

        //  Now Set the Profile image using file_name
        setDataBaseImage(getApiUrlImage(API_ROUTES_IMAGE.EMPLOYEE_IMAGE_PROFILE+fileName))
       
        // console.log("Line 42", profileImageUrl);
        // setImage(profileImage);
        setImageLoading(false);
        // console.log(image,"Line 46")
      });
  }, [id]);
  // Choose Photo from Galary
  const choosePhotoFromLibrary = () => {
    setShowModal(false);
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      console.log(image);
      const formData = new FormData();
      formData.append('employeeid', id);
      formData.append('image', {
        uri: image.path,
        type: image.mime,
        name: 'image.jpg',
      });

      // Define the API Endpoint URL for uploading the image
      const apiUrl = getApiUrl(API_ROUTES.USER_IMAGE);
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
          const fileId = id;
          const readImageUrl = getApiUrl(API_ROUTES.READ_USER_IMAGE + fileId);
          fetch(readImageUrl)
            .then(response => response.json())
            .then(data => {
              console.log(data, 'Line 72');
              const fileName = data.data[0]?.file_name;
              console.log(fileName, 'Line 74');

              //  Now set the profile image using the file_name
              setDataBaseImage(getApiUrlImage(API_ROUTES_IMAGE.EMPLOYEE_IMAGE_PROFILE+fileName))
              
              console.log(image, 'Line 114');
              setImageLoading(false);
            })
            .catch(error => {
              console.log('Read Image API ERROR:', error);
            });
        })
        .catch(error => {
          console.log('API ERROR:', error);
        });
      // console.log('Line 52', formData);
    });
  };

  const takePhotoFromCamera = () => {
    setShowModal(false);
    ImagePicker.openCamera({
      cropping: true,
    }).then(image => {
      console.log(image, 'line 133');
      const formData = new FormData();
      formData.append('employeeid', id);
      formData.append('image', {
        uri: image.path,
        type: image.mime,
        name: 'image.jpg',
      });
      const apiUrl = getApiUrl(API_ROUTES.USER_IMAGE);
      fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('API Response Line 152', data);

          // After Sucessfully uploading the image, fetch the file_Name
          const fileId = id;
          const readImageUrl = getApiUrl(API_ROUTES.READ_USER_IMAGE + fileId);
          fetch(readImageUrl)
            .then(response => response.json())
            .then(data => {
              console.log(data, 'Line 159');
              const fileName = data.data[0]?.file_name;
              console.log(fileName, 'Line 161');

              //  Now set the profile image using the file_name
              
              setDataBaseImage(getApiUrlImage(API_ROUTES_IMAGE.EMPLOYEE_IMAGE_PROFILE+fileName))
              console.log(databaseImage, 'Line 203');
              setImageLoading(false);
            })
            .catch(error => {
              console.log('Read Image API ERROR:', error);
            });
        })
        .catch(error => {
          console.log('API ERROR Line 83:', error);
        });
    });
  };

  const renderInner = () => {
    return (
      <View style={styles.panel}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.panelTitle}>Upload User Profile Photo</Text>
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

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 20,
        }}>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          {imageLoading || !image ? (
            <Image
              source={{uri: profileImage}}
              resizeMode="contain"
              style={{width: 80, height: 80, borderRadius: 40}}
            />
          ) : (
            <Image
              source={{uri: databaseImage}}
              resizeMode="cover"
              style={{width: 80, height: 80, borderRadius: 40}}
            />
          )}
        </TouchableOpacity>
        {showModal && renderInner()}
        <Text style={{marginTop: 10, fontSize: 18, color: 'black'}}>
          {name}
        </Text>
        <Text style={{color: 'black'}}>{email}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

function Job({userData, navigation}) {
  // console.log(navigation,"Line 143")
  // console.log(userData.id,"Line 144");
  return (
    <>
      <Header navigation={navigation} userData={userData.id} />
      <Tab.Navigator>
        <Tab.Screen name="Assigned Job">
          {props => <AdminJobAssigned {...props} userData={userData} />}
        </Tab.Screen>
        <Tab.Screen name="Planned Job">
          {props => <SelfAssignedJob {...props} userData={userData} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
}

const DrawerNavigation = ({route}) => {
  const userData = route.params.userData;

  return (
    <Drawer.Navigator
      backBehavior="none"
      initialRouteName="Lead List"
      drawerContent={props => (
        <CustomDrawerContent {...props} userData={userData} />
      )}>
      <Drawer.Screen name="Profile" options={{headerShown: false}}>
        {props => <Profile {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Lead List" options={{headerShown: false}}>
        {props => <JobList {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Job" options={{headerShown: false}}>
        {props => <Job {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen name="Create Lead" options={{headerShown: false}}>
        {props => <CreateJobList {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Shared Lead Creation" options={{headerShown: false}}>
        {props => <SharedLeadbyEmployee {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Total Worked " options={{headerShown: false}}>
        {props => <History {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Performance " options={{headerShown: false}}>
        {props => <EmployeePerformance {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Closed Lead " options={{headerShown: false}}>
        {props => <LeadClosed {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Lead History " options={{headerShown: false}}>
        {props => <LeadHistory {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Time Sheet " options={{headerShown: false}}>
        {props => <TimeSheet {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Monthly Plan " options={{headerShown: false}}>
        {props => <MonthPlan {...props} userData={userData} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
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
