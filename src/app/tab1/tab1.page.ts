import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PostProvider } from '../../providers/post-provider';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class Tab1Page implements OnInit {

  totalWarga = 0;
  wargaLakiLaki = 0;
  wargaPerempuan = 0;
  wargaBelumKawin = 0;

  constructor(
    private router: Router,
    private postPvdr: PostProvider
  ) {}

  ngOnInit() {
    this.loadStatistikWarga();
  }

  loadStatistikWarga() {
    const body = { aksi: 'statistik' };

    this.postPvdr.postData(body, 'action.php').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.totalWarga = res.total;
          this.wargaLakiLaki = res.laki;
          this.wargaPerempuan = res.perempuan;
          this.wargaBelumKawin = res.belumKawin;
        }
      },
      error: err => {
        console.error('❌ Gagal memuat statistik:', err);
      }
    });
  }

  goToTab2() {
    this.router.navigate(['/tabs/tab2']);
  }

  goToStatistik() {
    this.router.navigate(['/tabs/tab3']);
  }

  goToDetail() {
    this.router.navigate(['/tabs/tab4']);
  }

  logout() {
    // Opsional: bisa hapus token dari localStorage/sessionStorage
    this.router.navigate(['/login']);
  }
}
