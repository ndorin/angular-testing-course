import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { doesNotReject } from "assert";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", () => {

    it("Asyncronous test example with Jasmin done()", (done:DoneFn) => {

        let test = false;

        setTimeout(() => {

            console.log('running Assertions');
            test = true;

            expect(test).toBeTruthy();

            done();

        }, 1000);
        
    });

    it("Asyncronous test example - setTimout()", fakeAsync(() => {

        let test = false;

        setTimeout(() => {

            console.log('running assertions setTimeout()');

            test = true;

        }, 1000);

        flush();

        expect(test).toBeTruthy();

    }));

    it('Asyncronous test example - plain Promise', fakeAsync(() => {

        let test = false;

        console.log('Creating promise');

        Promise.resolve().then(() => {
            
            console.log('Promise first then() evaluated successfully');
            
            test = true;

            return Promise.resolve();
        }).then(() => {

            console.log('Promise second then() evaluated successfully');

            test = true;
        });

        flushMicrotasks();

        console.log('Running test assertions');

        expect(test).toBeTruthy();
    }));

    it('Asyncronous test example - Promises + setTimeout()', fakeAsync(() => {

        let counter = 0;

        Promise.resolve()
            .then(() => {

                counter +=10;

                setTimeout(() => {

                    counter += 1;

                }, 1000);

            });

        expect(counter).toBe(0);

        flushMicrotasks();

        expect(counter).toBe(10);

        flush();

        expect(counter).toBe(11);
    }));

    it('Asyncronous test example - Observables', fakeAsync(() => {

        let test = false;

        console.log('Create Observable');

        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => {

            test = true;

        });

        tick(1000);

        console.log('Running test assertions');

        expect(test).toBe(true);
    }));
});