import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TablerIconsModule } from 'angular-tabler-icons';

import { CartService } from 'src/app/core/services';
import { Cart, CartShop, CartItem } from 'src/app/core/models';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

/**
 * Cart Page Component
 * Displays user's shopping cart grouped by shop.
 * Access: USER role only
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatChipsModule,
    MatDialogModule,
    TablerIconsModule,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Mon Panier</h1>
        <p class="text-gray-500 mt-1">Gérez vos articles avant de passer commande</p>
      </div>

      @if (loading) {
        <div class="flex justify-center items-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (cart.shops.length === 0) {
        <!-- Empty Cart -->
        <mat-card class="mat-elevation-z2">
          <mat-card-content class="p-8 text-center">
            <div class="flex flex-col items-center gap-4">
              <div class="p-6 rounded-full bg-gray-100">
                <i-tabler name="shopping-cart-off" class="icon-48 text-gray-400"></i-tabler>
              </div>
              <h3 class="text-xl font-medium text-gray-700">Votre panier est vide</h3>
              <p class="text-gray-500">Parcourez nos boutiques pour trouver des produits</p>
              <button mat-raised-button color="primary" routerLink="/user/products">
                <span class="flex items-center">
                  <i-tabler name="shopping-bag" class="icon-18 mr-2"></i-tabler>
                  Parcourir les Produits
                </span>
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Cart Items grouped by Shop -->
          <div class="lg:col-span-2 space-y-4">
            @for (shop of cart.shops; track shop.shopId) {
              <mat-card class="mat-elevation-z2">
                <mat-card-header class="bg-gray-50 p-4">
                  <mat-card-title class="flex items-center gap-2">
                    <i-tabler name="building-store" class="icon-20"></i-tabler>
                    {{ shop.shopName }}
                  </mat-card-title>
                  <mat-card-subtitle>{{ shop.items.length }} article(s)</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content class="p-0">
                  @for (item of shop.items; track item.productId; let last = $last) {
                    <div class="p-4 flex items-center gap-4">
                      <!-- Product Image Placeholder -->
                      <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i-tabler name="package" class="icon-24 text-gray-400"></i-tabler>
                      </div>

                      <!-- Product Info -->
                      <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-800 truncate">{{ item.name }}</h4>
                        <p class="text-primary font-semibold">{{ item.price | number }} MGA</p>
                      </div>

                      <!-- Quantity Controls -->
                      <div class="flex items-center gap-2">
                        <button mat-icon-button 
                                color="primary"
                                [disabled]="item.quantity <= 1 || updatingItem === item.productId"
                                (click)="updateQuantity(item.productId, item.quantity - 1)">
                          <i-tabler name="minus" class="icon-18"></i-tabler>
                        </button>
                        <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                        <button mat-icon-button 
                                color="primary"
                                [disabled]="updatingItem === item.productId"
                                (click)="updateQuantity(item.productId, item.quantity + 1)">
                          <i-tabler name="plus" class="icon-18"></i-tabler>
                        </button>
                      </div>

                      <!-- Subtotal -->
                      <div class="text-right w-28">
                        <p class="font-semibold text-gray-800">{{ item.subtotal | number }} MGA</p>
                      </div>

                      <!-- Remove Button -->
                      <button mat-icon-button 
                              color="warn"
                              [disabled]="updatingItem === item.productId"
                              (click)="removeItem(item.productId, item.name)">
                        <i-tabler name="trash" class="icon-18"></i-tabler>
                      </button>
                    </div>
                    @if (!last) {
                      <mat-divider></mat-divider>
                    }
                  }
                </mat-card-content>
                <mat-card-actions class="bg-gray-50 p-4 flex justify-between items-center">
                  <span class="text-gray-600">Sous-total boutique</span>
                  <span class="font-bold text-lg">{{ shop.shopTotal | number }} MGA</span>
                </mat-card-actions>
              </mat-card>
            }
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <mat-card class="mat-elevation-z2 sticky top-4">
              <mat-card-header>
                <mat-card-title>Récapitulatif</mat-card-title>
              </mat-card-header>
              <mat-card-content class="p-4">
                <div class="space-y-3">
                  @for (shop of cart.shops; track shop.shopId) {
                    <div class="flex justify-between text-gray-600">
                      <span>{{ shop.shopName }}</span>
                      <span>{{ shop.shopTotal | number }} MGA</span>
                    </div>
                  }
                  <mat-divider></mat-divider>
                  <div class="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span class="text-primary">{{ cart.total | number }} MGA</span>
                  </div>
                </div>
              </mat-card-content>
              <mat-card-actions class="p-4 flex flex-col gap-2">
                <button mat-raised-button 
                        color="primary" 
                        class="w-full"
                        [disabled]="confirming || cart.shops.length === 0"
                        (click)="confirmOrder()">
                  <span class="flex items-center justify-center">
                    @if (confirming) {
                      <mat-spinner diameter="20" class="inline-block mr-2"></mat-spinner>
                    } @else {
                      <i-tabler name="check" class="icon-18 mr-2"></i-tabler>
                    }
                    Confirmer la Commande
                  </span>
                </button>
                <button mat-stroked-button 
                        color="warn" 
                        class="w-full"
                        [disabled]="confirming"
                        (click)="clearCart()">
                  <span class="flex items-center justify-center">
                    <i-tabler name="trash" class="icon-18 mr-2"></i-tabler>
                    Vider le Panier
                  </span>
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .icon-18 { width: 18px; height: 18px; }
    .icon-20 { width: 20px; height: 20px; }
    .icon-24 { width: 24px; height: 24px; }
    .icon-48 { width: 48px; height: 48px; }
    
    mat-card-header {
      display: flex;
      align-items: center;
    }
    
    mat-card-actions {
      margin: 0 !important;
      padding: 16px !important;
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = { shops: [], total: 0 };
  loading = true;
  confirming = false;
  updatingItem: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          this.cart = cart;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.showError('Erreur lors du chargement du panier');
        }
      });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;
    
    this.updatingItem = productId;
    this.cartService.updateQuantity(productId, quantity)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          this.cart = cart;
          this.updatingItem = null;
        },
        error: (error) => {
          this.updatingItem = null;
          this.showError(error.error?.error || 'Erreur lors de la mise à jour');
        }
      });
  }

  removeItem(productId: string, productName: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer l\'article',
        message: `Voulez-vous supprimer "${productName}" du panier ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatingItem = productId;
        this.cartService.removeItem(productId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (cart) => {
              this.cart = cart;
              this.updatingItem = null;
              this.showSuccess('Article supprimé du panier');
            },
            error: (error) => {
              this.updatingItem = null;
              this.showError('Erreur lors de la suppression');
            }
          });
      }
    });
  }

  clearCart(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Vider le panier',
        message: 'Voulez-vous vraiment vider tout le panier ?',
        confirmText: 'Vider',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.clearCart()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (cart) => {
              this.cart = cart;
              this.showSuccess('Panier vidé');
            },
            error: (error) => {
              this.showError('Erreur lors de la suppression');
            }
          });
      }
    });
  }

  confirmOrder(): void {
    if (this.cart.shops.length === 0) {
      this.showError('Le panier est vide');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la commande',
        message: `Confirmer la commande de ${this.cart.total.toLocaleString()} MGA ?`,
        confirmText: 'Confirmer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirming = true;
        this.cartService.confirmOrder()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.confirming = false;
              this.cart = { shops: [], total: 0 };
              this.showSuccess('Commande confirmée avec succès !');
              this.router.navigate(['/user/orders']);
            },
            error: (error) => {
              this.confirming = false;
              this.showError(error.error?.error || 'Erreur lors de la confirmation');
            }
          });
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: 'success-snackbar'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }
}
