import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { passwordMatchValidator } from '../../shared/password-match.directive';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/auth';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CardModule, InputTextModule, ReactiveFormsModule, ButtonModule, RouterLink, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
registerForm = this.fb.group({
  fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]], 
  email:['', [Validators.required, Validators.email]],
  password:['', Validators.required],
  confirmPassword:['', Validators.required]
}, {
  validators: passwordMatchValidator
})
  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router){}
  get fullName() {
    return this.registerForm.controls['fullName'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }
  submitDetails(){
    const postData = { ...this.registerForm.value};
    delete postData.confirmPassword;

    this.authService.registerUser(postData as User).subscribe(
      response => {console.log(response)
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Register successfully' });
          this.router.navigate(['login'])
        },
      error => {console.error(error)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Register error' });
      }
    )
  }
}
