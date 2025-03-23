// set-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./src/firebase/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setUserAsAdmin(uid) {
  try {
    // Option 1: Using custom claims (preferred for authentication)
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Successfully set user ${uid} as admin`);
    
    // Option 2: Using Firestore (as your app is currently using)
    await admin.firestore().collection('users').doc(uid).set({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`Successfully updated user ${uid} in Firestore`);
  } catch (error) {
    console.error('Error setting admin privileges:', error);
  }
}

// Replace with the UID of the user you want to make an admin
const userUid = 'dDv2jzfG6Gcy7zvxpDNRD8hhPH32';
setUserAsAdmin(userUid);