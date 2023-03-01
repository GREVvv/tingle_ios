import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    navigation
  } from 'react-native';
  import React, { useEffect, useState } from "react";
  import SettingsButton from '../components/settingsButton';
  import {SafeAreaView, ScrollView,ActivityIndicator, FlatList} from 'react-native';
  import {Appbar, Avatar} from 'react-native-paper';
  import {Text, BottomNavigation} from 'react-native-paper';
  import ButtonWithBackground from '../components/buttonWithBackground';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  import {getMeeting, readPool, token} from '../../api';
  import {
    MediaStream,
    MeetingProvider,
    RTCView,
    useMeeting,
    useParticipant,
  } from '@videosdk.live/react-native-sdk';

function JoinScreen(props) {
  const [meetingVal, setMeetingVal] = useState('');
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          paddingHorizontal: 6 * 10,
        }}>
        <TouchableOpacity
          onPress={async()=>{
            const mid = await props.readPool().catch(err=>console.log(err));
            if (mid) {
              // console.log(mid)
              props.setMeetingId(mid);
            }
          }}
          style={{backgroundColor: '#FF356B', padding: 12, borderRadius: 6}}>
          <Text style={{color: 'white', alignSelf: 'center', fontSize: 18}}>
            Call!
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const Button = ({onPress, buttonText, backgroundColor}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 12,
          borderRadius: 4,
        }}>
        <Text style={{color: 'white', fontSize: 12}}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };

  function ControlsContainer({leave, changeWebcam, toggleMic}) {
    return (
      <View
        style={{
          padding: 24,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Button
          onPress={() => {
            changeWebcam();
          }}
          buttonText={'Change camera'}
          backgroundColor={'#1178F8'}
        />
        <Button
          onPress={() => {
            toggleMic();
          }}
          buttonText={'Mute/unmute'}
          backgroundColor={'#1178F8'}
        />
        <Button
          onPress={() => {
            leave();
          }}
          buttonText={'Leave'}
          backgroundColor={'#FF0000'}
        />
      </View>
    );
  }

  function ParticipantView({participantId}) {
    const {webcamStream, webcamOn} = useParticipant(participantId);
    return webcamOn && webcamStream ? (
      <RTCView
        streamURL={new MediaStream([webcamStream.track]).toURL()}
        objectFit={'cover'}
        style={{
          height: 300,
          marginVertical: 8,
          marginHorizontal: 8,
        }}
      />
    ) : (
      <View
        style={{
          backgroundColor: 'grey',
          height: 300,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 16}}>NO MEDIA</Text>
      </View>
    );
  }

  function ParticipantList({participants}) {
    return participants.length > 0 ? (
      <FlatList
        data={participants}
        renderItem={({item}) => {
          return <ParticipantView participantId={item} />;
        }}
      />
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F6F6FF',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 20}}>Press Join button to enter meeting.</Text>
      </View>
    );
  }

  function MeetingView() {
    const {join, leave, changeWebcam, toggleMic, meetingId, participants} =
      useMeeting();
    const participantsArrId = [...participants.keys()];
    useEffect(() => {
      join();
    }, [])
    return (
      <View style={{flex: 1}}>
        {meetingId ? (
          <Text style={{fontSize: 18, padding: 12}}>Meeting Id :{meetingId}</Text>
        ) : null}
        <ParticipantList participants={participantsArrId} />
        <ControlsContainer
          leave={leave}
          changeWebcam={changeWebcam}
          toggleMic={toggleMic}
        />
      </View>
    );
  }






  export default function VideoCallScreen(){
    const [meetingId, setMeetingId] = useState(null);

    const CallRoute = () => {
    return meetingId ? (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F6F6FF'}}>
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: false,
            webcamEnabled: true,
            name: 'Test User',
          }}
          token={token}>
          <MeetingView />
        </MeetingProvider>
      </SafeAreaView>
    ) : (
      <JoinScreen readPool={readPool} meetingId = {meetingId} setMeetingId = {setMeetingId}/>
    );
  }
    return(
      <CallRoute/>
    )
  }


