import React from 'react';

const Login = () => {
  return (
    <div>
      <h1>Welcome to the Login Page</h1>
      {/* Add more content here */}
        <div>
        <form name = "log in form" method="post" action="">
          <label>Log In</label>
          <br></br>

          <table width = "100" allign = "center">
          <tr>
          <input type = "text" name = "username"></input>
          </tr>
          <tr>
          <input type = "password" name = "password"></input>
          </tr>
          <input type = "submit" value = "log in"></input>
          </table>
          </form>
        </div>
      
      <h2>Don't have an Account? Register here</h2>
    </div>
  );
};

export default Login;