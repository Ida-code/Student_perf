const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost/Stud_Perf/Loginstud.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const text = await response.text();
    console.log("RAW LOGIN RESPONSE:", text);

    const data = JSON.parse(text);

    if (data.status === "success") {
      // ✅ STORE USER (VERY IMPORTANT)
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: data.id,
          name: data.name,
          role: data.role,
        }),
      );

      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed");
  }
};
