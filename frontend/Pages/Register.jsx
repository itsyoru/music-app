import React from 'react';

const register = () => {
  return (
    <div>
      <h1></h1>
      {/* Add more content here */}
        <div>
        <form name = "log in form" method="post" action="">
          <label>register</label>
          <br></br>

          <table width = "100" allign = "center">
          <tr>
          <input type = "text" name = "username"></input>
          </tr>
          <tr>
          <input type = "password" name = "password"></input>
          </tr>
          <tr>
          <input type = "confirm password" name = "password"></input>
          </tr>
          <input type = "submit" value = "log in"></input>
          </table>
          </form>
        </div>
      
    </div>
  );
};

export default register;