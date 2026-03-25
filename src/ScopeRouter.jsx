import ScopePageClg from "./ScopePageClg";
import ScopePageCmp from "./ScopePageCmp";

function ScopeRouter() {
  var user = null;

  try {
    var data = localStorage.getItem("user");
    if (data && data !== "undefined") {
      user = JSON.parse(data);
    }
  } catch (e) {
    console.log("Invalid user data");
  }

  console.log("USER:", user); // debug

  if (!user) {
    return <h2>Please login</h2>;
  }

  if (user.role === "college") {
    return <ScopePageClg />;
  } else if (user.role === "competitive") {
    return <ScopePageCmp />;
  } else {
    return <h2>No scope available</h2>;
  }
}

export default ScopeRouter;
