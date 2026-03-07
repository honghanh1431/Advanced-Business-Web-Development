import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFashionList } from './client-fashion-list';

describe('ClientFashionList', () => {
  let component: ClientFashionList;
  let fixture: ComponentFixture<ClientFashionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientFashionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFashionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
