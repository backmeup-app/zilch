import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { IsDefined, IsString } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Resource } from '../resource/resource.schema';

export type BackupDocument = Backup & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Backup {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  uuid: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Resource',
    required: true,
  })
  resource: Resource;

  @IsString()
  @IsDefined()
  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  value: any;
}

export const BackupSchema = SchemaFactory.createForClass(Backup);
