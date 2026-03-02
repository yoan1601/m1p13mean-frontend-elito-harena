import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

import { TablerIconsModule } from 'angular-tabler-icons';

import { OrderService } from 'src/app/core/services';
import { Order, OrderStatus, OrderFilterParams, PaginationMeta } from 'src/app/core/models';

/**
 * User Orders Component
 * Displays order history for USER role.
 * Access: USER role only
 */
@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDividerModule,
    TablerIconsModule,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Mes Commandes</h1>
        <p class="text-gray-500 mt-1">Suivez l'état de vos commandes</p>
      </div>

      <!-- Filters -->
      <mat-card class="mat-elevation-z2 mb-6">
        <mat-card-content class="p-4">
          <div class="flex flex-nowrap gap-4 items-center">
            <mat-form-field appearance="outline" class="status-filter" subscriptSizing="dynamic">
              <mat-label>Statut</mat-label>
              <mat-select [(ngModel)]="statusFilter" (selectionChange)="loadOrders()">
                <mat-option value="">Tous</mat-option>
                <mat-option value="CONFIRMED">Confirmée</mat-option>
                <mat-option value="PREPARING">En préparation</mat-option>
                <mat-option value="READY">Prête</mat-option>
                <mat-option value="DELIVERED">Livrée</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-stroked-button (click)="loadOrders()">
              <span class="flex items-center">
                <i-tabler name="refresh" class="icon-18 mr-2"></i-tabler>
                Actualiser
              </span>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      @if (loading) {
        <div class="flex justify-center items-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (orders.length === 0) {
        <!-- No Orders -->
        <mat-card class="mat-elevation-z2">
          <mat-card-content class="p-8 text-center">
            <div class="flex flex-col items-center gap-4">
              <div class="p-6 rounded-full bg-gray-100">
                <i-tabler name="package-off" class="icon-48 text-gray-400"></i-tabler>
              </div>
              <h3 class="text-xl font-medium text-gray-700">Aucune commande</h3>
              <p class="text-gray-500">Vous n'avez pas encore passé de commande</p>
              <button mat-raised-button color="primary" routerLink="/user/products">
                <span class="flex items-center">
                  <i-tabler name="shopping-bag" class="icon-18 mr-2"></i-tabler>
                  Commencer vos Achats
                </span>
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <!-- Orders List -->
        <div class="space-y-4">
          @for (order of orders; track order._id) {
            <mat-card class="mat-elevation-z2">
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                      <i-tabler name="package" class="icon-20"></i-tabler>
                      <span class="font-medium">{{ order._id | slice:-8 | uppercase }}</span>
                    </div>
                    <mat-chip [ngClass]="getStatusClass(order.status)">
                      {{ getStatusLabel(order.status) }}
                    </mat-chip>
                  </mat-panel-title>
                  <mat-panel-description class="flex items-center gap-4">
                    <span>{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                    <span class="font-semibold text-primary">{{ order.totalAmount | number }} {{ order.currency }}</span>
                  </mat-panel-description>
                </mat-expansion-panel-header>

                <div class="p-4">
                  <h4 class="font-medium text-gray-700 mb-3">Articles ({{ order.items.length }})</h4>
                  <div class="space-y-2">
                    @for (item of order.items; track item.productId) {
                      <div class="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <i-tabler name="package" class="icon-18 text-gray-500"></i-tabler>
                          </div>
                          <div>
                            <p class="font-medium">{{ item.nameSnapshot }}</p>
                            <p class="text-sm text-gray-500">Qté: {{ item.quantity }} × {{ item.priceSnapshot | number }} {{ order.currency }}</p>
                          </div>
                        </div>
                        <span class="font-semibold">{{ item.quantity * item.priceSnapshot | number }} {{ order.currency }}</span>
                      </div>
                    }
                  </div>

                  <mat-divider class="my-4"></mat-divider>

                  <div class="flex justify-between items-center">
                    <div class="text-gray-600">
                      <p>Créée le: {{ order.createdAt | date:'dd MMMM yyyy à HH:mm' }}</p>
                      <p>Dernière mise à jour: {{ order.updatedAt | date:'dd MMMM yyyy à HH:mm' }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-gray-500">Total</p>
                      <p class="text-2xl font-bold text-primary">{{ order.totalAmount | number }} {{ order.currency }}</p>
                    </div>
                  </div>
                </div>
              </mat-expansion-panel>
            </mat-card>
          }
        </div>

        <!-- Pagination -->
        <mat-paginator
          [length]="pagination.totalItems"
          [pageSize]="pagination.limit"
          [pageIndex]="pagination.page - 1"
          [pageSizeOptions]="[5, 10, 25]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .icon-18 { width: 18px; height: 18px; }
    .icon-20 { width: 20px; height: 20px; }
    .icon-48 { width: 48px; height: 48px; }
    
    .status-filter {
      min-width: 200px;
    }
    
    .status-confirmed { 
      background-color: #e3f2fd !important; 
      color: #1976d2 !important; 
    }
    .status-preparing { 
      background-color: #fff3e0 !important; 
      color: #f57c00 !important; 
    }
    .status-ready { 
      background-color: #e8f5e9 !important; 
      color: #388e3c !important; 
    }
    .status-delivered { 
      background-color: #e0f2f1 !important; 
      color: #00796b !important; 
    }
    
    mat-expansion-panel {
      box-shadow: none !important;
    }
  `]
})
export class UserOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  statusFilter = '';
  
  pagination: PaginationMeta = {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.loading = true;
    const filters: OrderFilterParams = {
      page: this.pagination.page,
      limit: this.pagination.limit,
      sortBy: 'createdAt',
      order: 'desc'
    };

    if (this.statusFilter) {
      filters.status = this.statusFilter as OrderStatus;
    }

    this.orderService.getUserOrders(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.orders = response.data;
          this.pagination = response.pagination;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.showError('Erreur lors du chargement des commandes');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.limit = event.pageSize;
    this.loadOrders();
  }

  getStatusLabel(status: OrderStatus): string {
    return this.orderService.getStatusLabel(status);
  }

  getStatusClass(status: OrderStatus): string {
    return this.orderService.getStatusColor(status);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }
}
