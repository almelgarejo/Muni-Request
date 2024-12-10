import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerSolicitudesPage } from './ver-solicitudes.page';

describe('VerSolicitudesPage', () => {
  let component: VerSolicitudesPage;
  let fixture: ComponentFixture<VerSolicitudesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSolicitudesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
