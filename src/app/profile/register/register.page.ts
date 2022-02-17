import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FirebaseService } from 'src/app/app-global-services/firebase.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'register-page',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss']
})
export class RegisterPage implements OnInit{

  pageTitle: string = 'Register New User';

  userForm: FormGroup;
  successMsg: string = '';
  errorMsg: string = '';

  error_msg = {
    'email': [
      { type: 'required', message: 'Provide email.' },
      { type: 'pattern', message: 'Email is not valid.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' 
      },
      { type: 'minlength', message: 'Password length should be 6 characters long.' }
    ]
  };

  constructor(
    private router: Router,
    private authService: FirebaseService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  signUp(value) {
    this.authService.createUser(value)
      .then((response) => {
        this.errorMsg = "";
        this.successMsg = "New user created.";
        // call log in
        this.authService.signinNewUser(value)
          .then((response) => {
            this.errorMsg = "";
            this.router.navigateByUrl('tabs/profile');
          }, error => {
            this.errorMsg = error.message;
            this.successMsg = "";
          })
      }, error => {
        this.errorMsg = error.message;
        this.successMsg = "";
      })
  }

}
