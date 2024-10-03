// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD0R5K1FuXOhaVjzzCqNov9DR2CYNqigqc",
//   authDomain: "ticketbookingwebsite.firebaseapp.com",
//   projectId: "ticketbookingwebsite",
//   storageBucket: "ticketbookingwebsite.appspot.com",
//   messagingSenderId: "1032821918724",
//   appId: "1:1032821918724:web:48a077982a965f41387951",
//   measurementId: "G-B9J3ZFG7X3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

//   document.querySelector('login-call').addEventListener('click', () => {
//     const email = document.querySelector('#email').value;
//     const password = document.querySelector('#password').value;
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in
//         const user = userCredential.user;
//         // ...
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorCode, errorMessage);
//         console.log('error');
//       });
//     })

//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             // document.querySelector('#openLogin').style.display = 'none';
//           // User is signed in, see docs for a list of available properties
//           // https://firebase.google.com/docs/reference/js/auth.user
//           const uid = user.uid;
//           console.log(user);
//           // ...
//         } else {
//             console.log('user is not signed in');
//           // User is signed out
//           // ...
//         }
//       });

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0R5K1FuXOhaVjzzCqNov9DR2CYNqigqc",
  authDomain: "ticketbookingwebsite.firebaseapp.com",
  projectId: "ticketbookingwebsite",
  storageBucket: "ticketbookingwebsite.appspot.com",
  messagingSenderId: "1032821918724",
  appId: "1:1032821918724:web:48a077982a965f41387951",
  measurementId: "G-B9J3ZFG7X3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set session persistence to 'local', so user stays logged in on refresh
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    document.querySelector('login-call').addEventListener('click', () => {
    //   const email = document.querySelector('#email').value;
    const email = 'chetan23rd@admin.com';
      const password = document.querySelector('#password').value;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User signed in:", user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    });
  })
  .catch((error) => {
    // Handle errors
    console.error("Error setting persistence:", error);
  });

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
    // User is signed in
  } else {
    console.log("User is not signed in");
    // User is signed out
  }
});
