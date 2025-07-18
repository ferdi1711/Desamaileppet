import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, NavController, IonicModule } from '@ionic/angular';
import { PostProvider } from '../../providers/post-provider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule
  ]
})
export class LoginPage {
  username = '';
  password = '';

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  login() {
  // Validasi input
  if (!this.username.trim() || !this.password.trim()) {
    this.showToast('Username dan password wajib diisi');
    return;
  }

  const body = {
    aksi: 'login',
    username: this.username,
    password: this.password
  };

  this.postPvdr.postData(body, 'action.php').subscribe({
    next: (res: any) => {
      console.log('Response dari server:', res); // DEBUG LOG

      if (res.success) {
        this.showToast('Login berhasil');
        this.navCtrl.navigateRoot('/tabs'); // arahkan ke halaman utama
      } else {
        this.showToast(res.message || 'Login gagal');
      }
    },
    error: () => {
      this.showToast('Gagal koneksi ke server');
    }
  });
} // <== KURUNG TUTUP UNTUK login() DITAMBAHKAN DI SINI

async showToast(msg: string) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000,
    position: 'bottom',
    color: 'danger'
  });
  await toast.present();
}

}
