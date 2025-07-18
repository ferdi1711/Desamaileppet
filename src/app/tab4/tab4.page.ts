import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController, IonicModule } from '@ionic/angular';
import { PostProvider } from '../../providers/post-provider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule
  ]
})
export class Tab4Page implements OnInit {

  wargas: any[] = [];
  filteredWargas: any[] = [];
  searchTerm: string = '';

  limit = 10;
  start = 0;
  hasMoreData = true; // ✅ indikator data habis

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.resetData();
    this.loadWarga();
  }

  resetData() {
    this.wargas = [];
    this.filteredWargas = [];
    this.start = 0;
    this.hasMoreData = true;
  }

  doRefresh(event: any) {
    this.resetData();
    this.loadWarga().then(() => event.target.complete());
  }

  loadData(event: any) {
    if (!this.hasMoreData) {
      event.target.disabled = true;
      return;
    }

    this.start += this.limit;
    this.loadWarga().then(() => {
      if (!this.hasMoreData) {
        event.target.disabled = true;
      }
      event.target.complete();
    });
  }

  private loadWarga(): Promise<void> {
    return new Promise(resolve => {
      const body = {
        aksi: 'getdata',
        limit: this.limit,
        start: this.start
      };

      this.postPvdr.postData(body, 'action.php').subscribe({
        next: async res => {
          if (res?.result?.length) {
            const data = res.result.map((w: any) => ({
              id_warga: w.id_warga,
              nama_lengkap: w.nama_lengkap,
              nik: w.nik,
              tanggallahir: w.tanggal_lahir,
              jeniskelamin: w.jenis_kelamin,
              statuspernikahan: w.status_pernikahan,
              pendidikanterakhir: w.pendidikan_terakhir,
              pekerjaan: w.pekerjaan,
              alamat: w.alamat
            }));

            this.wargas.push(...data);
            this.filterWargas();

            if (res.result.length < this.limit) {
              this.hasMoreData = false;
            }
          } else {
            this.hasMoreData = false;
            await this.presentToast('Tidak ada data lagi.');
          }
          resolve();
        },
        error: async err => {
          console.error('❌ Gagal memuat data warga:', err);
          this.hasMoreData = false;
          await this.presentToast('Terjadi kesalahan memuat data.');
          resolve();
        }
      });
    });
  }

  filterWargas() {
    const term = this.searchTerm.toLowerCase();
    if (!term.trim()) {
      this.filteredWargas = [...this.wargas];
    } else {
      this.filteredWargas = this.wargas.filter(w =>
        w.nama_lengkap.toLowerCase().includes(term) ||
        w.nik.toLowerCase().includes(term)
      );
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  editWarga(warga: any) {
    this.router.navigate(['/edit-warga', warga.id_warga]);
  }

  async hapusWarga(warga: any) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: `Yakin ingin menghapus data <strong>${warga.nama_lengkap}</strong>?`,
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          handler: () => this.prosesHapus(warga.id_warga)
        }
      ]
    });
    await alert.present();
  }

  prosesHapus(id_warga: number) {
    const body = {
      aksi: 'delete',
      id_warga
    };

    this.postPvdr.postData(body, 'action.php').subscribe({
      next: async res => {
        if (res.success) {
          await this.presentToast('Data berhasil dihapus.');
          this.ionViewWillEnter();
        } else {
          await this.presentToast(res.message || 'Gagal menghapus data.');
        }
      },
      error: async err => {
        console.error('❌ Gagal menghapus data:', err);
        await this.presentToast('Terjadi kesalahan server.');
      }
    });
  }

  trackById(index: number, item: any) {
    return item.id_warga;
  }

  goToBeranda() {
    this.router.navigate(['/tabs/tab1']);
  }
}
