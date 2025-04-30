import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'board-coordinates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-coordinates.component.html',
  styleUrls: ['./board-coordinates.component.scss']
})
export class BoardCoordinatesComponent {
  @Input() showCoordinates: boolean = true;
} 