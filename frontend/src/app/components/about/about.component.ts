import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  certificates = [
    {
      name: 'GST Certificate',
      icon: 'assets/certificate/GST.png',
      description: 'Goods and Services Tax Registration',
      type: 'image'
    },
    {
      name: 'IEC Certificate',
      icon: 'assets/certificate/IEC.jpeg',
      description: 'Importer Exporter Code Certificate',
      type: 'image'
    },
    {
      name: 'FIEO',
      icon: 'assets/certificate/FIEO.png',
      description: 'Federation of Indian Export Organisations',
      type: 'image'
    },
    {
      name: 'APEDA',
      icon: 'assets/certificate/appeda.jpeg',
      description: 'Agricultural and Processed Food Products Export Development Authority',
      type: 'image'
    }
  ];

  viewCertificate(cert: any): void {
    if (cert.type === 'image') {
      window.open(cert.icon, '_blank');
    }
  }
}
