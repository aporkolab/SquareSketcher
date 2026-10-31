import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, PixelArt } from '../../services/api';
import { ArtService } from '../../services/art';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, MatListModule, MatCardModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.scss']
})
export class GalleryComponent implements OnInit {
  pixelArts: PixelArt[] = [];

  constructor(private apiService: ApiService, private artService: ArtService) { }

  ngOnInit(): void {
    this.loadGallery();
  }

  loadGallery(): void {
    this.apiService.getAllPixelArt().subscribe(arts => {
      this.pixelArts = arts;
    });
  }

  loadArt(art: PixelArt): void {
    this.artService.loadArt(art);
  }
}
