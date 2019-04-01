import {
  Alert
} from 'react-native';


export const alert = (title = '', message= '', funOk, funCancel= () => {} ) => {
  Alert.alert(title, message,
  [
    {
      text: 'ok',
      onPress: () =>  funOk(),
      style: 'default',
    },
    { 
      text: 'cancel', 
      onPress: () => funCancel(),
      style: 'default',
    },
  ],
  { cancelable: false },
);
}

