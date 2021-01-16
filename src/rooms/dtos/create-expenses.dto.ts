import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Expenses } from '../entities/expense.entity';


@InputType()
export class CreateExpensesInput extends PickType(Expenses, ['name', 'img']) {}

@ObjectType()
export class CreateExpensesOutput extends MutationOutput {}
