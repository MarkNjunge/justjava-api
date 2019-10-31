import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe("root", () => {
    it("should return appService.getHello", () => {
      const response = "justjava";

      jest.spyOn(appService, "getHello").mockImplementation(() => response);

      expect(appController.getHello()).toBe(response);
    });
  });
});
