import { Component, OnInit } from '@angular/core';
import { ApiBookingsService } from 'src/app/services/api-bookings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  error="";
  constructor(public api: ApiBookingsService, private router: Router) {
  

  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');

    if (token.toString() !== "null") {
      this.router.navigate(['home']);
    }
  }


  validarUser(email, password, app) {
   

    this.api.validarUser(email, password, app).then((data: any) => {
      console.log(data.sessionTokenBck != null);
      if (data.sessionTokenBck != null) {
        localStorage.setItem('token', data.sessionTokenBck);
        this.router.navigate(['home']);
      }
    });
  }
  todo = {
    email:"",
    password:"",
    app:""
  }
  logForm() {
    let email = this.todo["email"];
    let password = this.todo['password'];
    let app = this.todo['app'];
    console.log(email)
    if(email!="" && password!="" && app!=""){
      this.validarUser(email, password, app);
    }else{
      this.error="Error, los datos en el formulario no son correctos"
      
    }
  
  }
}
