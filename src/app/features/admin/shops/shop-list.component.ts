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
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';

import { Shop, ShopFilterParams } from 'src/app/core/models';
import { ShopService } from 'src/app/core/services';
import { ShopFormDialogComponent } from './shop-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-shop-list',
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
    TablerIconsModule,
  ],
  template: `
    <div class="shop-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Boutiques</mat-card-title>
          <mat-card-subtitle>Liste de toutes les boutiques du centre commercial</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="toolbar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Rechercher</mat-label>
              <input matInput [(ngModel)]="searchQuery" 
                     placeholder="Nom de la boutique..."
                     (keyup.enter)="loadShops()">
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <span class="btn-content">
                <i-tabler name="plus" class="icon-18"></i-tabler>
                Nouvelle Boutique
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
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
                <td mat-cell *matCellDef="let shop">
                  <div class="shop-name">
                    @if (shop.imagePath) {
                      <img [src]="shop.imagePath" alt="Shop" class="shop-avatar">
                    } @else {
                      <div class="shop-avatar-placeholder">
                        <i-tabler name="building-store" class="icon-24"></i-tabler>
                      </div>
                    }
                    <span>{{ shop.name }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Location Column -->
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Emplacement</th>
                <td mat-cell *matCellDef="let shop">
                  <span class="location-badge">
                    Étage {{ shop.location.floor }} - Zone {{ shop.location.zone }}
                  </span>
                </td>
              </ng-container>

              <!-- Categories Column -->
              <ng-container matColumnDef="categories">
                <th mat-header-cell *matHeaderCellDef>Catégories</th>
                <td mat-cell *matCellDef="let shop">
                  <div class="categories-chips">
                    @for (cat of shop.categories.slice(0, 2); track cat) {
                      <mat-chip>{{ cat }}</mat-chip>
                    }
                    @if (shop.categories.length > 2) {
                      <mat-chip>+{{ shop.categories.length - 2 }}</mat-chip>
                    }
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="isOpen">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
                <td mat-cell *matCellDef="let shop">
                  <mat-chip [color]="shop.isOpen ? 'primary' : 'warn'" selected>
                    {{ shop.isOpen ? 'Ouvert' : 'Fermé' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Owner Column -->
              <ng-container matColumnDef="owner">
                <th mat-header-cell *matHeaderCellDef>Propriétaire</th>
                <td mat-cell *matCellDef="let shop">
                  {{ shop.owner?.email || 'N/A' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let shop">
                  <button mat-icon-button color="primary" 
                          matTooltip="Modifier"
                          (click)="openEditDialog(shop)">
                    <i-tabler name="edit" class="icon-18"></i-tabler>
                  </button>
                  <button mat-icon-button color="warn" 
                          matTooltip="Supprimer"
                          (click)="openDeleteDialog(shop)"
                          [disabled]="shop.deletedAt !== null">
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
                <i-tabler name="building-store-off" class="icon-48"></i-tabler>
                <p>Aucune boutique trouvée</p>
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
    .shop-list-container {
      padding: 24px;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      gap: 16px;
    }

    .search-field {
      flex: 1;
      max-width: 400px;
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

    .shop-name {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .shop-avatar, .shop-avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
    }

    .shop-avatar-placeholder {
      background-color: #e3f2fd;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1976d2;
    }

    .location-badge {
      background-color: #e8f5e9;
      color: #388e3c;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
    }

    .categories-chips {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
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
      margin-top: 16px;
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
export class ShopListComponent implements OnInit {
  displayedColumns = ['name', 'location', 'categories', 'isOpen', 'owner', 'actions'];
  dataSource = new MatTableDataSource<Shop>([]);
  loading = false;
  searchQuery = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private shopService: ShopService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops(): void {
    this.loading = true;
    const filters: ShopFilterParams = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchQuery || undefined
    };

    this.shopService.getAll(filters).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalItems = response.pagination.totalItems;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading shops:', error);
        this.snackBar.open('Erreur lors du chargement des boutiques', 'Fermer', {
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
    this.loadShops();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ShopFormDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadShops();
      }
    });
  }

  openEditDialog(shop: Shop): void {
    const dialogRef = this.dialog.open(ShopFormDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { mode: 'edit', shop }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadShops();
      }
    });
  }

  openDeleteDialog(shop: Shop): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer la boutique',
        message: `Êtes-vous sûr de vouloir supprimer la boutique "${shop.name}" ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteShop(shop);
      }
    });
  }

  deleteShop(shop: Shop): void {
    this.shopService.delete(shop._id).subscribe({
      next: () => {
        this.snackBar.open('Boutique supprimée avec succès', 'Fermer', {
          duration: 3000
        });
        this.loadShops();
      },
      error: (error) => {
        console.error('Error deleting shop:', error);
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
