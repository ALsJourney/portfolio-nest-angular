import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJSComponentComponent } from './three-jscomponent.component';

describe('ThreeJSComponentComponent', () => {
  let component: ThreeJSComponentComponent;
  let fixture: ComponentFixture<ThreeJSComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJSComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeJSComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
