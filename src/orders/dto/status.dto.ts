import { IsEnum, IsOptional } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";
import { OrderStatus } from "../enum/order.enum";

export class StatusDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Possible status values are ${OrderStatusList.join(', ')}`
    })
    status: OrderStatus
}