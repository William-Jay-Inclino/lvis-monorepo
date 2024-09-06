import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MeqsSupplier } from '../../meqs-supplier/entities/meqs-supplier.entity';

@ObjectType()
export class MeqsSupplierAttachment {

  @Field(() => ID)
  id: string;

  @Field(() => String)
  meqs_supplier_id: string;

  @Field(() => String)
  src: string;

  @Field(() => String)
  filename: string;


  // =============== derived / resolvers =============== 

  @Field(() => MeqsSupplier)
  meqs_supplier: MeqsSupplier

}
