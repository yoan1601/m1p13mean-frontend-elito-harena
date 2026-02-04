import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';

interface stats {
  id: number;
  time: string;
  color: string;
  title?: string;
  subtext?: string;
  link?: string;
}

@Component({
  selector: 'app-recent-transactions',
  imports: [NgApexchartsModule, MaterialModule],
  templateUrl: './recent-transactions.component.html',
})
export class AppRecentTransactionsComponent {
  stats: stats[] = [
    {
      id: 1,
      time: '08:45',
      color: 'primary',
      subtext: 'Paiement reçu de Jean Dupont de 385,90 €',
    },
    {
      id: 2,
      time: '09:30',
      color: 'accent',
      title: 'Nouvelle vente enregistrée',
      link: '#ML-3467',
    },
    {
      id: 3,
      time: '10:00',
      color: 'success',
      subtext: 'Paiement effectué de 64,95 € à Michel',
    },
    {
      id: 4,
      time: '12:00',
      color: 'warning',
      title: 'Nouvelle vente enregistrée',
      link: '#ML-3467',
    },
    {
      id: 5,
      time: '15:00',
      color: 'error',
      title: 'Nouvelle arrivée enregistrée',
      link: '#ML-3467',
    },
    {
      id: 6,
      time: '16:45',
      color: 'success',
      subtext: 'Paiement Effectué',
    },
  ];
}
