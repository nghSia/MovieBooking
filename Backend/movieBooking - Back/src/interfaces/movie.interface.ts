import { Field,ID, InterfaceType } from "@nestjs/graphql";

@InterfaceType()
export abstract class Movie {
  @Field(() => ID)
  id: string;
  @Field()
  title: string;  
  @Field()
  overview : string;
  @Field()
  release_date : string;
}
