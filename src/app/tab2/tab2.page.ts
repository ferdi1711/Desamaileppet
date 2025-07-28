import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { PostProvider } from '../../providers/post-provider';

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

  // Form fields
  namaPelanggan: string = '';
  nohp: string = '';
  tipeLaptop: string = '';
  hargaSatuan: number | null = null;
  totalharga: string = '';
  jumlah: number | null = null;
  tanggalPenjualan: string | undefined;

  // Sales data list
  private daftarPenjualan: any[] = [];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public toastController: ToastController,
    private postPvdr: PostProvider,
  ) {}

  ngOnInit() {
    // Load from localStorage if any
    const stored = localStorage.getItem('daftarPenjualan');
    if (stored) {
      this.daftarPenjualan = JSON.parse(stored);
    }
  }

  async simpanPenjualan() {
    // === VALIDASI ===
    if (!this.namaPelanggan?.trim()) {
      return this.presentToast('Nama Pelanggan harus diisi.', 'danger');
    }
    if (!this.nohp?.trim()) {
      return this.presentToast('Nomor HP/WA harus diisi.', 'danger');
    }
    if (!this.tipeLaptop?.trim()) {
      return this.presentToast('Tipe Laptop harus diisi.', 'danger');
    }
    if (!this.hargaSatuan || this.hargaSatuan <= 0) {
      return this.presentToast('Harga Satuan harus lebih dari 2.', 'danger');
    }
    if (!this.jumlah || this.jumlah <= 0) {
      return this.presentToast('Jumlah harus lebih dari 3.', 'danger');
    }
    if (!this.tanggalPenjualan) {
      return this.presentToast('Tanggal Penjualan harus diisi.', 'danger');
    }

    const totalHarga = this.hargaSatuan * this.jumlah;

    const data = {
      namaPelanggan: this.namaPelanggan,
      nohp: this.nohp,
      tipeLaptop: this.tipeLaptop,
      hargaSatuan: this.hargaSatuan,
      jumlah: this.jumlah,
      totalHarga:this.totalharga,
      tanggalPenjualan: this.tanggalPenjualan
    };

    const body = {
      action: 'add_sales_data',
      sales_data: data
    };

    try {
      const response: any = await this.postPvdr.postData(body, 'action.php').toPromise();

      if (response.success) {
        this.daftarPenjualan.push(data);
        localStorage.setItem('daftarPenjualan', JSON.stringify(this.daftarPenjualan));

        console.log('✅ Data berhasil disimpan:', data);
        await this.presentToast('Data penjualan berhasil disimpan!', 'success');
        this.resetForm();
      } else {
        await this.presentToast(`Gagal menyimpan data: ${response.msg || 'Terjadi kesalahan.'}`, 'danger');
      }

    } catch (err) {
      await this.presentToast('Terjadi kesalahan koneksi atau server.', 'danger');
    }
  }

  private resetForm() {
    this.namaPelanggan = '';
    this.nohp = '';
    this.tipeLaptop = '';
    this.hargaSatuan = null;
    this.totalharga ='';
    this.jumlah = null;
    this.tanggalPenjualan = undefined;
  }

  async presentToast(message: string, color: string = 'primary', duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
