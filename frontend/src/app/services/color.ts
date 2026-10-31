import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private readonly selectedColorState = signal('#000000');

  readonly selectedColor = this.selectedColorState.asReadonly();

  setSelectedColor(color: string): void {
    this.selectedColorState.set(color);
  }
}
