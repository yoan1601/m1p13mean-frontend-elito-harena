import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;

  @Output() optionsChange = new EventEmitter<AppSettings>();

  // User info from auth service
  currentUser = computed(() => this.authService.currentUser());
  userRole = computed(() => this.authService.userRole());

  constructor(private authService: AuthService) {}

  /**
   * Get display name for current user
   */
  get displayName(): string {
    const user = this.currentUser();
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'User';
  }

  /**
   * Get formatted role name
   */
  get roleName(): string {
    const role = this.userRole();
    if (role) {
      return role.charAt(0).toUpperCase() + role.slice(1);
    }
    return '';
  }

  /**
   * Logout and redirect to login
   */
  logout(): void {
    this.authService.logout();
  }
}