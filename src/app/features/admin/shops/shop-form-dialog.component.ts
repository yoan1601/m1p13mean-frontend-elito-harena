import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Shop, ShopCreatePayload, ShopUpdatePayload, Category, ShopUser } from 'src/app/core/models';
import { ShopService, CategoryService, UserService } from 'src/app/core/services';

export interface ShopFormDialogData {
  mode: 'create' | 'edit';
  shop?: Shop;
}

@Component({
  selector: 'app-shop-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'create' ? 'Nouvelle Boutique' : 'Modifier la Boutique' }}
    </h2>
    
    <mat-dialog-content>
      <form [formGroup]="form" class="shop-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom de la boutique</mat-label>
          <input matInput formControlName="name" placeholder="Ex: Nike Store">
          @if (form.get('name')?.hasError('required')) {
            <mat-error>Le nom est obligatoire</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" 
                    rows="3" 
                    placeholder="Description de la boutique"></textarea>
        </mat-form-field>

        <div class="location-row">
          <mat-form-field appearance="outline">
            <mat-label>Étage</mat-label>
            <input matInput type="number" formControlName="floor" min="0" max="10">
            @if (form.get('floor')?.hasError('required')) {
              <mat-error>Obligatoire</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Zone</mat-label>
            <input matInput formControlName="zone" placeholder="Ex: A12">
            @if (form.get('zone')?.hasError('required')) {
              <mat-error>Obligatoire</mat-error>
            }
            @if (form.get('zone')?.hasError('pattern')) {
              <mat-error>Format: A1 à Z999</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Propriétaire</mat-label>
          <mat-select formControlName="ownerId" placeholder="Sélectionner un propriétaire">
            @for (owner of availableOwners; track owner._id) {
              <mat-option [value]="owner._id">
                {{ owner.firstName || '' }} {{ owner.lastName || '' }} ({{ owner.email }})
              </mat-option>
            }
          </mat-select>
          @if (form.get('ownerId')?.hasError('required')) {
            <mat-error>Le propriétaire est obligatoire</mat-error>
          }
          @if (loadingOwners) {
            <mat-hint>Chargement des propriétaires...</mat-hint>
          }
        </mat-form-field>
                
        @if (!loadingOwners && availableOwners.length === 0) {
          <div class="no-owners-warning">
            <mat-icon>warning</mat-icon>
            <span>Aucun propriétaire disponible. Veuillez vous déconnecter puis créer un nouvel utilisateur de type "Propriétaire de Boutique" via la page d'inscription, ou ouvrir <a href="/authentication/register" target="_blank">ce lien</a> dans une fenêtre de navigation privée.</span>
          </div>
        }

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Catégories</mat-label>
          <mat-select formControlName="categories" multiple>
            @for (category of categories; track category._id) {
              <mat-option [value]="category.code">{{ category.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="image-upload">
          <label class="upload-label">Image de la boutique</label>
          <div class="upload-area" (click)="fileInput.click()">
            @if (imagePreview) {
              <img [src]="imagePreview" alt="Preview" class="preview-image">
            } @else {
              <mat-icon>cloud_upload</mat-icon>
              <span>Cliquez pour télécharger une image</span>
            }
          </div>
          <input #fileInput type="file" accept="image/*" 
                 (change)="onFileSelected($event)" hidden>
        </div>

        <mat-slide-toggle formControlName="isOpen" color="primary">
          Boutique ouverte
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
    .shop-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    .location-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .image-upload {
      margin: 8px 0;
    }

    .upload-label {
      display: block;
      margin-bottom: 8px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }

    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .upload-area:hover {
      border-color: #1976d2;
    }

    .upload-area mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #9e9e9e;
    }

    .upload-area span {
      display: block;
      margin-top: 8px;
      color: #9e9e9e;
    }

    .preview-image {
      max-width: 200px;
      max-height: 200px;
      border-radius: 8px;
    }

    .no-owners-warning {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      background-color: #fff3e0;
      border: 1px solid #ffb74d;
      border-radius: 8px;
      color: #e65100;
    }

    .no-owners-warning mat-icon {
      color: #ff9800;
      flex-shrink: 0;
    }

    .no-owners-warning a {
      color: #1976d2;
      text-decoration: underline;
      font-weight: 500;
.upload-area:hover {
      border-color: #1976d2;
    }

    .upload-area mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #9e9e9e;
    }

    .upload-area span {
      display: block;
      margin-top: 8px;
      color: #9e9e9e;
    }

    .preview-image {
      max-width: 200px;
      max-height: 200px;
      border-radius: 8px;
    }

    .no-owners-warning {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      background-color: #fff3e0;
      border: 1px solid #ffb74d;
      border-radius: 8px;
      color: #e65100;
    }

    .no-owners-warning mat-icon {
      color: #ff9800;
      flex-shrink: 0;
    }

    .no-owners-warning a {
      color: #1976d2;
      text-decoration: underline;
      font-weight: 500;
    }

    mat-dialog-actions button {
      min-width: 100px;
    }

    mat-spinner {
      display: inline-block;
    }
  `]
})
export class ShopFormDialogComponent implements OnInit {
  form: FormGroup;
  saving = false;
  categories: Category[] = [];
  availableOwners: ShopUser[] = [];
  loadingOwners = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private categoryService: CategoryService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ShopFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShopFormDialogData
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      floor: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      zone: ['', [Validators.required, Validators.pattern(/^[A-Z]\d{1,3}$/)]],
      ownerId: ['', Validators.required],
      categories: [[]],
      isOpen: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadAvailableOwners();
    
    if (this.data.mode === 'edit' && this.data.shop) {
      this.form.patchValue({
        name: this.data.shop.name,
        description: this.data.shop.description || '',
        floor: this.data.shop.location.floor,
        zone: this.data.shop.location.zone,
        ownerId: this.data.shop.ownerId,
        categories: this.data.shop.categories || [],
        isOpen: this.data.shop.isOpen
      });
      
      if (this.data.shop.imagePath) {
        this.imagePreview = this.data.shop.imagePath;
      }
    }
  }

  loadAvailableOwners(): void {
    this.loadingOwners = true;
    this.userService.getShopUsers().subscribe({
      next: (users) => {
        // Filter to only show users without a shop assigned
        // In edit mode, also include the current owner
        const currentOwnerId = this.data.mode === 'edit' ? this.data.shop?.ownerId : null;
        this.availableOwners = users.filter(
          user => user.totalShops === 0 || user._id === currentOwnerId
        );
        this.loadingOwners = false;
      },
      error: (error) => {
        console.error('Error loading available owners:', error);
        this.loadingOwners = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories.filter(c => c.isActive && !c.deletedAt);
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
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
      const payload: ShopCreatePayload = {
        name: formValue.name,
        description: formValue.description || undefined,
        location: {
          floor: formValue.floor,
          zone: formValue.zone.toUpperCase()
        },
        ownerId: formValue.ownerId,
        categories: formValue.categories,
        isOpen: formValue.isOpen,
        image: this.selectedFile || undefined
      };

      this.shopService.create(payload).subscribe({
        next: () => {
          this.snackBar.open('Boutique créée avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating shop:', error);
          this.snackBar.open(error.error?.message || 'Erreur lors de la création', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.saving = false;
        }
      });
    } else {
      const payload: ShopUpdatePayload = {
        name: formValue.name,
        description: formValue.description || undefined,
        location: {
          floor: formValue.floor,
          zone: formValue.zone.toUpperCase()
        },
        ownerId: formValue.ownerId,
        categories: formValue.categories,
        isOpen: formValue.isOpen,
        image: this.selectedFile || undefined
      };

      this.shopService.update(this.data.shop!._id, payload).subscribe({
        next: () => {
          this.snackBar.open('Boutique mise à jour avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating shop:', error);
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
