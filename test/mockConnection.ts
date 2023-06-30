// import path from "path";
// import { AppDataSource } from "src/config";
// import { DataSource } from "typeorm";

// const mockConnection = {
//     async create(){

//   //     const TestDataSource = new DataSource({
//   //       type: "mysql",
//   //       host: "localhost",
//   //       port: 3306,
//   //       username: "test",
//   //       password: "test",
//   //       database: "app.test",
//   //       host: process.env.POSTGRES_HOST,
//   // database: process.env.POSTGRES_DATABASE,
//   // username: process.env.POSTGRES_USER,
//   // password: process.env.POSTGRES_PASSWORD,
//   // port: +process.env.POSTGRES_PORT!,
//   // type: 'postgres',
//   // synchronize: false,
//   // logging: false,
//   // entities: [User, Event, Task, Tag],
//   //   })
//     //   AppDataSource.setOptions({
//     //     entities: [path.join(__dirname, '../dist/entities/**/*.entity.js')],
//     //     migrations: [path.join(__dirname, '../dist/migrations/**/*.js')],
//     //     synchronize: true,
//     //     dropSchema: true,
//     // })
//     let connection = await TestDataSource.initialize()
//     await connection.synchronize(true)

//     return connection
//     },
  
//     async close(){
//       await connection.close(); 
//     },
  
//     async clear(){
//       const entities = connection.entityMetadatas;
  
//       entities.forEach(async (entity) => {
//         const repository = connection.getRepository(entity.name);
//         await repository.query(`DELETE FROM ${entity.tableName}`);
//       });
//     },
//   };
//   export default connection;