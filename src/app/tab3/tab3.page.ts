import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../providers/post-provider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

interface Warga {
  jenis_kelamin: string;
  status_pernikahan: string;
  pendidikan_terakhir: string;
  pekerjaan: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule
  ]
})
export class Tab3Page implements OnInit {

  totalWarga: number = 0;
  wargaLakiLaki: number = 0;
  wargaPerempuan: number = 0;
  wargaBelumKawin: number = 0;
  wargaBerpendidikanTinggi: number = 0;
  jumlahJenisPekerjaan: number = 0;

  constructor(
    private router: Router,
    public toastController: ToastController,
    private postPvdr: PostProvider
  ) {}

  ngOnInit() {
    this.loadStatistik();
  }

  goToBeranda() {
    this.router.navigate(['/tabs/tab1']);
  }

  async loadStatistik() {
    const body = { aksi: 'get_statistik' };

    this.postPvdr.postData(body, 'action.php').subscribe(async data => {
      if (data.success && data.result) {
        const wargaList: Warga[] = data.result;
        this.totalWarga = wargaList.length;

        const pekerjaanSet = new Set<string>();

        this.wargaLakiLaki = wargaList.filter(w => w.jenis_kelamin === 'Laki-laki').length;
        this.wargaPerempuan = wargaList.filter(w => w.jenis_kelamin === 'Perempuan').length;
        this.wargaBelumKawin = wargaList.filter(w => w.status_pernikahan === 'Belum Kawin').length;
        this.wargaBerpendidikanTinggi = wargaList.filter(w =>
          ['S1', 'S2', 'S3'].includes(w.pendidikan_terakhir)
        ).length;

        wargaList.forEach(w => pekerjaanSet.add(w.pekerjaan));
        this.jumlahJenisPekerjaan = pekerjaanSet.size;

      } else {
        const toast = await this.toastController.create({
          message: 'Gagal memuat data statistik.',
          duration: 2000
        });
        await toast.present();
      }
    }, async err => {
      const toast = await this.toastController.create({
        message: 'Terjadi kesalahan koneksi.',
        duration: 2000
      });
      await toast.present();
    });
  }
}
