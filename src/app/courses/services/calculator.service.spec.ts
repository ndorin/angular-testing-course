import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe('CalculatorService', () => {

    let calculator: CalculatorService;
    let loggerSpy: any;

    beforeEach(() => {

        console.log("calling beforeEach");

        loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);

        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                {provide: LoggerService, useValue: loggerSpy}
            ]
        })

        calculator = TestBed.inject(CalculatorService);

    });

    it('should add two numbers', () => {

        console.log("add test");

        let result = calculator.add(2, 2);

        expect(result).toBe(4);

        result = calculator.add(10, -1);

        expect(result).toBe(9);

        expect(loggerSpy.log).toHaveBeenCalledTimes(2);

    });

    it('should subtract two numbers', () => {

        console.log("subtract test");

        const result = calculator.subtract(2, 2);

        expect(result).toBe(0, 'unexpected subtraction result');

        expect(loggerSpy.log).toHaveBeenCalledTimes(1);

    });
})