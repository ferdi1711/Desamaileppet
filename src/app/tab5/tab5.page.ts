import { Component } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class Tab5Page {
  agendas = [
    {
      judul: 'Musyawarah Dusun',
      lokasi: 'Balai Dusun RT 03',
      tanggal: new Date('2025-06-20'),
      icon: 'people-outline',
      warna: 'primary',
      deskripsi: 'Diskusi mengenai pembangunan dan kebutuhan warga.'
    },
    {
      judul: 'Gotong Royong',
      lokasi: 'Seluruh Dusun',
      tanggal: new Date('2025-06-23'),
      icon: 'trash-outline',
      warna: 'success',
      deskripsi: 'Kerja bakti membersihkan lingkungan desa.'
    }
  ];

  constructor(private alertCtrl: AlertController) {}

  async editAgenda(index: number) {
    const agenda = this.agendas[index];

    // Pastikan tanggal adalah objek Date
    let agendaDate: string;
    if (agenda.tanggal instanceof Date) {
      agendaDate = agenda.tanggal.toISOString().split('T')[0];
    } else {
      agendaDate = new Date(agenda.tanggal).toISOString().split('T')[0];
    }

    const alert = await this.alertCtrl.create({
      header: 'Edit Agenda',
      inputs: [
        {
          name: 'judul',
          type: 'text',
          placeholder: 'Judul',
          value: agenda.judul
        },
        {
          name: 'lokasi',
          type: 'text',
          placeholder: 'Lokasi',
          value: agenda.lokasi
        },
        {
          name: 'tanggal',
          type: 'date',
          value: agendaDate
        },
        {
          name: 'deskripsi',
          type: 'textarea',
          placeholder: 'Deskripsi',
          value: agenda.deskripsi
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Simpan',
          handler: (data) => {
            this.agendas[index] = {
              ...agenda,
              judul: data.judul,
              lokasi: data.lokasi,
              tanggal: new Date(data.tanggal),
              deskripsi: data.deskripsi
            };
          }
        }
      ]
    });

    await alert.present();
  }
}
