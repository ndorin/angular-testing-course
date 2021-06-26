import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {

    let coursesService: CoursesService,
        httpTestingController: HttpTestingController;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService,
            ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should retrieve all courses', () => {

        coursesService.findAllCourses()
            .subscribe(courses => {

                expect(courses).toBeTruthy('No courses returned');
                expect(courses.length).toBe(12, 'incorrect number of courses');

                const course = courses.find(course => course.id === 12);

                expect(course.titles.description).toBe("Angular Testing Course", 'incorrect title description');

            });

        const req = httpTestingController.expectOne('/api/courses');

        expect(req.request.method).toEqual("GET");
        
        req.flush({payload: Object.values(COURSES)});
    });

    it('should return course by id', () => {

        const id = 12;

        coursesService.findCourseById(id)
            .subscribe(course => {

                expect(course).toBeTruthy('No course returned');
                expect(course.id).toBe(id);

            });

        const req = httpTestingController.expectOne(`/api/courses/${id}`);

        expect(req.request.method).toEqual("GET");

        req.flush(COURSES[12]);

    });

    it('should save the course data', () =>{

        const id = 12;

        const changes:Partial<Course> = {titles:{description: 'Testing Course'}};

        coursesService.saveCourse(id, changes)
            .subscribe(course => {

                expect(course.id).toBe(id);

            });

        const req = httpTestingController.expectOne(`/api/courses/${id}`);

        expect(req.request.method).toEqual("PUT");

        expect(req.request.body.titles.description)
            .toEqual(changes.titles.description);

        req.flush({
            ...COURSES[12],
            ...changes
        });
    });

    it('should give an error if save course fails', () => {
        
        const id = 12;

        const changes:Partial<Course> = {titles:{description: 'Testing Course'}};
        
        coursesService.saveCourse(id, changes)
            .subscribe(
                () => fail("the save course operation should have failed"),
                    
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500);
                }
            );

        const req = httpTestingController.expectOne(`/api/courses/${id}`);

        expect(req.request.method).toEqual("PUT");

        req.flush('Save course failed', {status:500, statusText:'Internal Server Error'});
    });

    it('should find a list of lessons', () => {

        const id = 12;

        coursesService.findLessons(id)
            .subscribe(lessons => {
                
                expect(lessons).toBeTruthy();
                expect(lessons.length).toBe(3);

            }); 

        const req = httpTestingController.expectOne(
            req =>  req.url == '/api/lessons');

        expect(req.request.method).toEqual("GET");

        expect(req.request.params.get("courseId")).toEqual(`${id}`);
        expect(req.request.params.get("filter")).toEqual("");
        expect(req.request.params.get("sortOrder")).toEqual("asc");
        expect(req.request.params.get("pageNumber")).toEqual("0");
        expect(req.request.params.get("pageSize")).toEqual("3");

        req.flush({
            payload: findLessonsForCourse(id).slice(0,3)
        })

    });

    afterEach(() => {
        httpTestingController.verify();
    });

})