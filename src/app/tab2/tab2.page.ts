import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../providers/post-provider';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule
  ]
})
export class Tab2Page implements OnInit {

  namalengkap: string = '';
  nik: string = '';
  jeniskelamin: string = '';
  tanggallahir: string = '';
  alamat: string = '';
  statuspernikahan: string = '';
  pekerjaan: string = '';
  pendidikanterakhir: string = '';

  constructor(
    private router: Router,
    public toastController: ToastController,
    private postPvdr: PostProvider
  ) {}

  ngOnInit() {}

  async addRegister() {
    if (!this.namalengkap || !this.nik || !this.jeniskelamin || !this.tanggallahir ||
        !this.alamat || !this.statuspernikahan || !this.pekerjaan || !this.pendidikanterakhir) {
      const toast = await this.toastController.create({
        message: 'Semua field wajib diisi.',
        duration: 2000
      });
      toast.present();
      return;
    }

    const body = {
      aksi: 'insert',
      nama_lengkap: this.namalengkap,
      nik: this.nik,
      jenis_kelamin: this.jeniskelamin,
      tanggal_lahir: this.tanggallahir,
      alamat: this.alamat,
      status_pernikahan: this.statuspernikahan,
      pekerjaan: this.pekerjaan,
      pendidikan_terakhir: this.pendidikanterakhir
    };

    this.postPvdr.postData(body, 'action.php').subscribe(async data => {
      const toast = await this.toastController.create({
        message: data.message,
        duration: 2000
      });
      toast.present();

      if (data.success) {
        this.router.navigate(['/tab4']);
      }
    }, async err => {
      const toast = await this.toastController.create({
        message: 'Terjadi kesalahan koneksi.',
        duration: 2000
      });
      toast.present();
    });
  }
}
