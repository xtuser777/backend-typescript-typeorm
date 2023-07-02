import { EntitySchema } from 'typeorm';
import { IFreightOrder } from './FreightOrder';
import { IRepresentation } from './Representation';

export interface ILoadStep {
  id: number;
  order: number;
  status: number;
  load: number;
  freightOrder: IFreightOrder;
  representation: IRepresentation;
}

export const LoadStep = new EntitySchema<ILoadStep>({
  name: 'load_step',
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    order: { type: 'integer', nullable: false },
    status: { type: 'integer', nullable: false },
    load: { type: 'decimal', precision: 10, scale: 2, nullable: false },
  },
  relations: {
    freightOrder: {
      type: 'many-to-one',
      target: 'freight_order',
      joinColumn: { name: 'freight_order_id' },
      inverseSide: 'steps',
      nullable: false,
    },
    representation: {
      type: 'many-to-one',
      target: 'representation',
      joinColumn: { name: 'representation_id' },
      nullable: false,
    },
  },
});
