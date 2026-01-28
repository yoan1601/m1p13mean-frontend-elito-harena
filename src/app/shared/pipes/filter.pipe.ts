import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filter pipe for searching through lists.
 * Used primarily in navigation/sidebar filtering.
 */
@Pipe({ 
  name: 'appFilter', 
  standalone: true, 
  pure: true 
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, property: string = 'displayName'): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    
    searchText = searchText.toLocaleLowerCase();

    return items.filter((item) => {
      const value = item[property];
      return value ? value.toLocaleLowerCase().includes(searchText) : false;
    });
  }
}
