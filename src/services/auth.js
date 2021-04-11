import { firestore } from './firebase';

export const createUserProfileDoc = async (userAuth, additionalData) => {
    if (!userAuth) return;
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData,
            });
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
};

export const createUserAgentDoc = async () => {
    const { userAgent } = window.navigator;
    const visitors = firestore.collection('visitors');
    const res = await visitors.where('userAgent', '==', userAgent).get();

    if (res.empty) {
        const createdAt = new Date();
        try {
            await visitors.add({ userAgent, createdAt });
        } catch (error) {
            console.log('error creating doc', error.message);
        }
    }
};
