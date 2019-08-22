import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgxAutofocusFixDirective } from './ngx-autofocus-fix.directive';

@Component({
  selector: 'wrapper',
  template: `
    <div *ngIf="show[0]">
      <input class="input-0" type="text" [autofocus]="autofocusValue" [autofocusFixSmartEmptyCheck]="smartEmptyCheck">
    </div>
    <div *ngIf="show[1]">
      <input class="input-1" type="text" [autofocus]="autofocusValue">
    </div>
    <div *ngIf="show[2]">
      <input class="input-2" type="text" autofocus>
    </div>
    <div *ngIf="show[3]">
      <input class="input-3" type="text" autofocus [autofocusFixSmartEmptyCheck]="smartEmptyCheck">
    </div>
  `,
})

export class TestWrapperComponent {
  public show: boolean[] = Array(4).fill(false);
  public autofocusValue: any = true;
  public smartEmptyCheck = false;
}

describe('NgxAutofocusFixDirective', () => {
  let comp: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  function getInput(num: number): HTMLElement | undefined {
    const debugElement = fixture.debugElement.query(By.css('.input-' + num));
    return debugElement && debugElement.nativeElement;
  }

  function getFocused(): HTMLElement | undefined {
    const debugElement = fixture.debugElement.query(By.css(':focus'));
    return debugElement && debugElement.nativeElement;
  }

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        imports: [CommonModule],
        declarations: [TestWrapperComponent, NgxAutofocusFixDirective],
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('SCENARIO: Testing TestWrapperComponent', () => {
    describe('GIVEN: Initialization', () => {
      it('should create', () => {
        expect(comp).toBeTruthy();
      });
      it('should have correct default values', () => {
        comp.show.forEach(v => expect(v).toBe(false));
        expect(comp.autofocusValue).toBe(true);
        expect(comp.smartEmptyCheck).toBe(false);
      });
    });

    for (let i = 0; i < 4; i++) {
      describe(`GIVEN: The <input class="input-${ i }"> should be inserted and deleted from HTML depend of .show${ i }`, () => {

        describe(`WHEN: .show${ i } === false`, () => {
          it('THEN: <input> must be absent', () => {
            expect(getInput(i)).toBeFalsy();
          });
        });

        describe(`WHEN: .show${ i } become false`, () => {
          it('THEN: <input> must be inserted', () => {
            // act
            comp.show[i] = true;
            fixture.detectChanges();

            // assert
            expect(getInput(i)).toBeTruthy();
          });
        });
      });
    }

  }); // end :: SCENARIO: Testing TestWrapperComponent

  describe('SCENARIO: Input autofocus on creation', () => {

    describe('GIVEN: Autofocus in case one input', () => {
      describe('WHEN: Input created', () => {
        it('THEN: Should be autofocused', () => {
          // act
          comp.show[0] = true;
          fixture.detectChanges();

          // assert
          const input = getInput(0);
          expect(input).toBeTruthy();
          expect(input).toBe(getFocused());
        });
      });

      describe('WHEN: Input created with no value for @Input(\'autofocus\')', () => {
        it('THEN: Should be autofocused', () => {
          // act
          comp.show[2] = true;
          fixture.detectChanges();

          // assert
          const input = getInput(2);
          expect(input).toBeTruthy();
          expect(input).toBe(getFocused());
        });
      });
    });

    describe('GIVEN: Opposite autofocus behavior for an empty string in case Smart Empty Check', () => {
      describe('WHEN: Input created', () => {
        it('THEN: Should be autofocused', () => {
          // arrange
          comp.smartEmptyCheck = true;
          comp.autofocusValue = '';

          // act
          comp.show[0] = true;
          fixture.detectChanges();

          // assert
          const input = getInput(0);
          expect(input).toBeTruthy();
          expect(getFocused()).toBeFalsy();
        });
      });

      describe('WHEN: Input created with no value for @Input(\'autofocus\')', () => {
        it('THEN: Should be autofocused', () => {
          // arrange
          comp.smartEmptyCheck = true;

          // act
          comp.show[3] = true;
          fixture.detectChanges();

          // assert
          const input = getInput(3);
          expect(input).toBeTruthy();
          expect(getFocused()).toBeFalsy();
        });
      });
    });

    describe('GIVEN: Disable autofocus on creation in case @Input(\'autofocus\') falsy', () => {
      describe('WHEN: Input created with @Input(\'autofocus\') === false', () => {
        it('THEN: Should not be autofocused', () => {
          // arrange
          comp.autofocusValue = false;

          // act
          comp.show[0] = true;
          fixture.detectChanges();

          // assert
          const input = getInput(0);
          expect(input).toBeTruthy();
          expect(getFocused()).toBeFalsy();
        });
      });

      describe('WHEN: Input created with @Input(\'autofocus\') === undefined', () => {
        it('THEN: Should not be autofocused', () => {
          // arrange
          comp.autofocusValue = undefined;

          // act
          comp.show[0] = true;
          fixture.detectChanges();

          // assert
          const input = getInput(0);
          expect(input).toBeTruthy();
          expect(getFocused()).toBeFalsy();
        });
      });
    });

    describe('GIVEN: Autofocus in case multiple inputs', () => {
      describe('WHEN: Second input created', () => {
        it('THEN: Second input should be autofocused', () => {
          // arrange
          comp.show[0] = true;
          fixture.detectChanges();

          // act
          comp.show[1] = true;
          fixture.detectChanges();

          // assert
          const input1 = getInput(0);
          const input2 = getInput(1);
          expect(input1).toBeTruthy();
          expect(input2).toBeTruthy();
          expect(input2).toBe(getFocused());
        });
      });
    });

  }); // end :: SCENARIO: Autofocus on creation

});
