import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exercise10 } from './exercise10';

describe('Exercise10', () => {
  let component: Exercise10;
  let fixture: ComponentFixture<Exercise10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Exercise10]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exercise10);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
