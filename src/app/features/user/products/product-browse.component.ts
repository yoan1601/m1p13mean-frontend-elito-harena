import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TablerIconsModule } from 'angular-tabler-icons';

import { ProductService, CartService, CategoryService } from 'src/app/core/services';
import { Product, ProductFilterParams, PaginationMeta, Category } from 'src/app/core/models';

/**
 * Product Browse Component
 * Displays products for USER role with Add to Cart functionality.
 * Access: USER role
 */
@Component({
  selector: 'app-product-browse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatDialogModule,
    TablerIconsModule,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Parcourir les Produits</h1>
          <p class="text-gray-500 mt-1">Découvrez notre sélection de produits</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/user/cart">
          <span class="flex items-center">
            <i-tabler name="shopping-cart" class="icon-18 mr-2"></i-tabler>
            Panier
            @if (cartCount > 0) {
              <span class="ml-2 bg-white text-primary px-2 py-0.5 rounded-full text-sm font-bold">
                {{ cartCount }}
              </span>
            }
          </span>
        </button>
      </div>

      <!-- Filters -->
      <mat-card class="mat-elevation-z2 mb-6">
        <mat-card-content class="p-4">
          <div class="flex flex-nowrap gap-4 items-center">
            <mat-form-field appearance="outline" class="search-field" subscriptSizing="dynamic">
              <mat-label>Rechercher</mat-label>
              <input matInput [(ngModel)]="searchQuery" 
                     placeholder="Nom du produit..."
                     (keyup.enter)="loadProducts()">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="category-field" subscriptSizing="dynamic">
              <mat-label>Catégorie</mat-label>
              <mat-select [(ngModel)]="categoryFilter" (selectionChange)="loadProducts()">
                <mat-option value="">Toutes</mat-option>
                @for (cat of categories; track cat._id) {
                  <mat-option [value]="cat.code">{{ cat.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <button mat-stroked-button (click)="loadProducts()">
              <span class="flex items-center">
                <i-tabler name="refresh" class="icon-18 mr-2"></i-tabler>
                Rechercher
              </span>
            </button>

            @if (searchQuery || categoryFilter) {
              <button mat-button color="warn" (click)="clearFilters()">
                <span class="flex items-center">
                  <i-tabler name="x" class="icon-18 mr-1"></i-tabler>
                  Effacer
                </span>
              </button>
            }
          </div>
        </mat-card-content>
      </mat-card>

      @if (loading) {
        <div class="flex justify-center items-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (products.length === 0) {
        <!-- No Products -->
        <mat-card class="mat-elevation-z2">
          <mat-card-content class="p-8 text-center">
            <div class="flex flex-col items-center gap-4">
              <div class="p-6 rounded-full bg-gray-100">
                <i-tabler name="package-off" class="icon-48 text-gray-400"></i-tabler>
              </div>
              <h3 class="text-xl font-medium text-gray-700">Aucun produit trouvé</h3>
              <p class="text-gray-500">Essayez de modifier vos critères de recherche</p>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of products; track product._id) {
            <mat-card class="mat-elevation-z2 product-card hover:shadow-lg transition-shadow">
              <!-- Product Image -->
              <div class="product-image-container">
                @if (product.imagePaths && product.imagePaths.length > 0) {
                  <img [src]="product.imagePaths[0]" [alt]="product.name" class="product-image">
                } @else {
                  <div class="product-image-placeholder">
                    <i-tabler name="package" class="icon-48 text-gray-400"></i-tabler>
                  </div>
                }
                @if (product.stock < 5 && product.stock > 0) {
                  <span class="stock-badge low-stock">Stock limité</span>
                } @else if (product.stock === 0) {
                  <span class="stock-badge out-of-stock">Rupture</span>
                }
              </div>

              <mat-card-content class="p-4">
                <!-- Categories -->
                @if (product.categories && product.categories.length > 0) {
                  <div class="flex flex-wrap gap-1 mb-2">
                    @for (cat of product.categories.slice(0, 2); track cat) {
                      <mat-chip class="category-chip">{{ cat }}</mat-chip>
                    }
                  </div>
                }

                <!-- Product Name -->
                <h3 class="font-medium text-gray-800 truncate mb-1" [title]="product.name">
                  {{ product.name }}
                </h3>

                <!-- Description -->
                @if (product.description) {
                  <p class="text-gray-500 text-sm line-clamp-2 mb-2">
                    {{ product.description }}
                  </p>
                }

                <!-- Price & Stock -->
                <div class="flex justify-between items-center mt-3">
                  <span class="text-xl font-bold text-primary">
                    {{ product.price | number }} {{ product.currency }}
                  </span>
                  <span class="text-sm text-gray-500">
                    Stock: {{ product.stock }}
                  </span>
                </div>
              </mat-card-content>

              <mat-card-actions class="p-4 pt-0">
                <div class="flex gap-2 w-full">
                  @if (product.stock > 0) {
                    <div class="flex items-center gap-2 flex-1">
                      <button mat-icon-button 
                              [disabled]="getQuantityForProduct(product._id) <= 1"
                              (click)="decrementQuantity(product._id)">
                        <i-tabler name="minus" class="icon-18"></i-tabler>
                      </button>
                      <span class="w-8 text-center">{{ getQuantityForProduct(product._id) }}</span>
                      <button mat-icon-button 
                              [disabled]="getQuantityForProduct(product._id) >= product.stock"
                              (click)="incrementQuantity(product._id)">
                        <i-tabler name="plus" class="icon-18"></i-tabler>
                      </button>
                    </div>
                    <button mat-raised-button 
                            color="primary"
                            [disabled]="addingToCart === product._id"
                            (click)="addToCart(product)">
                      <span class="flex items-center">
                        @if (addingToCart === product._id) {
                          <mat-spinner diameter="18" class="inline-block"></mat-spinner>
                        } @else {
                          <i-tabler name="shopping-cart-plus" class="icon-18 mr-1"></i-tabler>
                          Ajouter
                        }
                      </span>
                    </button>
                  } @else {
                    <button mat-raised-button disabled class="w-full">
                      <span class="flex items-center">
                        <i-tabler name="shopping-cart-off" class="icon-18 mr-1"></i-tabler>
                        Indisponible
                      </span>
                    </button>
                  }
                </div>
              </mat-card-actions>
            </mat-card>
          }
        </div>

        <!-- Pagination -->
        <mat-paginator
          [length]="pagination.totalItems"
          [pageSize]="pagination.limit"
          [pageIndex]="pagination.page - 1"
          [pageSizeOptions]="[12, 24, 48]"
          (page)="onPageChange($event)"
          showFirstLastButtons
          class="mt-6">
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .icon-18 { width: 18px; height: 18px; }
    .icon-48 { width: 48px; height: 48px; }
    
    .search-field { min-width: 250px; }
    .category-field { min-width: 180px; }
    
    .product-card {
      display: flex;
      flex-direction: column;
    }
    
    .product-image-container {
      position: relative;
      height: 200px;
      background-color: #f5f5f5;
      overflow: hidden;
    }
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .product-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f0f0f0;
    }
    
    .stock-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .low-stock {
      background-color: #fff3e0;
      color: #f57c00;
    }
    
    .out-of-stock {
      background-color: #ffebee;
      color: #d32f2f;
    }
    
    .category-chip {
      font-size: 11px !important;
      min-height: 24px !important;
      padding: 0 8px !important;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    mat-card-actions {
      margin-top: auto !important;
    }
  `]
})
export class ProductBrowseComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  searchQuery = '';
  categoryFilter = '';
  addingToCart: string | null = null;
  cartCount = 0;

  // Track quantities per product for add to cart
  productQuantities: Map<string, number> = new Map();
  
  pagination: PaginationMeta = {
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.subscribeToCartCount();
    
    // Load initial cart count
    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToCartCount(): void {
    this.cartService.cartCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.cartCount = count;
      });
  }

  loadProducts(): void {
    this.loading = true;
    const filters: ProductFilterParams = {
      page: this.pagination.page,
      limit: this.pagination.limit,
      status: 'PUBLISHED',
      inStock: true
    };

    if (this.searchQuery) {
      filters.search = this.searchQuery;
    }

    if (this.categoryFilter) {
      filters.category = this.categoryFilter;
    }

    this.productService.getAll(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.products = response.data;
          this.pagination = response.pagination;
          this.loading = false;
          
          // Initialize quantities for new products
          this.products.forEach(p => {
            if (!this.productQuantities.has(p._id)) {
              this.productQuantities.set(p._id, 1);
            }
          });
        },
        error: (error) => {
          this.loading = false;
          this.showError('Erreur lors du chargement des produits');
        }
      });
  }

  loadCategories(): void {
    this.categoryService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        }
      });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.categoryFilter = '';
    this.pagination.page = 1;
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.limit = event.pageSize;
    this.loadProducts();
  }

  getQuantityForProduct(productId: string): number {
    return this.productQuantities.get(productId) || 1;
  }

  incrementQuantity(productId: string): void {
    const current = this.getQuantityForProduct(productId);
    this.productQuantities.set(productId, current + 1);
  }

  decrementQuantity(productId: string): void {
    const current = this.getQuantityForProduct(productId);
    if (current > 1) {
      this.productQuantities.set(productId, current - 1);
    }
  }

  addToCart(product: Product): void {
    const quantity = this.getQuantityForProduct(product._id);
    
    this.addingToCart = product._id;
    this.cartService.addItem({ productId: product._id, quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.addingToCart = null;
          this.productQuantities.set(product._id, 1); // Reset quantity
          this.showSuccess(`${product.name} ajouté au panier`);
        },
        error: (error) => {
          this.addingToCart = null;
          this.showError(error.error?.error || 'Erreur lors de l\'ajout au panier');
        }
      });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Voir le panier', {
      duration: 3000,
      panelClass: 'success-snackbar'
    }).onAction().subscribe(() => {
      // Navigate to cart when clicking action
      window.location.href = '/user/cart';
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }
}
