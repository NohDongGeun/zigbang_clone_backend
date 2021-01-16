import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Expenses } from '../entities/expense.entity';
import { Options } from '../entities/options.entity';
import { Room } from '../entities/room.entity';

@InputType()
export class OptionsExpensesInput {
  @Field(type => [Number], { nullable: true })
  optionsIds?: number[];

  @Field(type => [Number], { nullable: true })
  expensesIds?: number[];
}
