import { Component, OnInit } from '@angular/core';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { PostProvider } from '../../providers/post-provider';

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
  penjualan: any[] = [];
  start = 0;
  limit = 5;

  constructor(
    public toastController: ToastController,
    private postPvdr: PostProvider
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.penjualan = [];
    this.start = 0;
    this.loadPenjualan();
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }

  loadData(event: any) {
    this.start += this.limit;
    setTimeout(() => {
      this.loadPenjualan().then(() => {
        event.target.complete();
      });
    }, 500);
  }

  async loadPenjualan(): Promise<void> {
    let body = {
      action: 'getdata',
      start: this.start,
      limit: this.limit
    };

    this.postPvdr.postData(body, 'action.php').subscribe(async data => {
      if (data.success) {
        this.penjualan = this.penjualan.concat(data.result);
      } else {
        const toast = await this.toastController.create({
          message: 'Gagal memuat data.',
          duration: 2000
        });
        toast.present();
      }
    }, async error => {
      const toast = await this.toastController.create({
        message: 'Terjadi kesalahan saat menghubungi server.',
        duration: 2000
      });
      toast.present();
    });
  }
}
