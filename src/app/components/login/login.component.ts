import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Login } from '../../interfaces/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, InputTextModule, ReactiveFormsModule, ButtonModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private messageService: MessageService) { }

  get email(){
    return this.loginForm.controls['email'];
  }
  get password(){
    return this.loginForm.controls['password'];
  }

  loginUser() {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');
  
    if (emailControl && passwordControl && emailControl.value && passwordControl.value) {
      const email = emailControl.value;
      const password = passwordControl.value;
      const loginData: Login = { Mail: email, Password: password };
  
      this.authService.login(loginData).subscribe(
        (response: any) => {
          if (response.jwt_token) {
            sessionStorage.setItem('jwt_token', response.jwt_token);
            sessionStorage.setItem('email', email);
            
            this.router.navigate(['/']); // Przekierowanie po pomyślnym zalogowaniu
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email or password is empty' });
    }
  }
}