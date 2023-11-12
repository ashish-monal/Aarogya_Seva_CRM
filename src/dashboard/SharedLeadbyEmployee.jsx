import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../component/Header';
// import Vector Icons
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-picker/picker';
import {TextInput} from 'react-native-gesture-handler';
import {API_ROUTES, getApiUrl} from '../api/Base';

const SharedLeadbyEmployee = ({navigation, userData}) => {
  const [showReferenceInput, setShowReferenceInput] = useState(false);
  const [refernceText, setReferenceText] = useState('-');
  const [createdBy, setCreatedBy] = useState('');
  const [source, setSource] = useState('');
  const [assigned, setAssigned] = useState('');
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandMark] = useState('');
  // Address
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubdivision, setSelectedSubdivision] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [districts, setDistricts] = useState([]);
  const [subdivisions, setSubdivisions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);

  //   For Background
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState('');
  const [subFields, setSubFields] = useState([]);
  const [selectedSubField, setSelectedSubField] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSectorName, setSelectedSectorName] = useState('');

  //  For Prospect
  const [purpose, setPurpose] = useState('');
  const [data, setData] = useState([]);

  const sourceOfLeed = ['Reference', 'Direct'];

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch(getApiUrl(API_ROUTES.DISTRICT));
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetch(getApiUrl(API_ROUTES.BACKGROUND))
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setBackgrounds(data.data);
        }
      })
      .catch(error => console.log('Error fetching Backgrounds', error.message));
  }, []);
  const handleBackgroundChange = background => {
    setSelectedBackground(background);
    setSelectedSubField('');
    fetch(getApiUrl(API_ROUTES.BACKGROUND + background))
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setSubFields(data.data);
        }
      })
      .catch(error => console.error('Error fetching subfields:', error));
  };

  const fetchData = async () => {
    try {
      const response = await fetch(getApiUrl(API_ROUTES.PURPOSE));
      const jsonData = await response.json();
      if (jsonData.status === 200) {
        setData(jsonData.data);
      }
    } catch (error) {
      console.log('Error fetching Data', error);
    }
  };

  const fetchSubdivisions = async districtId => {
    try {
      const response = await fetch(
        getApiUrl(API_ROUTES.DISTRICT + '/' + districtId),
      );
      const data = await response.json();
      setSubdivisions(data);
    } catch (error) {
      console.error('Error fetching subdivisions:', error);
    }
  };

  const fetchBlocks = async (districtId, subdivisionId) => {
    try {
      const response = await fetch(
        getApiUrl(API_ROUTES.DISTRICT + '/' + districtId + '/' + subdivisionId),
      );
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  const fetchPanchayats = async (districtId, subdivisionId, blockId) => {
    try {
      const response = await fetch(
        getApiUrl(
          API_ROUTES.DISTRICT +
            '/' +
            districtId +
            '/' +
            subdivisionId +
            '/' +
            blockId,
        ),
      );
      const data = await response.json();
      setPanchayats(data);
    } catch (error) {
      console.error('Error fetching panchayats:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (source.trim() === '') {
        Alert.alert('Error', 'Please select the Source');
        return;
      }
      if (refernceText.trim() === '') {
        Alert.alert('Error', 'Please Enter the reference Value');
        return;
      }
      if (title.trim() === '') {
        Alert.alert('Error', 'Please select the Salutation');
        return;
      }
      if (firstName.trim() === '') {
        Alert.alert('Error', 'Please enter the first Name');
        return;
      }
      if (lastName.trim() === '') {
        Alert.alert('Error', 'Please enter the last Name');
        return;
      }
      if (mobile.length != 10) {
        Alert.alert(
          'Error',
          `Please enter the 10 digit valid phone number You enter only ${mobile.length} digit`,
        );
        return;
      }

      if (selectedDistrict === '') {
        Alert.alert('Error', 'Please Enter District Name');
        return;
      }
      if (selectedSubdivision === '') {
        Alert.alert('Error', 'Please Select Sub Division');
        return;
      }
      if (selectedBlock === '') {
        Alert.alert('Error', 'Please Select Block');
        return;
      }
      if (selectedPanchayat === '') {
        Alert.alert('Error', 'Please Select Panchayat');
        return;
      }
      if (address.trim() === '') {
        Alert.alert('Error', 'Please enter the permanent Address ');
        return;
      }
      if (landmark.trim() === '') {
        Alert.alert('Error', 'Please enter landmark location or name');
        return;
      }
      if (purpose === '') {
        Alert.alert('Error', 'Please Select the Prospect');
        return;
      }
      if (selectedBackground === '') {
        Alert.alert('Error', 'Please Select the Background');
        return;
      }
      if(selectedBackground !=null){
        if(selectedSubField === ''){
            Alert.alert("Error"," Please Select the Sub Bakground");
            return;
        }
       
      }
      const formData = {
        createdby: userData.id,
        source: source,
        note: refernceText,
        title: title,
        firstname: firstName,
        middlename: middleName,
        lastname: lastName,
        mobile: mobile,
        email: email,
        address: address,
        district: selectedDistrict,
        subdivision: selectedSubdivision,
        individualblock: selectedBlock,
        panchayat: selectedPanchayat,
        landmark: landmark,
        prospect: purpose,
        backgroundsector: selectedBackground,
        background: selectedSubField,
        image: 'ashish.png',
        assignedto: '0',
        discussion: '-',
        followup: '-',
        outcome: '-',
        purposeamount: '-',
        geographicallocation: '-',
        dateforfollowup: '-',
        timeforfollowup: '-',
        outcome: '-',
        note: '-',
      };
      console.log(formData, 'Line 175');
      const response = await fetch(getApiUrl(API_ROUTES.JOBLIST), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log(responseData, 'Line 188');
      if (responseData.status === 200) {
        console.log('Data Added sucessfully:', responseData.message);
        Alert.alert('Success', 'Thank you for your lead sharing with admin.');
        navigation.navigate('Lead List');
        setSource('');
        setReferenceText('-');
        setTitle('');
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setMobile('');
        setEmail('');
        setSelectedDistrict('');
        setSelectedSubdivision('');
        setSelectedBlock('');
        setSelectedPanchayat('');
        setAddress('');
        setLandMark('');
        setPurpose('');
        setSelectedBackground('');
        setSelectedSubField('');
      } else {
        console.log(
          'Error while sharing Lead to admin Line 193',
          responseData.message,
        );
      }
    } catch (error) {
      console.log('Error at line :197', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} userData={userData.id} />
      <Text style={styles.heading}>Share Lead with Collegue</Text>
      <ScrollView>
        <View style={styles.textInput}>
          <View style={{flexDirection: 'column'}}>
            <View style={styles.inputView}>
              <MaterialIcons name="source" size={24} color="gray" />
              <Picker
                style={styles.input}
                selectedValue={source}
                onValueChange={itemValue => {
                  setSource(itemValue);
                  setShowReferenceInput(itemValue === 'Reference');
                }}>
                <Picker.Item label="Select Source" value="" />
                {sourceOfLeed.map((purposeName, index) => (
                  <Picker.Item
                    key={index}
                    label={purposeName}
                    value={purposeName}
                  />
                ))}
              </Picker>
            </View>
            {showReferenceInput && (
              <View style={styles.inputView}>
                <TextInput
                  value={refernceText}
                  style={styles.input}
                  placeholderTextColor="gray"
                  placeholder="Brief of Reference"
                  onChangeText={text => {
                    setReferenceText(text);
                  }}
                />
              </View>
            )}
          </View>

          {/* Name Title Picker */}
          <View style={styles.inputView}>
            <MaterialCommunityIcons
              name="human-male-female"
              size={24}
              color="gray"
            />
            <Picker
              style={styles.input}
              selectedValue={title}
              onValueChange={setTitle}>
              <Picker.Item label="Select Title" value="" />
              <Picker.Item label="Mr" value="Mr" />
              <Picker.Item label="Mrs" value="Mrs" />
              <Picker.Item label="Dr" value="Dr" />
            </Picker>
          </View>
          {/* First, Middle and Last name TextInput */}
          <View style={styles.nameSection}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                keyboardType="name-phone-pad"
                returnKeyType="next"
                placeholderTextColor={'black'}
                onChangeText={text => setFirstName(text)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                placeholder="Middle Name"
                value={middleName}
                keyboardType="name-phone-pad"
                returnKeyType="next"
                placeholderTextColor={'black'}
                onChangeText={text => setMiddleName(text)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                keyboardType="name-phone-pad"
                placeholderTextColor={'black'}
                returnKeyType="next"
                onChangeText={text => setLastName(text)}
              />
            </View>
          </View>
          {/* Mobile Number */}
          <View style={styles.inputView}>
            <FontAwesome name="phone" size={24} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={mobile}
              maxLength={10}
              placeholderTextColor={'black'}
              keyboardType="numeric"
              returnKeyType="next"
              onChangeText={text => setMobile(text)}
            />
          </View>

          {/* Email Id */}
          <View style={styles.inputView}>
            <Entypo name="mail" size={24} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Email ID"
              value={email}
              placeholderTextColor={'black'}
              returnKeyType="next"
              keyboardType="email-address"
              onChangeText={text => setEmail(text)}
            />
          </View>

          {/* District Picker */}
          <View style={styles.inputView}>
            <Entypo name="home" size={24} color="gray" />
            <Picker
              style={styles.input}
              selectedValue={selectedDistrict}
              onValueChange={itemValue => {
                setSelectedDistrict(itemValue);
                setSelectedSubdivision('');
                setSelectedBlock('');
                setSelectedPanchayat('');
                fetchSubdivisions(itemValue); // Fetch subdivisions for the selected district
              }}>
              <Picker.Item label="Select District" value="" />
              {districts.map((district, index) => (
                <Picker.Item
                  key={index}
                  label={district.district}
                  value={district.district_id.toString()}
                />
              ))}
            </Picker>
          </View>

          {/* Subdivision Picker */}
          {subdivisions.length > 0 && (
            <View style={styles.inputView}>
              <Picker
                style={styles.input}
                selectedValue={selectedSubdivision}
                onValueChange={itemValue => {
                  setSelectedSubdivision(itemValue);
                  setSelectedBlock('');
                  setSelectedPanchayat('');
                  fetchBlocks(selectedDistrict, itemValue); // Fetch blocks for the selected subdivision
                }}>
                <Picker.Item label="Select Subdivision" value="" />
                {subdivisions.map((subdivision, index) => (
                  <Picker.Item
                    key={index}
                    label={subdivision.subdivision}
                    value={subdivision.subdivision_id.toString()}
                  />
                ))}
              </Picker>
            </View>
          )}

          {/* Block Picker */}
          {blocks.length > 0 && (
            <View style={styles.inputView}>
              <Picker
                style={styles.input}
                selectedValue={selectedBlock}
                onValueChange={itemValue => {
                  setSelectedBlock(itemValue);
                  setSelectedPanchayat('');
                  fetchPanchayats(
                    selectedDistrict,
                    selectedSubdivision,
                    itemValue,
                  ); // Fetch panchayats for the selected block
                }}>
                <Picker.Item label="Select Block" value="" />
                {blocks.map((block, index) => (
                  <Picker.Item
                    key={index}
                    label={block.individualblock}
                    value={block.individualblock_id.toString()}
                  />
                ))}
              </Picker>
            </View>
          )}

          {/* Panchayat Picker */}
          {panchayats.length > 0 && (
            <View style={styles.inputView}>
              {/* ... Similar pattern for other icons ... */}
              <Picker
                style={styles.input}
                selectedValue={selectedPanchayat}
                onValueChange={itemValue => setSelectedPanchayat(itemValue)}>
                <Picker.Item label="Select Panchayat" value="" />
                {panchayats.map((panchayat, index) => (
                  <Picker.Item
                    key={index}
                    label={panchayat.panchayat}
                    value={panchayat.panchayat_id.toString()}
                  />
                ))}
              </Picker>
            </View>
          )}

          {/* User Address */}
          <View style={styles.inputView}>
            <Entypo name="home" size={24} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              placeholderTextColor={'black'}
              keyboardType="default"
              returnKeyType="next"
              onChangeText={text => setAddress(text)}
            />
          </View>

          {/* Landmark */}
          <View style={styles.inputView}>
            <FontAwesome5 name="landmark" size={24} color="gray" />
            <TextInput
              placeholderTextColor={'black'}
              style={styles.input}
              placeholder="Landmark"
              value={landmark}
              keyboardType="default"
              returnKeyType="next"
              onChangeText={text => setLandMark(text)}
            />
          </View>

          {/* Prospect Picker */}
          <View style={styles.inputView}>
            <Octicons name="workflow" size={24} color="gray" />
            <Picker
              style={styles.input}
              selectedValue={purpose}
              onValueChange={itemValue => setPurpose(itemValue)}>
              <Picker.Item label="Select Prospect" value="" />
              {data.map(item => (
                <Picker.Item
                  key={item.id}
                  label={`${item.purpose} - Amount: ${item.amount}`}
                  value={item.purpose}
                />
              ))}
            </Picker>
          </View>

          {/* Background */}
          {/* Picker for Sector */}
          <View style={styles.inputView}>
            <Octicons name="workflow" size={24} color="gray" />
            <Picker
              style={styles.input}
              selectedValue={selectedBackground}
              onValueChange={handleBackgroundChange}>
              <Picker.Item label="Select Background" value="" />
              {backgrounds.map((background, index) => (
                <Picker.Item
                  key={index}
                  label={background}
                  value={background}
                />
              ))}
            </Picker>
          </View>
          {/* Picker for Sector Name */}
          {selectedBackground && (
            <View style={styles.inputView}>
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color="gray"
              />
              <Picker
                style={styles.input}
                selectedValue={selectedSubField}
                onValueChange={setSelectedSubField}>
                <Picker.Item label="Select Sub Background Name" value="" />
                {subFields.map(subField => (
                  <Picker.Item
                    key={subField.id}
                    label={subField.background}
                    value={subField.background}
                  />
                ))}
              </Picker>
            </View>
          )}
          {/* TextInput for Other Sector Name */}
          {selectedSector === '3' ? (
            <View style={styles.inputView}>
              <AntDesign name="profile" size={24} color="gray" />
              <TextInput
                style={styles.input}
                placeholder="Enter Other Sector Name"
                value={selectedSectorName}
                onChangeText={text => setSelectedSectorName(text)}
              />
            </View>
          ) : null}
          {/* Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.touchableOpacitySignIn}>
            <Text style={styles.SignIn}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SharedLeadbyEmployee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    color: '#2e509d',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  textInput: {
    height: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 15,
  },
  inputView: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'gray',
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '80%',
    color: 'black',
  },
  touchableOpacitySignIn: {
    backgroundColor: 'green',
    width: '80%',
    height: 50,
    borderRadius: 25,
    marginVertical: 25,
  },
  SignIn: {
    marginTop: 10,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
