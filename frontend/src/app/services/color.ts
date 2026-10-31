import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  selectedColor = signal('#000000');

  setSelectedColor(color: string): void {
    this.selectedColor.set(color);
  }
}
