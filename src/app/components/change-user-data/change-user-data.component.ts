import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/auth';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-change-user-data',
  standalone: true,
  imports: [CardModule, InputTextModule, ReactiveFormsModule, ButtonModule, RouterLink, CommonModule, HttpClientModule],
  templateUrl: './change-user-data.component.html',
  styleUrl: './change-user-data.component.css'
})

export class ChangeUserDataComponent implements OnInit {
  disabled = true;
  userDataForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.userDataForm = this.fb.group({
      FirstName: [null, Validators.required],
      Password: [null, Validators.required],
      LastName: [null, Validators.required],
      BirthDate: [null, Validators.required],
      Sex: [null], // Handle nullable types appropriately based on your logic
      DefaultAddress: [null, Validators.required],
      DefaultPostalcode: [null, Validators.required],
      DefaultLocation: [null, Validators.required],
      Phone: [null, Validators.required],
      Mail: [null],
      Active: [null],
      Country: [null]
    });
  }

  ngOnInit() {
    // Pobierz aktualne dane użytkownika i wypełnij nimi formularz
    this.userService.getUserData().subscribe(
      (userData: Partial<User>) => {
        this.userDataForm.patchValue(userData);
      },
      (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch user data' });
      }
    );
  }

  submitDetails() {
    if (this.userDataForm.valid) {
      const userData = this.userDataForm.value;

      this.userService.updateUserData(userData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User data updated successfully' });
          // Opcjonalnie przekieruj gdziekolwiek po aktualizacji danych użytkownika
        },
        (error) => {
          console.error(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user data' });
        }
      );
    } else {
      // Obsłuż formularz nieprawidłowy
    }
  }
}