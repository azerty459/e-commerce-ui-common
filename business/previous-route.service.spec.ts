import {inject, TestBed} from "@angular/core/testing";

import {PreviousRouteBusiness} from "./previous-route.service";

describe("PreviousRouteService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreviousRouteBusiness]
    });
  });

  it("should be created", inject([PreviousRouteBusiness], (service: PreviousRouteBusiness) => {
    expect(service).toBeTruthy();
  }));
});
