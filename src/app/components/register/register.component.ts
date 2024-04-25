import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { passwordMatchValidator } from '../../shared/password-match.directive';
import { AuthService } from '../../services/auth.service';
import { Register, User } from '../../interfaces/auth';
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
    Mail: [null, [Validators.required, Validators.email]],
    Password: [null, Validators.required],
    FirstName: [null, Validators.required],
    LastName: [null, Validators.required],
    BirthDate: [null, Validators.required],
    Sex: [null], // Handle nullable types appropriately based on your logic
    DefaultAddress: [null, Validators.required],
    DefaultPostalcode: [null, Validators.required],
    DefaultLocation: [null, Validators.required],
    Phone: [null, Validators.required]
  });
  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router){}
  submitDetails() {
    if (this.registerForm.valid) {
        const { Mail, Password, FirstName, LastName, BirthDate, Sex, DefaultAddress, DefaultPostalcode, DefaultLocation, Phone } = this.registerForm.value;
        
        const postData: Register = {
            Mail,
            Password,
            FirstName,
            LastName,
            BirthDate,
            Sex,
            DefaultAddress,
            DefaultPostalcode,
            DefaultLocation,
            Phone
        };

        this.authService.registerUser(postData).subscribe(
            () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Register successful' });
                this.router.navigate(['login']);
            },
            error => {
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Registration error' });
            }
        );
    } else {
        // Handle invalid form
    }
}
  }
// registerForm = this.fb.group({
//   fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]], 
//   email:['', [Validators.required, Validators.email]],
//   password:['', Validators.required],
//   confirmPassword:['', Validators.required]
// }, {
//   validators: passwordMatchValidator
// })