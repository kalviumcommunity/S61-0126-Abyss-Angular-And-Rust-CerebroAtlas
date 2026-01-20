import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responsive-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './responsive-showcase.component.html',
  styleUrls: ['./responsive-showcase.component.css']
})
export class ResponsiveShowcaseComponent {
  products = [
    { name: 'Product A' },
    { name: 'Product B' },
    { name: 'Product C' },
    { name: 'Product D' },
    { name: 'Product E' },
    { name: 'Product F' }
  ];
}
