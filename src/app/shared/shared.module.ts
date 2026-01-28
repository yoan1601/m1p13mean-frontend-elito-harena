import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';
import { FilterPipe } from './pipes/filter.pipe';

// Third-party modules commonly used
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';

/**
 * Shared Module
 * 
 * Contains common modules, components, directives, and pipes
 * that are used across multiple feature modules.
 * 
 * Import this module in feature modules that need shared functionality.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FilterPipe,
  ],
  exports: [
    // Angular modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Material Design
    MaterialModule,
    
    // Third-party
    TablerIconsModule,
    NgScrollbarModule,
    
    // Pipes
    FilterPipe,
  ],
})
export class SharedModule {}
