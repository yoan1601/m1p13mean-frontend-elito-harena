import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TablerIconsModule } from 'angular-tabler-icons';

import { Category } from 'src/app/core/models';
import { CategoryService } from 'src/app/core/services';
import { CategoryFormDialogComponent } from './category-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
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
    TablerIconsModule,
  ],
  template: `
    <div class="category-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Catégories</mat-card-title>
          <mat-card-subtitle>Liste de toutes les catégories du centre commercial</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="toolbar">
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <span class="btn-content">
                <i-tabler name="plus" class="icon-18"></i-tabler>
                Nouvelle Catégorie
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
              <!-- Code Column -->
              <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Code</th>
                <td mat-cell *matCellDef="let category">
                  <span class="code-badge">{{ category.code }}</span>
                </td>
              </ng-container>

              <!-- Label Column -->
              <ng-container matColumnDef="label">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Libellé</th>
                <td mat-cell *matCellDef="let category">{{ category.label }}</td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="isActive">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
                <td mat-cell *matCellDef="let category">
                  <mat-chip [color]="category.isActive ? 'primary' : 'warn'" selected>
                    {{ category.isActive ? 'Actif' : 'Inactif' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date de création</th>
                <td mat-cell *matCellDef="let category">
                  {{ category.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let category">
                  <button mat-icon-button color="primary" 
                          matTooltip="Modifier"
                          (click)="openEditDialog(category)">
                    <i-tabler name="edit" class="icon-18"></i-tabler>
                  </button>
                  <button mat-icon-button color="warn" 
                          matTooltip="Supprimer"
                          (click)="openDeleteDialog(category)"
                          [disabled]="category.deletedAt !== null">
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
                <i-tabler name="folder-off" class="icon-48"></i-tabler>
                <p>Aucune catégorie trouvée</p>
              </div>
            }
          </div>

          <mat-paginator [pageSizeOptions]="[5, 10, 25, 50]"
                         showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .category-list-container {
      padding: 24px;
    }

    .toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }

    .table-container {
      position: relative;
      min-height: 200px;
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

    .code-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-weight: 500;
      font-size: 12px;
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
export class CategoryListComponent implements OnInit {
  displayedColumns = ['code', 'label', 'isActive', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Category>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Erreur lors du chargement des catégories', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  openDeleteDialog(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Supprimer la catégorie',
        message: `Êtes-vous sûr de vouloir supprimer la catégorie "${category.label}" ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteCategory(category);
      }
    });
  }

  deleteCategory(category: Category): void {
    this.categoryService.delete(category._id).subscribe({
      next: () => {
        this.snackBar.open('Catégorie supprimée avec succès', 'Fermer', {
          duration: 3000
        });
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
