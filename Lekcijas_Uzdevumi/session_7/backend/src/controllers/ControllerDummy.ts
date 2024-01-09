import {Body, Controller, Post, Get, Route, FormField, Query} from 'tsoa';

@Route('dummy') //   http://localhost:8000/dummy
export class ControllerDummy {
  // FormField if using file upload otherwise
  @Post('DummyFunction') //http://localhost:8000/dummy/DummyFunction
  public async DummyFunction(
    @Query() input_name: string,
    @Query() something: string,
  ): Promise<any> {
    let result = 'echo: ' + input_name;
    return {result: result};
  }
}
