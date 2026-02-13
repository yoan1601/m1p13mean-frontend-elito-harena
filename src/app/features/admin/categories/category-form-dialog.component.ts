import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Category, CategoryCreatePayload, CategoryUpdatePayload } from 'src/app/core/models';
import { CategoryService } from 'src/app/core/services';

export interface CategoryFormDialogData {
  mode: 'create' | 'edit';
  category?: Category;
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'create' ? 'Nouvelle Catégorie' : 'Modifier la Catégorie' }}
    </h2>
    
    <mat-dialog-content>
      <form [formGroup]="form" class="category-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code" placeholder="Ex: SPORT" 
                 [readonly]="data.mode === 'edit'">
          @if (form.get('code')?.hasError('required')) {
            <mat-error>Le code est obligatoire</mat-error>
          }
          @if (form.get('code')?.hasError('pattern')) {
            <mat-error>Le code doit être en majuscules sans espaces</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Libellé</mat-label>
          <input matInput formControlName="label" placeholder="Ex: Sport et Fitness">
          @if (form.get('label')?.hasError('required')) {
            <mat-error>Le libellé est obligatoire</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Icône (optionnel)</mat-label>
          <input matInput formControlName="icon" placeholder="Ex: sports">
        </mat-form-field>

        <mat-slide-toggle formControlName="isActive" color="primary">
          Catégorie active
        </mat-slide-toggle>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" 
              (click)="onSubmit()"
              [disabled]="form.invalid || saving">
        @if (saving) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          {{ data.mode === 'create' ? 'Créer' : 'Mettre à jour' }}
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .category-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-actions button {
      min-width: 100px;
    }

    mat-spinner {
      display: inline-block;
    }
  `]
})
export class CategoryFormDialogComponent implements OnInit {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CategoryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryFormDialogData
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]],
      label: ['', Validators.required],
      icon: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.category) {
      this.form.patchValue({
        code: this.data.category.code,
        label: this.data.category.label,
        icon: this.data.category.icon || '',
        isActive: this.data.category.isActive
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving = true;
    const formValue = this.form.value;

    if (this.data.mode === 'create') {
      const payload: CategoryCreatePayload = {
        code: formValue.code,
        label: formValue.label,
        icon: formValue.icon || undefined,
        isActive: formValue.isActive
      };

      this.categoryService.create(payload).subscribe({
        next: () => {
          this.snackBar.open('Catégorie créée avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.snackBar.open(error.error?.message || 'Erreur lors de la création', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.saving = false;
        }
      });
    } else {
      const payload: CategoryUpdatePayload = {
        code: formValue.code,
        label: formValue.label,
        icon: formValue.icon || undefined,
        isActive: formValue.isActive
      };

      this.categoryService.update(this.data.category!._id, payload).subscribe({
        next: () => {
          this.snackBar.open('Catégorie mise à jour avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.snackBar.open(error.error?.message || 'Erreur lors de la mise à jour', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.saving = false;
        }
      });
    }
  }
}
