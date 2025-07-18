import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { Tab1Page } from './tab1.page'; // Komponen standalone

@NgModule({
  // ❌ Jangan deklarasikan di sini karena ini komponen standalone
  // declarations: [Tab1Page],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab1Page,                // ✅ Impor komponen standalone
    Tab1PageRoutingModule
  ]
})
export class Tab1PageModule {}
