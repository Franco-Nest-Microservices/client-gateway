import { IsEnum, IsUUID } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";
import { OrderStatus } from "../enum/order.enum";

export class ChangeOrderStatusDto {
    @IsUUID(4)
    id: string

    @IsEnum(OrderStatusList, {
        message: "Possible status values are " + OrderStatusList.join(', ')
    })
    status: OrderStatus
}