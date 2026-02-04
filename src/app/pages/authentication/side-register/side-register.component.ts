import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserRole } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-side-register',
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  isLoading = false;
  errorMessage = '';

  // Available roles for registration (USER and SHOP can self-register)
  roles = [
    { value: UserRole.USER, label: 'Acheteur (Utilisateur)' },
    { value: UserRole.SHOP, label: 'Propriétaire de Boutique' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    role: new FormControl<UserRole>(UserRole.USER, [Validators.required]),
    acceptTerms: new FormControl(false, [Validators.requiredTrue]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    // Check password match
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { name, phone, email, password, role } = this.form.value;

    this.authService.register({
      email: email!,
      password: password!,
      role: role!,
      profile: {
        name: name!,
        phone: phone || undefined,
      },
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.authService.navigateToRoleDashboard();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'L\'inscription a échoué. Veuillez réessayer.';
      },
    });
  }
}
