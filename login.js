//import { el } from 'redom';
const { el, mount } = redom;

// define Login component
class Login {
  constructor () {
    this.el = el('form#login',
      this.email = el('input.email', { type: 'email' }),
      this.pass = el('input.pass', { type: 'password' }),
      this.submit = el('button', { type: 'submit' },
        'Sign in'
      )
    );
    this.el.onsubmit = e => {
      e.preventDefault();

      const email = this.email.value;
      const pass = this.pass.value;
      login_res(email,pass);
      console.log(email, pass);
    };
  }
}

let _l = new Login();

function login_res (){

    //e.preventDefault();
    let emailD = document.getElementById('email');
    let pwD = document.getElementById('password');
    let email = emailD.value;
    let pw = pwD.value;

    console.log(email.value + ' ' + pw.value);
    var request = new XMLHttpRequest();
    request.open('GET', '/login_res?user='+email+'&pw='+pw, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        //set auth cookie
        var data = JSON.parse(request.responseText);
        if (data.success===undefined){
          prompt('Please Check username and password');
        } else {
          setTimeout(() => window.location = '/serviceStatus', 300);
        }

      } else {
        // We reached our target server, but it returned an error
        console.log("request error");
        }
     };

    request.onerror = function() {
      // There was a connection error of some sort
      console.log("request onerror");
    };

    request.send();

}