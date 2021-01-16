import { Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Expenses } from '../entities/expense.entity';

@ObjectType()
export class ShowExpensesOutput extends MutationOutput {
  @Field(type => [Expenses], { nullable: true })
  expenses?: Expenses[];
}
