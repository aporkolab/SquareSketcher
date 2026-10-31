import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { ColorService } from '../../services/color';

@Component({
  selector: 'app-color-palette',
  imports: [MatGridListModule, MatCardModule],
  templateUrl: './color-palette.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './color-palette.scss',
})
export class ColorPaletteComponent {
  private readonly colorService = inject(ColorService);

  readonly selectedColor = this.colorService.selectedColor;

  readonly colors: readonly string[] = [
    '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#C0C0C0', '#808080', '#800000', '#808000',
  ];

  selectColor(color: string): void {
    this.colorService.setSelectedColor(color);
  }
}
