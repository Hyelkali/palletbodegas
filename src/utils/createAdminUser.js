export const createAdminUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Save user data in Firestore
    await setDoc(doc(db, "users", uid), {
      email,
      role: "admin",
      createdAt: new Date().toISOString(),
    });

    // Call the secure backend function to set admin privileges
    const setAdminRole = httpsCallable(functions, "setUserAsAdmin");
    await setAdminRole({ uid });

    console.log("Admin user created successfully!");
    return userCredential.user;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};
// Compare this snippet from src/utils/setAdminRole.js: