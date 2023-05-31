// import { QueryRunner } from 'typeorm';
// import { Level } from '../entity/Level';

// export class LevelModel {
//   private attributes: Level;

//   constructor(attributes?: Level) {
//     this.attributes = attributes ? attributes : { id: 0, description: '' };
//   }

//   get id(): number {
//     return this.attributes.id;
//   }
//   set id(v: number) {
//     this.attributes.id = v;
//   }

//   get description(): string {
//     return this.attributes.description;
//   }
//   set description(v: string) {
//     this.attributes.description = v;
//   }

//   get toAttributes(): Level {
//     return this.attributes;
//   }

//   async findOne(runner: QueryRunner, id: number) {
//     if (id <= 0) return undefined;

//     try {
//       const entity = await runner.manager.findOne(Level, { where: { id } });

//       return entity ? new LevelModel(entity) : undefined;
//     } catch (e) {
//       console.error(e);
//       runner.release();

//       return undefined;
//     }
//   }

//   async find(runner: QueryRunner) {
//     try {
//       const entities = await runner.manager.find(Level);
//       const levels: LevelModel[] = [];
//       for (const entity of entities) levels.push(new LevelModel(entity));

//       return levels;
//     } catch (e) {
//       console.error(e);
//       runner.release();

//       return [];
//     }
//   }
// }
