import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { TablerIconsModule } from 'angular-tabler-icons';

import { OrderService } from 'src/app/core/services';
import { Order, OrderStatus, OrderFilterParams, PaginationMeta, ValidStatusTransitions } from 'src/app/core/models';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

/**
 * Shop Orders Component
 * Manages orders for SHOP role with status update functionality.
 * Access: SHOP role only
 */
@Component({
  selector: 'app-shop-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    TablerIconsModule,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Gestion des Commandes</h1>
        <p class="text-gray-500 mt-1">Gérez et suivez les commandes de votre boutique</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        @for (stat of orderStats; track stat.status) {
          <mat-card class="mat-elevation-z2 cursor-pointer hover:shadow-lg transition-shadow"
                    [class.ring-2]="statusFilter === stat.status"
                    [class.ring-primary]="statusFilter === stat.status"
                    (click)="filterByStatus(stat.status)">
            <mat-card-content class="p-4">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-full" [ngClass]="stat.bgClass">
                  <i-tabler [name]="stat.icon" class="icon-24" [ngClass]="stat.colorClass"></i-tabler>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">{{ stat.label }}</p>
                  <h3 class="text-xl font-bold">{{ stat.count }}</h3>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Filters -->
      <mat-card class="mat-elevation-z2 mb-6">
        <mat-card-content class="p-4">
          <div class="flex flex-nowrap gap-4 items-center">
            <mat-form-field appearance="outline" class="status-filter" subscriptSizing="dynamic">
              <mat-label>Filtrer par statut</mat-label>
              <mat-select [(ngModel)]="statusFilter" (selectionChange)="loadOrders()">
                <mat-option value="">Toutes les commandes</mat-option>
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

            @if (statusFilter) {
              <button mat-button color="warn" (click)="clearFilter()">
                <span class="flex items-center">
                  <i-tabler name="x" class="icon-18 mr-1"></i-tabler>
                  Effacer le filtre
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
      } @else if (orders.length === 0) {
        <!-- No Orders -->
        <mat-card class="mat-elevation-z2">
          <mat-card-content class="p-8 text-center">
            <div class="flex flex-col items-center gap-4">
              <div class="p-6 rounded-full bg-gray-100">
                <i-tabler name="receipt-off" class="icon-48 text-gray-400"></i-tabler>
              </div>
              <h3 class="text-xl font-medium text-gray-700">Aucune commande</h3>
              <p class="text-gray-500">
                @if (statusFilter) {
                  Aucune commande avec ce statut
                } @else {
                  Vous n'avez pas encore reçu de commande
                }
              </p>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <!-- Orders Table -->
        <mat-card class="mat-elevation-z2">
          <mat-card-content class="p-0">
            <div class="overflow-x-auto">
              <table mat-table [dataSource]="dataSource" matSort class="w-full">
                <!-- Order ID Column -->
                <ng-container matColumnDef="orderId">
                  <th mat-header-cell *matHeaderCellDef>N° Commande</th>
                  <td mat-cell *matCellDef="let order">
                    <span class="font-mono text-sm">{{ (order._id + '').slice(-8).toUpperCase() }}</span>
                  </td>
                </ng-container>

                <!-- Date Column -->
                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
                  <td mat-cell *matCellDef="let order">
                    {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}
                  </td>
                </ng-container>

                <!-- Items Column -->
                <ng-container matColumnDef="items">
                  <th mat-header-cell *matHeaderCellDef>Articles</th>
                  <td mat-cell *matCellDef="let order">
                    {{ order.items.length }} article(s)
                  </td>
                </ng-container>

                <!-- Total Column -->
                <ng-container matColumnDef="totalAmount">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Total</th>
                  <td mat-cell *matCellDef="let order">
                    <span class="font-semibold">{{ order.totalAmount | number }} {{ order.currency }}</span>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
                  <td mat-cell *matCellDef="let order">
                    <mat-chip [ngClass]="getStatusClass(order.status)">
                      {{ getStatusLabel(order.status) }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="text-right">Actions</th>
                  <td mat-cell *matCellDef="let order" class="text-right">
                    <div class="flex items-center justify-end gap-2">
                      @if (canUpdateStatus(order.status)) {
                        <button mat-raised-button 
                                color="primary" 
                                [disabled]="updatingOrder === order._id"
                                (click)="advanceStatus(order)"
                                [matTooltip]="'Passer à: ' + getStatusLabel(getNextStatus(order.status)!)">
                          @if (updatingOrder === order._id) {
                            <mat-spinner diameter="18" class="inline-block"></mat-spinner>
                          } @else {
                            <i-tabler name="arrow-right" class="icon-18 mr-1"></i-tabler>
                            {{ getNextStatusLabel(order.status) }}
                          }
                        </button>
                      } @else {
                        <span class="text-green-600 flex items-center gap-1">
                          <i-tabler name="check" class="icon-18"></i-tabler>
                          Terminée
                        </span>
                      }

                      <button mat-icon-button [matMenuTriggerFor]="orderMenu">
                        <i-tabler name="dots-vertical" class="icon-18"></i-tabler>
                      </button>
                      <mat-menu #orderMenu="matMenu">
                        <button mat-menu-item (click)="viewOrderDetails(order)">
                          <i-tabler name="eye" class="icon-18 mr-2"></i-tabler>
                          Voir détails
                        </button>
                      </mat-menu>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </mat-card-content>

          <mat-paginator
            [length]="pagination.totalItems"
            [pageSize]="pagination.limit"
            [pageIndex]="pagination.page - 1"
            [pageSizeOptions]="[10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card>

        <!-- Order Details Panel -->
        @if (selectedOrder) {
          <mat-card class="mat-elevation-z2 mt-6">
            <mat-card-header class="bg-gray-50 p-4">
              <mat-card-title class="flex items-center gap-2">
                <i-tabler name="file-description" class="icon-20"></i-tabler>
                Détails de la commande #{{ selectedOrder._id | slice:-8 | uppercase }}
              </mat-card-title>
              <span class="flex-1"></span>
              <button mat-icon-button (click)="selectedOrder = null">
                <i-tabler name="x" class="icon-20"></i-tabler>
              </button>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium text-gray-700 mb-3">Articles commandés</h4>
                  <div class="space-y-2">
                    @for (item of selectedOrder.items; track item.productId) {
                      <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <i-tabler name="package" class="icon-18 text-gray-500"></i-tabler>
                          </div>
                          <div>
                            <p class="font-medium">{{ item.nameSnapshot }}</p>
                            <p class="text-sm text-gray-500">{{ item.quantity }} × {{ item.priceSnapshot | number }} {{ selectedOrder.currency }}</p>
                          </div>
                        </div>
                        <span class="font-semibold">{{ item.quantity * item.priceSnapshot | number }} {{ selectedOrder.currency }}</span>
                      </div>
                    }
                  </div>
                </div>
                <div>
                  <h4 class="font-medium text-gray-700 mb-3">Informations</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Statut actuel</span>
                      <mat-chip [ngClass]="getStatusClass(selectedOrder.status)">
                        {{ getStatusLabel(selectedOrder.status) }}
                      </mat-chip>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Date de commande</span>
                      <span>{{ selectedOrder.createdAt | date:'dd/MM/yyyy à HH:mm' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Dernière mise à jour</span>
                      <span>{{ selectedOrder.updatedAt | date:'dd/MM/yyyy à HH:mm' }}</span>
                    </div>
                    <mat-divider></mat-divider>
                    <div class="flex justify-between text-lg">
                      <span class="font-medium">Total</span>
                      <span class="font-bold text-primary">{{ selectedOrder.totalAmount | number }} {{ selectedOrder.currency }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      }
    </div>
  `,
  styles: [`
    .icon-18 { width: 18px; height: 18px; }
    .icon-20 { width: 20px; height: 20px; }
    .icon-24 { width: 24px; height: 24px; }
    .icon-48 { width: 48px; height: 48px; }
    
    .status-filter {
      min-width: 200px;
      max-width: 250px;
      flex: 0 0 auto;
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
    
    .bg-blue-50 { background-color: #e3f2fd; }
    .bg-orange-50 { background-color: #fff3e0; }
    .bg-green-50 { background-color: #e8f5e9; }
    .bg-teal-50 { background-color: #e0f2f1; }
    
    .text-blue-600 { color: #1976d2; }
    .text-orange-600 { color: #f57c00; }
    .text-green-600 { color: #388e3c; }
    .text-teal-600 { color: #00796b; }
  `]
})
export class ShopOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  statusFilter = '';
  updatingOrder: string | null = null;
  selectedOrder: Order | null = null;
  
  dataSource = new MatTableDataSource<Order>();
  displayedColumns = ['orderId', 'createdAt', 'items', 'totalAmount', 'status', 'actions'];
  
  pagination: PaginationMeta = {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  };

  orderStats = [
    { status: 'CONFIRMED', label: 'Confirmées', icon: 'check', count: 0, bgClass: 'bg-blue-50', colorClass: 'text-blue-600' },
    { status: 'PREPARING', label: 'En préparation', icon: 'clock-hour-4', count: 0, bgClass: 'bg-orange-50', colorClass: 'text-orange-600' },
    { status: 'READY', label: 'Prêtes', icon: 'package-export', count: 0, bgClass: 'bg-green-50', colorClass: 'text-green-600' },
    { status: 'DELIVERED', label: 'Livrées', icon: 'truck-delivery', count: 0, bgClass: 'bg-teal-50', colorClass: 'text-teal-600' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadOrderStats();
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

    this.orderService.getShopOrders(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.orders = response.data;
          this.dataSource.data = response.data;
          this.pagination = response.pagination;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.showError('Erreur lors du chargement des commandes');
        }
      });
  }

  loadOrderStats(): void {
    // Load counts for each status
    this.orderStats.forEach(stat => {
      this.orderService.getShopOrders({ status: stat.status as OrderStatus, limit: 1 })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            stat.count = response.pagination.totalItems;
          }
        });
    });
  }

  filterByStatus(status: string): void {
    if (this.statusFilter === status) {
      this.clearFilter();
    } else {
      this.statusFilter = status;
      this.pagination.page = 1;
      this.loadOrders();
    }
  }

  clearFilter(): void {
    this.statusFilter = '';
    this.pagination.page = 1;
    this.loadOrders();
  }

  onPageChange(event: PageEvent): void {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.limit = event.pageSize;
    this.loadOrders();
  }

  advanceStatus(order: Order): void {
    const nextStatus = this.getNextStatus(order.status);
    if (!nextStatus) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Changer le statut',
        message: `Passer la commande #${order._id.slice(-8).toUpperCase()} à "${this.getStatusLabel(nextStatus)}" ?`,
        confirmText: 'Confirmer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatingOrder = order._id;
        this.orderService.updateStatus(order._id, nextStatus)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.updatingOrder = null;
              this.showSuccess(`Statut mis à jour: ${this.getStatusLabel(nextStatus)}`);
              this.loadOrders();
              this.loadOrderStats();
              
              if (this.selectedOrder?._id === order._id) {
                this.selectedOrder = response.data;
              }
            },
            error: (error) => {
              this.updatingOrder = null;
              this.showError(error.error?.error || 'Erreur lors de la mise à jour');
            }
          });
      }
    });
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  getStatusLabel(status: OrderStatus): string {
    return this.orderService.getStatusLabel(status);
  }

  getStatusClass(status: OrderStatus): string {
    return this.orderService.getStatusColor(status);
  }

  getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    return this.orderService.getNextStatus(currentStatus);
  }

  getNextStatusLabel(currentStatus: OrderStatus): string {
    const next = this.getNextStatus(currentStatus);
    return next ? this.getStatusLabel(next) : '';
  }

  canUpdateStatus(status: OrderStatus): boolean {
    return this.orderService.canUpdateStatus(status);
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
