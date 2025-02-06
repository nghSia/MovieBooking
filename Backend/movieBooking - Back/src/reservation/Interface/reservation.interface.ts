import { Field,ID, InterfaceType } from "@nestjs/graphql";


export abstract class Reservation {
    @Field(() => ID)
    id: number;
    @Field()
    date : Date;
    @Field()
    createdAt : Date;
    @Field()
    updatedAt : Date;
    @Field()
    userId : number;
    @Field()
    filmId : number;
}