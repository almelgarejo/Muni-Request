import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarSolicitudPage } from './registrar-solicitud.page';

describe('RegistrarSolicitudPage', () => {
  let component: RegistrarSolicitudPage;
  let fixture: ComponentFixture<RegistrarSolicitudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarSolicitudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
