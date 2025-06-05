useEffect(() => {
  const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
    if (!user) {
      navigate("/login"); // Not logged in
      return;
    }

    // 🧠 Now it's safe to use `user.uid`
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const signupTime = userSnap.data().createdAt;

      if (!signupTime) return;

      const q = query(
        collection(db, "messages"),
        orderBy("createdAt"),
        where("createdAt", ">=", signupTime)
      );

      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

      // Cleanup message listener
      return () => unsubscribeMessages();
    }
  });

  // Cleanup auth listener
  return () => unsubscribeAuth();
}, []);
