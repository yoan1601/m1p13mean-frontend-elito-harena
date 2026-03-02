import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';

import { Product, ProductFilterParams, ProductStatus } from 'src/app/core/models';
import { ProductService, ShopService } from 'src/app/core/services';
import { AuthService } from 'src/app/core/services';
import { ProductFormDialogComponent } from './product-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TablerIconsModule,
  ],
  template: `
    <div class="product-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Produits</mat-card-title>
          <mat-card-subtitle>Liste de tous vos produits</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="toolbar">
            <div class="filters">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Rechercher</mat-label>
                <input matInput [(ngModel)]="searchQuery" 
                       placeholder="Nom du produit..."
                       (keyup.enter)="loadProducts()">
              </mat-form-field>

              <mat-form-field appearance="outline" class="status-field">
                <mat-label>Statut</mat-label>
                <mat-select [(ngModel)]="statusFilter" (selectionChange)="loadProducts()">
                  <mat-option value="">Tous</mat-option>
                  <mat-option value="DRAFT">Brouillon</mat-option>
                  <mat-option value="PUBLISHED">Publié</mat-option>
                  <mat-option value="INACTIVE">Inactif</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <span class="btn-content">
                <i-tabler name="plus" class="icon-18"></i-tabler>
                Nouveau Produit
              </span>
            </button>
          </div>

          <div class="table-container">
            @if (loading) {
              <div class="loading-spinner">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
            }

            <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z0">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Produit</th>
                <td mat-cell *matCellDef="let product">
                  <div class="product-name">
                    @if (product.imagePaths?.length > 0) {
                      <img [src]="product.imagePaths[0]" alt="Product" class="product-image">
                    } @else {
                      <div class="product-image-placeholder">
                        <i-tabler name="package" class="icon-24"></i-tabler>
                      </div>
                    }
                    <div class="product-info">
                      <span class="name">{{ product.name }}</span>
                      <span class="description">{{ product.description | slice:0:50 }}{{ product.description?.length > 50 ? '...' : '' }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Price Column -->
              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Prix</th>
                <td mat-cell *matCellDef="let product">
                  <span class="price">{{ product.price | number }} {{ product.currency }}</span>
                </td>
              </ng-container>

              <!-- Stock Column -->
              <ng-container matColumnDef="stock">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock</th>
                <td mat-cell *matCellDef="let product">
                  <span [class.low-stock]="product.stock < 10">{{ product.stock }}</span>
                </td>
              </ng-container>

              <!-- Categories Column -->
              <ng-container matColumnDef="categories">
                <th mat-header-cell *matHeaderCellDef>Catégories</th>
                <td mat-cell *matCellDef="let product">
                  <div class="categories-chips">
                    @for (cat of product.categories?.slice(0, 2); track cat) {
                      <mat-chip>{{ cat }}</mat-chip>
                    }
                    @if (product.categories?.length > 2) {
                      <mat-chip>+{{ product.categories.length - 2 }}</mat-chip>
                    }
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
                <td mat-cell *matCellDef="let product">
                  <mat-chip [ngClass]="getStatusClass(product.status)">
                    {{ getStatusLabel(product.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date de création</th>
                <td mat-cell *matCellDef="let product">
                  {{ product.createdAt | date:'dd/MM/yyyy' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let product">
                  <button mat-icon-button color="primary" 
                          matTooltip="Modifier"
                          (click)="openEditDialog(product)">
                    <i-tabler name="edit" class="icon-18"></i-tabler>
                  </button>
                  @if (product.status === 'DRAFT') {
                    <button mat-icon-button color="accent" 
                            matTooltip="Publier"
                            (click)="publishProduct(product)">
                      <i-tabler name="send" class="icon-18"></i-tabler>
                    </button>
                  }
                  @if (product.status === 'PUBLISHED') {
                    <button mat-icon-button 
                            matTooltip="Désactiver"
                            (click)="deactivateProduct(product)">
                      <i-tabler name="eye-off" class="icon-18"></i-tabler>
                    </button>
                  }
                  <button mat-icon-button color="warn" 
                          matTooltip="Supprimer"
                          (click)="openDeleteDialog(product)"
                          [disabled]="product.deletedAt !== null">
                    <i-tabler name="trash" class="icon-18"></i-tabler>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                  [class.deleted-row]="row.deletedAt !== null"></tr>
            </table>

            @if (!loading && dataSource.data.length === 0) {
              <div class="no-data">
                <i-tabler name="package-off" class="icon-48"></i-tabler>
                <p>Aucun produit trouvé</p>
                <button mat-stroked-button color="primary" (click)="openCreateDialog()">
                  Ajouter votre premier produit
                </button>
              </div>
            }
          </div>

          <mat-paginator [length]="totalItems"
                         [pageSize]="pageSize"
                         [pageSizeOptions]="[5, 10, 25, 50]"
                         [pageIndex]="currentPage - 1"
                         (page)="onPageChange($event)"
                         showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 24px;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .search-field {
      width: 300px;
    }

    .status-field {
      width: 150px;
    }

    .table-container {
      position: relative;
      min-height: 200px;
      overflow-x: auto;
    }

    .loading-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }

    table {
      width: 100%;
    }

    .product-name {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .product-image, .product-image-placeholder {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      object-fit: cover;
    }

    .product-image-placeholder {
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9e9e9e;
    }

    .product-info {
      display: flex;
      flex-direction: column;
    }

    .product-info .name {
      font-weight: 500;
    }

    .product-info .description {
      font-size: 12px;
      color: #757575;
    }

    .price {
      font-weight: 600;
      color: #4caf50;
    }

    .low-stock {
      color: #f44336;
      font-weight: 600;
    }

    .categories-chips {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .status-draft {
      background-color: #fff3e0 !important;
      color: #e65100 !important;
    }

    .status-published {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }

    .status-inactive {
      background-color: #fafafa !important;
      color: #757575 !important;
    }

    .deleted-row {
      opacity: 0.5;
      background-color: #ffebee;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #9e9e9e;
    }

    .no-data p {
      margin: 16px 0;
    }

    .icon-18 {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .icon-24 {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .icon-48 {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ProductListComponent implements OnInit {
  displayedColumns = ['name', 'price', 'stock', 'categories', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  loading = false;
  searchQuery = '';
  statusFilter = '';
  shopId: string | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private shopService: ShopService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get the shop ID by finding the shop where current user is the owner
    const user = this.authService.currentUser();
    if (user?.id) {
      this.shopService.getAll({ ownerId: user.id }).subscribe({
        next: (response) => {
          if (response.data && response.data.length > 0) {
            this.shopId = response.data[0]._id;
            this.loadProducts();
          } else {
            this.snackBar.open('Aucune boutique trouvée pour cet utilisateur', 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Error loading shop:', error);
          this.snackBar.open('Erreur lors du chargement de la boutique', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
    } else {
      this.snackBar.open('Utilisateur non authentifié', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.loading = false;
    }
  }

  loadProducts(): void {
    this.loading = true;
    const filters: ProductFilterParams = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchQuery || undefined,
      status: (this.statusFilter as ProductStatus) || undefined,
      shopId: this.shopId || undefined
    };

    this.productService.getAll(filters).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalItems = response.pagination.totalItems;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  getStatusClass(status: ProductStatus): string {
    switch (status) {
      case 'DRAFT': return 'status-draft';
      case 'PUBLISHED': return 'status-published';
      case 'INACTIVE': return 'status-inactive';
      default: return '';
    }
  }

  getStatusLabel(status: ProductStatus): string {
    switch (status) {
      case 'DRAFT': return 'Brouillon';
      case 'PUBLISHED': return 'Publié';
      case 'INACTIVE': return 'Inactif';
      default: return status;
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { mode: 'create', shopId: this.shopId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { mode: 'edit', product, shopId: this.shopId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  openDeleteDialog(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer le produit',
        message: `Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteProduct(product);
      }
    });
  }

  publishProduct(product: Product): void {
    this.productService.update(product._id, { status: 'PUBLISHED' }).subscribe({
      next: () => {
        this.snackBar.open('Produit publié avec succès', 'Fermer', { duration: 3000 });
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error publishing product:', error);
        this.snackBar.open('Erreur lors de la publication', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deactivateProduct(product: Product): void {
    this.productService.update(product._id, { status: 'INACTIVE' }).subscribe({
      next: () => {
        this.snackBar.open('Produit désactivé', 'Fermer', { duration: 3000 });
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deactivating product:', error);
        this.snackBar.open('Erreur lors de la désactivation', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteProduct(product: Product): void {
    this.productService.delete(product._id).subscribe({
      next: () => {
        this.snackBar.open('Produit supprimé avec succès', 'Fermer', {
          duration: 3000
        });
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
