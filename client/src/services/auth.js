import VueJwtDecode from 'vue-jwt-decode'

class AuthService {
  // our constructor
  constructor() {
    // create an object with auth details
    this.obj = {
      token: `${process.env.VUE_APP_NAME}_token`,
      user: `${process.env.VUE_APP_NAME}_user`,
    };
    // get the auth token from local storage
    this.token = window.localStorage.getItem(this.obj.token);
    // get the current user from local storage
    this.user = JSON.parse(window.localStorage.getItem(this.obj.user));

  }
  // check if user is authenticated
  check() {
    return !!this.token;
  }
  // get the token
  token() {
    return !!this.token;
  }
  // we getting the current user
  user() {
    return !!this.user;
  }
  isAdmin() {
    if(this.token){
      const decodedToken = VueJwtDecode.decode(this.token)
      return !!decodedToken.isAdmin;
    } else {
      return false
    }
  }
  // logout the current user
  logout() {
    // unset the token and the user
    window.localStorage.removeItem(this.obj.token);
    window.localStorage.removeItem(this.obj.user);
    location.reload();
  }
  // login the user
  login({ token, user }, redirect = true) {
    window.localStorage.setItem(this.obj.token, token);
    if(user){
      window.localStorage.setItem(this.obj.user, JSON.stringify(user));
    }

    this.token = token;
    this.user = user;

    // if (redirect) {
    //   window.location = "/";
    // }
  }
  // set the value of the current user
  setUser(user) {
    window.localStorage.removeItem(this.obj.user);
    window.localStorage.setItem(this.obj.user, JSON.stringify(user));
    this.user = user;
    location.reload();
  }
}
// export the auth service
export default new AuthService();
