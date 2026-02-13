import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Product, ProductCreatePayload, ProductUpdatePayload, Category, ProductStatus, Currency } from 'src/app/core/models';
import { ProductService, CategoryService } from 'src/app/core/services';

export interface ProductFormDialogData {
  mode: 'create' | 'edit';
  product?: Product;
  shopId: string;
}

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'create' ? 'Nouveau Produit' : 'Modifier le Produit' }}
    </h2>
    
    <mat-dialog-content>
      <form [formGroup]="form" class="product-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom du produit</mat-label>
          <input matInput formControlName="name" placeholder="Ex: Sneakers Nike Air">
          @if (form.get('name')?.hasError('required')) {
            <mat-error>Le nom est obligatoire</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" 
                    rows="3" 
                    placeholder="Description du produit"></textarea>
        </mat-form-field>

        <div class="price-row">
          <mat-form-field appearance="outline">
            <mat-label>Prix</mat-label>
            <input matInput type="number" formControlName="price" min="0">
            @if (form.get('price')?.hasError('required')) {
              <mat-error>Le prix est obligatoire</mat-error>
            }
            @if (form.get('price')?.hasError('min')) {
              <mat-error>Le prix doit être positif</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Devise</mat-label>
            <mat-select formControlName="currency">
              <mat-option value="MGA">MGA</mat-option>
              <mat-option value="USD">USD</mat-option>
              <mat-option value="EUR">EUR</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Stock</mat-label>
            <input matInput type="number" formControlName="stock" min="0">
            @if (form.get('stock')?.hasError('min')) {
              <mat-error>Le stock doit être positif</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Catégories</mat-label>
          <mat-select formControlName="categories" multiple>
            @for (category of categories; track category._id) {
              <mat-option [value]="category.code">{{ category.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status">
            <mat-option value="DRAFT">Brouillon</mat-option>
            <mat-option value="PUBLISHED">Publié</mat-option>
            <mat-option value="INACTIVE">Inactif</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="image-upload">
          <label class="upload-label">Images du produit</label>
          <div class="upload-area" (click)="fileInput.click()">
            @if (imagePreviews.length > 0) {
              <div class="preview-container">
                @for (preview of imagePreviews; track preview; let i = $index) {
                  <div class="preview-item">
                    <img [src]="preview" alt="Preview" class="preview-image">
                    <button mat-icon-button class="remove-btn" (click)="removeImage(i, $event)">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }
              </div>
            } @else {
              <mat-icon>cloud_upload</mat-icon>
              <span>Cliquez pour télécharger des images</span>
            }
          </div>
          <input #fileInput type="file" accept="image/*" multiple
                 (change)="onFilesSelected($event)" hidden>
        </div>
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
    .product-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
      max-height: 60vh;
      overflow-y: auto;
    }

    .full-width {
      width: 100%;
    }

    .price-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
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
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s;
      min-height: 100px;
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

    .preview-container {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }

    .preview-item {
      position: relative;
    }

    .preview-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
    }

    .remove-btn {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      background-color: #f44336;
      color: white;
    }

    .remove-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    mat-dialog-actions button {
      min-width: 100px;
    }

    mat-spinner {
      display: inline-block;
    }
  `]
})
export class ProductFormDialogComponent implements OnInit {
  form: FormGroup;
  saving = false;
  categories: Category[] = [];
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductFormDialogData
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      currency: ['MGA'],
      stock: [0, Validators.min(0)],
      categories: [[]],
      status: ['DRAFT']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    if (this.data.mode === 'edit' && this.data.product) {
      this.form.patchValue({
        name: this.data.product.name,
        description: this.data.product.description || '',
        price: this.data.product.price,
        currency: this.data.product.currency,
        stock: this.data.product.stock,
        categories: this.data.product.categories || [],
        status: this.data.product.status
      });
      
      // Load existing images as previews
      if (this.data.product.imagePaths?.length > 0) {
        this.imagePreviews = [...this.data.product.imagePaths];
      }
    }
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories.filter(c => c.isActive && !c.deletedAt);
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        this.selectedFiles.push(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number, event: Event): void {
    event.stopPropagation();
    this.imagePreviews.splice(index, 1);
    if (index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
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
      const payload: ProductCreatePayload = {
        shopId: this.data.shopId,
        name: formValue.name,
        description: formValue.description || undefined,
        price: formValue.price,
        currency: formValue.currency as Currency,
        stock: formValue.stock,
        categories: formValue.categories,
        status: formValue.status as ProductStatus,
        images: this.selectedFiles.length > 0 ? this.selectedFiles : undefined
      };

      this.productService.create(payload).subscribe({
        next: () => {
          this.snackBar.open('Produit créé avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.snackBar.open(error.error?.message || 'Erreur lors de la création', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.saving = false;
        }
      });
    } else {
      const payload: ProductUpdatePayload = {
        name: formValue.name,
        description: formValue.description || undefined,
        price: formValue.price,
        currency: formValue.currency as Currency,
        stock: formValue.stock,
        categories: formValue.categories,
        status: formValue.status as ProductStatus,
        images: this.selectedFiles.length > 0 ? this.selectedFiles : undefined
      };

      this.productService.update(this.data.product!._id, payload).subscribe({
        next: () => {
          this.snackBar.open('Produit mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating product:', error);
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
