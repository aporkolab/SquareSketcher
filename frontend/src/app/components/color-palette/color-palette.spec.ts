import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '../../services/color';
import { ColorPaletteComponent } from './color-palette';

describe('ColorPaletteComponent', () => {
  let fixture: ComponentFixture<ColorPaletteComponent>;
  let colorService: ColorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ColorPaletteComponent] }).compileComponents();
    colorService = TestBed.inject(ColorService);
    fixture = TestBed.createComponent(ColorPaletteComponent);
    await fixture.whenStable();
  });

  function tiles(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('mat-grid-tile'));
  }

  it('renders one tile per color', () => {
    expect(tiles().length).toBe(fixture.componentInstance.colors.length);
  });

  it('selects the clicked color and highlights it', async () => {
    tiles()[2].click();
    await fixture.whenStable();

    expect(colorService.selectedColor()).toBe('#FF0000');
    expect(tiles()[2].classList).toContain('selected');
    expect(tiles()[2].getAttribute('aria-pressed')).toBe('true');
    expect(tiles()[1].classList).not.toContain('selected');
  });

  it('selects a color with the keyboard', () => {
    tiles()[4].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(colorService.selectedColor()).toBe('#0000FF');
  });
});
