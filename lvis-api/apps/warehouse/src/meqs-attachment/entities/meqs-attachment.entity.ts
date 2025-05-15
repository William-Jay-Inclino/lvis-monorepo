import { ObjectType, Field } from '@nestjs/graphql';
import { MEQS } from '../../meqs/entities/meq.entity';

@ObjectType()
export class MeqsAttachment {

  @Field()
  id: string;

  @Field(() => String)
  meqs_id: string;

  @Field(() => String)
  src: string;

  @Field(() => String)
  filename: string;


  // =============== derived / resolvers =============== 

  @Field(() => MEQS)
  meqs: MEQS

}
