import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFashionDetail } from './client-fashion-detail';

describe('ClientFashionDetail', () => {
  let component: ClientFashionDetail;
  let fixture: ComponentFixture<ClientFashionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientFashionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFashionDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
