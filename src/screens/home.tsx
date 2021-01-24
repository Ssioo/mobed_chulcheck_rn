import React, { useEffect, useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { SafeArea } from 'components/layout'
import { COLOR } from 'infra/color'
// @ts-ignore
import { MAIL_ID, SECRET } from '@env'
import RNSmtpMailer from 'react-native-smtp-mailer'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const HomeScreen = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [today, setToday] = useState(moment())
  const [mailTxt, setMailTxt] = useState('')
  useEffect(() => {
    AsyncStorage.getItem('email').then((mail) => {
      if (mail !== null) setEmail(mail)
    })
    AsyncStorage.getItem('name').then((savedName) => {
      if (savedName !== null) setName(savedName)
    })
    const interval = setInterval(() => {
      setToday(moment())
    }, 10000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  useEffect(() => {
    setMailTxt(
      `제목) ${today.format(
        'YYMMDD HH:mm',
      )} ${name} 출근합니다.\n내용) ${name} ${today.format(
        'M월 D일 HH:mm',
      )} 출근했습니다.`,
    )
  }, [name, today])

  return (
    <SafeArea>
      <Text style={styles.titleTxt}>출석체크</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder='메일을 입력하세요'
        placeholderTextColor='#c4c4c4'
        style={styles.inputTxt}
      />
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.inputTxt}
        placeholderTextColor='#c4c4c4'
        placeholder='이름을 입력하세요'
      />
      <Text style={styles.descTxt}>{mailTxt}</Text>
      <TouchableOpacity
        style={styles.centerBtn}
        onPress={() => onPressSubmit(email, name, today)}
      >
        <Text style={styles.btnText}>출첵</Text>
      </TouchableOpacity>
    </SafeArea>
  )
}

const onPressSubmit = async (
  email: string,
  name: string,
  today: moment.Moment,
) => {
  const secretEmail = MAIL_ID
  const pwd = SECRET
  if (!pwd || !email.includes('@') || !secretEmail || name.length < 2) {
    Alert.alert('실패', '메일과 이름을 확인해주세요.')
    return
  }
  Alert.alert(
    '알림',
    '오늘 출근 메일을 보낼까요?',
    [
      {
        text: '취소',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '출석',
        onPress: async () => {
          try {
            await AsyncStorage.setItem('email', email)
            await AsyncStorage.setItem('name', name)
            await RNSmtpMailer.sendMail({
              mailhost: 'smtp.naver.com',
              port: '465',
              username: secretEmail,
              password: pwd,
              fromName: email,
              replyTo: email,
              recipients: __DEV__
                ? 'wooisso@naver.com'
                : 'hjcha@yonsei.ac.kr,mobed.usergroups@yonsei.ac.kr',
              subject: `${today.format('YYMMDD HH:mm')} ${name} 출근합니다.`,
              htmlBody: `${name} ${today.format(
                'M월 D일 HH:mm',
              )} 출근했습니다.`,
            })
            Alert.alert('성공', '출근 메일을 보냈습니다.')
          } catch (e) {
            Alert.alert('실패', '출근 메일을 보내지 못했습니다.')
          }
        },
      },
    ],
    {
      cancelable: true,
    },
  )
}

const styles = StyleSheet.create({
  centerBtn: {
    borderRadius: 100,
    elevation: 2,
    backgroundColor: COLOR.white,
    width: '40%',
    aspectRatio: 1,
    alignSelf: 'center',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 24,
    color: '#333',
  },
  inputTxt: {
    fontSize: 16,
    color: COLOR.white,
    alignSelf: 'center',
    textAlign: 'center',
  },
  descTxt: {
    fontSize: 12,
    color: '#c4c4c4',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 12,
  },
  titleTxt: {
    color: COLOR.white,
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
  },
})
