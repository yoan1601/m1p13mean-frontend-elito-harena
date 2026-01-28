import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { CoreService } from 'src/app/services/core.service';
import { AppSettings } from 'src/app/config';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppNavItemComponent } from './sidebar/nav-item/nav-item.component';

// Role-based navigation imports
import { AuthService } from 'src/app/core/services/auth.service';
import { UserRole } from 'src/app/core/models/user.model';
import { NavItem } from './sidebar/nav-item/nav-item';
import { adminNavItems } from 'src/app/features/admin/admin-nav';
import { shopNavItems } from 'src/app/features/shop/shop-nav';
import { userNavItems } from 'src/app/features/user/user-nav';
import { navItems as demoNavItems } from './sidebar/sidebar-data';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';


@Component({
  selector: 'app-full',
  imports: [
    RouterModule,
    AppNavItemComponent,
    MaterialModule,
    CommonModule,
    SidebarComponent,
    NgScrollbarModule,
    TablerIconsModule,
    HeaderComponent
  ],
  templateUrl: './full.component.html',

  encapsulation: ViewEncapsulation.None
})
export class FullComponent implements OnInit, OnDestroy {
  // Navigation items based on current role
  navItems: NavItem[] = [];

  @ViewChild('leftsidenav')
  public sidenav: MatSidenav;
  resView = false;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;
  //get options from service
  options = this.settings.getOptions();
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  // Computed user info from auth service
  currentUser = computed(() => this.authService.currentUser());
  userRole = computed(() => this.authService.userRole());

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  get isTablet(): boolean {
    return this.resView;
  }

  constructor(
    private settings: CoreService,
    private mediaMatcher: MediaMatcher,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private navService: NavService, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW, BELOWMONITOR])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;
        this.isMobileScreen = state.breakpoints[BELOWMONITOR];
        if (this.options.sidenavCollapsed == false) {
          this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
        }
        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
        this.resView = state.breakpoints[BELOWMONITOR];
      });

    // Initialize project theme with options
    this.receiveOptions(this.options);

    // This is for scroll to top and update navigation based on route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        this.content.scrollTo({ top: 0 });
        this.updateNavigationForCurrentRoute();
      });
  }

  isFilterNavOpen = false;

  toggleFilterNav() {
    this.isFilterNavOpen = !this.isFilterNavOpen;
    console.log('Sidebar open:', this.isFilterNavOpen);
    this.cdr.detectChanges(); // Ensures Angular updates the view
  }

  ngOnInit(): void {
    this.updateNavigationForCurrentRoute();
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  /**
   * Update navigation items based on current route/role
   */
  private updateNavigationForCurrentRoute(): void {
    const url = this.router.url;
    
    if (url.startsWith('/admin')) {
      this.navItems = adminNavItems;
    } else if (url.startsWith('/shop')) {
      this.navItems = shopNavItems;
    } else if (url.startsWith('/user')) {
      this.navItems = userNavItems;
    } else if (url.startsWith('/demo')) {
      this.navItems = demoNavItems;
    } else {
      // Fallback based on user role
      this.navItems = this.getNavItemsForRole(this.userRole());
    }
  }

  /**
   * Get navigation items based on user role
   */
  private getNavItemsForRole(role: UserRole | null): NavItem[] {
    switch (role) {
      case UserRole.ADMIN:
        return adminNavItems;
      case UserRole.SHOP:
        return shopNavItems;
      case UserRole.USER:
        return userNavItems;
      default:
        return demoNavItems;
    }
  }

  /**
   * Logout and redirect to login
   */
  logout(): void {
    this.authService.logout();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }

  receiveOptions(options: AppSettings): void {
    this.toggleDarkTheme(options);
    this.toggleColorsTheme(options);
  }

  toggleDarkTheme(options: AppSettings) {
    if (options.theme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
    } else {
      this.htmlElement.classList.remove('dark-theme');
      this.htmlElement.classList.add('light-theme');
    }
  }

  toggleColorsTheme(options: AppSettings) {
    // Remove any existing theme class dynamically
    this.htmlElement.classList.forEach((className) => {
      if (className.endsWith('_theme')) {
        this.htmlElement.classList.remove(className);
      }
    });

    // Add the selected theme class
    this.htmlElement.classList.add(options.activeTheme);
  }
}
