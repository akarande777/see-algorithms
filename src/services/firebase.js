import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: 'AIzaSyDe09P0GdNxxZJDVhqD_poRtdj2Vc4ixzM',
    authDomain: 'see-algorithms.firebaseapp.com',
    projectId: 'see-algorithms',
    storageBucket: 'see-algorithms.appspot.com',
    messagingSenderId: '343375151411',
    appId: '1:343375151411:web:ab1d0cc80513c1a79abe46',
    measurementId: 'G-CG2WRZ9YET',
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
