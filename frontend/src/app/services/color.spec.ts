import { TestBed } from '@angular/core/testing';
import { ColorService } from './color';

describe('ColorService', () => {
  it('defaults to black and remembers the selected color', () => {
    const service = TestBed.inject(ColorService);
    expect(service.selectedColor()).toBe('#000000');

    service.setSelectedColor('#FF0000');
    expect(service.selectedColor()).toBe('#FF0000');
  });
});
