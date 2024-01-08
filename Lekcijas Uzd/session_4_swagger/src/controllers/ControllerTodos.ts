import {Body, Controller, Post, Get, Route, FormField, Query} from "tsoa";
import {DatabaseConnection} from "./DatabaseConnection";
import {OrmTodos} from "../models/orm/OrmTodos";
import {OrmSession} from "../models/orm/OrmSession";

@Route("todos")
export class ControllerTodos {
    private dbConnection = DatabaseConnection.instance;



    @Post("add")
    public async add_todo(@Body() test: { title:string, token:string}): Promise<any> {
        let newTodo = new OrmTodos();
        newTodo.title = test.title;
        let token = test.token
        if(await this.dbConnection.dataSource.manager.findOne(OrmSession,
            {where: {token}, relations: ["user"]})
    ){
            await this.dbConnection.dataSource.manager.save(newTodo);
            return 'Created new todo'
        }
        else {
            return 'failed'
        }

    }
    @Post("list")
    public async list_todo(@Body()  intoken:string): Promise<any> {

         let todo_list = await this.dbConnection.dataSource.manager.findBy(OrmTodos,
            {token: intoken})

         if(todo_list.length != null){
             return todo_list

        }
        else {
            return 'no todos found'
        }

    }




}
