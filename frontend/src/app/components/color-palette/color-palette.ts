import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-color-palette',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatButtonModule, MatCardModule],
  templateUrl: './color-palette.html',
  styleUrls: ['./color-palette.scss']
})
export class ColorPaletteComponent {
  colors: string[] = [
    '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#C0C0C0', '#808080', '#800000', '#808000'
  ];

  constructor(private colorService: ColorService) {}

  selectColor(color: string): void {
    this.colorService.setSelectedColor(color);
  }
}
